// Tipos que o front e o back usam juntos. Mudou aqui, o TypeScript aponta o erro nos dois lados.

export type ProjectId = 'financeflow' | 'speak-ai' | 'trading-bot' | 'lifequest' | 'devquest';

/** Trecho real de um dos seus projetos usado como exemplo numa aula */
export interface ProjectRef {
  project: ProjectId;
  path: string; // relativo à raiz do projeto
  hint: string; // o que observar nesse arquivo
}

export interface Card {
  front: string;
  back: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // índice da opção certa
  explain: string;
}

/** Conteúdo completo de uma missão: o ciclo Gancho → Conceito → Seu código → Prática → Ensine → Cards */
export interface LessonContent {
  hook: string; // pergunta/situação que prende a atenção (markdown)
  concept: string; // explicação principal (markdown)
  analogy: string; // comparação com o mundo real
  memoryHook: string; // frase/mnemônico para gravar
  example?: { lang: string; code: string; explanation: string };
  practice: { prompt: string; starter?: string; checklist: string[] };
  feynman: string; // o que você deve explicar com suas palavras
  cards: Card[];
  quiz: QuizQuestion[];
}

export interface Lesson {
  id: string;
  realmId: string;
  title: string;
  minutes: number;
  objectives: string[];
  topics: string[];
  refs?: ProjectRef[];
  interview?: string[]; // perguntas de entrevista sobre o tema
  boss?: boolean; // prova final do reino: mistura tudo que veio antes
  tier?: number; // nível dentro do reino: 1 Fundamentos, 2 Avançado, 3 Expert (padrão 1)
  books?: string[]; // livros de referência (trilha de finanças)
  content?: LessonContent; // escrito à mão; sem ele, a IA gera a partir do syllabus
}

export interface Realm {
  id: string;
  title: string;
  emoji: string;
  color: string; // classe de cor base (tailwind), ex.: "violet"
  tagline: string;
  why: string; // por que isso te separa da multidão
  lessons: Lesson[];
  track?: Track; // padrão: 'dev'
}

/** Trilha: programação ou concursos. Ficam separadas no app. */
export type Track = 'dev' | 'concurso' | 'financas' | 'mente' | 'social';

export type LessonStatus = 'locked' | 'available' | 'in_progress' | 'done';

export interface Me {
  id: number;
  name: string;
  email: string;
  xp: number;
  level: number;
  streak: number;
  aiEnabled: boolean;
}

export interface Overview {
  me: Me;
  progress: Record<string, { status: LessonStatus; score: number | null }>;
  dueCards: number;
  next: { lessonId: string; realmId: string; title: string } | null;
  todayMinutes: number;
}

export interface ReviewCard {
  id: number;
  lessonId: string | null;
  front: string;
  back: string;
  intervalDays: number;
}

export interface Grade {
  score: number; // 0–100
  verdict: string;
  strengths: string[];
  gaps: string[];
  idealAnswer?: string;
}

export type InterviewPersona = 'techlead' | 'gringo' | 'senior' | 'security' | 'rh';
export type InterviewLevel = 'junior' | 'pleno' | 'senior';

export interface ChatMessage {
  role: 'interviewer' | 'candidate';
  text: string;
}

export interface InterviewFeedback {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  perQuestion: { question: string; score: number; better: string }[];
  studyNext: string[];
}

export interface InterviewSummary {
  id: number;
  persona: InterviewPersona;
  level: InterviewLevel;
  topic: string;
  score: number | null;
  createdAt: string;
  finished: boolean;
}

export interface LabInfo {
  id: string;
  title: string;
  owasp: string;
  difficulty: 1 | 2 | 3;
  story: string;
  goal: string;
  hints: string[];
  vulnerableCode: string;
  fixPrompt: string;
}

// ---------- Modo Concurso ----------

export type Banca = 'cebraspe' | 'fgv' | 'fcc' | 'cesgranrio' | 'vunesp' | 'mista';

/** Carreira do guia de concursos (valores aproximados de editais recentes) */
export interface Career {
  id: string;
  name: string;
  orgao: string;
  escolaridade: 'medio' | 'superior';
  salario: string; // faixa aproximada, ex.: "≈ R$ 5.900"
  banca: string;
  area: 'policial' | 'tribunais' | 'bancario' | 'administrativo' | 'legislativo' | 'militar';
  materias: string[]; // ids dos reinos de concurso que mais caem
  fases: string[];
  dica: string;
}

export interface SimQuestion {
  q: string;
  options: string[];
  topic?: string;
  realmId: string;
}

export interface SimQuestionFull extends SimQuestion {
  answer: number;
  explain: string;
}

export interface SimuladoResult {
  id: number;
  score: number;
  correct: number;
  total: number;
  xpGain: number;
  questions: (SimQuestionFull & { picked: number | null })[];
}

export interface SimuladoSummary {
  id: number;
  realmIds: string[];
  banca: Banca;
  total: number;
  correct: number | null;
  score: number | null;
  createdAt: string;
}

export interface MateriaStats {
  realmId: string;
  answered: number;
  correct: number;
  pct: number;
}

export interface StudyPlanInput {
  careerId?: string;
  target: string;
  hoursPerDay: number;
  daysPerWeek: number;
  examDate?: string;
  levels: Record<string, 1 | 2 | 3>; // 1 fraco, 2 médio, 3 forte
}

export interface StudyPlan {
  resumo: string;
  ciclo: { realmId: string; materia: string; horas: number; foco: string }[];
  semana: { dia: string; blocos: string[] }[];
  estrategia: string[];
  metas: { prazo: string; meta: string }[];
  alertas: string[];
}

export interface ConcursoOverview {
  progress: Record<string, { status: LessonStatus; score: number | null }>;
  dueCards: number;
  stats: MateriaStats[];
  simulados: number;
  hasPlan: boolean;
  target: string | null;
}

// ---------- Finanças ----------

export interface FinancePlanInput {
  rendaMensal: number;
  gastosMensais: number;
  dividas: number;
  jurosDividaMes?: number;
  reserva: number;
  investido: number;
  idade: number;
  objetivo: string;
  perfil: 'conservador' | 'moderado' | 'arrojado';
  prazoAnos: number;
}

export interface FinancePlan {
  diagnostico: string;
  fases: { fase: string; prazo: string; acoes: string[] }[];
  alocacao: { classe: string; percentual: number; porque: string }[];
  numeros: { aporteMensalSugerido: number; reservaIdeal: number; metaIndependencia: number; anosParaMeta: number };
  trilha: { realmId: string; motivo: string }[];
  livros: string[];
  alertas: string[];
}

export interface BookSummary {
  ideia: string;
  licoes: { titulo: string; explicacao: string }[];
  citacoesParafraseadas: string[];
  planoDeAcao: string[];
  criticas: string[];
  paraQuem: string;
}

export interface FinancasOverview {
  progress: Record<string, { status: LessonStatus; score: number | null }>;
  dueCards: number;
  hasPlan: boolean;
  objetivo: string | null;
}

// Indicadores de mercado (Banco Central + Mercado Bitcoin), atualizados pelo servidor.
export interface Indicador { valor: number; data: string }
export interface Indicadores {
  cdiAnual: Indicador | null;   // % a.a. (base 252)
  cdiDiario: Indicador | null;  // % ao dia útil
  selic: Indicador | null;      // meta Selic % a.a.
  ipca12m: Indicador | null;    // IPCA acumulado 12 meses %
  dolarPtax: Indicador | null;  // R$ (fechamento do BC)
  dolar: Indicador | null;      // R$ ao vivo (cotação USDT-BRL)
  btc: Indicador | null;        // R$ ao vivo
  btcVar24h: number | null;     // % desde a abertura
  atualizadoEm: string;
}

// ---------- Foco (Pomodoro + horas líquidas) ----------

export interface FocoSession {
  id: number;
  subject: string;     // realmId (ex.: "c-port") ou texto livre
  label: string;       // nome legível da matéria
  track: Track | 'outro';
  minutes: number;
  note: string | null;
  createdAt: string;
}

export interface FocoStats {
  todayMinutes: number;
  weekMinutes: number;
  goalMinutes: number;                                    // meta diária
  days: { date: string; minutes: number }[];              // últimos 14 dias
  bySubject: { subject: string; label: string; minutes: number }[]; // últimos 7 dias
  recent: FocoSession[];
}

// ---------- Redação / Discursiva ----------

export type RedacaoBanca = 'cebraspe' | 'fgv' | 'fcc' | 'vunesp' | 'cesgranrio' | 'enem';
export type RedacaoTipo = 'dissertativa' | 'discursiva' | 'estudo-caso';

export interface RedacaoTema {
  tema: string;
  comando: string;           // o que a banca pede
  textosMotivadores: string[];
  aspectos: string[];        // tópicos que o texto deve abordar (quesitos de conteúdo)
  linhas: { min: number; max: number };
}

export interface RedacaoCriterio { nome: string; nota: number; max: number; comentario: string }
export interface RedacaoErro { trecho: string; tipo: string; correcao: string; regra: string }

export interface RedacaoCorrecao {
  nota: number;               // 0–100 normalizada
  notaBanca: string;          // ex.: "NPD 7,4 de 10" no formato da banca
  criterios: RedacaoCriterio[];
  aspectosCobertos: { aspecto: string; ok: boolean; comentario: string }[];
  erros: RedacaoErro[];
  fortes: string[];
  melhorar: string[];
  reescrita: string;          // um parágrafo reescrito como modelo
}

export interface RedacaoSummary {
  id: number;
  banca: RedacaoBanca;
  tipo: RedacaoTipo;
  tema: string;
  nota: number | null;
  createdAt: string;
}

export interface RedacaoFull extends RedacaoSummary {
  proposta: RedacaoTema;
  texto: string | null;
  correcao: RedacaoCorrecao | null;
}

// ---------- Captura (link/vídeo/PDF/texto → resumo + cards + quiz) ----------

export type CapturaSource = 'url' | 'youtube' | 'pdf' | 'texto';

export interface CapturaResult {
  titulo: string;
  resumo: string;              // markdown
  pontos: string[];
  cards: { front: string; back: string }[];
  quiz: { q: string; options: string[]; answer: number; explain: string }[];
}

export interface CapturaSummary {
  id: number;
  track: Track;
  sourceType: CapturaSource;
  source: string;
  titulo: string;
  cards: number;
  createdAt: string;
}

export interface CapturaFull extends CapturaSummary { result: CapturaResult }

// ---------- Disciplina & Mente ----------

export interface MenteProtocol {
  frase: string;                                   // frase-âncora para os dias difíceis
  identidade: string;                              // "Eu sou alguém que…"
  porque: string;                                  // o porquê profundo, nas palavras do aluno, lapidado
  minimo: string;                                  // versão mínima diária (impossível de falhar)
  ideal: string;                                   // versão completa do dia
  regras: string[];                                // regras inegociáveis (ex.: nunca falhar duas vezes)
  seEntao: { se: string; entao: string }[];        // planos para os obstáculos
  ambiente: string[];                              // mudanças no ambiente
  alertas: { sinal: string; acao: string }[];      // sinais de que você está escorregando
  diaRuim: string[];                               // passo a passo do dia ruim
  recaida: string[];                               // como voltar depois de parar
  revisaoSemanal: string[];                        // perguntas da revisão de domingo
  livros: { titulo: string; porque: string }[];
}

export interface MenteOverview {
  progress: Record<string, { status: LessonStatus; score: number | null }>;
  dueCards: number;
  meta: string | null;
  hasProtocol: boolean;
  today: 'minimo' | 'completo' | null;
  yesterday: 'minimo' | 'completo' | null;
  run: number;          // dias seguidos com check-in (até hoje ou ontem)
  best: number;
  days: { date: string; kind: 'minimo' | 'completo' | null }[]; // últimos 35 dias
}

// ---------- Comunicação & Relações ----------

export interface ConversaMsg { role: 'eu' | 'outro'; text: string }

export interface ConversaFeedback {
  score: number;                                          // 0–100
  resumo: string;
  objetivo: { alcancado: boolean; comentario: string };
  criterios: { nome: string; nota: number; comentario: string }[]; // nota 0–10
  melhorMomento: string;
  reescritas: { original: string; melhor: string; porque: string }[];
  dicas: string[];
}

export interface ConversaCena { titulo: string; emoji: string; objetivo: string; papel: string; abertura: string; skill: string; realmId?: string }

export interface ConversaSummary { id: number; titulo: string; emoji: string; dificuldade: string; score: number | null; finished: boolean; createdAt: string }

export interface ConversaFull extends ConversaSummary { cena: ConversaCena; messages: ConversaMsg[]; feedback: ConversaFeedback | null }

export interface SocialOverview {
  progress: Record<string, { status: LessonStatus; score: number | null }>;
  dueCards: number;
  conversas: number;
  media: number | null;
}

export interface Reescrita {
  analise: string;                                  // como a mensagem original pode ser recebida
  versoes: { tom: string; texto: string }[];
  dicas: string[];
}
