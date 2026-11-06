// Configuração central, lida do .env (carregado pelo --env-file do tsx).
function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variável de ambiente ausente: ${name}`);
  return v;
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3030),
  databaseUrl: req('DATABASE_URL'),
  jwtSecret: req('JWT_SECRET'),
  setupCode: req('SETUP_CODE'),
  projectsRoot: process.env.PROJECTS_ROOT ?? '..',
  ai: {
    key: process.env.GEMINI_API_KEY ?? '',
    model: process.env.GEMINI_MODEL ?? 'gemini-3.5-flash',
    fallbacks: (process.env.GEMINI_FALLBACK_MODELS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    timeoutMs: 45000,
    maxRetries: 2,
  },
};

export const aiEnabled = () => Boolean(config.ai.key);
