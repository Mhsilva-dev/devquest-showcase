// Biblioteca da trilha Comunicação & Relações. Ids com prefixo "s-" (cache de resumos compartilhado).
import type { MenteBook } from '../mente/livros.js';

export const socialBooks: MenteBook[] = [
  { id: 's-carnegie', title: 'Como Fazer Amigos e Influenciar Pessoas', author: 'Dale Carnegie', level: 1, why: 'O clássico: princípios simples que fazem as pessoas gostarem de conversar com você.', realmIds: ['s-conversa'] },
  { id: 's-cnv', title: 'Comunicação Não-Violenta', author: 'Marshall Rosenberg', level: 1, why: 'Como falar de sentimentos e pedidos sem atacar nem se anular.', realmIds: ['s-assertivo', 's-escrita'] },
  { id: 's-qualquer-pessoa', title: 'Como Conversar com Qualquer Pessoa', author: 'Leil Lowndes', level: 1, why: 'Técnicas práticas para puxar e manter conversa.', realmIds: ['s-conversa'] },
  { id: 's-escutando', title: 'Você Não Está Escutando', author: 'Kate Murphy', level: 1, why: 'Por que quase ninguém escuta de verdade e como mudar isso.', realmIds: ['s-ouvir'] },
  { id: 's-covey', title: 'Os 7 Hábitos das Pessoas Altamente Eficazes', author: 'Stephen Covey', level: 1, why: 'O hábito 5 (procure primeiro compreender) muda qualquer relação.', realmIds: ['s-ouvir'] },
  { id: 's-quietos', title: 'O Poder dos Quietos', author: 'Susan Cain', level: 1, why: 'Para quem é mais reservado: comunicar bem sem virar outra pessoa.', realmIds: ['s-conversa'] },
  { id: 's-goleman', title: 'Inteligência Emocional', author: 'Daniel Goleman', level: 1, why: 'Entender e controlar emoções, as suas e as dos outros.', realmIds: ['s-ouvir'] },
  { id: 's-dificeis', title: 'Conversas Difíceis', author: 'Douglas Stone, Bruce Patton e Sheila Heen', level: 2, why: 'O mapa de toda conversa delicada, de Harvard.', realmIds: ['s-conflito'] },
  { id: 's-cruciais', title: 'Conversas Cruciais', author: 'Kerry Patterson e outros', level: 2, why: 'Como manter o diálogo quando há muita coisa em jogo e o clima esquenta.', realmIds: ['s-conflito'] },
  { id: 's-voss', title: 'Negocie Como se Sua Vida Dependesse Disso', author: 'Chris Voss', level: 2, why: 'Empatia tática de um ex-negociador de reféns do FBI.', realmIds: ['s-conflito'] },
  { id: 's-cialdini', title: 'As Armas da Persuasão', author: 'Robert Cialdini', level: 2, why: 'Os princípios da influência (para usar com ética e se defender).', realmIds: ['s-falar'] },
  { id: 's-ted', title: 'TED: Falar, Convencer, Emocionar', author: 'Carmine Gallo', level: 2, why: 'O que as melhores palestras do mundo têm em comum.', realmIds: ['s-falar'] },
  { id: 's-colam', title: 'Ideias que Colam', author: 'Chip Heath e Dan Heath', level: 2, why: 'Por que algumas ideias são lembradas e outras esquecidas.', realmIds: ['s-falar', 's-conversa'] },
  { id: 's-carisma', title: 'O Mito do Carisma', author: 'Olivia Fox Cabane', level: 2, why: 'Carisma é comportamento treinável: presença, poder e calor.', realmIds: ['s-conversa', 's-ouvir'] },
  { id: 's-nao-agradar', title: 'A Coragem de Não Agradar', author: 'Ichiro Kishimi e Fumitake Koga', level: 2, why: 'Parar de viver pela aprovação dos outros e colocar limites.', realmIds: ['s-assertivo', 's-ouvir'] },
  { id: 's-imperfeito', title: 'A Coragem de Ser Imperfeito', author: 'Brené Brown', level: 2, why: 'Vulnerabilidade como base de conexão e coragem.', realmIds: ['s-assertivo'] },
];

export const findSocialBook = (id: string) => socialBooks.find((b) => b.id === id);
