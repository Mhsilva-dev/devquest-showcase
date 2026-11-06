import { Router } from 'express';
import { capturaSchema, capturaQuizSchema } from '@devquest/shared';
import type { CapturaFull, CapturaSummary, Track } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { aiEnabled } from '../services/ai.js';
import { capture, YT_RE } from '../services/captura.js';

// Captura: qualquer material de fora (link, vídeo, PDF, texto) entra na revisão espaçada da trilha escolhida.
export const capturaRouter = Router();
capturaRouter.use(requireAuth);

// Prefixo do lesson_id decide em qual revisão o card aparece (ver DEV_CARDS/CONCURSO_CARDS/FINANCAS_CARDS/MENTE_CARDS/SOCIAL_CARDS)
const PREFIX: Record<Track, string> = { dev: 'cap-', concurso: 'c-cap-', financas: 'f-cap-', mente: 'm-cap-', social: 's-cap-' };

function summary(r: any): CapturaSummary {
  return { id: r.id, track: r.track, sourceType: r.source_type, source: r.source, titulo: r.result.titulo, cards: r.result.cards.length, createdAt: r.created_at };
}

capturaRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const r = await query('SELECT * FROM capturas WHERE user_id=$1 ORDER BY created_at DESC LIMIT 60', [req.user!.id]);
    res.json(r.rows.map(summary));
  } catch (e) { next(e); }
});

capturaRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const r = (await query('SELECT * FROM capturas WHERE id=$1 AND user_id=$2', [Number(req.params.id), req.user!.id])).rows[0];
    if (!r) return res.status(404).json({ error: 'Captura não encontrada' });
    const full: CapturaFull = { ...summary(r), result: r.result };
    res.json(full);
  } catch (e) { next(e); }
});

capturaRouter.post('/', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const input = capturaSchema.parse(req.body);
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });
    // Link do YouTube colado como "link" vira vídeo automaticamente
    const sourceType = input.sourceType === 'url' && YT_RE.test(input.source) ? 'youtube' : input.sourceType;
    let result;
    try { result = await capture(sourceType, input.source.trim(), input.track, input.foco, input.pdfBase64); }
    catch (e: any) { return res.status(422).json({ error: e?.message ?? 'Falha ao processar o material' }); }

    const source = sourceType === 'texto' ? input.source.trim().slice(0, 300) : input.source.trim().slice(0, 1000);
    const r = (await query('INSERT INTO capturas (user_id, track, source_type, source, result) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [uid, input.track, sourceType, source, JSON.stringify(result)])).rows[0];
    for (const c of result.cards) {
      await query('INSERT INTO cards (user_id, lesson_id, front, back) VALUES ($1,$2,$3,$4)', [uid, `${PREFIX[input.track as Track]}${r.id}`, c.front, c.back]);
    }
    await query('UPDATE users SET xp = xp + 10 WHERE id=$1', [uid]);
    const full: CapturaFull = { ...summary(r), result };
    res.json(full);
  } catch (e) { next(e); }
});

// Quiz da captura: XP só na primeira vez
capturaRouter.post('/:id/quiz', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const { score } = capturaQuizSchema.parse(req.body);
    const r = (await query('UPDATE capturas SET quiz_score=$3 WHERE id=$1 AND user_id=$2 AND quiz_score IS NULL RETURNING id', [Number(req.params.id), uid, Math.round(score)])).rows[0];
    const xpGain = r ? 5 + Math.round(score / 10) : 0;
    if (xpGain) {
      await query(
        `UPDATE users SET xp = xp + $2,
           streak = CASE WHEN last_study = CURRENT_DATE THEN streak WHEN last_study = CURRENT_DATE - 1 THEN streak + 1 ELSE 1 END,
           last_study = CURRENT_DATE
         WHERE id=$1`, [uid, xpGain]);
    }
    res.json({ xpGain });
  } catch (e) { next(e); }
});

capturaRouter.delete('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const r = (await query('DELETE FROM capturas WHERE id=$1 AND user_id=$2 RETURNING track, id', [Number(req.params.id), uid])).rows[0];
    if (r) await query('DELETE FROM cards WHERE user_id=$1 AND lesson_id=$2', [uid, `${PREFIX[r.track as Track]}${r.id}`]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
