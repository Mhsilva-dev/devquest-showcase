// Leitura segura dos SEUS projetos: o app abre trechos reais do seu código como material.
// Trava contra path traversal: só lê dentro de PROJECTS_ROOT e nas pastas mapeadas.
import { readFile } from 'node:fs/promises';
import { resolve, join, normalize } from 'node:path';
import { config } from '../config.js';
import type { ProjectId } from '@devquest/shared';

const DIRS: Record<ProjectId, string> = {
  financeflow: 'finance/financeflow',
  'speak-ai': 'speak-ai',
  'trading-bot': 'trading-bot',
  lifequest: 'disciplina',
  devquest: 'devquest',
};

export function projectDir(project: ProjectId): string {
  return resolve(config.projectsRoot, DIRS[project]);
}

/** Lê um arquivo de um projeto, bloqueando qualquer tentativa de sair da pasta. */
export async function readProjectFile(project: ProjectId, relPath: string): Promise<string> {
  const base = projectDir(project);
  const full = resolve(base, normalize(relPath));
  if (!full.startsWith(base + '/') && full !== base) throw new Error('Caminho fora do projeto');
  if (full.includes('node_modules') || full.includes('/.env')) throw new Error('Arquivo protegido');
  const content = await readFile(full, 'utf8');
  return content.length > 20000 ? content.slice(0, 20000) + '\n… (truncado)' : content;
}
