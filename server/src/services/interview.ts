// Modo Entrevista: um entrevistador de IA com personas e níveis. Mantém a conversa e dá nota ao final.
import type { InterviewPersona, InterviewLevel, ChatMessage, InterviewFeedback } from '@devquest/shared';
import { askJSON, ask } from './ai.js';

const PERSONAS: Record<InterviewPersona, string> = {
  techlead: 'Você é um tech lead brasileiro experiente, direto mas gentil. Entrevista em português.',
  gringo: 'You are a senior engineering manager from a US tech company. Conduct the ENTIRE interview in English, to help the candidate practice.',
  senior: 'Você é um engenheiro sênior exigente avaliando profundidade técnica. Entrevista em português, com perguntas de acompanhamento ("por quê?").',
  security: 'Você é um especialista em segurança (AppSec). Foca em ameaças, defesas e decisões seguras. Em português.',
  rh: 'Você é um recrutador de RH tech. Foca em perguntas comportamentais (método STAR) e fit. Em português.',
};

const LEVELS: Record<InterviewLevel, string> = {
  junior: 'Nível júnior: fundamentos, clareza e vontade de aprender.',
  pleno: 'Nível pleno: autonomia, boas decisões técnicas e trade-offs.',
  senior: 'Nível sênior: arquitetura, liderança técnica, profundidade e visão de sistema.',
};

function sys(persona: InterviewPersona, level: InterviewLevel, topic: string): string {
  return `${PERSONAS[persona]}
${LEVELS[level]}
Tema desta entrevista: ${topic}.
Regras: faça UMA pergunta por vez. Reaja brevemente à resposta anterior antes da próxima pergunta. Faça follow-ups quando a resposta for rasa. Seja realista como numa entrevista de verdade. Não dê a resposta nem a nota durante a conversa.`;
}

/** Primeira fala do entrevistador. */
export async function openingQuestion(persona: InterviewPersona, level: InterviewLevel, topic: string): Promise<string> {
  return ask(`Comece a entrevista com um cumprimento curto e a primeira pergunta sobre "${topic}".`, { system: sys(persona, level, topic), temperature: 0.8 });
}

/** Próxima fala do entrevistador, dada a conversa até aqui. */
export async function nextTurn(persona: InterviewPersona, level: InterviewLevel, topic: string, messages: ChatMessage[]): Promise<string> {
  const transcript = messages.map((m) => `${m.role === 'interviewer' ? 'Entrevistador' : 'Candidato'}: ${m.text}`).join('\n');
  const answered = messages.filter((m) => m.role === 'candidate').length;
  const closing = answered >= 5 ? '\nJá houve perguntas suficientes: faça a ÚLTIMA pergunta ou encerre agradecendo.' : '';
  return ask(`Conversa até agora:\n${transcript}\n\nReaja à última resposta e faça a próxima pergunta.${closing}`, { system: sys(persona, level, topic), temperature: 0.8 });
}

/** Avaliação final da entrevista. */
export async function evaluate(persona: InterviewPersona, level: InterviewLevel, topic: string, messages: ChatMessage[]): Promise<InterviewFeedback> {
  const transcript = messages.map((m) => `${m.role === 'interviewer' ? 'Entrevistador' : 'Candidato'}: ${m.text}`).join('\n');
  const prompt = `Avalie o desempenho do CANDIDATO nesta entrevista (${persona}, nível ${level}, tema ${topic}).
Transcrição:
${transcript}

Responda em JSON (em português, mesmo que a entrevista tenha sido em inglês):
{
 "score": <0-100>,
 "summary": "resumo honesto do desempenho",
 "strengths": [".."],
 "weaknesses": [".."],
 "perQuestion": [{"question":"a pergunta","score":<0-100>,"better":"como responder melhor"}],
 "studyNext": ["o que estudar para melhorar"]
}`;
  return askJSON<InterviewFeedback>(prompt, { temperature: 0.3 });
}
