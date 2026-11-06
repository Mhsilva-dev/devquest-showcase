import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { config } from './config.js';
import { initDb } from './db/init.js';
import { authRouter } from './routes/auth.js';
import { learnRouter } from './routes/learn.js';
import { interviewRouter } from './routes/interview.js';
import { extrasRouter } from './routes/extras.js';
import { labsRouter } from './routes/labs.js';
import { concursosRouter } from './routes/concursos.js';
import { financasRouter } from './routes/financas.js';
import { focoRouter } from './routes/foco.js';
import { redacaoRouter } from './routes/redacao.js';
import { capturaRouter } from './routes/captura.js';
import { menteRouter } from './routes/mente.js';
import { socialRouter } from './routes/social.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.set('trust proxy', 1); // atrás do nginx

app.use(helmet({ contentSecurityPolicy: false })); // CSP fica no nginx
// Captura aceita PDF em base64 (até ~8 MB); o parser global ignora corpos já lidos
app.use('/api/captura', express.json({ limit: '12mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Rate limit nas rotas sensíveis (ver aula sec-10)
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60000, max: 20 }));
app.use('/api/auth/setup', rateLimit({ windowMs: 60 * 60000, max: 5 }));
app.use('/api', rateLimit({ windowMs: 60000, max: 120 }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/learn', learnRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/labs', labsRouter);
app.use('/api/concursos', concursosRouter);
app.use('/api/financas', financasRouter);
app.use('/api/foco', focoRouter);
app.use('/api/redacao', redacaoRouter);
app.use('/api/captura', capturaRouter);
app.use('/api/mente', menteRouter);
app.use('/api/social', socialRouter);
app.use('/api', extrasRouter);

// Frontend buildado (web/dist). SPA: qualquer rota não-API cai no index.html.
const webDist = join(__dirname, '../../web/dist');
app.use(express.static(webDist));
app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(join(webDist, 'index.html')));

// Tratador de erro central (não vaza stack trace — aula de segurança)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Duck-typing em vez de instanceof: evita falha quando há mais de uma cópia do zod entre pacotes
  const issues = err?.issues ?? err?.errors;
  if (err?.name === 'ZodError' && Array.isArray(issues)) {
    return res.status(400).json({ error: 'Dados inválidos', details: issues.map((i: any) => i.message) });
  }
  console.error('[erro]', err);
  res.status(500).json({ error: 'Erro interno' });
});

async function main() {
  await initDb();
  app.listen(config.port, '127.0.0.1', () => console.log(`[devquest] no ar em http://127.0.0.1:${config.port} (IA: ${config.ai.key ? 'ligada' : 'desligada'})`));
}
main().catch((e) => { console.error('Falha ao subir:', e); process.exit(1); });
