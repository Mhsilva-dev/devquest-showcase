import { Router } from 'express';
import { concursoRealms, careers, findRealm, trackOf, simuladoStartSchema, simuladoSubmitSchema, planSchema } from '@devquest/shared';
import type { ConcursoOverview, MateriaStats, SimQuestionFull, SimuladoResult, SimuladoSummary } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { aiEnabled } from '../services/ai.js';
import { generateSimulado, generatePlan } from '../services/concursos.js';
import { progressMap, CONCURSO_CARDS } from './learn.js';

export const concursosRouter = Router();
concursosRouter.use(requireAuth);

concursosRouter.get('/realms', (_req, res) => {
  res.json(concursoRealms.map((r) => ({ ...r, lessons: r.lessons.map(({ content, ...l }) => l) })));
});

concursosRouter.get('/careers', (_req, res) => res.json(careers));

async function statsOf(uid: number): Promise<MateriaStats[]> {
  const r = await query('SELECT realm_id, answered, correct FROM concurso_stats WHERE user_id=$1', [uid]);
  return r.rows.map((s) => ({ realmId: s.realm_id, answered: s.answered, correct: s.correct, pct: s.answered ? Math.round((s.correct / s.answered) * 100) : 0 }));
}

concursosRouter.get('/overview', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const all = await progressMap(uid);
    const progress = Object.fromEntries(Object.entries(all).filter(([id]) => trackOf(id) === 'concurso'));
    const due = (await query(`SELECT COUNT(*)::int AS n FROM cards WHERE user_id=$1 AND NOT graduated AND next_review <= now() AND ${CONCURSO_CARDS}`, [uid])).rows[0].n;
    const sims = (await query('SELECT COUNT(*)::int AS n FROM simulados WHERE user_id=$1 AND finished_at IS NOT NULL', [uid])).rows[0].n;
    const plan = (await query("SELECT input->>'target' AS target FROM concurso_plans WHERE user_id=$1", [uid])).rows[0];
    const ov: ConcursoOverview = { progress, dueCards: due, stats: await statsOf(uid), simulados: sims, hasPlan: Boolean(plan), target: plan?.target ?? null };
    res.json(ov);
  } catch (e) { next(e); }
});

// ---------- Simulados ----------

concursosRouter.post('/simulado', async (req: AuthedRequest, res, next) => {
  try {
    const { realmIds, banca, count, difficulty } = simuladoStartSchema.parse(req.body);
    if (realmIds.some((id) => !findRealm(id) || trackOf(id) !== 'concurso')) return res.status(400).json({ error: 'Matéria inválida' });
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });
    const questions = await generateSimulado(realmIds, banca, count, difficulty);
    const r = await query(
      'INSERT INTO simulados (user_id, realm_ids, banca, difficulty, questions) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [req.user!.id, realmIds, banca, difficulty, JSON.stringify(questions)],
    );
    // O gabarito não sai do servidor até a entrega
    res.json({ id: r.rows[0].id, banca, questions: questions.map(({ q, options, topic, realmId }) => ({ q, options, topic, realmId })) });
  } catch (e) { next(e); }
});

concursosRouter.post('/simulado/:id/submit', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const { answers } = simuladoSubmitSchema.parse(req.body);
    const sim = (await query('SELECT * FROM simulados WHERE id=$1 AND user_id=$2', [Number(req.params.id), uid])).rows[0];
    if (!sim) return res.status(404).json({ error: 'Simulado não encontrado' });
    if (sim.finished_at) return res.status(409).json({ error: 'Simulado já entregue' });

    const qs = sim.questions as (SimQuestionFull & { realmId: string })[];
    const picked = qs.map((_, i) => (answers[i] ?? -1));
    let correct = 0, wrong = 0;
    const perRealm: Record<string, { a: number; c: number }> = {};
    qs.forEach((q, i) => {
      const p = picked[i];
      const pr = (perRealm[q.realmId] ??= { a: 0, c: 0 });
      if (p === -1) return; // em branco não conta na estatística
      pr.a++;
      if (p === q.answer) { correct++; pr.c++; } else wrong++;
    });
    // Cebraspe: uma errada anula uma certa. Demais bancas: % de acertos.
    const net = sim.banca === 'cebraspe' ? Math.max(0, correct - wrong) : correct;
    const score = Math.round((net / qs.length) * 100);
    const xpGain = 5 + correct * 2;

    await query('UPDATE simulados SET answers=$2, correct=$3, score=$4, finished_at=now() WHERE id=$1', [sim.id, JSON.stringify(picked), correct, score]);
    for (const [realmId, s] of Object.entries(perRealm)) {
      if (!s.a) continue;
      await query(
        `INSERT INTO concurso_stats (user_id, realm_id, answered, correct) VALUES ($1,$2,$3,$4)
         ON CONFLICT (user_id, realm_id) DO UPDATE SET answered = concurso_stats.answered + $3, correct = concurso_stats.correct + $4`,
        [uid, realmId, s.a, s.c],
      );
    }
    // Caderno de erros: cada questão errada vira card de revisão espaçada
    for (const [i, q] of qs.entries()) {
      if (picked[i] === q.answer) continue;
      await query('INSERT INTO cards (user_id, lesson_id, front, back) VALUES ($1,$2,$3,$4)',
        [uid, `c-sim-${q.realmId}`, q.q, `✔ ${q.options[q.answer]}\n\n${q.explain}`]);
    }
    await query(
      `UPDATE users SET xp = xp + $2,
         streak = CASE WHEN last_study = CURRENT_DATE THEN streak WHEN last_study = CURRENT_DATE - 1 THEN streak + 1 ELSE 1 END,
         last_study = CURRENT_DATE
       WHERE id=$1`, [uid, xpGain]);

    const result: SimuladoResult = { id: sim.id, score, correct, total: qs.length, xpGain, questions: qs.map((q, i) => ({ ...q, picked: picked[i] === -1 ? null : picked[i] })) };
    res.json(result);
  } catch (e) { next(e); }
});

concursosRouter.get('/simulados', async (req: AuthedRequest, res, next) => {
  try {
    const r = await query(
      `SELECT id, realm_ids, banca, jsonb_array_length(questions) AS total, correct, score, created_at
       FROM simulados WHERE user_id=$1 AND finished_at IS NOT NULL ORDER BY created_at DESC LIMIT 30`, [req.user!.id]);
    const list: SimuladoSummary[] = r.rows.map((s) => ({ id: s.id, realmIds: s.realm_ids, banca: s.banca, total: s.total, correct: s.correct, score: s.score, createdAt: s.created_at }));
    res.json(list);
  } catch (e) { next(e); }
});

// ---------- Plano de estudos ----------

concursosRouter.get('/plan', async (req: AuthedRequest, res, next) => {
  try {
    const r = (await query('SELECT input, plan, updated_at FROM concurso_plans WHERE user_id=$1', [req.user!.id])).rows[0];
    res.json(r ? { input: r.input, plan: r.plan, updatedAt: r.updated_at } : null);
  } catch (e) { next(e); }
});

concursosRouter.post('/plan', async (req: AuthedRequest, res, next) => {
  try {
    const input = planSchema.parse(req.body);
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });
    const uid = req.user!.id;
    const plan = await generatePlan(input, await statsOf(uid));
    await query(
      `INSERT INTO concurso_plans (user_id, input, plan, updated_at) VALUES ($1,$2,$3,now())
       ON CONFLICT (user_id) DO UPDATE SET input=$2, plan=$3, updated_at=now()`,
      [uid, JSON.stringify(input), JSON.stringify(plan)],
    );
    res.json({ input, plan, updatedAt: new Date().toISOString() });
  } catch (e) { next(e); }
});
