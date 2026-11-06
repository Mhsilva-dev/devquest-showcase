// Simulador de conversas: a IA interpreta a outra pessoa da cena e, no final, avalia a comunicação do aluno.
import type { ConversaCena, ConversaFeedback, ConversaMsg, Reescrita } from '@devquest/shared';
import { ask, askJSON } from './ai.js';

const DIFICULDADE: Record<string, string> = {
  facil: 'Seja receptivo: facilite um pouco a conversa, mas continue sendo um personagem real.',
  realista: 'Reaja como uma pessoa real reagiria: nem fácil nem impossível.',
  dificil: 'Seja um personagem difícil: mais resistente, mais emotivo, interrompa às vezes. Só ceda diante de comunicação realmente boa.',
};

function system(cena: ConversaCena, dificuldade: string) {
  return `Você está num TREINO DE COMUNICAÇÃO, interpretando um personagem numa cena. Fique SEMPRE no papel.
Personagem: ${cena.papel}
Cena: ${cena.abertura}
${DIFICULDADE[dificuldade] ?? DIFICULDADE.realista}
Regras: fale como um brasileiro de verdade fala (natural, informal quando couber), em 1 a 3 frases por fala. Reaja ao TOM e às palavras do aluno:
se ele for agressivo, você se fecha ou revida; se ele escutar e validar, você se abre. Não dê dicas, não avalie e não saia do personagem.
Se o objetivo do aluno tiver sido claramente alcançado ou a conversa terminar de forma natural, encerre a cena com uma fala de despedida.`;
}

const transcript = (cena: ConversaCena, msgs: ConversaMsg[]) =>
  msgs.map((m) => `${m.role === 'eu' ? 'Aluno' : 'Personagem'}: ${m.text}`).join('\n');

export async function opening(cena: ConversaCena, dificuldade: string): Promise<string> {
  return ask('Comece a cena com a primeira fala do seu personagem (ou uma reação curta à presença do aluno). Só a fala, sem narração.', { system: system(cena, dificuldade), temperature: 0.9 });
}

export async function reply(cena: ConversaCena, dificuldade: string, msgs: ConversaMsg[]): Promise<string> {
  return ask(`Conversa até agora:\n${transcript(cena, msgs)}\n\nResponda à última fala do aluno, no papel. Só a fala, sem narração nem aspas.`, { system: system(cena, dificuldade), temperature: 0.9 });
}

export async function avaliar(cena: ConversaCena, dificuldade: string, msgs: ConversaMsg[]): Promise<ConversaFeedback> {
  const prompt = `Avalie a comunicação do ALUNO neste treino.
Cena: ${cena.titulo} — ${cena.abertura}
Personagem: ${cena.papel}
Objetivo do aluno: ${cena.objetivo}
Habilidade treinada: ${cena.skill}
Dificuldade: ${dificuldade}

Transcrição:
${transcript(cena, msgs)}

Responda em JSON (português do Brasil):
{
 "score": <0-100>,
 "resumo": "2-3 frases honestas sobre como foi",
 "objetivo": {"alcancado": true|false, "comentario": "..."},
 "criterios": [
   {"nome":"Escuta e empatia","nota":<0-10>,"comentario":"..."},
   {"nome":"Clareza","nota":<0-10>,"comentario":"..."},
   {"nome":"Assertividade","nota":<0-10>,"comentario":"..."},
   {"nome":"Controle emocional","nota":<0-10>,"comentario":"..."},
   {"nome":"Condução da conversa","nota":<0-10>,"comentario":"..."}
 ],
 "melhorMomento": "a melhor fala do aluno e por que funcionou",
 "reescritas": [{"original":"fala EXATA do aluno que poderia ser melhor","melhor":"como dizer melhor, do jeito que um brasileiro falaria","porque":"técnica usada (ex.: CNV, rotular emoção, pergunta aberta)"}],
 "dicas": ["dicas práticas para a próxima conversa real"]
}
Faça de 2 a 4 reescritas e 3 dicas.`;
  return askJSON<ConversaFeedback>(prompt, { temperature: 0.3, timeoutMs: 90000 });
}

export async function reescrever(texto: string, contexto?: string): Promise<Reescrita> {
  const prompt = `Um aluno quer mandar esta mensagem e quer que ela seja bem recebida.
${contexto ? `Contexto (para quem é e o que aconteceu): ${contexto}` : ''}
Mensagem original:
"""
${texto}
"""

Responda em JSON (português do Brasil):
{
 "analise": "como a outra pessoa provavelmente vai receber a mensagem original e por quê (2-4 frases, honesto)",
 "versoes": [
   {"tom":"Gentil e acolhedor","texto":"..."},
   {"tom":"Assertivo e direto","texto":"..."},
   {"tom":"Profissional","texto":"..."}
 ],
 "dicas": ["2-3 dicas sobre o que mudou e por quê (CNV, clareza, pedido explícito…)"]
}
Mantenha o objetivo e o conteúdo do aluno; só mude a forma. As versões devem soar naturais, como um brasileiro escreveria no WhatsApp ou e-mail.`;
  return askJSON<Reescrita>(prompt, {
    system: 'Você é especialista em comunicação escrita e Comunicação Não-Violenta. Responde em JSON.',
    temperature: 0.6, timeoutMs: 60000,
  });
}
