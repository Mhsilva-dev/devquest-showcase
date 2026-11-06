import { Router } from 'express';
import { findRealm, trackOf, focoSessionSchema, focoGoalSchema } from '@devquest/shared';
import type { FocoSession, FocoStats } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';

// Modo Foco: Pomodoro + controle de horas líquidas por matéria (o que concurseiro chama de "horas de estudo de verdade").
export const focoRouter = Router();
focoRouter.use(requireAuth);

// Dias contados no fuso de Brasília, não em UTC
const DAY = "(created_at AT TIME ZONE 'America/Sao_Paulo')::date";
const TODAY = "(now() AT TIME ZONE 'America/Sao_Paulo')::date";

export function subjectLabel(subject: string): string {
  const r = findRealm(subject);
  return r ? `${r.emoji} ${r.title}` : subject;
}

export async function todayMinutes(uid: number): Promise<number> {
  return (await query(`SELECT COALESCE(SUM(minutes),0)::int AS n FROM focus_sessions WHERE user_id=$1 AND ${DAY} = ${TODAY}`, [uid])).rows[0].n;
}

async function stats(uid: number): Promise<FocoStats> {
  const goal = (await query('SELECT focus_goal FROM users WHERE id=$1', [uid])).rows[0].focus_goal;
  const days = await query(
    `SELECT to_char(d, 'YYYY-MM-DD') AS date, COALESCE(SUM(f.minutes),0)::int AS minutes
     FROM generate_series(${TODAY} - 13, ${TODAY}, '1 day') AS d
     LEFT JOIN focus_sessions f ON f.user_id=$1 AND (f.created_at AT TIME ZONE 'America/Sao_Paulo')::date = d
     GROUP BY d ORDER BY d`, [uid]);
  const subj = await query(
    `SELECT subject, SUM(minutes)::int AS minutes FROM focus_sessions
     WHERE user_id=$1 AND ${DAY} > ${TODAY} - 7 GROUP BY subject ORDER BY minutes DESC`, [uid]);
  const recent = await query('SELECT id, subject, minutes, note, created_at FROM focus_sessions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 15', [uid]);
  const d = days.rows as { date: string; minutes: number }[];
  return {
    todayMinutes: d.at(-1)?.minutes ?? 0,
    weekMinutes: d.slice(-7).reduce((n, x) => n + x.minutes, 0),
    goalMinutes: goal,
    days: d,
    bySubject: subj.rows.map((s) => ({ subject: s.subject, label: subjectLabel(s.subject), minutes: s.minutes })),
    recent: recent.rows.map((s): FocoSession => ({
      id: s.id, subject: s.subject, label: subjectLabel(s.subject), track: findRealm(s.subject) ? trackOf(s.subject) : 'outro',
      minutes: s.minutes, note: s.note, createdAt: s.created_at,
    })),
  };
}

focoRouter.get('/stats', async (req: AuthedRequest, res, next) => {
  try { res.json(await stats(req.user!.id)); } catch (e) { next(e); }
});

// Registra um bloco de foco concluído (do timer ou lançado à mão). 1 XP a cada 5 min.
focoRouter.post('/session', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const { subject, minutes, note } = focoSessionSchema.parse(req.body);
    await query('INSERT INTO focus_sessions (user_id, subject, minutes, note) VALUES ($1,$2,$3,$4)', [uid, subject.trim(), minutes, note?.trim() || null]);
    const xpGain = Math.floor(minutes / 5);
    await query(
      `UPDATE users SET xp = xp + $2,
         streak = CASE WHEN last_study = CURRENT_DATE THEN streak WHEN last_study = CURRENT_DATE - 1 THEN streak + 1 ELSE 1 END,
         last_study = CURRENT_DATE
       WHERE id=$1`, [uid, xpGain]);
    res.json({ xpGain, stats: await stats(uid) });
  } catch (e) { next(e); }
});

focoRouter.delete('/session/:id', async (req: AuthedRequest, res, next) => {
  try {
    await query('DELETE FROM focus_sessions WHERE id=$1 AND user_id=$2', [Number(req.params.id), req.user!.id]);
    res.json(await stats(req.user!.id));
  } catch (e) { next(e); }
});

focoRouter.post('/goal', async (req: AuthedRequest, res, next) => {
  try {
    const { minutes } = focoGoalSchema.parse(req.body);
    await query('UPDATE users SET focus_goal=$2 WHERE id=$1', [req.user!.id, minutes]);
    res.json(await stats(req.user!.id));
  } catch (e) { next(e); }
});
