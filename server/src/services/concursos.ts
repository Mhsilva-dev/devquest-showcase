// Modo Concurso: simulados no estilo de banca e plano de estudos estratégico, ambos gerados pela IA.
import type { Banca, SimQuestionFull, StudyPlan, StudyPlanInput, MateriaStats } from '@devquest/shared';
import { concursoRealms, findRealm, findCareer } from '@devquest/shared';
import { askJSON } from './ai.js';

const SYSTEM = `Você é um elaborador de questões de concursos públicos brasileiros com anos de experiência em Cebraspe, FGV, FCC, Cesgranrio e Vunesp.
Cria questões inéditas, corretas, sem ambiguidade, fiéis à legislação vigente e no estilo exato da banca pedida. Responde em português do Brasil, em JSON.`;

const BANCA_STYLE: Record<Banca, string> = {
  cebraspe: 'Cebraspe: itens de CERTO ou ERRADO. Cada item é uma afirmação; options exatamente ["Certo","Errado"]. Use as pegadinhas típicas (generalizações, troca de uma palavra, "somente", "sempre").',
  fgv: 'FGV: múltipla escolha com 5 alternativas (A–E), enunciados longos e contextualizados, muita interpretação e casos concretos.',
  fcc: 'FCC: múltipla escolha com 5 alternativas, muito apego à letra da lei e a conceitos literais.',
  cesgranrio: 'Cesgranrio: múltipla escolha com 5 alternativas, objetiva, com situações do dia a dia bancário/empresarial e cálculos.',
  vunesp: 'Vunesp: múltipla escolha com 5 alternativas, linguagem direta, cobra conceitos e letra da lei.',
  mista: 'Misture: metade itens Certo/Errado estilo Cebraspe (options ["Certo","Errado"]) e metade múltipla escolha com 5 alternativas estilo FGV/FCC.',
};

const DIFF = { facil: 'fácil (conceitos básicos)', media: 'média (nível de prova real)', dificil: 'difícil (nível das questões que eliminam candidatos)' };

export async function generateSimulado(realmIds: string[], banca: Banca, count: number, difficulty: keyof typeof DIFF): Promise<(SimQuestionFull & { realmId: string })[]> {
  const materias = realmIds.map((id) => {
    const r = findRealm(id)!;
    return `- realmId "${r.id}": ${r.title} — tópicos: ${r.lessons.flatMap((l) => l.topics).slice(0, 40).join(', ')}`;
  }).join('\n');

  const prompt = `Crie um simulado com EXATAMENTE ${count} questões inéditas.
Estilo: ${BANCA_STYLE[banca]}
Dificuldade: ${DIFF[difficulty]}
Distribua as questões entre estas matérias (proporcionalmente, variando os tópicos):
${materias}

Responda em JSON:
{"questions":[{"realmId":"id da matéria","topic":"tópico curto","q":"enunciado","options":["..."],"answer":<índice da correta>,"explain":"comentário do professor: por que a certa é certa, onde está a pegadinha, artigo de lei se houver"}]}
Varie a posição da resposta correta. Não repita tópicos.`;

  const out = await askJSON<{ questions: (SimQuestionFull & { realmId: string })[] }>(prompt, { system: SYSTEM, temperature: 0.8, timeoutMs: 120000 });
  // Higieniza: a IA às vezes erra o formato. Descarta questões quebradas.
  const valid = (out.questions ?? []).filter((q) =>
    typeof q?.q === 'string' && Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 6 &&
    Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length,
  ).map((q) => ({
    q: q.q, options: q.options.map(String), answer: q.answer, explain: String(q.explain ?? ''), topic: q.topic ? String(q.topic) : undefined,
    realmId: realmIds.includes(q.realmId) ? q.realmId : realmIds[0],
  }));
  if (valid.length < Math.min(5, count)) throw new Error('A IA gerou um simulado inválido. Tente de novo.');
  return valid.slice(0, count);
}

const PLAN_SYSTEM = `Você é um coach de aprovação em concursos públicos, especialista em planejamento estratégico (ciclo de estudos, revisão espaçada, questões, simulados).
É realista com o tempo disponível, prioriza por peso no edital x dificuldade do aluno, e escreve em português do Brasil. Responde em JSON.`;

export async function generatePlan(input: StudyPlanInput, stats: MateriaStats[]): Promise<StudyPlan> {
  const career = input.careerId ? findCareer(input.careerId) : undefined;
  const materiaIds = career?.materias ?? concursoRealms.map((r) => r.id).filter((id) => id !== 'c-estrategia');
  const materias = materiaIds.map((id) => {
    const r = findRealm(id);
    const lvl = input.levels[id];
    const s = stats.find((x) => x.realmId === id);
    return `- ${id}: ${r?.title ?? id} | nível declarado: ${lvl === 1 ? 'fraco' : lvl === 3 ? 'forte' : 'médio'}${s && s.answered >= 5 ? ` | acerto real em simulados: ${s.pct}% (${s.answered} questões)` : ''}`;
  }).join('\n');

  const weekly = input.hoursPerDay * input.daysPerWeek;
  const prompt = `Monte um plano de estudos ESTRATÉGICO para este candidato.

Concurso-alvo: ${input.target}${career ? ` (${career.orgao}, banca ${career.banca}, ${career.escolaridade === 'medio' ? 'nível médio' : 'nível superior'}, fases: ${career.fases.join(', ')})` : ''}
Tempo: ${input.hoursPerDay}h por dia, ${input.daysPerWeek} dias por semana (${weekly}h/semana)
${input.examDate ? `Data provável da prova: ${input.examDate}` : 'Sem edital aberto ainda (estudo de base).'}
Matérias (use EXATAMENTE estes realmId no ciclo):
${materias}

Regras:
- Ciclo de estudos (não cronograma fixo): soma das horas do ciclo = ${weekly}h. Mais horas para matérias de maior peso e onde o aluno é fraco; matéria forte recebe menos, mas nunca zero.
- Inclua tempo de questões e revisão dentro dos blocos.
- Se houver TAF nas fases, inclua treino físico nos alertas/estratégia.
- Seja concreto e prático; nada genérico.

Responda em JSON:
{
  "resumo": "2-3 frases com a estratégia geral",
  "ciclo": [{"realmId":"c-port","materia":"Língua Portuguesa","horas":3,"foco":"o que priorizar nessa matéria agora"}],
  "semana": [{"dia":"Segunda","blocos":["1h Português: crase + 20 questões","..."]}],
  "estrategia": ["regra prática 1","..."],
  "metas": [{"prazo":"30 dias","meta":"..."},{"prazo":"90 dias","meta":"..."}],
  "alertas": ["cuidados (ex.: confira o edital, TAF, idade, CNH)"]
}
Na "semana", liste só os ${input.daysPerWeek} dias de estudo.`;

  const plan = await askJSON<StudyPlan>(prompt, { system: PLAN_SYSTEM, temperature: 0.5, timeoutMs: 90000 });
  plan.ciclo = (plan.ciclo ?? []).filter((c) => findRealm(c.realmId));
  return plan;
}
