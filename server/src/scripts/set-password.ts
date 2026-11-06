// Troca a senha de um usuário direto no banco. Uso:
//   NEW_PW='nova-senha' npm -w server run set-password -- email@exemplo.com
import { hashPassword } from '../services/auth.js';
import { query, pool } from '../db/pool.js';

const email = process.argv[2];
const pw = process.env.NEW_PW;
if (!email || !pw) { console.error('Uso: NEW_PW=... set-password <email>'); process.exit(1); }
if (pw.length < 6) { console.error("Senha precisa ter pelo menos 6 caracteres"); process.exit(1); }

const r = await query('UPDATE users SET password_hash=$1 WHERE email=$2 RETURNING id', [await hashPassword(pw), email]);
console.log(r.rowCount ? `Senha de ${email} atualizada.` : `Usuário ${email} não encontrado.`);
await pool.end();
