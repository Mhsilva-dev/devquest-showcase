import { Router } from 'express';
import { labAttackSchema, labFixSchema } from '@devquest/shared';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { LABS, findLab } from '../labs/catalog.js';
import { SANDBOX } from '../labs/sandbox.js';
import { query } from '../db/pool.js';
import { ask, aiEnabled } from '../services/ai.js';

export const labsRouter = Router();
labsRouter.use(requireAuth);

labsRouter.get('/', (_req, res) => res.json(LABS));

labsRouter.get('/:id', (req, res) => {
  const lab = findLab(String(req.params.id));
  if (!lab) return res.status(404).json({ error: 'Laboratório não encontrado' });
  res.json(lab);
});

// Roda o ataque no alvo FALSO e isolado. Mostra lado a lado: vulnerável x seguro.
labsRouter.post('/:id/attack', (req, res, next) => {
  try {
    const id = String(req.params.id);
    const fn = SANDBOX[id];
    if (!fn) return res.status(404).json({ error: 'Laboratório não encontrado' });
    const { input } = labAttackSchema.parse(req.body);
    const result = fn(input);
    const solved = Boolean(result.vulnerable.flag);
    res.json({ result, solved });
  } catch (e) { next(e); }
});

// Desafio de correção: você escreve/explica a defesa; a IA avalia. Marca o lab como concluído e dá XP.
labsRouter.post('/:id/fix', async (req: AuthedRequest, res, next) => {
  try {
    const lab = findLab(String(req.params.id));
    if (!lab) return res.status(404).json({ error: 'Laboratório não encontrado' });
    const { code } = labFixSchema.parse(req.body);
    if (!aiEnabled()) return res.status(503).json({ error: 'Configure a GEMINI_API_KEY para a avaliação da correção.' });

    const prompt = `Laboratório de segurança: "${lab.title}" (${lab.owasp}).
Código vulnerável original:
${lab.vulnerableCode}

Tarefa dada ao aluno: ${lab.fixPrompt}

Resposta/correção do aluno:
"""${code}"""

Avalie em JSON (português): {"score": <0-100>, "secure": <true se a correção realmente fecha a falha>, "verdict": "curto e honesto", "strengths": [".."], "gaps": ["o que ainda está vulnerável ou faltou"], "idealAnswer": "correção modelo com código"}`;
    const raw = await ask(prompt, { json: true, temperature: 0.3 });
    let grade: any; try { grade = JSON.parse(raw); } catch { grade = { score: 0, secure: false, verdict: 'Não consegui avaliar, tente de novo.', strengths: [], gaps: [] }; }

    if (grade.secure && grade.score >= 70) {
      const lessonId = `lab-${lab.id}`;
      const already = (await query('SELECT 1 FROM progress WHERE user_id=$1 AND lesson_id=$2', [req.user!.id, lessonId])).rows[0];
      await query(`INSERT INTO progress (user_id, lesson_id, status, score) VALUES ($1,$2,'done',$3)
                   ON CONFLICT (user_id, lesson_id) DO UPDATE SET status='done', score=GREATEST(progress.score,$3)`,
        [req.user!.id, lessonId, Math.round(grade.score)]);
      if (!already) await query('UPDATE users SET xp = xp + 40 WHERE id=$1', [req.user!.id]); // laboratório vale bem
    }
    res.json({ grade, xpAwarded: grade.secure && grade.score >= 70 });
  } catch (e) { next(e); }
});
