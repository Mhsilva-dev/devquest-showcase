// Simulador de conversas: situações reais para treinar com a IA no papel da outra pessoa.

export interface Cenario {
  id: string;
  emoji: string;
  title: string;
  skill: string;        // habilidade treinada
  objetivo: string;     // o que o aluno precisa conseguir
  papel: string;        // quem a IA interpreta (e como ela é)
  abertura: string;     // contexto da cena mostrado ao aluno
  realmId: string;      // trilha para aprofundar
}

export const cenarios: Cenario[] = [
  { id: 'novo-amigo', emoji: '🤝', title: 'Puxar conversa com alguém novo', skill: 'Conversar com qualquer pessoa', realmId: 's-conversa',
    objetivo: 'Começar a conversa, achar um assunto em comum e terminar combinando algo (trocar contato, estudar junto…).',
    papel: 'Lucas, 27 anos, colega novo do cursinho. Simpático mas um pouco reservado: responde curto no começo e só se abre se a pessoa mostrar interesse genuíno.',
    abertura: 'Intervalo do cursinho preparatório. O Lucas está sozinho pegando um café, olhando o celular.' },
  { id: 'aumento', emoji: '💼', title: 'Pedir aumento ou promoção', skill: 'Assertividade e negociação', realmId: 's-conflito',
    objetivo: 'Apresentar o pedido com argumentos concretos, lidar com as objeções e sair com um próximo passo claro.',
    papel: 'Renata, gerente do setor. Justa, mas pressionada por orçamento: vai levantar objeções ("não é o momento", "o orçamento está apertado") e só cede diante de argumentos concretos.',
    abertura: 'Você marcou 15 minutos com a sua gestora, a Renata, numa sala de reunião.' },
  { id: 'discordar', emoji: '⚖️', title: 'Discordar de um colega sem brigar', skill: 'Discordar sem brigar', realmId: 's-conflito',
    objetivo: 'Expor sua discordância, ouvir o outro lado e chegar a um acordo ou próximo passo sem estragar a relação.',
    papel: 'Diego, colega de trabalho orgulhoso da própria ideia. Fica na defensiva se se sentir atacado, mas é razoável quando é ouvido.',
    abertura: 'Numa reunião, o Diego propôs um jeito de fazer o projeto que você acha que vai dar errado. Vocês ficaram a sós depois.' },
  { id: 'familia', emoji: '🏠', title: 'Conversa difícil em família', skill: 'Conversas difíceis', realmId: 's-conflito',
    objetivo: 'Falar de algo que te incomoda usando CNV (observação, sentimento, necessidade, pedido), sem acusar, e combinar uma mudança.',
    papel: 'Mãe ou pai (adapte ao que o aluno disser) que se sente criticado facilmente e responde com "eu só quero o seu bem". Amoroso, mas teimoso.',
    abertura: 'Sua família vive cobrando que você "largue esses estudos e arrume algo garantido". Você decidiu conversar com calma na cozinha.' },
  { id: 'dizer-nao', emoji: '🙅', title: 'Dizer não sem culpa', skill: 'Assertividade e limites', realmId: 's-assertivo',
    objetivo: 'Recusar o pedido de forma gentil e firme, sem inventar desculpas e sem ceder à insistência.',
    papel: 'Thiago, amigo antigo e insistente. Pede para você ajudar na mudança dele no sábado inteiro (seu dia de estudo). Usa culpa ("depois de tudo que eu fiz por você").',
    abertura: 'O Thiago te liga numa quinta à noite.' },
  { id: 'reclamar', emoji: '📞', title: 'Reclamar de um serviço com firmeza', skill: 'Assertividade', realmId: 's-assertivo',
    objetivo: 'Explicar o problema com clareza, manter a calma e conseguir uma solução concreta (estorno, prazo, protocolo).',
    papel: 'Atendente de operadora de internet treinada para enrolar: oferece soluções genéricas, pede para aguardar e só resolve se o cliente for claro, educado e insistente.',
    abertura: 'Sua internet caiu 4 vezes esta semana e cobraram um serviço que você não contratou. Você ligou para o atendimento.' },
  { id: 'desculpas', emoji: '🙏', title: 'Pedir desculpas de verdade', skill: 'Conversas difíceis', realmId: 's-conflito',
    objetivo: 'Reconhecer o erro sem "mas", mostrar que entendeu o impacto e propor como reparar.',
    papel: 'Ana, amiga próxima, magoada porque você esqueceu o aniversário dela e não apareceu no encontro combinado. Está fria no começo e testa se o pedido é sincero.',
    abertura: 'Você foi até a casa da Ana dois dias depois do aniversário dela.' },
  { id: 'apoiar', emoji: '🫂', title: 'Apoiar um amigo que está mal', skill: 'Escuta ativa e empatia', realmId: 's-ouvir',
    objetivo: 'Escutar sem julgar, validar o sentimento e não sair dando conselho logo de cara; descobrir do que ele precisa.',
    papel: 'Bruno, amigo que acabou de ser reprovado no concurso que estudou por 2 anos. Desanimado, fala pouco, e se fecha se receber conselho pronto ou "vai dar certo" vazio.',
    abertura: 'O Bruno te mandou mensagem: "passou o resultado… não passei". Vocês se encontram numa praça.' },
  { id: 'apresentar', emoji: '🎤', title: 'Se apresentar numa entrevista', skill: 'Falar em público', realmId: 's-falar',
    objetivo: 'Responder "fale um pouco sobre você" em até 1-2 minutos com começo, meio e fim, e responder bem às perguntas de acompanhamento.',
    papel: 'Recrutadora de uma empresa de tecnologia, objetiva e atenta a respostas longas ou sem foco. Faz 2-3 perguntas de acompanhamento.',
    abertura: 'Entrevista por vídeo para uma vaga de desenvolvedor júnior. A recrutadora abre a conversa.' },
  { id: 'abordagem', emoji: '🚓', title: 'Atender um cidadão irritado (treino policial)', skill: 'Desescalonamento', realmId: 's-conflito',
    objetivo: 'Manter a calma e o respeito, verbalizar com clareza e firmeza, baixar a tensão e conduzir a situação.',
    papel: 'Motorista irritado e apressado, parado numa fiscalização de rotina. Reclama, eleva a voz e diz que está sendo perseguido, mas não é violento. Acalma se for tratado com respeito e firmeza.',
    abertura: 'Treino de comunicação: você é o agente numa fiscalização de rotina e o motorista já chega reclamando.' },
  { id: 'negociar', emoji: '💰', title: 'Negociar o preço de um freela', skill: 'Negociação', realmId: 's-conflito',
    objetivo: 'Defender o seu preço com valor, usar perguntas abertas e fechar um acordo bom para os dois sem baixar demais.',
    papel: 'Dono de uma pequena loja que quer um site. Gosta do seu trabalho mas acha caro e diz que "o sobrinho faz por metade".',
    abertura: 'Você mandou o orçamento de um site e o cliente pediu uma ligação.' },
];

export const findCenario = (id: string) => cenarios.find((c) => c.id === id);
