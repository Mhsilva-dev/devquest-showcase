import type { Realm, Lesson } from '../types.js';
import { level } from '../levels.js';

// Trilha DISCIPLINA & MENTE — separada das outras. Ids começam com "m-".
// Cada aula se apoia em livros (campo books) e na ciência do comportamento, sempre com exercício prático.

function realm(r: Omit<Realm, 'lessons' | 'track'>, lessons: Lesson[]): Realm {
  return { ...r, track: 'mente', lessons };
}

export const menteRealms: Realm[] = [
  realm({ id: 'm-base', title: 'Por que a gente desiste', emoji: '🧠', color: 'violet', tagline: 'Comece aqui: entender o inimigo antes de lutar', why: 'Quem entende por que desiste para de se culpar e passa a corrigir o sistema. É a base de toda disciplina que dura.' }, [
    ...level('m-base', 'm-base', 1, [
      ['Motivação não é o combustível: sistemas são', 'motivação vem e vai; disciplina como sistema; metas x sistemas; o mito de "estar a fim"', 'Hábitos Atômicos — James Clear'],
      ['Dopamina: por que o fácil vence o importante', 'dopamina e antecipação; recompensas rápidas; equilíbrio prazer-dor; detox de dopamina sem misticismo', 'Nação Dopamina — Anna Lembke'],
      ['A Resistência: o inimigo que aparece quando algo importa', 'a Resistência; profissional x amador; aparecer todo dia mesmo sem vontade', 'A Guerra da Arte — Steven Pressfield'],
      ['O vale da decepção: por que desistimos no meio', 'platô do potencial latente; resultados atrasados; curva real do progresso; expectativa x realidade', 'Hábitos Atômicos — James Clear'],
      ['Os 5 motivos mais comuns de desistência', 'meta grande demais; tudo ou nada; depender de motivação; falta de porquê; comparação com os outros'],
    ]),
    ...level('m-base', 'm-base', 2, [
      ['Força de vontade: o que a ciência diz hoje', 'esgotamento do ego e a crise de replicação; crenças sobre força de vontade; quem tem autocontrole evita a tentação'],
      ['Sistema 1 x Sistema 2: decidir com a cabeça fria', 'pensamento rápido e lento; viés do presente; decidir antes, na hora só executar', 'Rápido e Devagar — Daniel Kahneman'],
      ['Procrastinação, ansiedade e perfeccionismo', 'procrastinação como fuga de emoção ruim; perfeccionismo; começar imperfeito; ação gera motivação'],
      ['Corpo primeiro: sono, exercício e energia', 'sono e autocontrole; exercício e humor; alimentação; gerenciar energia e não só tempo', 'Por que Nós Dormimos — Matthew Walker'],
    ]),
  ]),

  realm({ id: 'm-habitos', title: 'Hábitos que se mantêm sozinhos', emoji: '🔁', color: 'emerald', tagline: 'Disciplina que não depende de força de vontade', why: 'Os disciplinados não lutam contra si mesmos todo dia: eles montam hábitos e ambientes que decidem por eles.' }, [
    ...level('m-habitos', 'm-hab', 1, [
      ['O loop do hábito: deixa, rotina e recompensa', 'deixa; desejo; resposta; recompensa; mapear os seus loops', 'O Poder do Hábito — Charles Duhigg'],
      ['As 4 leis: óbvio, atraente, fácil e satisfatório', 'as 4 leis da mudança de comportamento; inverter as leis para cortar hábitos ruins', 'Hábitos Atômicos — James Clear'],
      ['Comece ridiculamente pequeno', 'regra dos 2 minutos; mini hábitos; micro-hábitos; celebrar a vitória pequena', 'Mini Hábitos — Stephen Guise | Micro-hábitos — BJ Fogg'],
      ['Empilhamento de hábitos e intenção de implementação', '"depois de X, eu faço Y"; quando, onde e como; âncoras do seu dia'],
      ['Ambiente: disciplina sem força de vontade', 'tirar atrito do que é bom; pôr atrito no que é ruim; celular longe; ambiente que decide por você', 'Hábitos Atômicos — James Clear'],
      ['Nunca falhe duas vezes', 'tudo ou nada; versão mínima do hábito; voltar rápido; registro visual da sequência', 'Hábitos Atômicos — James Clear'],
    ]),
    ...level('m-habitos', 'm-hab', 2, [
      ['Identidade: de "eu quero" para "eu sou"', 'hábitos baseados em identidade; cada ação é um voto; a história que você conta sobre você', 'Hábitos Atômicos — James Clear'],
      ['Quebrando hábitos ruins de vez', 'trocar a rotina e manter a deixa; mapear gatilhos; recaída como dado e não como sentença', 'O Poder do Hábito — Charles Duhigg'],
      ['Rastrear sem virar obsessão', 'tracker de hábitos; medir o que importa; lei de Goodhart; revisão semanal'],
      ['Agrupar tentações e criar recompensas', 'temptation bundling; recompensa imediata para ganho de longo prazo; recompensas que não sabotam a meta'],
    ]),
    ...level('m-habitos', 'm-hab', 3, [
      ['Pré-compromisso: amarre-se ao mastro', 'Ulisses e as sereias; contratos de compromisso; apostas com você mesmo; parceiro de responsabilidade'],
      ['Rotinas de vida: manhã, noite e semana', 'rotina matinal sem misticismo; desligar à noite; planejamento semanal; dias de folga planejados'],
      ['Quando o hábito vira estilo de vida', 'automaticidade (66 dias em média); o tédio dos hábitos; evoluir o hábito sem quebrar a sequência'],
    ]),
  ]),

  realm({ id: 'm-garra', title: 'Garra e resiliência', emoji: '🔥', color: 'orange', tagline: 'Continuar quando dá vontade de largar', why: 'Talento conta, mas quem chega é quem continua. Garra e resiliência se treinam, como músculo.' }, [
    ...level('m-garra', 'm-garra', 1, [
      ['Garra: paixão e perseverança', 'talento x esforço; esforço conta duas vezes; escala de garra; interesse, prática, propósito e esperança', 'Garra — Angela Duckworth'],
      ['Mentalidade de crescimento', 'mentalidade fixa x de crescimento; o poder do "ainda"; elogiar o processo e não o talento', 'Mindset — Carol Dweck'],
      ['Desconforto como treino', 'zona de conforto; desconforto voluntário; a regra dos 40%; calejar a mente', 'Nada Pode Me Ferir — David Goggins'],
      ['Disciplina é liberdade', 'responsabilidade total; acordar cedo sem drama; sem desculpas; disciplina como caminho para a liberdade', 'Disciplina é Liberdade — Jocko Willink'],
      ['Fracasso como informação', 'errar rápido; analisar sem culpa; separar o erro da sua identidade'],
    ]),
    ...level('m-garra', 'm-garra', 2, [
      ['Sentido no sofrimento', 'logoterapia; a última liberdade: escolher a atitude; quem tem um porquê suporta quase qualquer como', 'Em Busca de Sentido — Viktor Frankl'],
      ['Como pensam os que não quebram', 'otimismo aprendido; estilo explicativo; os 3 Ps: pessoal, permanente e generalizado', 'Aprenda a Ser Otimista — Martin Seligman'],
      ['Prática deliberada: evoluir de verdade', 'prática deliberada x repetição; as "10 mil horas" e o que isso realmente significa; feedback', 'Peak: Segredos da Nova Ciência da Expertise — Anders Ericsson'],
      ['O jogo de longo prazo', 'jogo finito x infinito; consistência por anos; juros compostos do esforço'],
    ]),
    ...level('m-garra', 'm-garra', 3, [
      ['Desafios voluntários com prudência', 'desafios de 30 dias; testar limites sem se machucar; acumular provas de que você consegue'],
      ['Rejeição, crítica e reprovação', 'reprovar em concurso ou entrevista; receber crítica; rejeição não define quem você é'],
      ['Visão de vida e valores inegociáveis', 'visão de 10 anos; carta para o seu eu do futuro; valores inegociáveis; legado'],
    ]),
  ]),

  realm({ id: 'm-estoico', title: 'Estoicismo: firme no que acontecer', emoji: '🏛️', color: 'sky', tagline: 'A filosofia de quem não se abala', why: 'Imperadores, escravos e soldados usaram o estoicismo para manter o rumo em meio ao caos. É o treino mental para "não importa o que aconteça".' }, [
    ...level('m-estoico', 'm-est', 1, [
      ['Dicotomia do controle', 'o que depende de mim; o que não depende; foco no esforço e não no resultado', 'Manual (Enchiridion) — Epicteto'],
      ['O obstáculo é o caminho', 'percepção, ação e vontade; transformar o obstáculo em matéria-prima', 'O Obstáculo é o Caminho — Ryan Holiday'],
      ['Meditações: o diário de um imperador', 'exame da manhã; impermanência; fazer o seu dever mesmo cansado', 'Meditações — Marco Aurélio'],
      ['Sobre a brevidade da vida', 'tempo como o recurso mais caro; ocupado x vivo; memento mori', 'Sobre a Brevidade da Vida — Sêneca'],
      ['Premeditação dos males', 'premeditatio malorum; visualização negativa; estar pronto para o pior', 'Cartas a Lucílio — Sêneca'],
    ]),
    ...level('m-estoico', 'm-est', 2, [
      ['O ego é seu inimigo', 'ego na ambição, no sucesso e no fracasso; ser eterno estudante', 'O Ego é Seu Inimigo — Ryan Holiday'],
      ['O estoicismo no dia a dia', 'diário estoico; revisão noturna de Sêneca; desconforto voluntário; uma reflexão por dia', 'Diário Estoico — Ryan Holiday'],
      ['Amor fati: abraçar o que acontece', 'amor fati; aceitar sem se resignar; agir sobre o que dá'],
      ['Emoções sem ser escravo delas', 'impressões e assentimento; raiva; medo; o espaço entre estímulo e resposta'],
    ]),
  ]),

  realm({ id: 'm-foco', title: 'Foco e essencialismo', emoji: '🎯', color: 'rose', tagline: 'Proteger a atenção num mundo feito para roubá-la', why: 'Sem foco, disciplina vira esforço jogado fora. Atenção é o recurso que decide se o seu tempo vira resultado.' }, [
    ...level('m-foco', 'm-foco', 1, [
      ['Trabalho focado num mundo distraído', 'trabalho profundo x superficial; resíduo de atenção; blocos de foco', 'Trabalho Focado — Cal Newport'],
      ['Indistraível: gatilhos internos e externos', 'gatilhos internos; tempo para tração; hackear gatilhos externos; pactos', 'Indistraível — Nir Eyal'],
      ['Essencialismo: menos, porém melhor', 'dizer não; escolher trade-offs; o que é essencial', 'Essencialismo — Greg McKeown'],
      ['A única coisa', 'a pergunta foco; efeito dominó; blocar tempo para o mais importante', 'A Única Coisa — Gary Keller'],
      ['Celular e redes sociais: retomando o controle', 'design viciante; minimalismo digital; limites práticos no celular', 'Minimalismo Digital — Cal Newport'],
    ]),
    ...level('m-foco', 'm-foco', 2, [
      ['Foco roubado: o quadro maior', 'por que todos perderam a atenção; flow; sono; leitura profunda', 'Foco Roubado — Johann Hari'],
      ['Estado de flow', 'condições do flow; desafio x habilidade; feedback imediato', 'Flow — Mihaly Csikszentmihalyi'],
      ['Prioridades e planejamento semanal', 'matriz de Eisenhower; revisão semanal; metas por trimestre'],
      ['Estudar trabalhando: foco com pouco tempo', 'horas líquidas; microblocos; aproveitar o transporte; proteger o seu horário'],
    ]),
  ]),

  realm({ id: 'm-recaida', title: 'Quando tudo dá errado', emoji: '🌱', color: 'teal', tagline: 'Recaídas, dias ruins e recomeços', why: 'Todo mundo falha. A diferença de quem chega é que volta rápido, sem se destruir no caminho.' }, [
    ...level('m-recaida', 'm-rec', 1, [
      ['Recaída faz parte, desistir não', 'efeito "dane-se"; lapso x recaída; recomeçar no mesmo dia'],
      ['Autocompaixão não é moleza', 'autocompaixão x autoestima; diálogo interno; por que se punir piora o resultado', 'Autocompaixão — Kristin Neff'],
      ['Protocolo do dia ruim', 'versão mínima; reduzir, não zerar; movimento antes de motivação'],
      ['Voltando depois de semanas parado', 'recomeçar sem tentar compensar; reduzir a meta; nova âncora na rotina'],
      ['Quando é hora de pedir ajuda', 'preguiça x cansaço x esgotamento x depressão; burnout; procurar psicólogo ou médico; CVV 188'],
    ]),
    ...level('m-recaida', 'm-rec', 2, [
      ['Revisão sem culpa: o post-mortem pessoal', 'o que aconteceu; por quê; o que muda no sistema; sem culpa'],
      ['Quem anda com você', 'efeito do grupo; parceiro de estudo; comunidades; cultura que puxa para cima'],
      ['Recomeçar com um porquê mais forte', 'revisar o porquê; metas de aproximação x de fuga; reconectar com os seus valores'],
    ]),
  ]),
];
