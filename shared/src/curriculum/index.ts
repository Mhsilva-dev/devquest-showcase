import type { Realm, Lesson, Track } from '../types.js';
import { concursoRealms } from '../concursos/materias.js';
import { financasRealms } from '../financas/materias.js';
import { menteRealms } from '../mente/materias.js';
import { socialRealms } from '../social/materias.js';
import { metodo } from './metodo.js';
import { seguranca } from './seguranca.js';
import { withLevels } from '../levels.js';
import { devLevels } from './niveis.js';
import { fundamentos, backend, bancos, frontend, tempoReal, git, ia, engenharia, devops, pentest, carreira } from './outros.js';

// Ordem dos reinos no mapa. Começa pelo método (aprender a aprender), termina em carreira.
export const realms: Realm[] = withLevels([
  metodo,
  fundamentos,
  git,
  backend,
  bancos,
  seguranca,
  frontend,
  tempoReal,
  ia,
  engenharia,
  devops,
  pentest,
  carreira,
], devLevels);

/** Todos os reinos (dev + concursos). `realms` continua sendo só a trilha de programação. */
export const everyRealm: Realm[] = [...realms, ...concursoRealms, ...financasRealms, ...menteRealms, ...socialRealms];

export const allLessons: Lesson[] = everyRealm.flatMap((r) => r.lessons);

export function findLesson(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function findRealm(id: string): Realm | undefined {
  return everyRealm.find((r) => r.id === id);
}

export function trackOf(lessonOrRealmId: string): Track {
  if (lessonOrRealmId.startsWith('c-')) return 'concurso';
  if (lessonOrRealmId.startsWith('f-')) return 'financas';
  if (lessonOrRealmId.startsWith('m-')) return 'mente';
  if (lessonOrRealmId.startsWith('s-')) return 'social';
  return 'dev';
}

const devLessons = realms.flatMap((r) => r.lessons);
const tierOf = (l: Lesson) => l.tier ?? 1;
/** Trilha principal (nível 1) de todos os reinos em sequência. */
const coreOrder: string[] = devLessons.filter((l) => tierOf(l) === 1).map((l) => l.id);
/** Ordem das aulas de programação: todo o nível 1 primeiro, depois o 2 e o 3 (usada para sugerir a próxima missão). */
export const lessonOrder: string[] = [1, 2, 3].flatMap((t) => devLessons.filter((l) => tierOf(l) === t).map((l) => l.id));

/**
 * Aula que precisa estar concluída antes desta (null = já liberada).
 * Dev nível 1: trilha única sequencial. Níveis 2/3 (a 1ª aula pede o chefão do nível anterior), Concurso e Finanças:
 * sequência dentro do próprio reino/matéria.
 */
export function prerequisiteOf(lessonId: string): string | null {
  if (trackOf(lessonId) === 'dev' && (findLesson(lessonId)?.tier ?? 1) === 1) {
    const i = coreOrder.indexOf(lessonId);
    return i > 0 ? coreOrder[i - 1] : null;
  }
  const lesson = findLesson(lessonId);
  const realm = lesson && findRealm(lesson.realmId);
  if (!realm) return null;
  const i = realm.lessons.findIndex((l) => l.id === lessonId);
  return i > 0 ? realm.lessons[i - 1].id : null;
}
