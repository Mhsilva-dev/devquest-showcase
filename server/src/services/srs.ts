// Repetição espaçada: 1 → 3 → 7 → 14 → 30 dias. Errou volta pro 1; passou do 30, graduou.
// Mesma lógica que você escreveu no Speak AI (srs.js) — reaproveitada como material de estudo.
const INTERVALS = [1, 3, 7, 14, 30];
const DAY = 86400000;

export function nextReview(currentIntervalDays: number, success: boolean, now = new Date()) {
  if (!success) return { intervalDays: 1, nextReview: new Date(now.getTime() + DAY), graduated: false };
  const next = INTERVALS.find((d) => d > currentIntervalDays);
  if (!next) return { intervalDays: currentIntervalDays, nextReview: null, graduated: true };
  return { intervalDays: next, nextReview: new Date(now.getTime() + next * DAY), graduated: false };
}

// XP e nível: curva suave (nível n exige 100*n*(n+1)/2 de XP acumulado).
export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= 50 * level * (level + 1)) level++;
  return level;
}
