import { Router } from 'express';
import { socialRealms, socialBooks, findSocialBook, findCenario, cenarios, trackOf, conversaStartSchema, conversaReplySchema, reescreverSchema } from '@devquest/shared';
import type { ConversaCena, ConversaFull, ConversaMsg, ConversaSummary, SocialOverview } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { aiEnabled } from '../services/ai.js';
import { progressMap, SOCIAL_CARDS } from './learn.js';
import { cachedSummary, summarizeBook } from '../services/books.js';
import { opening, reply, avaliar, reescrever } from '../services/conversa.js';

// Trilha Comunicação & Relações: aulas, simulador de conversas, reescrever mensagens e biblioteca.
export const socialRouter = Router();
socialRouter.use(requireAuth);

const needAI = (res: any) => { if (aiEnabled()) return false; res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' }); return true; };

socialRouter.get('/realms', (_req, res) => {
  res.json(socialRealms.map((r) => ({ ...r, lessons: r.lessons.map(({ content, ...l }) => l) })));
});

socialRouter.get('/cenarios', (_req, res) => res.json(cenarios));

socialRouter.get('/overview', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const all = await progressMap(uid);
    const progress = Object.fromEntries(Object.entries(all).filter(([id]) => trackOf(id) === 'social'));
    const due = (await query(`SELECT COUNT(*)::int AS n FROM cards WHERE user_id=$1 AND NOT graduated AND next_review <= now() AND ${SOCIAL_CARDS}`, [uid])).rows[0].n;
    const c = (await query('SELECT COUNT(*)::int AS n, ROUND(AVG(score))::int AS media FROM conversas WHERE user_id=$1 AND finished', [uid])).rows[0];
    const ov: SocialOverview = { progress, dueCards: due, conversas: c.n, media: c.media };
    res.json(ov);
  } catch (e) { next(e); }
});

// ---------- Simulador de conversas ----------

function toSummary(r: any): ConversaSummary {
  return { id: r.id, titulo: r.cena.titulo, emoji: r.cena.emoji, dificuldade: r.dificuldade, score: r.score, finished: r.finished, createdAt: r.created_at };
}
const toFull = (r: any): ConversaFull => ({ ...toSummary(r), cena: r.cena, messages: r.messages, feedback: r.feedback });

socialRouter.get('/conversas', async (req: AuthedRequest, res, next) => {
  try {
    const r = await query('SELECT * FROM conversas WHERE user_id=$1 ORDER BY created_at DESC LIMIT 30', [req.user!.id]);
    res.json(r.rows.map(toSummary));
  } catch (e) { next(e); }
});

socialRouter.get('/conversas/:id', async (req: AuthedRequest, res, next) => {
  try {
    const r = (await query('SELECT * FROM conversas WHERE id=$1 AND user_id=$2', [Number(req.params.id), req.user!.id])).rows[0];
    if (!r) return res.status(404).json({ error: 'Conversa não encontrada' });
    res.json(toFull(r));
  } catch (e) { next(e); }
});

socialRouter.post('/conversas', async (req: AuthedRequest, res, next) => {
  try {
    const { cenarioId, dificuldade, livre } = conversaStartSchema.parse(req.body);
    let cena: ConversaCena;
    if (livre) {
      cena = { titulo: 'Situação livre', emoji: '✨', objetivo: livre.objetivo, papel: livre.pessoa, abertura: livre.situacao, skill: 'Comunicação em geral' };
    } else {
      const c = cenarioId ? findCenario(cenarioId) : undefined;
      if (!c) return res.status(400).json({ error: 'Escolha uma situação' });
      cena = { titulo: c.title, emoji: c.emoji, objetivo: c.objetivo, papel: c.papel, abertura: c.abertura, skill: c.skill, realmId: c.realmId };
    }
    if (needAI(res)) return;
    const messages: ConversaMsg[] = [{ role: 'outro', text: (await opening(cena, dificuldade)).trim() }];
    const r = (await query('INSERT INTO conversas (user_id, cena, dificuldade, messages) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user!.id, JSON.stringify(cena), dificuldade, JSON.stringify(messages)])).rows[0];
    res.json(toFull(r));
  } catch (e) { next(e); }
});

socialRouter.post('/conversas/:id/reply', async (req: AuthedRequest, res, next) => {
  try {
    const { text } = conversaReplySchema.parse(req.body);
    const cv = (await query('SELECT * FROM conversas WHERE id=$1 AND user_id=$2', [Number(req.params.id), req.user!.id])).rows[0];
    if (!cv) return res.status(404).json({ error: 'Conversa não encontrada' });
    if (cv.finished) return res.status(409).json({ error: 'Conversa já encerrada' });
    if (cv.messages.length >= 40) return res.status(409).json({ error: 'A conversa ficou longa: encerre para ver o feedback.' });
    if (needAI(res)) return;
    const messages: ConversaMsg[] = [...cv.messages, { role: 'eu', text: text.trim() }];
    messages.push({ role: 'outro', text: (await reply(cv.cena, cv.dificuldade, messages)).trim() });
    await query('UPDATE conversas SET messages=$2 WHERE id=$1', [cv.id, JSON.stringify(messages)]);
    res.json({ messages });
  } catch (e) { next(e); }
});

socialRouter.post('/conversas/:id/finish', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const cv = (await query('SELECT * FROM conversas WHERE id=$1 AND user_id=$2', [Number(req.params.id), uid])).rows[0];
    if (!cv) return res.status(404).json({ error: 'Conversa não encontrada' });
    if (cv.finished) return res.json({ ...toFull(cv), xpGain: 0 });
    if (cv.messages.filter((m: ConversaMsg) => m.role === 'eu').length < 2) return res.status(400).json({ error: 'Converse um pouco mais (pelo menos 2 falas) antes de encerrar.' });
    if (needAI(res)) return;
    const fb = await avaliar(cv.cena, cv.dificuldade, cv.messages);
    const score = Math.max(0, Math.min(100, Math.round(Number(fb.score) || 0)));
    const r = (await query('UPDATE conversas SET finished=TRUE, score=$2, feedback=$3 WHERE id=$1 RETURNING *', [cv.id, score, JSON.stringify({ ...fb, score })])).rows[0];
    // As melhores reescritas viram cards de revisão ("como dizer melhor")
    for (const x of (fb.reescritas ?? []).slice(0, 4)) {
      if (!x?.original || !x?.melhor) continue;
      await query('INSERT INTO cards (user_id, lesson_id, front, back) VALUES ($1,$2,$3,$4)',
        [uid, `s-conv-${cv.id}`, `💬 Como dizer melhor?\n“${x.original}”`, `✔ ${x.melhor}\n\n${x.porque ?? ''}`]);
    }
    const xpGain = 10 + Math.round(score / 5);
    await query(
      `UPDATE users SET xp = xp + $2,
         streak = CASE WHEN last_study = CURRENT_DATE THEN streak WHEN last_study = CURRENT_DATE - 1 THEN streak + 1 ELSE 1 END,
         last_study = CURRENT_DATE
       WHERE id=$1`, [uid, xpGain]);
    res.json({ ...toFull(r), xpGain });
  } catch (e) { next(e); }
});

socialRouter.delete('/conversas/:id', async (req: AuthedRequest, res, next) => {
  try {
    await query('DELETE FROM conversas WHERE id=$1 AND user_id=$2', [Number(req.params.id), req.user!.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ---------- Reescrever mensagem ----------

socialRouter.post('/reescrever', async (req, res, next) => {
  try {
    const { texto, contexto } = reescreverSchema.parse(req.body);
    if (needAI(res)) return;
    const r = await reescrever(texto, contexto);
    res.json({ analise: String(r.analise ?? ''), versoes: (r.versoes ?? []).filter((v) => v?.texto).map((v) => ({ tom: String(v.tom), texto: String(v.texto) })), dicas: (r.dicas ?? []).map(String) });
  } catch (e) { next(e); }
});

// ---------- Biblioteca ----------

socialRouter.get('/books', async (_req, res, next) => {
  try {
    const done = (await query("SELECT book_id FROM book_summaries WHERE book_id LIKE 's-%'")).rows.map((r) => r.book_id);
    res.json(socialBooks.map((b) => ({ ...b, hasSummary: done.includes(b.id) })));
  } catch (e) { next(e); }
});

socialRouter.get('/books/:id', async (req, res, next) => {
  try {
    const book = findSocialBook(String(req.params.id));
    if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
    const cached = await cachedSummary(book.id);
    if (cached) return res.json({ book, summary: cached });
    if (needAI(res)) return;
    const summary = await summarizeBook(book, 'um brasileiro que quer se comunicar melhor com as pessoas (família, amigos, trabalho e entrevistas)',
      'Você resume livros de comunicação, psicologia e relacionamentos com fidelidade às ideias do autor e senso crítico, em português do Brasil, sem copiar o texto original. Sempre dá exemplos de frases. Responde em JSON.');
    res.json({ book, summary });
  } catch (e) { next(e); }
});
