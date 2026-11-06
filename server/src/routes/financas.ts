import { Router } from 'express';
import { financasRealms, books, findBook, findRealm, trackOf, financePlanSchema } from '@devquest/shared';
import type { BookSummary, FinancePlan, FinancePlanInput, FinancasOverview } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { aiEnabled, askJSON } from '../services/ai.js';
import { progressMap, FINANCAS_CARDS } from './learn.js';
import { indicadores } from '../services/mercado.js';

// Trilha de Finanças & Investimentos: matérias, plano financeiro e biblioteca de livros.
export const financasRouter = Router();
financasRouter.use(requireAuth);

const DISCLAIMER = 'Conteúdo educativo, não é recomendação de investimento. Regras de produtos e impostos mudam: confira as regras atuais.';

financasRouter.get('/realms', (_req, res) => {
  res.json(financasRealms.map((r) => ({ ...r, lessons: r.lessons.map(({ content, ...l }) => l) })));
});

financasRouter.get('/overview', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const all = await progressMap(uid);
    const progress = Object.fromEntries(Object.entries(all).filter(([id]) => trackOf(id) === 'financas'));
    const due = (await query(`SELECT COUNT(*)::int AS n FROM cards WHERE user_id=$1 AND NOT graduated AND next_review <= now() AND ${FINANCAS_CARDS}`, [uid])).rows[0].n;
    const plan = (await query("SELECT input->>'objetivo' AS objetivo FROM finance_plans WHERE user_id=$1", [uid])).rows[0];
    const ov: FinancasOverview = { progress, dueCards: due, hasPlan: Boolean(plan), objetivo: plan?.objetivo ?? null };
    res.json(ov);
  } catch (e) { next(e); }
});

// CDI, Selic, IPCA, dólar e bitcoin (com cache no servidor).
financasRouter.get('/indicadores', async (_req, res, next) => {
  try { res.json(await indicadores()); } catch (e) { next(e); }
});

// ---------- Biblioteca ----------

financasRouter.get('/books', async (_req, res, next) => {
  try {
    const done = (await query('SELECT book_id FROM book_summaries')).rows.map((r) => r.book_id);
    res.json(books.map((b) => ({ ...b, hasSummary: done.includes(b.id) })));
  } catch (e) { next(e); }
});

financasRouter.get('/books/:id', async (req, res, next) => {
  try {
    const book = findBook(String(req.params.id));
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    const cached = (await query('SELECT summary FROM book_summaries WHERE book_id=$1', [book.id])).rows[0];
    if (cached) return res.json({ book, summary: cached.summary });
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });

    const prompt = `Faça um resumo de estudo do livro "${book.title}", de ${book.author}, para um leitor brasileiro que quer aplicar as ideias na vida real.
Explique tudo com suas próprias palavras (não reproduza trechos do livro). Adapte os exemplos ao Brasil (reais, Selic, Tesouro, B3) quando fizer sentido.

Responda em JSON:
{
  "ideia": "a ideia central do livro em 2-3 frases",
  "licoes": [{"titulo":"lição curta","explicacao":"explicação em 3-5 frases com exemplo prático"}],
  "citacoesParafraseadas": ["ideias marcantes do autor, parafraseadas"],
  "planoDeAcao": ["passo concreto para aplicar esta semana", "..."],
  "criticas": ["limitações ou pontos em que o livro é criticado ou envelheceu"],
  "paraQuem": "para quem este livro é mais útil"
}
Gere de 7 a 10 lições, 4 ideias marcantes, 5 passos de ação e 2-3 críticas.`;
    const summary = await askJSON<BookSummary>(prompt, {
      system: 'Você é um educador financeiro que resume livros clássicos com fidelidade às ideias do autor, em português do Brasil, sem copiar o texto original. Responde em JSON.',
      temperature: 0.4, timeoutMs: 90000,
    });
    await query('INSERT INTO book_summaries (book_id, summary) VALUES ($1,$2) ON CONFLICT (book_id) DO UPDATE SET summary=$2', [book.id, JSON.stringify(summary)]);
    res.json({ book, summary });
  } catch (e) { next(e); }
});

// ---------- Plano financeiro ----------

financasRouter.get('/plan', async (req: AuthedRequest, res, next) => {
  try {
    const r = (await query('SELECT input, plan, updated_at FROM finance_plans WHERE user_id=$1', [req.user!.id])).rows[0];
    res.json(r ? { input: r.input, plan: r.plan, updatedAt: r.updated_at } : null);
  } catch (e) { next(e); }
});

// Apaga o plano (a pessoa volta para o formulário em branco).
financasRouter.delete('/plan', async (req: AuthedRequest, res, next) => {
  try {
    await query('DELETE FROM finance_plans WHERE user_id=$1', [req.user!.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

financasRouter.post('/plan', async (req: AuthedRequest, res, next) => {
  try {
    const input: FinancePlanInput = financePlanSchema.parse(req.body);
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });
    const sobra = input.rendaMensal - input.gastosMensais;
    const realmList = financasRealms.map((r) => `${r.id}: ${r.title}`).join('\n');
    const bookList = books.map((b) => `${b.title} — ${b.author}`).join('; ');

    const prompt = `Monte um plano financeiro ESTRATÉGICO e realista para esta pessoa (Brasil):
- Renda líquida mensal: R$ ${input.rendaMensal}
- Gastos mensais: R$ ${input.gastosMensais} (sobra: R$ ${sobra})
- Dívidas: R$ ${input.dividas}${input.jurosDividaMes ? ` a ${input.jurosDividaMes}% ao mês` : ''}
- Reserva de emergência atual: R$ ${input.reserva}
- Já investido: R$ ${input.investido}
- Idade: ${input.idade} anos
- Objetivo: ${input.objetivo} (prazo: ${input.prazoAnos} anos)
- Perfil: ${input.perfil}

Regras: ordem correta (dívidas caras → reserva → investimentos); números coerentes com a renda; alocação por CLASSE de ativo (nunca indique ações ou fundos específicos); use premissas conservadoras de retorno real e diga quais usou.
Trilhas disponíveis (use estes realmId):
${realmList}
Livros disponíveis: ${bookList}

Responda em JSON:
{
  "diagnostico": "situação atual em 3-4 frases, honesta",
  "fases": [{"fase":"1. Sair das dívidas","prazo":"0-6 meses","acoes":["..."]}],
  "alocacao": [{"classe":"Renda fixa pós-fixada","percentual":40,"porque":"..."}],
  "numeros": {"aporteMensalSugerido":0,"reservaIdeal":0,"metaIndependencia":0,"anosParaMeta":0},
  "trilha": [{"realmId":"f-orcamento","motivo":"por que estudar isso agora"}],
  "livros": ["título — autor (por que ler)"],
  "alertas": ["riscos e cuidados"]
}
A soma dos percentuais da alocação deve ser 100. Ordene a trilha pela prioridade de estudo (4 a 6 itens).`;

    const plan = await askJSON<FinancePlan>(prompt, {
      system: `Você é um planejador financeiro certificado, brasileiro, prudente e didático. ${DISCLAIMER} Responde em JSON.`,
      temperature: 0.4, timeoutMs: 90000,
    });
    // A IA às vezes omite campos: garante o formato que a tela espera
    plan.diagnostico ??= '';
    plan.fases = (plan.fases ?? []).map((f) => ({ ...f, acoes: f.acoes ?? [] }));
    plan.alocacao = plan.alocacao ?? [];
    plan.numeros = Object.assign({ aporteMensalSugerido: 0, reservaIdeal: 0, metaIndependencia: 0, anosParaMeta: 0 }, plan.numeros);
    plan.livros = plan.livros ?? [];
    plan.trilha = (plan.trilha ?? []).filter((t) => findRealm(t.realmId));
    plan.alertas = [...(plan.alertas ?? []), DISCLAIMER];
    await query(
      `INSERT INTO finance_plans (user_id, input, plan, updated_at) VALUES ($1,$2,$3,now())
       ON CONFLICT (user_id) DO UPDATE SET input=$2, plan=$3, updated_at=now()`,
      [req.user!.id, JSON.stringify(input), JSON.stringify(plan)],
    );
    res.json({ input, plan, updatedAt: new Date().toISOString() });
  } catch (e) { next(e); }
});
