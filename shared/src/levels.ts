import type { Lesson, Realm } from './types.js';

// Helper para declarar níveis extras de forma compacta.
// Cada item: [título, "tópico; tópico; tópico"] (ou com livros: [título, tópicos, "Livro A | Livro B"]).
// O chefão do nível é criado automaticamente, misturando os títulos do nível.
export type LevelDef = [title: string, topics: string, books?: string];

export const TIER_NAMES: Record<number, string> = { 1: 'Fundamentos', 2: 'Avançado', 3: 'Expert' };

export function level(realmId: string, prefix: string, tier: number, defs: LevelDef[], minutes = 25): Lesson[] {
  const lessons: Lesson[] = defs.map(([title, topics, books], i) => ({
    id: `${prefix}-n${tier}-${i + 1}`,
    realmId,
    title,
    minutes,
    tier,
    objectives: [`Dominar: ${title}`, 'Aplicar na prática e explicar com suas palavras'],
    topics: topics.split(';').map((t) => t.trim()).filter(Boolean),
    ...(books ? { books: books.split('|').map((b) => b.trim()) } : {}),
  }));
  lessons.push({
    id: `${prefix}-n${tier}-boss`,
    realmId,
    title: `Chefão do nível ${TIER_NAMES[tier] ?? tier}`,
    minutes: 30,
    tier,
    boss: true,
    objectives: ['Misturar tudo do nível num desafio no nível de mercado/prova'],
    topics: defs.map(([t]) => t),
  });
  return lessons;
}

/** Junta níveis extras aos reinos (sem mutar os originais). */
export function withLevels(realms: Realm[], extra: Record<string, Lesson[]>): Realm[] {
  return realms.map((r) => ({ ...r, lessons: [...r.lessons, ...(extra[r.id] ?? [])] }));
}
