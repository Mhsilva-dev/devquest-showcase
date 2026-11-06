import { Router } from 'express';
import { realms, lessonOrder, findLesson, prerequisiteOf, trackOf, gradeSchema, completeSchema, reviewSchema } from '@devquest/shared';
import type { LessonStatus, Overview } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { getLessonContent, gradeAnswer } from '../services/lessons.js';
import { nextReview, levelFromXp } from '../services/srs.js';
import { aiEnabled } from '../services/ai.js';
import { todayMinutes } from './foco.js';

export const learnRouter = Router();
learnRouter.use(requireAuth);

// Mapa de reinos (sem o conteúdo pesado das aulas)
learnRouter.get('/realms', (_req, res) => {
  res.json(realms.map((r) => ({ ...r, lessons: r.lessons.map(({ content, ...l }) => l) })));
});

export async function progressMap(userId: number): Promise<Record<string, { status: LessonStatus; score: number | null }>> {
  const r = await query('SELECT lesson_id, status, score FROM progress WHERE user_id=$1', [userId]);
  const map: Record<string, { status: LessonStatus; score: number | null }> = {};
  for (const row of r.rows) map[row.lesson_id] = { status: row.status, score: row.score };
  return map;
}

// Visão geral do dashboard: XP, nível, streak, próxima missão, cards a revisar
// Cards de concurso têm lesson_id "c-…"; os de programação não
export const DEV_CARDS = "(lesson_id IS NULL OR (lesson_id NOT LIKE 'c-%' AND lesson_id NOT LIKE 'f-%' AND lesson_id NOT LIKE 'm-%' AND lesson_id NOT LIKE 's-%'))";
export const CONCURSO_CARDS = "lesson_id LIKE 'c-%'";
export const FINANCAS_CARDS = "lesson_id LIKE 'f-%'";
export const MENTE_CARDS = "lesson_id LIKE 'm-%'";
export const SOCIAL_CARDS = "lesson_id LIKE 's-%'";

learnRouter.get('/overview', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const u = (await query('SELECT xp, streak FROM users WHERE id=$1', [uid])).rows[0];
    const all = await progressMap(uid);
    // Só a trilha de programação: o Modo Concurso tem o próprio painel
    const prog = Object.fromEntries(Object.entries(all).filter(([id]) => trackOf(id) === 'dev'));
    const due = (await query(`SELECT COUNT(*)::int AS n FROM cards WHERE user_id=$1 AND NOT graduated AND next_review <= now() AND ${DEV_CARDS}`, [uid])).rows[0].n;

    // Próxima missão = primeira aula ainda não concluída na ordem do currículo
    const nextId = lessonOrder.find((id) => prog[id]?.status !== 'done');
    const nextLesson = nextId ? findLesson(nextId) : null;

    const overview: Overview = {
      me: { id: uid, name: req.user!.name, email: req.user!.email, xp: u.xp, level: levelFromXp(u.xp), streak: u.streak, aiEnabled: aiEnabled() },
      progress: prog,
      dueCards: due,
      next: nextLesson ? { lessonId: nextLesson.id, realmId: nextLesson.realmId, title: nextLesson.title } : null,
      todayMinutes: await todayMinutes(uid),
    };
    res.json(overview);
  } catch (e) { next(e); }
});

// Uma aula com o conteúdo (escrito à mão ou gerado pela IA) + status de desbloqueio
learnRouter.get('/lesson/:id', async (req: AuthedRequest, res, next) => {
  try {
    const id = String(req.params.id);
    if (!findLesson(id)) return res.status(404).json({ error: 'Aula não encontrada' });
    const prog = await progressMap(req.user!.id);
    // Desbloqueio sequencial: a anterior precisa estar concluída (a primeira é sempre liberada)
    const prereq = prerequisiteOf(id);
    const prevDone = !prereq || prog[prereq]?.status === 'done';
    if (!prevDone && prog[id]?.status !== 'done') {
      return res.status(423).json({ error: 'Conclua a missão anterior para desbloquear esta.' });
    }
    const { lesson, content, aiGenerated } = await getLessonContent(id);
    res.json({ lesson: { ...lesson, content: undefined }, content, aiGenerated, track: trackOf(id), status: prog[id]?.status ?? 'available' });
  } catch (e) { next(e); }
});

// Corrige o desafio prático ou a explicação Feynman com a IA
learnRouter.post('/grade', async (req, res, next) => {
  try {
    const { lessonId, kind, answer } = gradeSchema.parse(req.body);
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY para a correção automática.' });
    const lesson = findLesson(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });
    const { content } = await getLessonContent(lessonId);
    const grade = await gradeAnswer(lesson, kind, answer, content);
    res.json(grade);
  } catch (e) { next(e); }
});

// Conclui a aula: grava progresso, dá XP, atualiza streak e cria os cards de revisão
learnRouter.post('/complete', async (req: AuthedRequest, res, next) => {
  try {
    const { lessonId, quizScore } = completeSchema.parse(req.body);
    const lesson = findLesson(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Aula não encontrada' });
    const uid = req.user!.id;

    const already = (await query('SELECT status FROM progress WHERE user_id=$1 AND lesson_id=$2', [uid, lessonId])).rows[0];
    await query(
      `INSERT INTO progress (user_id, lesson_id, status, score, updated_at) VALUES ($1,$2,'done',$3,now())
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET status='done', score=GREATEST(progress.score, $3), updated_at=now()`,
      [uid, lessonId, Math.round(quizScore)],
    );

    let xpGain = 0;
    if (already?.status !== 'done') {
      xpGain = 20 + Math.round(quizScore / 5) + (lesson.boss ? 30 : 0); // bônus de chefão
      // Streak: +1 se estudou ontem, reinicia se pulou dia
      await query(
        `UPDATE users SET xp = xp + $2,
           streak = CASE WHEN last_study = CURRENT_DATE THEN streak
                         WHEN last_study = CURRENT_DATE - 1 THEN streak + 1
                         ELSE 1 END,
           last_study = CURRENT_DATE
         WHERE id=$1`,
        [uid, xpGain],
      );
      // Cria cards de revisão espaçada a partir da aula
      const { content } = await getLessonContent(lessonId);
      for (const c of content?.cards ?? []) {
        await query('INSERT INTO cards (user_id, lesson_id, front, back) VALUES ($1,$2,$3,$4)', [uid, lessonId, c.front, c.back]);
      }
    }
    const u = (await query('SELECT xp, streak FROM users WHERE id=$1', [uid])).rows[0];
    res.json({ ok: true, xpGain, xp: u.xp, level: levelFromXp(u.xp), streak: u.streak });
  } catch (e) { next(e); }
});

// Revisão espaçada: cards vencidos
learnRouter.get('/review', async (req: AuthedRequest, res, next) => {
  try {
    const filter = req.query.track === 'concurso' ? CONCURSO_CARDS : req.query.track === 'financas' ? FINANCAS_CARDS : req.query.track === 'mente' ? MENTE_CARDS : req.query.track === 'social' ? SOCIAL_CARDS : DEV_CARDS;
    const r = await query(
      `SELECT id, lesson_id, front, back, interval_days FROM cards WHERE user_id=$1 AND NOT graduated AND next_review <= now() AND ${filter} ORDER BY next_review LIMIT 30`,
      [req.user!.id],
    );
    res.json(r.rows.map((c) => ({ id: c.id, lessonId: c.lesson_id, front: c.front, back: c.back, intervalDays: c.interval_days })));
  } catch (e) { next(e); }
});

learnRouter.post('/review', async (req: AuthedRequest, res, next) => {
  try {
    const { cardId, remembered } = reviewSchema.parse(req.body);
    const card = (await query('SELECT interval_days FROM cards WHERE id=$1 AND user_id=$2', [cardId, req.user!.id])).rows[0];
    if (!card) return res.status(404).json({ error: 'Card não encontrado' });
    const n = nextReview(card.interval_days, remembered);
    await query('UPDATE cards SET interval_days=$2, next_review=COALESCE($3, next_review), graduated=$4 WHERE id=$1',
      [cardId, n.intervalDays, n.nextReview, n.graduated]);
    if (remembered) await query('UPDATE users SET xp = xp + 2 WHERE id=$1', [req.user!.id]);
    res.json({ ok: true, graduated: n.graduated });
  } catch (e) { next(e); }
});
