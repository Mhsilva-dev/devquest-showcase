import { Router } from 'express';
import { explainSchema, journalSchema } from '@devquest/shared';
import { query } from '../db/pool.js';
import { requireAuth, type AuthedRequest } from '../services/auth.js';
import { readProjectFile } from '../services/projects.js';
import { ask, aiEnabled } from '../services/ai.js';

export const extrasRouter = Router();
extrasRouter.use(requireAuth);

// Explicar código: abre um trecho do SEU projeto e a IA explica (linha a linha se pedir)
extrasRouter.post('/explain', async (req, res, next) => {
  try {
    const { project, path, question } = explainSchema.parse(req.body);
    let code: string;
    try { code = await readProjectFile(project, path); }
    catch { return res.status(404).json({ error: 'Arquivo não encontrado nesse projeto.' }); }
    if (!aiEnabled()) return res.json({ code, explanation: null });
    const prompt = `Explique este arquivo do projeto "${project}" (${path}) para um dev que quer APRENDER com ele.
${question ? `Pergunta específica do aluno: ${question}` : 'Dê uma visão geral e depois os pontos mais importantes, explicando o PORQUÊ das decisões.'}
Seja didático, em português do Brasil, com markdown.

\`\`\`
${code}
\`\`\``;
    const explanation = await ask(prompt, { temperature: 0.4 });
    res.json({ code, explanation });
  } catch (e) { next(e); }
});

// Diário de aprendizado
extrasRouter.get('/journal', async (req: AuthedRequest, res, next) => {
  try {
    const r = await query('SELECT id, content, created_at FROM journal WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50', [req.user!.id]);
    res.json(r.rows);
  } catch (e) { next(e); }
});

extrasRouter.post('/journal', async (req: AuthedRequest, res, next) => {
  try {
    const { content } = journalSchema.parse(req.body);
    const r = await query('INSERT INTO journal (user_id, content) VALUES ($1,$2) RETURNING id, content, created_at', [req.user!.id, content]);
    res.json(r.rows[0]);
  } catch (e) { next(e); }
});
