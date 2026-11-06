import type { Realm, Lesson } from '../types.js';
import { level } from '../levels.js';

// Trilha COMUNICAÇÃO & RELAÇÕES — separada das outras. Ids começam com "s-".
// Escutar, conversar, ser assertivo, resolver conflitos, falar em público e escrever, com base nos livros.

function realm(r: Omit<Realm, 'lessons' | 'track'>, lessons: Lesson[]): Realm {
  return { ...r, track: 'social', lessons };
}

export const socialRealms: Realm[] = [
  realm({ id: 's-ouvir', title: 'Escutar de verdade', emoji: '👂', color: 'sky', tagline: 'Comece aqui: quem escuta bem conversa bem', why: 'A maior parte dos problemas de comunicação não é falta de saber falar, é ouvir só para responder. Escutar muda todas as suas relações.' }, [
    ...level('s-ouvir', 's-ouv', 1, [
      ['Por que a gente se comunica mal', 'ouvir para responder; suposições; ilusão de transparência; o que você quis dizer x o que o outro entendeu'],
      ['Escuta ativa: ouvir para entender', 'parafrasear; não interromper; resumir o que ouviu; "procure primeiro compreender"', 'Os 7 Hábitos das Pessoas Altamente Eficazes — Stephen Covey | Você Não Está Escutando — Kate Murphy'],
      ['Perguntas que abrem conversas', 'perguntas abertas x fechadas; curiosidade genuína; aprofundar ("e como foi isso?")'],
      ['Corpo e tom de voz', 'contato visual; postura; tom; o mito do 7-38-55; coerência entre fala e corpo'],
      ['Empatia não é concordar', 'empatia cognitiva x emocional; validar o sentimento; não sair consertando logo'],
    ]),
    ...level('s-ouvir', 's-ouv', 2, [
      ['Inteligência emocional nas conversas', 'autoconsciência; autocontrole; sequestro emocional; ler a emoção do outro', 'Inteligência Emocional — Daniel Goleman'],
      ['Ouvir sem levar para o lado pessoal', 'separar o problema do outro do seu; não precisar agradar; críticas como informação', 'A Coragem de Não Agradar — Ichiro Kishimi e Fumitake Koga'],
      ['Presença: estar 100% na conversa', 'presença, poder e calor; celular longe; pausas e silêncio', 'O Mito do Carisma — Olivia Fox Cabane'],
    ]),
  ]),

  realm({ id: 's-conversa', title: 'Conversar com qualquer pessoa', emoji: '💬', color: 'emerald', tagline: 'Puxar assunto, manter o papo e criar conexão', why: 'Oportunidades, amizades e até aprovações em entrevista passam por conversas. Conversar bem é habilidade, não dom.' }, [
    ...level('s-conversa', 's-conv', 1, [
      ['Começar uma conversa sem travar', 'abridores simples; contexto em comum; FORD (família, ocupação, recreação, sonhos)', 'Como Conversar com Qualquer Pessoa — Leil Lowndes'],
      ['Manter a conversa fluindo', 'ganchos; perguntas de acompanhamento; contar e perguntar; não virar interrogatório'],
      ['Os princípios de Carnegie', 'interesse genuíno; lembrar nomes; falar do que interessa ao outro; não criticar; fazer o outro se sentir importante', 'Como Fazer Amigos e Influenciar Pessoas — Dale Carnegie'],
      ['Timidez e introversão: comunicar do seu jeito', 'introversão x timidez; preparar antes; conversas 1 a 1; recarregar a energia', 'O Poder dos Quietos — Susan Cain'],
      ['Encerrar bem e deixar a porta aberta', 'sair da conversa com educação; combinar o próximo contato; lembrar detalhes da pessoa'],
    ]),
    ...level('s-conversa', 's-conv', 2, [
      ['Carisma se aprende', 'presença; poder; calor; como pessoas carismáticas fazem o outro se sentir', 'O Mito do Carisma — Olivia Fox Cabane'],
      ['Fazer e manter amizades depois de adulto', 'proximidade e repetição; vulnerabilidade na medida; manter contato sem forçar'],
      ['Contar histórias que prendem', 'estrutura de uma boa história; detalhe concreto; emoção; chegar ao ponto', 'Ideias que Colam — Chip Heath e Dan Heath'],
      ['Humor e leveza sem forçar', 'humor observacional; rir de si mesmo; quando não fazer piada'],
    ]),
  ]),

  realm({ id: 's-assertivo', title: 'Assertividade e limites', emoji: '🗣️', color: 'violet', tagline: 'Dizer o que pensa sem agredir e sem se anular', why: 'Quem não sabe dizer não vive a agenda dos outros; quem fala atropelando perde as pessoas. Assertividade é o meio-termo que funciona.' }, [
    ...level('s-assertivo', 's-ass', 1, [
      ['Passivo, agressivo e assertivo', 'os três estilos; custos de cada um; frases assertivas na prática'],
      ['Comunicação Não-Violenta', 'observação sem julgamento; sentimento; necessidade; pedido claro', 'Comunicação Não-Violenta — Marshall Rosenberg'],
      ['Dizer não sem culpa', 'não gentil e firme; não precisa de justificativa longa; oferecer alternativa quando fizer sentido', 'A Coragem de Não Agradar — Ichiro Kishimi e Fumitake Koga'],
      ['Fazer pedidos claros', 'pedido x exigência; ser específico; combinar prazo; confirmar entendimento'],
      ['Dar e receber críticas', 'feedback situação-comportamento-impacto; criticar o comportamento e não a pessoa; receber sem se defender'],
    ]),
    ...level('s-assertivo', 's-ass', 2, [
      ['Limites com família e amigos', 'limites saudáveis; repetir com calma; lidar com a reação do outro'],
      ['Elogios que valem', 'elogio específico; reconhecer esforço; aceitar elogio sem diminuir'],
      ['Coragem de se mostrar', 'vulnerabilidade; vergonha; se posicionar mesmo com medo', 'A Coragem de Ser Imperfeito — Brené Brown'],
    ]),
  ]),

  realm({ id: 's-conflito', title: 'Conversas difíceis e conflitos', emoji: '⚡', color: 'orange', tagline: 'Quando o assunto é delicado ou o clima esquenta', why: 'As conversas que mais evitamos são as que mais mudam a vida. Dá para tê-las sem brigar e sem fugir.' }, [
    ...level('s-conflito', 's-conf', 1, [
      ['As 3 conversas dentro de toda conversa difícil', 'o que aconteceu; os sentimentos; a identidade de cada um; intenção x impacto', 'Conversas Difíceis — Douglas Stone, Bruce Patton e Sheila Heen'],
      ['Quando o clima esquenta', 'segurança na conversa; silêncio x violência; voltar ao objetivo em comum', 'Conversas Cruciais — Kerry Patterson e outros'],
      ['Pedir desculpas de verdade', 'reconhecer sem "mas"; assumir o impacto; reparar; mudar o comportamento'],
      ['Pessoas irritadas ou difíceis', 'baixar o tom; validar antes de explicar; não entrar na briga; limites claros'],
      ['Discordar sem brigar', 'separar ideia de pessoa; "e" no lugar de "mas"; buscar o ponto em comum'],
    ]),
    ...level('s-conflito', 's-conf', 2, [
      ['Negociar com empatia tática', 'espelhamento; rotular emoções; perguntas "como?"; chegar ao "é isso mesmo"', 'Negocie Como se Sua Vida Dependesse Disso — Chris Voss'],
      ['Mediar conflitos entre outras pessoas', 'ouvir os dois lados; interesses x posições; acordo possível'],
      ['Comunicação no atendimento ao público e na carreira policial', 'verbalização clara e respeitosa; comando verbal firme; desescalonamento; postura profissional sob pressão'],
    ]),
  ]),

  realm({ id: 's-falar', title: 'Falar em público e convencer', emoji: '🎤', color: 'rose', tagline: 'Apresentar, se apresentar e defender uma ideia', why: 'Entrevista, prova oral, reunião, apresentação: falar bem na frente dos outros abre portas que o currículo sozinho não abre.' }, [
    ...level('s-falar', 's-fal', 1, [
      ['Domando o medo de falar em público', 'de onde vem o medo; preparação; exposição gradual; respiração antes de falar'],
      ['Estruturar uma fala', 'abertura que prende; três pontos; fechamento com chamada para ação; pitch de 1 minuto'],
      ['Histórias que convencem', 'storytelling; emoção; novidade; memorável', 'TED: Falar, Convencer, Emocionar — Carmine Gallo'],
      ['Voz, ritmo e pausas', 'volume; velocidade; pausa estratégica; vícios de linguagem ("né", "tipo")'],
      ['Se apresentar em 1 minuto', 'quem eu sou, o que faço, para onde vou; adaptar ao público; treinar em voz alta'],
    ]),
    ...level('s-falar', 's-fal', 2, [
      ['Persuasão ética', 'reciprocidade; compromisso; prova social; autoridade; afeição; escassez; usar sem manipular', 'As Armas da Persuasão — Robert Cialdini'],
      ['Ideias que colam', 'simples; inesperada; concreta; crível; emocional; histórias', 'Ideias que Colam — Chip Heath e Dan Heath'],
      ['Perguntas difíceis e improviso', 'ganhar tempo com elegância; "não sei, mas…"; improviso com estrutura'],
      ['Prova oral, banca e entrevista de emprego', 'postura diante de banca; responder com estrutura; nervosismo sob controle'],
    ]),
  ]),

  realm({ id: 's-escrita', title: 'Escrever para ser entendido', emoji: '✍️', color: 'teal', tagline: 'WhatsApp, e-mail e mensagens sem mal-entendido', why: 'Hoje a maior parte das conversas é por escrito. Uma mensagem mal escrita cria briga ou é ignorada; uma bem escrita resolve.' }, [
    ...level('s-escrita', 's-esc', 1, [
      ['Mensagem clara: o principal primeiro', 'o mais importante na primeira linha; um assunto por mensagem; pedido explícito'],
      ['WhatsApp e tom: evitando mal-entendidos', 'tom em texto; emojis; áudio x texto; responder com calma'],
      ['E-mail profissional que é respondido', 'assunto claro; objetivo; próximos passos; cordialidade sem enrolação'],
      ['Escrever quando está com raiva', 'esperar antes de enviar; rascunho; reescrever com CNV', 'Comunicação Não-Violenta — Marshall Rosenberg'],
    ]),
    ...level('s-escrita', 's-esc', 2, [
      ['Pedir algo por escrito e conseguir', 'contexto curto; benefício para o outro; facilitar o sim; acompanhamento'],
      ['Comunicação no trabalho remoto', 'mensagens assíncronas; contexto completo; status claro; evitar ruído'],
    ]),
  ]),
];
