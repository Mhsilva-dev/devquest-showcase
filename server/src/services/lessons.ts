// Geração de conteúdo de aula. Se a aula já tem `content` escrito à mão, usa ele.
// Senão, pede à IA um conteúdo completo a partir do roteiro + trechos reais do seu código, e guarda em cache.
import type { Lesson, LessonContent } from '@devquest/shared';
import { findLesson, findRealm, trackOf } from '@devquest/shared';
import { query } from '../db/pool.js';
import { askJSON, aiEnabled } from './ai.js';
import { readProjectFile } from './projects.js';

const SYSTEM = `Você é um professor de programação brasileiro excepcional, no estilo Feynman: didático, direto e motivador.
Escreve em português do Brasil. Usa analogias do dia a dia, explica o PORQUÊ e conecta tudo ao código REAL do aluno.
Nunca é prolixo. Markdown é permitido no texto.`;

const SYSTEM_CONCURSO = `Você é um professor de cursinho preparatório para concursos públicos brasileiros, dos melhores do país.
Escreve em português do Brasil, direto ao ponto, focado no que as bancas (Cebraspe, FGV, FCC, Cesgranrio, Vunesp) realmente cobram.
Sempre aponta pegadinhas de prova, cita o artigo/lei quando houver (lei seca) e usa mnemônicos. Markdown é permitido.
Seja fiel à legislação vigente que você conhece; quando algo puder ter mudado recentemente, avise para conferir a lei atualizada.`;

function concursoPrompt(lesson: Lesson): string {
  const realm = findRealm(lesson.realmId);
  return `Monte uma aula COMPLETA de cursinho para concurso, de ~${lesson.minutes} minutos.

Matéria: ${realm?.title ?? ''}
Aula: ${lesson.title}
Objetivos: ${lesson.objectives.join('; ')}
Tópicos a cobrir: ${lesson.topics.join(', ')}
${lesson.boss ? 'Esta é a PROVA FINAL da matéria: a prática e o quiz devem misturar todos os tópicos e ser no nível de prova real.' : ''}

Responda em JSON EXATAMENTE neste formato (sem texto fora do JSON):
{
  "hook": "uma questão de prova real-style ou situação que mostra por que isso cai (markdown)",
  "concept": "teoria completa e organizada (markdown com ## subtítulos, listas e tabelas comparativas). Termine com uma seção '## ⚠️ Pegadinhas de banca' e outra '## 📌 Resumo para revisão'",
  "analogy": "uma analogia do dia a dia que ajuda a entender",
  "memoryHook": "mnemônico ou frase para decorar",
  "example": { "lang": "text", "code": "uma questão de prova (enunciado + alternativas ou item certo/errado)", "explanation": "resolução comentada passo a passo" },
  "practice": { "prompt": "uma questão discursiva curta ou caso prático para o aluno responder por escrito", "checklist": ["o que a resposta precisa conter 1","2","3"] },
  "feynman": "o que o aluno deve explicar com as próprias palavras",
  "cards": [{"front":"pergunta objetiva de revisão","back":"resposta curta"}],
  "quiz": [{"q":"enunciado no estilo de banca","options":["A","B","C","D","E"],"answer":0,"explain":"por que a certa é certa e as outras erradas"}]
}
Gere 8 cards e 6 questões de quiz: 3 de múltipla escolha (5 alternativas, estilo FGV/FCC) e 3 itens de certo/errado estilo Cebraspe (options exatamente ["Certo","Errado"]). Varie a posição da resposta certa.`;
}

const SYSTEM_FINANCAS = `Você é um educador financeiro brasileiro de primeira linha, que estudou a fundo os clássicos (Graham, Buffett, Bogle, Housel, Dalio, Kahneman, Marks, Damodaran…).
Ensina em português do Brasil, com exemplos em reais e no contexto brasileiro (Selic, CDI, IPCA, Tesouro, B3, IR).
Explica as ideias dos livros com suas próprias palavras (sem copiar trechos longos) e cita o livro e o autor de onde vem cada ideia.
É honesto sobre riscos, nunca promete retorno e deixa claro que é conteúdo educativo, não recomendação. Regras de impostos e produtos mudam: avise para conferir as regras atuais.`;

function financasPrompt(lesson: Lesson): string {
  const realm = findRealm(lesson.realmId);
  return `Monte uma aula COMPLETA de educação financeira, de ~${lesson.minutes} minutos.

Trilha: ${realm?.title ?? ''}
Aula: ${lesson.title}
Objetivos: ${lesson.objectives.join('; ')}
Tópicos a cobrir: ${lesson.topics.join(', ')}
${lesson.books?.length ? `Livros de referência (explique as ideias deles com suas palavras e cite-os): ${lesson.books.join('; ')}` : 'Cite livros clássicos relevantes quando fizer sentido.'}
${lesson.boss ? 'Esta é a PROVA FINAL do nível: a prática deve ser um caso real completo que mistura todos os tópicos.' : ''}

Responda em JSON EXATAMENTE neste formato (sem texto fora do JSON):
{
  "hook": "situação real e brasileira que mostra por que isso importa (markdown)",
  "concept": "conteúdo completo em markdown com ## subtítulos, listas, tabelas e exemplos numéricos em R$. Inclua uma seção '## 📚 O que os livros ensinam' e termine com '## ✅ Na prática'",
  "analogy": "uma analogia do dia a dia",
  "memoryHook": "frase curta para lembrar",
  "example": { "lang": "text", "code": "um caso prático com números (ex.: simulação de investimento)", "explanation": "resolução passo a passo com os cálculos" },
  "practice": { "prompt": "um exercício aplicado à vida do aluno (calcular, planejar ou analisar)", "checklist": ["critério 1","critério 2","critério 3"] },
  "feynman": "o que o aluno deve explicar com as próprias palavras",
  "cards": [{"front":"pergunta","back":"resposta"}],
  "quiz": [{"q":"pergunta","options":["a","b","c","d"],"answer":0,"explain":"por quê"}]
}
Gere 6 cards e 5 perguntas de quiz (algumas com cálculo). Varie a posição da resposta certa.`;
}

const SYSTEM_MENTE = `Você é um mentor de disciplina e alta performance, com base sólida em psicologia comportamental (hábitos, motivação, autocontrole, resiliência) e filosofia estoica.
Ensina em português do Brasil, com honestidade e sem autoajuda vazia: separa o que tem evidência científica do que é opinião do autor e diz quando uma ideia popular foi contestada.
Explica as ideias dos livros com suas próprias palavras (sem copiar trechos) e cita livro e autor. Sempre transforma a ideia em ação concreta para hoje.
Não é terapia: se o tema tocar em sofrimento intenso, esgotamento ou depressão, orienta com cuidado a buscar psicólogo/médico (e o CVV, 188, em crise).`;

function mentePrompt(lesson: Lesson): string {
  const realm = findRealm(lesson.realmId);
  return `Monte uma aula COMPLETA sobre disciplina e mente, de ~${lesson.minutes} minutos, para alguém que já desistiu de coisas antes e quer parar de desistir (estuda para concurso e programação).

Trilha: ${realm?.title ?? ''}
Aula: ${lesson.title}
Objetivos: ${lesson.objectives.join('; ')}
Tópicos a cobrir: ${lesson.topics.join(', ')}
${lesson.books?.length ? `Livros de referência (explique as ideias deles com suas palavras e cite-os): ${lesson.books.join('; ')}` : 'Cite livros e pesquisas relevantes quando fizer sentido.'}
${(lesson.tier ?? 1) > 1 ? 'Nível avançado: o aluno já conhece o básico; vá mais fundo e traga nuances e críticas.' : ''}
${lesson.boss ? 'Esta é a PROVA FINAL do nível: a prática deve ser um plano pessoal completo que mistura todos os tópicos.' : ''}

Responda em JSON EXATAMENTE neste formato (sem texto fora do JSON):
{
  "hook": "uma cena real e reconhecível (ex.: a terceira semana de estudo, o domingo à noite) que mostra o problema (markdown)",
  "concept": "conteúdo completo em markdown com ## subtítulos, listas e exemplos. Inclua '## 📚 O que os livros e a ciência dizem' e termine com '## ✅ Faça hoje' (3 ações concretas e pequenas)",
  "analogy": "uma analogia do dia a dia",
  "memoryHook": "frase curta e forte para lembrar nos dias difíceis",
  "example": { "lang": "text", "code": "um caso de alguém aplicando (antes x depois, com detalhes concretos)", "explanation": "o que mudou e por quê funcionou" },
  "practice": { "prompt": "um exercício escrito aplicado à SUA vida (plano, reflexão estruturada ou regra se-então)", "checklist": ["critério 1","critério 2","critério 3"] },
  "feynman": "o que o aluno deve explicar com as próprias palavras",
  "cards": [{"front":"pergunta","back":"resposta"}],
  "quiz": [{"q":"pergunta de situação prática","options":["a","b","c","d"],"answer":0,"explain":"por quê"}]
}
Gere 6 cards e 4 perguntas de quiz. Varie a posição da resposta certa.`;
}

const SYSTEM_SOCIAL = `Você é um professor de comunicação interpessoal, com base em psicologia, Comunicação Não-Violenta, negociação e oratória.
Ensina em português do Brasil, de forma prática: toda técnica vem com FRASES PRONTAS de exemplo, do jeito que um brasileiro fala de verdade, e com o que NÃO dizer.
Explica as ideias dos livros com suas próprias palavras (sem copiar trechos), cita livro e autor e diz quando algo é mito ou pouco comprovado.`;

function socialPrompt(lesson: Lesson): string {
  const realm = findRealm(lesson.realmId);
  return `Monte uma aula COMPLETA de comunicação, de ~${lesson.minutes} minutos, para alguém que quer se comunicar melhor com as pessoas (família, amigos, trabalho, entrevistas e concursos).

Trilha: ${realm?.title ?? ''}
Aula: ${lesson.title}
Objetivos: ${lesson.objectives.join('; ')}
Tópicos a cobrir: ${lesson.topics.join(', ')}
${lesson.books?.length ? `Livros de referência (explique as ideias deles com suas palavras e cite-os): ${lesson.books.join('; ')}` : 'Cite livros e pesquisas relevantes quando fizer sentido.'}
${(lesson.tier ?? 1) > 1 ? 'Nível avançado: o aluno já conhece o básico; traga nuances, situações difíceis e erros comuns.' : ''}
${lesson.boss ? 'Esta é a PROVA FINAL do nível: a prática deve ser uma situação real completa que mistura todos os tópicos.' : ''}

Responda em JSON EXATAMENTE neste formato (sem texto fora do JSON):
{
  "hook": "uma cena real do dia a dia em que a comunicação dá errado (markdown)",
  "concept": "conteúdo completo em markdown com ## subtítulos, listas e tabelas '❌ Evite dizer | ✅ Diga assim'. Inclua '## 📚 O que os livros dizem' e termine com '## ✅ Treine hoje' (3 desafios pequenos para fazer com pessoas reais)",
  "analogy": "uma analogia do dia a dia",
  "memoryHook": "frase curta para lembrar na hora da conversa",
  "example": { "lang": "text", "code": "um diálogo curto (versão ruim e versão boa, com nomes)", "explanation": "o que mudou e por quê funcionou" },
  "practice": { "prompt": "um exercício escrito: reescrever uma fala, escrever o que você diria numa situação concreta ou planejar uma conversa real", "checklist": ["critério 1","critério 2","critério 3"] },
  "feynman": "o que o aluno deve explicar com as próprias palavras",
  "cards": [{"front":"situação ou pergunta","back":"o que dizer / a ideia-chave"}],
  "quiz": [{"q":"situação: o que você diria?","options":["a","b","c","d"],"answer":0,"explain":"por quê"}]
}
Gere 6 cards e 4 perguntas de quiz baseadas em situações. Varie a posição da resposta certa.`;
}

async function refsSnippets(lesson: Lesson): Promise<string> {
  if (!lesson.refs?.length) return '';
  const parts: string[] = [];
  for (const ref of lesson.refs) {
    try {
      const code = await readProjectFile(ref.project, ref.path);
      parts.push(`### Projeto "${ref.project}" — ${ref.path}\nDica: ${ref.hint}\n\`\`\`\n${code.slice(0, 3500)}\n\`\`\``);
    } catch { /* arquivo pode ter mudado de lugar; segue sem ele */ }
  }
  return parts.join('\n\n');
}

export async function getLessonContent(lessonId: string): Promise<{ lesson: Lesson; content: LessonContent | null; aiGenerated: boolean }> {
  const lesson = findLesson(lessonId);
  if (!lesson) throw new Error('Aula não encontrada');
  if (lesson.content) return { lesson, content: lesson.content, aiGenerated: false };

  const cached = await query('SELECT content FROM lesson_cache WHERE lesson_id=$1', [lessonId]);
  if (cached.rows[0]) return { lesson, content: cached.rows[0].content, aiGenerated: true };

  if (!aiEnabled()) return { lesson, content: null, aiGenerated: false };

  const track = trackOf(lessonId);
  if (track !== 'dev') {
    const content = track === 'concurso'
      ? await askJSON<LessonContent>(concursoPrompt(lesson), { system: SYSTEM_CONCURSO, temperature: 0.5, timeoutMs: 90000 })
      : track === 'mente'
        ? await askJSON<LessonContent>(mentePrompt(lesson), { system: SYSTEM_MENTE, temperature: 0.6, timeoutMs: 90000 })
      : track === 'social'
        ? await askJSON<LessonContent>(socialPrompt(lesson), { system: SYSTEM_SOCIAL, temperature: 0.6, timeoutMs: 90000 })
        : await askJSON<LessonContent>(financasPrompt(lesson), { system: SYSTEM_FINANCAS, temperature: 0.5, timeoutMs: 90000 });
    await query('INSERT INTO lesson_cache (lesson_id, content) VALUES ($1,$2) ON CONFLICT (lesson_id) DO UPDATE SET content=$2', [lessonId, content]);
    return { lesson, content, aiGenerated: true };
  }

  const snippets = await refsSnippets(lesson);
  const prompt = `Monte o conteúdo COMPLETO de uma micro-aula de ~${lesson.minutes} minutos.

Título: ${lesson.title}
Objetivos: ${lesson.objectives.join('; ')}
Tópicos a cobrir: ${lesson.topics.join(', ')}
${(lesson.tier ?? 1) > 1 ? `Nível ${lesson.tier === 2 ? 'AVANÇADO' : 'EXPERT'}: o aluno já domina os fundamentos deste reino. Pule o básico, vá fundo, mostre como é feito em produção (casos reais, armadilhas, trade-offs) e faça um desafio prático de nível ${lesson.tier === 2 ? 'pleno' : 'sênior'}.` : ''}
${lesson.boss && (lesson.tier ?? 1) > 1 ? 'Esta é a PROVA FINAL do nível: o desafio prático deve misturar todos os tópicos num caso real completo.' : ''}
${snippets ? `\nUse estes trechos REAIS do código do aluno como exemplo (cite o arquivo):\n${snippets}` : ''}

Responda em JSON EXATAMENTE neste formato (sem texto fora do JSON):
{
  "hook": "pergunta ou situação curta que prende a atenção (markdown ok)",
  "concept": "explicação principal clara e bem estruturada (markdown, pode ter tabelas)",
  "analogy": "uma analogia do mundo real",
  "memoryHook": "frase curta ou mnemônico para gravar",
  "example": { "lang": "ts", "code": "código de exemplo", "explanation": "o que observar" },
  "practice": { "prompt": "um desafio prático", "checklist": ["critério 1","critério 2","critério 3"] },
  "feynman": "o que o aluno deve explicar com as próprias palavras",
  "cards": [{"front":"pergunta","back":"resposta"}],
  "quiz": [{"q":"pergunta","options":["a","b","c","d"],"answer":0,"explain":"por quê"}]
}
Gere 5 cards e 3 perguntas de quiz. Seja específico e técnico.`;

  const content = await askJSON<LessonContent>(prompt, { system: SYSTEM, temperature: 0.6 });
  await query('INSERT INTO lesson_cache (lesson_id, content) VALUES ($1,$2) ON CONFLICT (lesson_id) DO UPDATE SET content=$2', [lessonId, content]);
  return { lesson, content, aiGenerated: true };
}

const GRADE_SYSTEM = `Você é um avaliador técnico justo e encorajador. Responde em português do Brasil, em JSON.`;
const GRADE_SYSTEM_FINANCAS = `Você é um planejador financeiro que corrige exercícios de educação financeira: confere os cálculos, a lógica e se a resposta é prudente. Justo e didático. Responde em português do Brasil, em JSON.`;
const GRADE_SYSTEM_MENTE = `Você é um mentor de disciplina que avalia exercícios de reflexão e planos pessoais: verifica se são concretos, realistas e aplicam a ideia da aula. Acolhedor, mas honesto. Responde em português do Brasil, em JSON.`;
const GRADE_SYSTEM_SOCIAL = `Você é um professor de comunicação que avalia exercícios práticos: verifica se a fala/mensagem do aluno é clara, respeitosa, assertiva e aplica a técnica da aula. Mostra como ficaria melhor. Responde em português do Brasil, em JSON.`;
const GRADE_SYSTEM_CONCURSO = `Você é um corretor de discursivas de banca de concurso (estilo Cebraspe/FGV): rigoroso, justo e didático.
Avalia conteúdo (domínio do tema, fundamentação legal) e forma (gramática, clareza, estrutura). Responde em português do Brasil, em JSON.`;

export async function gradeAnswer(lesson: Lesson, kind: 'practice' | 'feynman', answer: string, content: LessonContent | null) {
  const criteria = kind === 'practice'
    ? (content?.practice.checklist.join('; ') ?? lesson.objectives.join('; '))
    : (content?.feynman ?? `Explicar com clareza: ${lesson.topics.join(', ')}`);
  const prompt = `Aula: ${lesson.title}
Tarefa (${kind === 'practice' ? 'desafio prático' : 'explicação Feynman'}): ${kind === 'practice' ? content?.practice.prompt ?? '' : content?.feynman ?? ''}
Critérios de uma boa resposta: ${criteria}

Resposta do aluno:
"""${answer}"""

Avalie em JSON:
{"score": <0-100>, "verdict": "veredito curto e honesto", "strengths": [".."], "gaps": ["o que faltou ou está errado"], "idealAnswer": "resposta modelo curta"}`;
  const t = trackOf(lesson.id);
  const system = t === 'concurso' ? GRADE_SYSTEM_CONCURSO : t === 'financas' ? GRADE_SYSTEM_FINANCAS : t === 'mente' ? GRADE_SYSTEM_MENTE : t === 'social' ? GRADE_SYSTEM_SOCIAL : GRADE_SYSTEM;
  return askJSON(prompt, { system, temperature: 0.3 });
}
