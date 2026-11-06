import type { Track } from '@devquest/shared';

// Para onde cada trilha aponta no front (API, painel e página de uma trilha/matéria).
export const TRACK_UI: Record<Track, { api: string; home: string; homeLabel: string; realmPath: string; realmLabel: string }> = {
  dev: { api: '/learn', home: '/', homeLabel: 'Mapa', realmPath: '/realm', realmLabel: 'Reino' },
  concurso: { api: '/concursos', home: '/concursos', homeLabel: 'Painel de concursos', realmPath: '/concursos/materia', realmLabel: 'Matéria' },
  financas: { api: '/financas', home: '/financas', homeLabel: 'Painel de finanças', realmPath: '/financas/trilha', realmLabel: 'Trilha' },
  mente: { api: '/mente', home: '/mente', homeLabel: 'Painel de disciplina', realmPath: '/mente/trilha', realmLabel: 'Trilha' },
  social: { api: '/social', home: '/social', homeLabel: 'Painel de comunicação', realmPath: '/social/trilha', realmLabel: 'Trilha' },
};
