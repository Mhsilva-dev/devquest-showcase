import { Router } from 'express';
import { redacaoTemaSchema, redacaoSubmitSchema } from '@devquest/shared';
import type { RedacaoFull, RedacaoSummary } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { aiEnabled } from '../services/ai.js';
import { generateTema, gradeRedacao } from '../services/redacao.js';

// Redação / discursiva do Modo Concurso. Os erros corrigidos viram cards no caderno de erros ("c-red-…").
export const redacaoRouter = Router();
redacaoRouter.use(requireAuth);

function toFull(r: any): RedacaoFull {
  return { id: r.id, banca: r.banca, tipo: r.tipo, tema: r.proposta.tema, nota: r.nota, createdAt: r.created_at, proposta: r.proposta, texto: r.texto, correcao: r.correcao };
}

redacaoRouter.get('/', async (req: AuthedRequest, res, next) => {
  try {
    const r = await query(`SELECT id, banca, tipo, proposta->>'tema' AS tema, nota, created_at FROM redacoes WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`, [req.user!.id]);
    res.json(r.rows.map((x): RedacaoSummary => ({ id: x.id, banca: x.banca, tipo: x.tipo, tema: x.tema, nota: x.nota, createdAt: x.created_at })));
  } catch (e) { next(e); }
});

redacaoRouter.get('/:id', async (req: AuthedRequest, res, next) => {
  try {
    const r = (await query('SELECT * FROM redacoes WHERE id=$1 AND user_id=$2', [Number(req.params.id), req.user!.id])).rows[0];
    if (!r) return res.status(404).json({ error: 'Redação não encontrada' });
    res.json(toFull(r));
  } catch (e) { next(e); }
});

redacaoRouter.post('/tema', async (req: AuthedRequest, res, next) => {
  try {
    const { banca, tipo, assunto, careerId } = redacaoTemaSchema.parse(req.body);
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });
    const proposta = await generateTema(banca, tipo, assunto, careerId);
    const r = (await query('INSERT INTO redacoes (user_id, banca, tipo, proposta) VALUES ($1,$2,$3,$4) RETURNING *', [req.user!.id, banca, tipo, JSON.stringify(proposta)])).rows[0];
    res.json(toFull(r));
  } catch (e) { next(e); }
});

redacaoRouter.post('/:id/corrigir', async (req: AuthedRequest, res, next) => {
  try {
    const uid = req.user!.id;
    const { texto } = redacaoSubmitSchema.parse(req.body);
    const red = (await query('SELECT * FROM redacoes WHERE id=$1 AND user_id=$2', [Number(req.params.id), uid])).rows[0];
    if (!red) return res.status(404).json({ error: 'Redação não encontrada' });
    if (red.correcao) return res.status(409).json({ error: 'Essa redação já foi corrigida. Gere um tema novo ou reescreva em outra.' });
    if (!aiEnabled()) return res.status(503).json({ error: 'IA desligada: configure a GEMINI_API_KEY.' });

    const correcao = await gradeRedacao(red.banca, red.tipo, red.proposta, texto);
    const r = (await query('UPDATE redacoes SET texto=$2, correcao=$3, nota=$4, graded_at=now() WHERE id=$1 RETURNING *',
      [red.id, texto, JSON.stringify(correcao), correcao.nota])).rows[0];

    // Cada erro vira card de revisão (máx. 10 por redação para não lotar o caderno)
    for (const e of correcao.erros.slice(0, 10)) {
      await query('INSERT INTO cards (user_id, lesson_id, front, back) VALUES ($1,$2,$3,$4)',
        [uid, `c-red-${red.id}`, `✍️ Corrija (${e.tipo}):\n“${e.trecho}”`, `✔ ${e.correcao}\n\n${e.regra}`]);
    }
    const xpGain = 15 + Math.round(correcao.nota / 5);
    await query(
      `UPDATE users SET xp = xp + $2,
         streak = CASE WHEN last_study = CURRENT_DATE THEN streak WHEN last_study = CURRENT_DATE - 1 THEN streak + 1 ELSE 1 END,
         last_study = CURRENT_DATE
       WHERE id=$1`, [uid, xpGain]);
    res.json({ ...toFull(r), xpGain });
  } catch (e) { next(e); }
});

redacaoRouter.delete('/:id', async (req: AuthedRequest, res, next) => {
  try {
    await query('DELETE FROM redacoes WHERE id=$1 AND user_id=$2', [Number(req.params.id), req.user!.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
