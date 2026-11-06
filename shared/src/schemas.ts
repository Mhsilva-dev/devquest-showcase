// Contratos da API validados com zod: o back valida a entrada, o front usa os mesmos tipos.
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
});

export const setupSchema = loginSchema.extend({
  password: z.string().min(8).max(200),
  name: z.string().min(2).max(60),
  setupCode: z.string().min(4).max(40),
});

export const gradeSchema = z.object({
  lessonId: z.string().max(80),
  kind: z.enum(['practice', 'feynman']),
  answer: z.string().min(1).max(12000),
});

export const completeSchema = z.object({
  lessonId: z.string().max(80),
  quizScore: z.number().min(0).max(100),
});

export const reviewSchema = z.object({
  cardId: z.number().int(),
  remembered: z.boolean(),
});

export const interviewStartSchema = z.object({
  persona: z.enum(['techlead', 'gringo', 'senior', 'security', 'rh']),
  level: z.enum(['junior', 'pleno', 'senior']),
  topic: z.string().min(2).max(120),
});

export const interviewReplySchema = z.object({
  answer: z.string().min(1).max(6000),
});

export const explainSchema = z.object({
  project: z.enum(['financeflow', 'speak-ai', 'trading-bot', 'lifequest', 'devquest']),
  path: z.string().min(1).max(300),
  question: z.string().max(500).optional(),
});

export const labAttackSchema = z.object({
  input: z.record(z.string(), z.string().max(2000)),
});

export const labFixSchema = z.object({
  code: z.string().min(10).max(8000),
});

export const bugHuntCheckSchema = z.object({
  huntId: z.number().int(),
  answer: z.string().min(3).max(3000),
});

export const journalSchema = z.object({
  content: z.string().min(3).max(5000),
});

export const minutesSchema = z.object({
  minutes: z.number().int().min(1).max(180),
});

export const simuladoStartSchema = z.object({
  realmIds: z.array(z.string().max(40)).min(1).max(6),
  banca: z.enum(['cebraspe', 'fgv', 'fcc', 'cesgranrio', 'vunesp', 'mista']),
  count: z.number().int().min(5).max(20),
  difficulty: z.enum(['facil', 'media', 'dificil']),
});

export const simuladoSubmitSchema = z.object({
  answers: z.array(z.number().int().min(-1).max(5)).max(20),
});

export const planSchema = z.object({
  careerId: z.string().max(40).optional(),
  target: z.string().min(2).max(120),
  hoursPerDay: z.number().min(0.5).max(12),
  daysPerWeek: z.number().int().min(1).max(7),
  examDate: z.string().max(20).optional(),
  levels: z.record(z.string(), z.union([z.literal(1), z.literal(2), z.literal(3)])),
});

export const financePlanSchema = z.object({
  rendaMensal: z.number().min(0).max(10_000_000),
  gastosMensais: z.number().min(0).max(10_000_000),
  dividas: z.number().min(0).max(100_000_000),
  jurosDividaMes: z.number().min(0).max(30).optional(),
  reserva: z.number().min(0).max(100_000_000),
  investido: z.number().min(0).max(1_000_000_000),
  idade: z.number().int().min(14).max(100),
  objetivo: z.string().min(2).max(200),
  perfil: z.enum(['conservador', 'moderado', 'arrojado']),
  prazoAnos: z.number().int().min(1).max(60),
});

export const focoSessionSchema = z.object({
  subject: z.string().min(1).max(80),
  minutes: z.number().int().min(1).max(300),
  note: z.string().max(300).optional(),
});

export const focoGoalSchema = z.object({
  minutes: z.number().int().min(10).max(900),
});

const redacaoBanca = z.enum(['cebraspe', 'fgv', 'fcc', 'vunesp', 'cesgranrio', 'enem']);
const redacaoTipo = z.enum(['dissertativa', 'discursiva', 'estudo-caso']);

export const redacaoTemaSchema = z.object({
  banca: redacaoBanca,
  tipo: redacaoTipo,
  assunto: z.string().max(200).optional(),   // tema livre ou matéria (ex.: "segurança pública", "Direito Administrativo")
  careerId: z.string().max(40).optional(),
});

export const redacaoSubmitSchema = z.object({
  texto: z.string().min(200).max(12000),
});

export const capturaSchema = z.object({
  sourceType: z.enum(['url', 'youtube', 'pdf', 'texto']),
  source: z.string().min(3).max(60000),       // URL, texto colado ou nome do PDF
  pdfBase64: z.string().max(11_000_000).optional(),
  track: z.enum(['dev', 'concurso', 'financas', 'mente', 'social']),
  foco: z.string().max(200).optional(),        // o que priorizar
});

export const capturaQuizSchema = z.object({
  score: z.number().min(0).max(100),
});

export const menteProtocolSchema = z.object({
  meta: z.string().min(3).max(300),           // o que você não quer largar
  porque: z.string().min(3).max(1500),        // por que isso importa
  historico: z.string().max(1500).optional(), // por que desistiu antes
  obstaculos: z.string().max(1500).optional(),
  rotina: z.string().max(800).optional(),     // horários, trabalho, energia
});

export const menteCheckinSchema = z.object({
  kind: z.enum(['minimo', 'completo']),
});

export const conversaStartSchema = z.object({
  cenarioId: z.string().max(40).optional(),
  dificuldade: z.enum(['facil', 'realista', 'dificil']),
  // Cena livre: o aluno descreve a situação que quer treinar
  livre: z.object({
    situacao: z.string().min(5).max(800),
    pessoa: z.string().min(3).max(400),
    objetivo: z.string().min(3).max(400),
  }).optional(),
});

export const conversaReplySchema = z.object({
  text: z.string().min(1).max(2000),
});

export const reescreverSchema = z.object({
  texto: z.string().min(3).max(4000),
  contexto: z.string().max(600).optional(),  // para quem é e o que aconteceu
});

export type MenteProtocolInput = z.infer<typeof menteProtocolSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SetupInput = z.infer<typeof setupSchema>;
export type GradeInput = z.infer<typeof gradeSchema>;
export type InterviewStartInput = z.infer<typeof interviewStartSchema>;
