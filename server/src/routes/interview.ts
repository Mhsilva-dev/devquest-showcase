import { Router } from 'express';
import { interviewStartSchema, interviewReplySchema } from '@devquest/shared';
import type { ChatMessage, InterviewSummary } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { openingQuestion, nextTurn, evaluate } from '../services/interview.js';
import { aiEnabled } from '../services/ai.js';

export const interviewRouter = Router();
interviewRouter.use(requireAuth);

function guardAI(res: any): boolean {
  if (!aiEnabled()) { res.status(503).json({ error: 'O modo entrevista precisa da GEMINI_API_KEY configurada.' }); return false; }
  return true;
}

// Histórico de entrevistas
interviewRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const r = await query('SELECT id, persona, level, topic, score, finished, created_at FROM interviews WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20', [req.user!.id]);
    const list: InterviewSummary[] = r.rows.map((x) => ({ id: x.id, persona: x.persona, level: x.level, topic: x.topic, score: x.score, finished: x.finished, createdAt: x.created_at }));
    res.json(list);
  } catch (e) { next(e); }
});

// Inicia uma entrevista
interviewRouter.post('/start', async (req: AuthedRequest, res, next) => {
  try {
    if (!guardAI(res)) return;
    const { persona, level, topic } = interviewStartSchema.parse(req.body);
    const opening = await openingQuestion(persona, level, topic);
    const messages: ChatMessage[] = [{ role: 'interviewer', text: opening }];
    const r = await query('INSERT INTO interviews (user_id, persona, level, topic, messages) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [req.user!.id, persona, level, topic, JSON.stringify(messages)]);
    res.json({ id: r.rows[0].id, messages });
  } catch (e) { next(e); }
});

// Carrega uma entrevista
interviewRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const r = await query('SELECT * FROM interviews WHERE id=$1 AND user_id=$2', [req.params.id, req.user!.id]);
    const iv = r.rows[0];
    if (!iv) return res.status(404).json({ error: 'Entrevista não encontrada' });
    res.json({ id: iv.id, persona: iv.persona, level: iv.level, topic: iv.topic, messages: iv.messages, finished: iv.finished, score: iv.score, feedback: iv.feedback });
  } catch (e) { next(e); }
});

// Responde ao entrevistador
interviewRouter.post('/:id/reply', async (req: AuthedRequest, res, next) => {
  try {
    if (!guardAI(res)) return;
    const { answer } = interviewReplySchema.parse(req.body);
    const r = await query('SELECT * FROM interviews WHERE id=$1 AND user_id=$2', [req.params.id, req.user!.id]);
    const iv = r.rows[0];
    if (!iv) return res.status(404).json({ error: 'Entrevista não encontrada' });
    if (iv.finished) return res.status(400).json({ error: 'Entrevista já encerrada' });

    const messages: ChatMessage[] = iv.messages;
    messages.push({ role: 'candidate', text: answer });
    const reply = await nextTurn(iv.persona, iv.level, iv.topic, messages);
    messages.push({ role: 'interviewer', text: reply });
    await query('UPDATE interviews SET messages=$2 WHERE id=$1', [iv.id, JSON.stringify(messages)]);
    res.json({ reply, messages });
  } catch (e) { next(e); }
});

// Encerra e avalia
interviewRouter.post('/:id/finish', async (req: AuthedRequest, res, next) => {
  try {
    if (!guardAI(res)) return;
    const r = await query('SELECT * FROM interviews WHERE id=$1 AND user_id=$2', [req.params.id, req.user!.id]);
    const iv = r.rows[0];
    if (!iv) return res.status(404).json({ error: 'Entrevista não encontrada' });
    const feedback = await evaluate(iv.persona, iv.level, iv.topic, iv.messages);
    await query('UPDATE interviews SET finished=TRUE, score=$2, feedback=$3 WHERE id=$1', [iv.id, feedback.score, JSON.stringify(feedback)]);
    await query('UPDATE users SET xp = xp + $2 WHERE id=$1', [req.user!.id, 15 + Math.round(feedback.score / 5)]);
    res.json({ feedback });
  } catch (e) { next(e); }
});
