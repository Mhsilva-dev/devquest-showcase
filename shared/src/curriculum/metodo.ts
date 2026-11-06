import type { Realm } from '../types.js';

export const metodo: Realm = {
  id: 'metodo',
  title: 'Aprender a Aprender',
  emoji: '🧠',
  color: 'fuchsia',
  tagline: 'O superpoder que multiplica todos os outros',
  why: 'Quem domina como o cérebro grava aprende qualquer tecnologia em metade do tempo e não esquece. É a base de tudo que vem depois.',
  lessons: [
    {
      id: 'metodo-1',
      realmId: 'metodo',
      title: 'Como seu cérebro grava (e por que você esquece)',
      minutes: 15,
      objectives: ['Entender a curva do esquecimento', 'Conhecer os 4 pilares da memória de longo prazo', 'Saber como o DevQuest usa cada um'],
      topics: ['curva do esquecimento', 'recordação ativa', 'repetição espaçada', 'intercalação', 'sono e consolidação'],
      refs: [{ project: 'speak-ai', path: 'src/services/pedagogy/srs.js', hint: 'Você já programou repetição espaçada no Speak AI! Os intervalos 1→3→7→14→30 dias são exatamente a técnica desta aula.' }],
      interview: ['Como você se mantém atualizado e aprende tecnologias novas rápido?'],
      content: {
        hook: 'Você já leu uma documentação inteira, entendeu tudo… e uma semana depois não lembrava de **nada**?\n\nIsso não é falta de inteligência. É o seu cérebro funcionando **exatamente como foi projetado**: ele joga fora o que acha que não vai precisar.',
        concept: `## A curva do esquecimento
Em 1885, Hermann Ebbinghaus descobriu que esquecemos **~70% do que aprendemos em 24 horas** se não revisarmos. Mas cada revisão no momento certo **achata a curva**: a memória dura cada vez mais.

## Os 4 pilares que o DevQuest usa

| Pilar | O que é | Como aparece aqui |
|---|---|---|
| **Recordação ativa** | Puxar a informação da cabeça, sem olhar | Quiz, cards e "Ensine de volta" |
| **Repetição espaçada** | Revisar logo antes de esquecer | Revisão diária com intervalos 1→3→7→14→30 dias |
| **Intercalação** | Misturar assuntos em vez de estudar um só por dias | O botão "Próxima missão" alterna os reinos |
| **Elaboração** | Ligar o novo ao que você já sabe | Toda aula mostra o conceito no **seu** código |

## A regra de ouro
> **Reler dá sensação de aprendizado. Lembrar é que cria aprendizado.**

Se foi fácil, você não aprendeu muito. O esforço de lembrar ("dificuldade desejável") é o que fortalece a conexão entre neurônios.

## Sono
Durante o sono profundo o cérebro **transfere** o que você estudou do hipocampo (memória temporária) para o córtex (memória permanente). Estudar 25 min e dormir bem vale mais que virar a noite.`,
        analogy: 'Memória é como uma trilha na mata. Na primeira vez, você abre caminho com dificuldade. Se ninguém passa, o mato cresce de novo (esquecimento). Cada vez que você passa (recorda), a trilha fica mais larga, até virar uma estrada.',
        memoryHook: '**L.E.I.S.**: Lembrar (não reler), Espaçar, Intercalar, Sono.',
        practice: {
          prompt: 'Sem olhar para cima: escreva os 4 pilares da memória e, para cada um, um exemplo de como você vai aplicar no seu estudo desta semana.',
          checklist: ['Citou recordação ativa', 'Citou repetição espaçada', 'Citou intercalação', 'Citou elaboração ou sono', 'Deu exemplos práticos e pessoais'],
        },
        feynman: 'Explique para um amigo que "estuda relendo o caderno" por que isso não funciona e o que ele deveria fazer no lugar.',
        cards: [
          { front: 'Quanto esquecemos em 24h sem revisar?', back: 'Cerca de 70% (curva do esquecimento de Ebbinghaus).' },
          { front: 'Qual a diferença entre reler e recordação ativa?', back: 'Reler é passivo e dá ilusão de saber. Recordação ativa é puxar da memória sem olhar, o que fortalece a conexão.' },
          { front: 'O que é intercalação?', back: 'Misturar assuntos diferentes na mesma sessão/semana em vez de estudar um tema só por dias seguidos.' },
          { front: 'Mnemônico dos pilares da memória', back: 'L.E.I.S.: Lembrar, Espaçar, Intercalar, Sono.' },
          { front: 'Onde está a repetição espaçada no Speak AI?', back: 'src/services/pedagogy/srs.js, com intervalos 1→3→7→14→30 dias.' },
        ],
        quiz: [
          { q: 'Qual técnica cria mais memória de longo prazo?', options: ['Reler o resumo 5 vezes', 'Fechar o material e tentar explicar', 'Grifar as partes importantes', 'Assistir a aula em 2x'], answer: 1, explain: 'Recordação ativa (puxar da memória) é a técnica com mais evidência científica.' },
          { q: 'Por que o DevQuest alterna os reinos na "Próxima missão"?', options: ['Para ser aleatório', 'Intercalação melhora a retenção e a capacidade de escolher a solução certa', 'Porque os reinos são curtos', 'Para gastar menos IA'], answer: 1, explain: 'Intercalar obriga o cérebro a identificar qual conhecimento usar, igual na vida real.' },
          { q: 'Quando é o melhor momento para revisar?', options: ['Logo depois de estudar', 'Logo antes de esquecer', 'Só na véspera da prova', 'Nunca, só praticar'], answer: 1, explain: 'Revisar quando está quase esquecendo exige esforço e reforça mais a memória.' },
        ],
      },
    },
    {
      id: 'metodo-2',
      realmId: 'metodo',
      title: 'Técnica Feynman: aprenda ensinando',
      minutes: 15,
      objectives: ['Aplicar os 4 passos da técnica Feynman', 'Detectar lacunas no próprio entendimento', 'Usar analogias para fixar conceitos técnicos'],
      topics: ['técnica Feynman', 'ilusão de competência', 'analogias', 'explicar para um iniciante', 'lacunas de conhecimento'],
      interview: ['Explique um conceito técnico complexo como se eu não fosse da área.'],
    },
    {
      id: 'metodo-3',
      realmId: 'metodo',
      title: 'Palácio da memória e chunking para devs',
      minutes: 20,
      objectives: ['Construir um palácio da memória', 'Agrupar informação em blocos (chunking)', 'Memorizar listas técnicas como o OWASP Top 10'],
      topics: ['método de loci', 'chunking', 'mnemônicos', 'imagens absurdas', 'memorizar OWASP Top 10 e status HTTP'],
    },
    {
      id: 'metodo-4',
      realmId: 'metodo',
      title: 'Foco profundo: estudar 25 minutos valendo 2 horas',
      minutes: 15,
      objectives: ['Usar a técnica Pomodoro', 'Eliminar distrações', 'Entender modo focado vs difuso'],
      topics: ['pomodoro', 'deep work', 'modo focado e difuso', 'dopamina e celular', 'ritual de início'],
    },
    {
      id: 'metodo-5',
      realmId: 'metodo',
      title: 'Ler código dos outros como um sênior',
      minutes: 20,
      objectives: ['Ter um método para entender um projeto desconhecido', 'Navegar do ponto de entrada até a regra de negócio', 'Fazer anotações úteis'],
      topics: ['ponto de entrada', 'seguir uma requisição', 'mapa mental do projeto', 'ler testes primeiro', 'git log e blame'],
      refs: [{ project: 'speak-ai', path: 'src/app.js', hint: 'Comece sempre pelo ponto de entrada: aqui você vê todas as rotas e middlewares montados.' }],
    },
    {
      id: 'metodo-6',
      realmId: 'metodo',
      title: 'Prática deliberada: como ficar bom de verdade',
      minutes: 15,
      objectives: ['Diferenciar prática ingênua de deliberada', 'Montar ciclos curtos de feedback', 'Construir projetos que ensinam'],
      topics: ['prática deliberada', 'zona de desconforto', 'feedback rápido', 'projetos pessoais', 'regra das 10 mil horas (mito e verdade)'],
    },
  ],
};
