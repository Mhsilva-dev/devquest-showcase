import { Router } from 'express';
import { levelFromXp } from '../services/srs.js';
import { loginSchema, setupSchema } from '@devquest/shared';
import { query } from '../db/pool.js';
import { config } from '../config.js';
import { hashPassword, checkPassword, setSession, clearSession, requireAuth, type AuthedRequest } from '../services/auth.js';

export const authRouter = Router();

// Primeiro acesso: cria a conta (exige o SETUP_CODE do .env). Depois do primeiro usuário, bloqueia.
authRouter.post('/setup', async (req, res, next) => {
  try {
    const { name, email, password, setupCode } = setupSchema.parse(req.body);
    if (setupCode !== config.setupCode) return res.status(403).json({ error: 'Código de setup inválido' });
    const count = await query('SELECT COUNT(*)::int AS n FROM users');
    if (count.rows[0].n > 0) return res.status(403).json({ error: 'Já existe uma conta. Use o login.' });
    const hash = await hashPassword(password);
    const r = await query('INSERT INTO users (name, email, password_hash, is_admin) VALUES ($1,$2,$3,TRUE) RETURNING id', [name, email.toLowerCase(), hash]);
    setSession(res, r.rows[0].id, req.secure);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const r = await query('SELECT id, password_hash FROM users WHERE email=$1', [email.toLowerCase()]);
    const u = r.rows[0];
    // Mensagem genérica de propósito (evita enumeração de usuários — aula sec-2)
    if (!u || !(await checkPassword(password, u.password_hash))) return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    setSession(res, u.id, req.secure);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

authRouter.post('/logout', (req, res) => { clearSession(res); res.json({ ok: true }); });

authRouter.get('/me', requireAuth, (req: AuthedRequest, res) => {
  res.json({ ...req.user, level: levelFromXp(req.user!.xp) });
});

// Para a tela de login saber se já existe conta (mostrar setup ou login)
authRouter.get('/status', async (_req, res, next) => {
  try {
    const r = await query('SELECT COUNT(*)::int AS n FROM users');
    res.json({ needsSetup: r.rows[0].n === 0 });
  } catch (e) { next(e); }
});
