// Biblioteca de finanças: livros clássicos que embasam a trilha.
// A IA gera, sob demanda, um resumo com as ideias principais e um plano de ação (cacheado).

export interface Book {
  id: string;
  title: string;
  author: string;
  theme: 'mentalidade' | 'orcamento' | 'acoes' | 'passivo' | 'macro' | 'comportamento' | 'trading' | 'negocios';
  level: 1 | 2 | 3; // 1 iniciante, 2 intermediário, 3 avançado
  why: string;
  realmIds: string[];
}

export const books: Book[] = [
  { id: 'psicologia-financeira', title: 'A Psicologia Financeira', author: 'Morgan Housel', theme: 'mentalidade', level: 1, why: 'O melhor ponto de partida: comportamento importa mais que conhecimento.', realmIds: ['f-mente', 'f-comport'] },
  { id: 'pai-rico', title: 'Pai Rico, Pai Pobre', author: 'Robert Kiyosaki', theme: 'mentalidade', level: 1, why: 'Ativos x passivos e a mentalidade de construir renda.', realmIds: ['f-mente'] },
  { id: 'babilonia', title: 'O Homem Mais Rico da Babilônia', author: 'George S. Clason', theme: 'mentalidade', level: 1, why: 'Regras simples e atemporais: pague-se primeiro.', realmIds: ['f-mente', 'f-orcamento'] },
  { id: 'ramsey', title: 'A Transformação Total do Seu Dinheiro', author: 'Dave Ramsey', theme: 'orcamento', level: 1, why: 'Plano passo a passo para sair das dívidas.', realmIds: ['f-orcamento'] },
  { id: 'ramit', title: 'Eu Te Ensino a Ficar Rico', author: 'Ramit Sethi', theme: 'orcamento', level: 1, why: 'Automatizar as finanças e gastar sem culpa no que importa.', realmIds: ['f-orcamento'] },
  { id: 'milionario-ao-lado', title: 'O Milionário Mora ao Lado', author: 'Thomas Stanley e William Danko', theme: 'mentalidade', level: 1, why: 'Como pessoas comuns realmente ficam ricas.', realmIds: ['f-mente'] },
  { id: 'investidor-inteligente', title: 'O Investidor Inteligente', author: 'Benjamin Graham', theme: 'acoes', level: 2, why: 'A bíblia do investimento em valor: Sr. Mercado e margem de segurança.', realmIds: ['f-acoes'] },
  { id: 'fisher', title: 'Ações Comuns, Lucros Extraordinários', author: 'Philip Fisher', theme: 'acoes', level: 2, why: 'Como identificar empresas de crescimento excepcionais.', realmIds: ['f-acoes'] },
  { id: 'lynch', title: 'O Jeito Peter Lynch de Investir', author: 'Peter Lynch', theme: 'acoes', level: 1, why: 'Investir no que você conhece, de forma prática.', realmIds: ['f-acoes'] },
  { id: 'buffett', title: 'Os Ensaios de Warren Buffett', author: 'Lawrence Cunningham (org.)', theme: 'acoes', level: 2, why: 'As ideias de Buffett organizadas por tema.', realmIds: ['f-acoes'] },
  { id: 'dorsey', title: 'O Pequeno Livro que Constrói Fortunas', author: 'Pat Dorsey', theme: 'acoes', level: 2, why: 'Vantagens competitivas duradouras (moats).', realmIds: ['f-acoes', 'f-valuation'] },
  { id: 'greenblatt', title: 'O Mais Simples Livro sobre Investimentos', author: 'Joel Greenblatt', theme: 'acoes', level: 2, why: 'A fórmula mágica: empresas boas a preços baixos.', realmIds: ['f-valuation'] },
  { id: 'damodaran', title: 'Valuation', author: 'Aswath Damodaran', theme: 'acoes', level: 3, why: 'O padrão de referência para avaliar empresas.', realmIds: ['f-valuation'] },
  { id: 'bogle', title: 'O Pequeno Livro do Investimento de Bom Senso', author: 'John C. Bogle', theme: 'passivo', level: 1, why: 'Por que fundos de índice de baixo custo vencem no longo prazo.', realmIds: ['f-passivo'] },
  { id: 'malkiel', title: 'Um Passeio Aleatório por Wall Street', author: 'Burton Malkiel', theme: 'passivo', level: 2, why: 'Mercados eficientes e a dificuldade de vencer o índice.', realmIds: ['f-passivo'] },
  { id: 'marks', title: 'O Mais Importante para o Investidor', author: 'Howard Marks', theme: 'macro', level: 2, why: 'Risco, ciclos e pensamento de segundo nível.', realmIds: ['f-macro', 'f-carteira'] },
  { id: 'dalio', title: 'Princípios para Navegar Grandes Crises de Dívida', author: 'Ray Dalio', theme: 'macro', level: 3, why: 'Como funcionam os ciclos de dívida e as crises.', realmIds: ['f-macro'] },
  { id: 'taleb', title: 'A Lógica do Cisne Negro', author: 'Nassim Nicholas Taleb', theme: 'comportamento', level: 3, why: 'Eventos raros e de alto impacto, e como se proteger.', realmIds: ['f-carteira'] },
  { id: 'kahneman', title: 'Rápido e Devagar', author: 'Daniel Kahneman', theme: 'comportamento', level: 2, why: 'Os vieses que nos fazem errar decisões.', realmIds: ['f-comport'] },
  { id: 'thaler', title: 'Misbehaving', author: 'Richard Thaler', theme: 'comportamento', level: 2, why: 'A origem das finanças comportamentais.', realmIds: ['f-comport'] },
  { id: 'douglas', title: 'Trading in the Zone', author: 'Mark Douglas', theme: 'trading', level: 2, why: 'A psicologia de operar com disciplina e probabilidades.', realmIds: ['f-trading', 'f-comport'] },
  { id: 'tharp', title: 'Trade Your Way to Financial Freedom', author: 'Van K. Tharp', theme: 'trading', level: 3, why: 'Expectativa matemática e tamanho de posição.', realmIds: ['f-trading'] },
  { id: 'die-with-zero', title: 'Die With Zero', author: 'Bill Perkins', theme: 'mentalidade', level: 2, why: 'Usar o dinheiro para viver bem, não só acumular.', realmIds: ['f-mente', 'f-aposentar'] },
  { id: 'your-money-your-life', title: 'Your Money or Your Life', author: 'Vicki Robin e Joe Dominguez', theme: 'mentalidade', level: 1, why: 'A origem do movimento de independência financeira.', realmIds: ['f-aposentar', 'f-mente'] },
  { id: 'startup-100', title: 'A Startup de $100', author: 'Chris Guillebeau', theme: 'negocios', level: 1, why: 'Criar um negócio lucrativo com pouco dinheiro.', realmIds: ['f-renda'] },
  { id: 'naval', title: 'O Almanaque de Naval Ravikant', author: 'Eric Jorgenson', theme: 'negocios', level: 2, why: 'Riqueza, alavancagem e conhecimento específico.', realmIds: ['f-renda', 'f-mente'] },
];

export function findBook(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}
