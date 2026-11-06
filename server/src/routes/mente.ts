import { Router } from 'express';
import { menteRealms, menteBooks, findMenteBook, trackOf, menteProtocolSchema, menteCheckinSchema } from '@devquest/shared';
import type { MenteOverview, MenteProtocol, MenteProtocolInput } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { aiEnabled, askJSON } from '../services/ai.js';
import { progressMap, MENTE_CARDS } from './learn.js';
import { cachedSummary, summarizeBook } from '../services/books.js';

// Trilha Disciplina & Mente: aulas baseadas em livros, biblioteca, protocolo anti-desistência e check-in diário.
export const menteRouter = Router();
menteRouter.use(requireAuth);

const TODAY = "(now() AT TIME ZONE 'America/Sao_Paulo')::date";
type Kind = 'minimo' | 'completo';

menteRouter.get('/realms', (_req, res) => {
  res.json(menteRealms.map((r) => ({ ...r, lessons: r.lessons.map(({ content, ...l }) => l) })));
});

async function overview(uid: number): Promise<MenteOverview> {
  const all = await progressMap(uid);
  const progress = Object.fromEntries(Object.entries(all).filter(([id]) => trackOf(id) === 'mente'));
  const due = (await query(`SELECT COUNT(*)::int AS n FROM cards WHERE user_id=$1 AND NOT graduated AND next_review <= now() AND ${MENTE_CARDS}`, [uid])).rows[0].n;
  const prot = (await query("SELECT input->>'meta' AS meta FROM mente_protocols WHERE user_id=$1", [uid])).rows[0];
  const today = (await query(`SELECT to_char(${TODAY}, 'YYYY-MM-DD') AS d`)).rows[0].d as string;
  const rows = (await query("SELECT to_char(day, 'YYYY-MM-DD') AS d, kind FROM mente_checkins WHERE user_id=$1 ORDER BY day", [uid])).rows as { d: string; kind: Kind }[];
  const byDay = new Map(rows.map((r) => [r.d, r.kind]));

  const shift = (d: string, n: number) => { const x = new Date(`${d}T12:00:00Z`); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  // Sequência atual: conta para trás a partir de hoje (ou de ontem, se hoje ainda não teve check-in)
  let run = 0;
  for (let d = byDay.has(today) ? today : shift(today, -1); byDay.has(d); d = shift(d, -1)) run++;
  let best = 0, cur = 0, prev = '';
  for (const r of rows) { cur = prev && shift(prev, 1) === r.d ? cur + 1 : 1; best = Math.max(best, cur); prev = r.d; }

  return {
    progress, dueCards: due, meta: prot?.meta ?? null, hasProtocol: Boolean(prot),
    today: byDay.get(today) ?? null, yesterday: byDay.get(shift(today, -1)) ?? null,
    run, best,
    days: Array.from({ length: 35 }, (_, i) => { const d = shift(today, i - 34); return { date: d, kind: byDay.get(d) ?? null }; }),
  };
}

menteRouter.get('/overview', async (req: AuthedRequest, res, next) => {
  try { res.json(await overview(req.user!.id)); } catch (e) { next(e); }
});

// Check-in do dia. "Completo" substitui "mínimo"; XP só no primeiro check-in do dia (e +5 se subir para completo).
menteRouter.post('/checkin', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const { kind } = menteCheckinSchema.parse(req.body);
    const before = (await query(`SELECT kind FROM mente_checkins WHERE user_id=$1 AND day=${TODAY}`, [uid])).rows[0]?.kind as Kind | undefined;
    if (before === 'completo' || before === kind) return res.json({ xpGain: 0, overview: await overview(uid) });
    await query(`INSERT INTO mente_checkins (user_id, day, kind) VALUES ($1, ${TODAY}, $2) ON CONFLICT (user_id, day) DO UPDATE SET kind=$2`, [uid, kind]);
    const xpGain = before ? 5 : kind === 'completo' ? 10 : 5;
    await query(
      `UPDATE users SET xp = xp + $2,
         streak = CASE WHEN last_study = CURRENT_DATE THEN streak WHEN last_study = CURRENT_DATE - 1 THEN streak + 1 ELSE 1 END,
         last_study = CURRENT_DATE
       WHERE id=$1`, [uid, xpGain]);
    res.json({ xpGain, overview: await overview(uid) });
  } catch (e) { next(e); }
});

// ---------- Protocolo anti-desistência ----------

const PROTOCOL_SYSTEM = `Você é um mentor de disciplina que monta protocolos pessoais anti-desistência, usando o que há de mais sólido em ciência do comportamento
(intenções de implementação "se-então", hábitos mínimos, design de ambiente, identidade, "nunca falhe duas vezes", autocompaixão) e em filosofia estoica.
É concreto, curto e direto, fala com a pessoa em segunda pessoa ("você"), em português do Brasil, e nunca usa frases motivacionais vazias. Responde em JSON.`;

async function buildProtocol(input: MenteProtocolInput): Promise<MenteProtocol> {
  const prompt = `Monte o PROTOCOLO ANTI-DESISTÊNCIA desta pessoa. O objetivo é que ela não abandone a meta não importa o que aconteça: dias ruins, cansaço, imprevistos, desânimo, recaídas.

Meta que ela não quer largar: ${input.meta}
Por que isso importa para ela: ${input.porque}
${input.historico ? `Por que ela desistiu de coisas antes: ${input.historico}` : ''}
${input.obstaculos ? `Obstáculos que ela prevê: ${input.obstaculos}` : ''}
${input.rotina ? `Rotina, horários e energia: ${input.rotina}` : ''}

Livros que você pode recomendar (use só estes títulos): ${menteBooks.map((b) => `${b.title} (${b.author})`).join('; ')}.

Responda em JSON:
{
  "frase": "uma frase-âncora curta e forte, específica para ela, para ler no dia em que quiser largar",
  "identidade": "Eu sou alguém que… (uma frase de identidade ligada à meta)",
  "porque": "o porquê dela, lapidado em 2-3 frases na primeira pessoa",
  "minimo": "a versão MÍNIMA diária, tão pequena que dá para fazer doente, cansada ou sem tempo (até 5-10 min)",
  "ideal": "a versão completa de um dia normal",
  "regras": ["4 a 6 regras inegociáveis curtas (inclua: nunca falhar dois dias seguidos; no dia ruim, faz o mínimo)"],
  "seEntao": [{"se":"situação concreta de risco (baseada no histórico e obstáculos dela)","entao":"ação exata"}],
  "ambiente": ["4 a 6 mudanças concretas no ambiente/celular/rotina"],
  "alertas": [{"sinal":"sinal precoce de que está escorregando","acao":"o que fazer na hora"}],
  "diaRuim": ["passo a passo curto (4-6 passos) para o dia em que tudo deu errado"],
  "recaida": ["passo a passo para voltar depois de dias ou semanas parado, sem tentar compensar"],
  "revisaoSemanal": ["5 perguntas para a revisão de domingo"],
  "livros": [{"titulo":"título exato da lista","porque":"por que este livro para ela, agora"}]
}
Gere de 6 a 8 planos se-então, 4 alertas e 3 livros.`;
  const p = await askJSON<MenteProtocol>(prompt, { system: PROTOCOL_SYSTEM, temperature: 0.6, timeoutMs: 90000 });
  const arr = (x: unknown) => (Array.isArray(x) ? x.map(String) : []);
  return {
    frase: String(p.frase ?? ''), identidade: String(p.identidade ?? ''), porque: String(p.porque ?? input.porque),
    minimo: String(p.minimo ?? ''), ideal: String(p.ideal ?? ''),
    regras: arr(p.regras), ambiente: arr(p.ambiente), diaRuim: arr(p.diaRuim), recaida: arr(p.recaida), revisaoSemanal: arr(p.revisaoSemanal),
    seEntao: (p.seEntao ?? []).filter((x) => x?.se && x?.entao).map((x) => ({ se: String(x.se), entao: String(x.entao) })),
    alertas: (p.alertas ?? []).filter((x) => x?.sinal).map((x) => ({ sinal: String(x.sinal), acao: String(x.acao ?? '') })),
    livros: (p.livros ?? []).filter((x) => x?.titulo).map((x) => ({ titulo: String(x.titulo), porque: String(x.porque ?? '') })),
  };
}

menteRouter.get('/protocol', async (req: AuthedRequest, res, next) => {
  try {
    const r = (await query('SELECT input, protocol, updated_at FROM mente_protocols WHERE user_id=$1', [req.user!.id])).rows[0];
    res.json(r ? { input: r.input, protocol: r.protocol, updatedAt: r.updated_at } : null);
  } catch (e) { next(e); }
});

menteRouter.post('/protocol', async (req: AuthedRequest, res, next) => {
  try {
    const input = menteProtocolSchema.parse(req.body);
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });
    const protocol = await buildProtocol(input);
    await query(
      `INSERT INTO mente_protocols (user_id, input, protocol, updated_at) VALUES ($1,$2,$3,now())
       ON CONFLICT (user_id) DO UPDATE SET input=$2, protocol=$3, updated_at=now()`,
      [req.user!.id, JSON.stringify(input), JSON.stringify(protocol)],
    );
    res.json({ input, protocol, updatedAt: new Date().toISOString() });
  } catch (e) { next(e); }
});

// ---------- Biblioteca ----------

menteRouter.get('/books', async (_req, res, next) => {
  try {
    const done = (await query("SELECT book_id FROM book_summaries WHERE book_id LIKE 'm-%'")).rows.map((r) => r.book_id);
    res.json(menteBooks.map((b) => ({ ...b, hasSummary: done.includes(b.id) })));
  } catch (e) { next(e); }
});

menteRouter.get('/books/:id', async (req, res, next) => {
  try {
    const book = findMenteBook(String(req.params.id));
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    const cached = await cachedSummary(book.id);
    if (cached) return res.json({ book, summary: cached });
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });
    const summary = await summarizeBook(book, 'um brasileiro que quer ter mais disciplina e parar de desistir das coisas (estuda para concurso e programação)',
      'Você resume livros de desenvolvimento pessoal, psicologia e filosofia com fidelidade às ideias do autor e senso crítico, em português do Brasil, sem copiar o texto original. Responde em JSON.');
    res.json({ book, summary });
  } catch (e) { next(e); }
});
