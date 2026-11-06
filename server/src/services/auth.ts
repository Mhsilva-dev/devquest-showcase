// Autenticação: hash bcrypt + JWT em cookie httpOnly. É também material da aula sec-2 e sec-6.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';
import { query } from '../db/pool.js';

const COOKIE = 'dq_session';

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 12); // custo 12: lento de propósito (ver aula de senhas)
}

export async function checkPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export function setSession(res: Response, userId: number, secure: boolean): void {
  const token = jwt.sign({ uid: userId }, config.jwtSecret, { expiresIn: '30d' });
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure, maxAge: 30 * 86400000, path: '/' });
}

export function clearSession(res: Response): void {
  res.clearCookie(COOKIE, { path: '/' });
}

export interface AuthedRequest extends Request {
  user?: { id: number; name: string; email: string; isAdmin: boolean; xp: number; streak: number };
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.[COOKIE];
    if (!token) { res.status(401).json({ error: 'Faça login para continuar' }); return; }
    const { uid } = jwt.verify(token, config.jwtSecret) as { uid: number };
    const r = await query('SELECT id, name, email, is_admin, xp, streak FROM users WHERE id=$1', [uid]);
    const u = r.rows[0];
    if (!u) { res.status(401).json({ error: 'Sessão inválida' }); return; }
    req.user = { id: u.id, name: u.name, email: u.email, isAdmin: u.is_admin, xp: u.xp, streak: u.streak };
    next();
  } catch {
    res.status(401).json({ error: 'Sessão inválida' });
  }
}
