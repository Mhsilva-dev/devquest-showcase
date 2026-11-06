// Biblioteca da trilha Disciplina & Mente. Ids com prefixo "m-" (o cache de resumos é compartilhado com Finanças).

export interface MenteBook {
  id: string;
  title: string;
  author: string;
  level: 1 | 2 | 3;
  why: string;
  realmIds: string[];
}

export const menteBooks: MenteBook[] = [
  { id: 'm-habitos-atomicos', title: 'Hábitos Atômicos', author: 'James Clear', level: 1, why: 'O manual mais prático para criar hábitos que duram e nunca falhar duas vezes.', realmIds: ['m-habitos', 'm-base'] },
  { id: 'm-mindset', title: 'Mindset', author: 'Carol S. Dweck', level: 1, why: 'Por que acreditar que dá para evoluir muda tudo o que você faz.', realmIds: ['m-garra'] },
  { id: 'm-garra', title: 'Garra', author: 'Angela Duckworth', level: 1, why: 'Paixão + perseverança vencem talento no longo prazo.', realmIds: ['m-garra'] },
  { id: 'm-obstaculo', title: 'O Obstáculo é o Caminho', author: 'Ryan Holiday', level: 1, why: 'Estoicismo aplicado: transformar problema em combustível.', realmIds: ['m-estoico'] },
  { id: 'm-poder-habito', title: 'O Poder do Hábito', author: 'Charles Duhigg', level: 1, why: 'O loop do hábito e como trocar rotinas ruins.', realmIds: ['m-habitos'] },
  { id: 'm-mini-habitos', title: 'Mini Hábitos', author: 'Stephen Guise', level: 1, why: 'Metas tão pequenas que é impossível falhar.', realmIds: ['m-habitos', 'm-recaida'] },
  { id: 'm-disciplina-liberdade', title: 'Disciplina é Liberdade', author: 'Jocko Willink', level: 1, why: 'Manual direto, de ex-SEAL, sobre disciplina sem desculpas.', realmIds: ['m-garra'] },
  { id: 'm-trabalho-focado', title: 'Trabalho Focado', author: 'Cal Newport', level: 1, why: 'Como produzir em profundidade num mundo de distrações.', realmIds: ['m-foco'] },
  { id: 'm-essencialismo', title: 'Essencialismo', author: 'Greg McKeown', level: 1, why: 'Fazer menos, porém melhor; aprender a dizer não.', realmIds: ['m-foco'] },
  { id: 'm-guerra-arte', title: 'A Guerra da Arte', author: 'Steven Pressfield', level: 1, why: 'Dá nome à força que te faz procrastinar: a Resistência.', realmIds: ['m-base'] },
  { id: 'm-em-busca-sentido', title: 'Em Busca de Sentido', author: 'Viktor Frankl', level: 2, why: 'Sobreviver ao pior com um porquê. Talvez o livro mais forte da lista.', realmIds: ['m-garra', 'm-recaida'] },
  { id: 'm-goggins', title: 'Nada Pode Me Ferir', author: 'David Goggins', level: 2, why: 'Resiliência extrema e mente calejada (leia com senso crítico).', realmIds: ['m-garra'] },
  { id: 'm-indistraivel', title: 'Indistraível', author: 'Nir Eyal', level: 2, why: 'Distração começa por dentro: como lidar com os gatilhos internos.', realmIds: ['m-foco'] },
  { id: 'm-unica-coisa', title: 'A Única Coisa', author: 'Gary Keller e Jay Papasan', level: 2, why: 'A pergunta foco: o que, se eu fizer, torna o resto mais fácil?', realmIds: ['m-foco'] },
  { id: 'm-nacao-dopamina', title: 'Nação Dopamina', author: 'Anna Lembke', level: 2, why: 'Por que o prazer fácil sabota o esforço, segundo uma psiquiatra.', realmIds: ['m-base'] },
  { id: 'm-ego', title: 'O Ego é Seu Inimigo', author: 'Ryan Holiday', level: 2, why: 'O ego atrapalha no começo, no sucesso e no fracasso.', realmIds: ['m-estoico'] },
  { id: 'm-autocompaixao', title: 'Autocompaixão', author: 'Kristin Neff', level: 2, why: 'Ser duro consigo mesmo faz desistir mais. A ciência explica.', realmIds: ['m-recaida'] },
  { id: 'm-otimista', title: 'Aprenda a Ser Otimista', author: 'Martin Seligman', level: 2, why: 'Como o jeito de explicar os fracassos decide se você continua.', realmIds: ['m-garra'] },
  { id: 'm-foco-roubado', title: 'Foco Roubado', author: 'Johann Hari', level: 2, why: 'Por que todo mundo perdeu a atenção e como recuperá-la.', realmIds: ['m-foco'] },
  { id: 'm-meditacoes', title: 'Meditações', author: 'Marco Aurélio', level: 3, why: 'O diário íntimo de um imperador tentando ser melhor todo dia.', realmIds: ['m-estoico'] },
  { id: 'm-cartas-lucilio', title: 'Cartas a Lucílio', author: 'Sêneca', level: 3, why: 'Conselhos práticos sobre tempo, medo, adversidade e caráter.', realmIds: ['m-estoico'] },
  { id: 'm-brevidade', title: 'Sobre a Brevidade da Vida', author: 'Sêneca', level: 3, why: 'A vida não é curta, nós é que a desperdiçamos.', realmIds: ['m-estoico'] },
  { id: 'm-epicteto', title: 'Manual (Enchiridion)', author: 'Epicteto', level: 3, why: 'O essencial do estoicismo em poucas páginas: o que depende de você.', realmIds: ['m-estoico'] },
  { id: 'm-rapido-devagar', title: 'Rápido e Devagar', author: 'Daniel Kahneman', level: 3, why: 'Os dois sistemas da mente e os vieses que sabotam decisões.', realmIds: ['m-base'] },
  { id: 'm-flow', title: 'Flow', author: 'Mihaly Csikszentmihalyi', level: 3, why: 'A psicologia do estado em que o esforço vira prazer.', realmIds: ['m-foco'] },
];

export const findMenteBook = (id: string) => menteBooks.find((b) => b.id === id);
