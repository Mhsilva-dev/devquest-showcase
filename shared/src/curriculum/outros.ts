import type { Realm } from '../types.js';

// Reinos com currículo em forma de roteiro: título, objetivos e tópicos.
// A IA gera o conteúdo completo de cada aula sob demanda a partir daqui + do seu código.

export const fundamentos: Realm = {
  id: 'js',
  title: 'Fundamentos & TypeScript',
  emoji: '⚡',
  color: 'amber',
  tagline: 'A base que sustenta tudo',
  why: 'Você programa há tempo, mas dominar os porquês (como o JS executa, tipos, assíncrono) é o que separa quem copia de quem cria. TypeScript está em quase toda vaga hoje.',
  lessons: [
    { id: 'js-1', realmId: 'js', title: 'Valores, tipos e coerção em JavaScript', minutes: 15, objectives: ['Entender tipos primitivos e referência', 'Evitar armadilhas de == e coerção'], topics: ['primitivos vs objetos', '== vs ===', 'truthy/falsy', 'null vs undefined', 'cópia por valor vs referência'] },
    { id: 'js-2', realmId: 'js', title: 'Escopo, closures e hoisting', minutes: 20, objectives: ['Dominar let/const/var', 'Entender closures na prática'], topics: ['escopo léxico', 'closures', 'hoisting', 'temporal dead zone', 'closures em loops'] },
    { id: 'js-3', realmId: 'js', title: 'this, protótipos e classes', minutes: 20, objectives: ['Entender como this é definido', 'Conhecer a cadeia de protótipos'], topics: ['this em 4 contextos', 'bind/call/apply', 'prototype', 'classes e herança'] },
    { id: 'js-4', realmId: 'js', title: 'Assíncrono: event loop, Promises e async/await', minutes: 25, objectives: ['Entender o event loop', 'Dominar async/await e tratamento de erro'], topics: ['call stack', 'event loop', 'microtasks', 'Promise', 'async/await', 'Promise.all', 'erros em async'], refs: [{ project: 'speak-ai', path: 'src/db/pool.js', hint: 'tx(fn) usa async/await com try/catch/finally: o padrão de transação.' }], interview: ['Explique o event loop.', 'Diferença entre Promise.all e Promise.allSettled?'] },
    { id: 'js-5', realmId: 'js', title: 'Arrays e objetos: map, filter, reduce e imutabilidade', minutes: 20, objectives: ['Dominar métodos funcionais', 'Trabalhar de forma imutável'], topics: ['map/filter/reduce', 'spread/rest', 'desestruturação', 'imutabilidade', 'structuredClone'] },
    { id: 'js-6', realmId: 'js', title: 'Módulos: ESM, CommonJS e como o Node resolve', minutes: 15, objectives: ['Entender import/export', 'Saber a diferença entre ESM e CJS'], topics: ['import/export', 'require', 'type: module', 'resolução de módulos', 'dependências circulares'] },
    { id: 'js-7', realmId: 'js', title: 'TypeScript: tipos que pegam o bug antes de rodar', minutes: 25, objectives: ['Tipar funções e objetos', 'Entender o compilador'], topics: ['tipos básicos', 'interface vs type', 'union e narrowing', 'tsconfig strict', 'any vs unknown'], interview: ['Qual a diferença entre any e unknown?'] },
    { id: 'js-8', realmId: 'js', title: 'TypeScript avançado: genéricos, utilitários e inferência', minutes: 25, objectives: ['Escrever código genérico e reutilizável', 'Usar tipos utilitários'], topics: ['genéricos', 'Partial/Pick/Omit/Record', 'keyof', 'tipos condicionais', 'inferência com zod'], refs: [{ project: 'devquest', path: 'shared/src/types.ts', hint: 'Os tipos que o front e o back deste app compartilham: é isso que estamos estudando.' }] },
    { id: 'js-9', realmId: 'js', title: 'Boss: desafio de fundamentos', minutes: 20, boss: true, objectives: ['Aplicar tudo do reino num problema só'], topics: ['assíncrono', 'tipos', 'imutabilidade', 'closures'] },
  ],
};

export const backend: Realm = {
  id: 'backend',
  title: 'Backend com Node & Express',
  emoji: '🔌',
  color: 'emerald',
  tagline: 'Construir as APIs que o mundo consome',
  why: 'Todo o seu lado servidor vive aqui. Entender a fundo request/response, middlewares e arquitetura é o que te faz resolver qualquer bug e desenhar sistemas que escalam.',
  lessons: [
    { id: 'be-1', realmId: 'backend', title: 'Como o Node funciona por dentro', minutes: 20, objectives: ['Entender o modelo single-thread não bloqueante', 'Conhecer libuv e o thread pool'], topics: ['single thread', 'I/O não bloqueante', 'libuv', 'thread pool', 'quando o Node trava'] },
    { id: 'be-2', realmId: 'backend', title: 'HTTP a fundo: métodos, status e headers', minutes: 20, objectives: ['Usar os métodos e status certos', 'Entender headers importantes'], topics: ['GET/POST/PUT/PATCH/DELETE', 'idempotência', 'status 2xx/3xx/4xx/5xx', 'headers', 'content negotiation'], interview: ['Qual a diferença entre PUT e PATCH?', 'Quando usar 401 vs 403?'] },
    { id: 'be-3', realmId: 'backend', title: 'Express: rotas, middlewares e o fluxo da requisição', minutes: 25, objectives: ['Entender a cadeia de middlewares', 'Organizar rotas'], topics: ['app.use', 'ordem dos middlewares', 'req/res/next', 'roteadores', 'tratamento de erro central'], refs: [{ project: 'speak-ai', path: 'src/app.js', hint: 'Veja a ordem: helmet, cookies, rotas, e o middleware de erro por último.' }] },
    { id: 'be-4', realmId: 'backend', title: 'Projetando uma API REST de verdade', minutes: 25, objectives: ['Modelar recursos e rotas', 'Versionar e paginar'], topics: ['recursos e substantivos', 'paginação', 'filtros', 'versionamento', 'erros padronizados', 'REST vs RPC'], refs: [{ project: 'financeflow', path: 'src/routes/transacoes/crud.js', hint: 'CRUD completo de um recurso.' }] },
    { id: 'be-5', realmId: 'backend', title: 'Arquitetura em camadas: rotas, serviços e repositórios', minutes: 25, objectives: ['Separar responsabilidades', 'Deixar o código testável'], topics: ['controller/service/repository', 'injeção de dependência', 'regra de negócio isolada', 'por que não colocar SQL na rota'], refs: [{ project: 'speak-ai', path: 'src/services/auth.service.js', hint: 'A rota chama o service; o service tem a regra. Compare com o FinanceFlow.' }] },
    { id: 'be-6', realmId: 'backend', title: 'Validação, erros e logs', minutes: 20, objectives: ['Validar toda entrada', 'Padronizar erros e logs'], topics: ['zod', 'erros operacionais vs bugs', 'async error handling', 'logs estruturados', 'não vazar stack trace'], refs: [{ project: 'trading-bot', path: 'src/server/security.js', hint: 'validate(schema, data) centraliza a validação com zod.' }] },
    { id: 'be-7', realmId: 'backend', title: 'Tarefas agendadas e trabalhos em background', minutes: 20, objectives: ['Agendar tarefas', 'Entender filas'], topics: ['node-cron', 'jobs em background', 'filas', 'idempotência de jobs'], refs: [{ project: 'financeflow', path: 'src/scheduler.js', hint: 'Agendamento de tarefas recorrentes.' }] },
    { id: 'be-8', realmId: 'backend', title: 'Boss: construa um módulo de API completo', minutes: 25, boss: true, objectives: ['Rota + serviço + validação + erro + teste'], topics: ['tudo do reino'] },
  ],
};

export const bancos: Realm = {
  id: 'db',
  title: 'Bancos de Dados',
  emoji: '🗄️',
  color: 'blue',
  tagline: 'Onde os dados vivem de verdade',
  why: 'Você usa SQLite e Postgres nos projetos. Dominar modelagem, SQL, índices e transações é o que faz sistemas rápidos e confiáveis, e cai em toda entrevista.',
  lessons: [
    { id: 'db-1', realmId: 'db', title: 'Relacional vs NoSQL: quando usar cada um', minutes: 20, objectives: ['Comparar modelos', 'Escolher o banco certo'], topics: ['relacional', 'documento', 'chave-valor', 'ACID vs BASE', 'SQLite vs Postgres vs Mongo'], interview: ['Quando você escolheria NoSQL em vez de SQL?'] },
    { id: 'db-2', realmId: 'db', title: 'Modelagem: tabelas, chaves e relacionamentos', minutes: 25, objectives: ['Modelar 1:N e N:N', 'Usar chaves estrangeiras'], topics: ['chave primária', 'chave estrangeira', '1:1, 1:N, N:N', 'tabela de junção', 'integridade referencial'], refs: [{ project: 'speak-ai', path: 'src/db/migrations/001_init.sql', hint: 'Veja as tabelas e as relações do Speak AI.' }] },
    { id: 'db-3', realmId: 'db', title: 'SQL essencial: SELECT, WHERE, JOIN, GROUP BY', minutes: 25, objectives: ['Escrever consultas com confiança', 'Dominar os JOINs'], topics: ['SELECT/WHERE', 'INNER/LEFT JOIN', 'GROUP BY', 'agregações', 'ORDER BY/LIMIT', 'subqueries'], interview: ['Diferença entre INNER JOIN e LEFT JOIN?'] },
    { id: 'db-4', realmId: 'db', title: 'Normalização e quando desnormalizar', minutes: 20, objectives: ['Aplicar as formas normais', 'Saber quando quebrar a regra'], topics: ['1FN, 2FN, 3FN', 'redundância', 'desnormalização por performance'] },
    { id: 'db-5', realmId: 'db', title: 'Índices: por que sua query está lenta', minutes: 25, objectives: ['Entender como índices funcionam', 'Ler um EXPLAIN'], topics: ['B-tree', 'índice composto', 'EXPLAIN/ANALYZE', 'full table scan', 'custo de escrever com muitos índices'], interview: ['Como você investigaria uma query lenta?'] },
    { id: 'db-6', realmId: 'db', title: 'Transações, ACID e concorrência', minutes: 25, objectives: ['Usar transações corretamente', 'Entender níveis de isolamento'], topics: ['ACID', 'BEGIN/COMMIT/ROLLBACK', 'níveis de isolamento', 'deadlock', 'race conditions'], refs: [{ project: 'speak-ai', path: 'src/db/pool.js', hint: 'tx(fn): BEGIN, executa, COMMIT, e ROLLBACK se der erro.' }] },
    { id: 'db-7', realmId: 'db', title: 'Migrations, pool de conexões e backups', minutes: 20, objectives: ['Versionar o schema', 'Gerenciar conexões e backups'], topics: ['migrations', 'pool de conexões', 'seeds', 'backup e restore', 'pg_dump'], refs: [{ project: 'speak-ai', path: 'src/db/migrate.js', hint: 'Como as migrations são aplicadas em ordem.' }] },
    { id: 'db-8', realmId: 'db', title: 'Boss: modele e consulte um domínio novo', minutes: 25, boss: true, objectives: ['Modelar do zero e escrever as queries'], topics: ['tudo do reino'] },
  ],
};

export const frontend: Realm = {
  id: 'front',
  title: 'Frontend com React',
  emoji: '🎨',
  color: 'cyan',
  tagline: 'Interfaces que as pessoas amam usar',
  why: 'Seu LifeQuest já é React. Entender a fundo estado, hooks e performance faz suas interfaces rápidas e sem bugs, e abre as portas para qualquer vaga full-stack.',
  lessons: [
    { id: 'fe-1', realmId: 'front', title: 'Como o React pensa: componentes e renderização', minutes: 20, objectives: ['Entender o fluxo de dados', 'Saber quando re-renderiza'], topics: ['componentes', 'props', 'JSX', 'virtual DOM', 'renderização'] },
    { id: 'fe-2', realmId: 'front', title: 'Estado com useState e eventos', minutes: 20, objectives: ['Gerenciar estado local', 'Lidar com formulários'], topics: ['useState', 'estado imutável', 'eventos', 'formulários controlados'] },
    { id: 'fe-3', realmId: 'front', title: 'useEffect e o ciclo de vida', minutes: 25, objectives: ['Usar efeitos corretamente', 'Evitar loops infinitos'], topics: ['useEffect', 'dependências', 'cleanup', 'buscar dados', 'erros comuns'], refs: [{ project: 'lifequest', path: 'src/App.jsx', hint: 'Veja como o LifeQuest busca o estado do servidor e reage a ele.' }] },
    { id: 'fe-4', realmId: 'front', title: 'Hooks customizados e reutilização', minutes: 20, objectives: ['Extrair lógica em hooks', 'Compor comportamento'], topics: ['hooks customizados', 'regras dos hooks', 'useRef', 'useMemo/useCallback'] },
    { id: 'fe-5', realmId: 'front', title: 'Estado global e comunicação com a API', minutes: 25, objectives: ['Compartilhar estado', 'Organizar chamadas à API'], topics: ['Context', 'levantamento de estado', 'fetch wrapper', 'estados de loading/erro'], refs: [{ project: 'lifequest', path: 'src/api.js', hint: 'O wrapper de API do LifeQuest.' }] },
    { id: 'fe-6', realmId: 'front', title: 'Performance: memo, listas e lazy loading', minutes: 20, objectives: ['Evitar renders desnecessários', 'Carregar sob demanda'], topics: ['React.memo', 'key em listas', 'code splitting', 'lazy/Suspense'] },
    { id: 'fe-7', realmId: 'front', title: 'Boss: construa uma tela interativa completa', minutes: 25, boss: true, objectives: ['Estado + efeito + API + performance'], topics: ['tudo do reino'] },
  ],
};

export const tempoReal: Realm = {
  id: 'rt',
  title: 'Tempo Real',
  emoji: '📡',
  color: 'violet',
  tagline: 'Dados que chegam no instante em que acontecem',
  why: 'Seu Trading Bot e o Speak AI usam WebSocket e push. Dominar tempo real é um diferencial raro que impressiona em entrevista.',
  lessons: [
    { id: 'rt-1', realmId: 'rt', title: 'Polling, SSE e WebSocket: qual usar', minutes: 20, objectives: ['Comparar as técnicas', 'Escolher a certa'], topics: ['polling', 'long polling', 'Server-Sent Events', 'WebSocket', 'trade-offs'] },
    { id: 'rt-2', realmId: 'rt', title: 'WebSocket na prática', minutes: 25, objectives: ['Abrir e manter conexões', 'Tratar reconexão'], topics: ['handshake', 'mensagens', 'heartbeat/ping', 'reconexão', 'escala com várias instâncias'], refs: [{ project: 'trading-bot', path: 'src/server/realtime.js', hint: 'Como o bot envia atualizações ao vivo para o dashboard.' }] },
    { id: 'rt-3', realmId: 'rt', title: 'Web Push e notificações', minutes: 20, objectives: ['Entender push do navegador', 'Enviar notificações'], topics: ['service worker', 'VAPID', 'subscription', 'payload'], refs: [{ project: 'speak-ai', path: 'src/services/push.service.js', hint: 'O envio de push do Speak AI.' }] },
    { id: 'rt-4', realmId: 'rt', title: 'Boss: um recurso ao vivo de ponta a ponta', minutes: 25, boss: true, objectives: ['Backend + WebSocket + front reativo'], topics: ['tudo do reino'] },
  ],
};

export const git: Realm = {
  id: 'git',
  title: 'Git & GitHub',
  emoji: '🌿',
  color: 'orange',
  tagline: 'Controlar a história do seu código',
  why: 'Git é a ferramenta nº1 do dia a dia de todo dev. Usar bem (branches, rebase, PRs, resolver conflitos sem medo) te faz produtivo e confiável em qualquer time.',
  lessons: [
    { id: 'git-1', realmId: 'git', title: 'Como o Git pensa: commits, árvore e HEAD', minutes: 20, objectives: ['Entender o modelo de dados do Git', 'Saber o que é um commit de verdade'], topics: ['working dir, staging, repo', 'commit como snapshot', 'HEAD', 'hash SHA', 'objetos do Git'], interview: ['O que é um commit no Git, tecnicamente?'] },
    { id: 'git-2', realmId: 'git', title: 'O dia a dia: add, commit, push, pull', minutes: 15, objectives: ['Dominar o fluxo básico', 'Escrever boas mensagens'], topics: ['status/add/commit', 'push/pull/fetch', 'mensagens de commit', 'conventional commits', '.gitignore'] },
    { id: 'git-3', realmId: 'git', title: 'Branches e merge', minutes: 20, objectives: ['Trabalhar com branches', 'Fazer merge sem medo'], topics: ['branch', 'checkout/switch', 'merge', 'fast-forward', 'estratégias de branch'] },
    { id: 'git-4', realmId: 'git', title: 'Resolvendo conflitos e usando rebase', minutes: 25, objectives: ['Resolver conflitos com calma', 'Entender rebase vs merge'], topics: ['conflitos', 'rebase', 'merge vs rebase', 'squash', 'histórico limpo'], interview: ['Qual a diferença entre merge e rebase?'] },
    { id: 'git-5', realmId: 'git', title: 'Desfazer qualquer coisa: reset, revert, reflog, stash', minutes: 25, objectives: ['Voltar atrás com segurança', 'Recuperar trabalho perdido'], topics: ['reset soft/mixed/hard', 'revert', 'reflog', 'stash', 'cherry-pick'], interview: ['Você commitou na branch errada. Como corrige?'] },
    { id: 'git-6', realmId: 'git', title: 'GitHub: PRs, code review e colaboração', minutes: 20, objectives: ['Abrir e revisar PRs', 'Colaborar em equipe'], topics: ['fork e clone', 'pull request', 'code review', 'issues', 'proteção de branch'] },
    { id: 'git-7', realmId: 'git', title: 'GitHub Actions: CI/CD na prática', minutes: 25, objectives: ['Automatizar testes e deploy', 'Escrever um workflow'], topics: ['workflow YAML', 'jobs e steps', 'rodar testes no PR', 'deploy automático', 'secrets'], interview: ['O que é CI/CD e por que importa?'] },
    { id: 'git-8', realmId: 'git', title: 'Boss: fluxo completo com PR e CI', minutes: 20, boss: true, objectives: ['Branch, commit, PR, resolver conflito, merge'], topics: ['tudo do reino'] },
  ],
};

export const ia: Realm = {
  id: 'ia',
  title: 'Programar COM Inteligência Artificial',
  emoji: '🤖',
  color: 'pink',
  tagline: 'Fazer a IA trabalhar para você',
  why: 'Você quer manipular a IA para trabalhar por você. Quem sabe integrar LLMs, escrever bons prompts e construir agentes está anos à frente. Seus projetos já usam Gemini, então você vai aprender no seu próprio código.',
  lessons: [
    { id: 'ia-1', realmId: 'ia', title: 'O que é um LLM e como ele realmente funciona', minutes: 20, objectives: ['Entender tokens, contexto e previsão', 'Saber os limites (alucinação)'], topics: ['tokens', 'janela de contexto', 'temperatura', 'alucinação', 'por que a IA erra'], interview: ['O que é uma alucinação de LLM e como você mitiga?'] },
    { id: 'ia-2', realmId: 'ia', title: 'Chamando a API de um modelo pelo seu backend', minutes: 25, objectives: ['Fazer uma chamada à API', 'Tratar timeout, retry e custo'], topics: ['requisição à API', 'system prompt', 'timeout e retry', 'fallback de modelo', 'controle de custo'], refs: [{ project: 'speak-ai', path: 'src/services/ai/gemini.service.js', hint: 'Seu cliente de IA já faz timeout, retry, fallback de modelo e cooldown por cota. É um ótimo exemplo real.' }] },
    { id: 'ia-3', realmId: 'ia', title: 'Engenharia de prompt para resultados confiáveis', minutes: 25, objectives: ['Escrever prompts claros', 'Forçar formato de saída'], topics: ['instruções claras', 'few-shot', 'persona', 'chain of thought', 'delimitadores', 'pedir JSON'], refs: [{ project: 'speak-ai', path: 'src/services/ai/prompts.js', hint: 'Veja como os prompts do Speak AI são montados.' }] },
    { id: 'ia-4', realmId: 'ia', title: 'Saída estruturada: fazendo a IA devolver JSON válido', minutes: 20, objectives: ['Obter JSON confiável', 'Validar a resposta'], topics: ['JSON mode', 'validar com zod', 'reparar JSON quebrado', 'schema de saída'], refs: [{ project: 'speak-ai', path: 'src/services/ai/gemini.service.js', hint: 'A função extractJSON recupera JSON de respostas quase certas. Estude essa defesa.' }] },
    { id: 'ia-5', realmId: 'ia', title: 'RAG: dando conhecimento próprio à IA', minutes: 25, objectives: ['Entender embeddings e busca', 'Montar um RAG simples'], topics: ['embeddings', 'busca vetorial', 'chunking', 'contexto recuperado', 'quando usar RAG vs fine-tuning'], interview: ['O que é RAG e quando usar?'] },
    { id: 'ia-6', realmId: 'ia', title: 'Agentes e tool calling: a IA que executa ações', minutes: 25, objectives: ['Entender tool/function calling', 'Montar um loop de agente'], topics: ['function calling', 'loop de agente', 'ferramentas', 'segurança de agentes', 'quando NÃO usar agente'], interview: ['Como você daria a um LLM a capacidade de consultar seu banco com segurança?'] },
    { id: 'ia-7', realmId: 'ia', title: 'Usar IA para programar melhor (e aprender mais rápido)', minutes: 20, objectives: ['Usar IA como par de programação', 'Não virar dependente'], topics: ['revisar código com IA', 'explicar código', 'gerar testes', 'o perigo de aceitar sem entender', 'prompts para estudo'] },
    { id: 'ia-8', realmId: 'ia', title: 'IA no editor e no terminal (Copilot, Cursor e afins)', minutes: 20, objectives: ['Usar assistentes dentro do fluxo de trabalho', 'Dar contexto certo e aceitar com critério'], topics: ['autocompletar vs agente', 'dar contexto do projeto', 'revisar o diff antes de aceitar', 'quando desligar a IA', 'armadilhas de segurança (segredos no prompt)'] },
    { id: 'ia-9', realmId: 'ia', title: 'Prompts que resolvem bug e exploram código', minutes: 20, objectives: ['Depurar com a IA', 'Fazer a IA explicar e refatorar com segurança'], topics: ['colar erro + contexto', 'pedir hipóteses, não só a "resposta"', 'pedir o porquê', 'refatorar passo a passo', 'gerar casos de teste do bug'], refs: [{ project: 'speak-ai', path: 'src/services/ai/gemini.service.js', hint: 'Um bom alvo para praticar: peça à IA para explicar o fluxo de retry/cooldown deste arquivo.' }] },
    { id: 'ia-10', realmId: 'ia', title: 'Seu assistente pessoal: automatizar tarefas com IA', minutes: 25, objectives: ['Montar um script que usa a IA por você', 'Fazer a IA trabalhar em lote'], topics: ['scripts com chamada à API', 'processar vários arquivos', 'resumir/classificar em lote', 'conectar a IA a dados seus', 'custo e limites'], refs: [{ project: 'financeflow', path: 'src/services/assistente.js', hint: 'Um assistente de IA que você mesmo já construiu. Estude como ele monta o contexto.' }] },
    { id: 'ia-11', realmId: 'ia', title: 'Riscos: alucinação, privacidade e dependência', minutes: 20, objectives: ['Confiar na medida certa', 'Proteger dados ao usar IA', 'Não perder a própria habilidade'], topics: ['verificar o que a IA afirma', 'não colar segredos/dados sensíveis', 'viés e limites', 'manter o cérebro no jogo', 'quando NÃO usar IA'] },
    { id: 'ia-12', realmId: 'ia', title: 'Boss: construa um recurso com IA do zero', minutes: 25, boss: true, objectives: ['Prompt + chamada + JSON validado + UI'], topics: ['tudo do reino'] },
  ],
};

export const engenharia: Realm = {
  id: 'eng',
  title: 'Boas Práticas & Arquitetura',
  emoji: '🏛️',
  color: 'slate',
  tagline: 'Código que outros (e o você do futuro) entendem',
  why: 'Escrever código que funciona é o começo. Escrever código limpo, testado e bem arquitetado é o que define um sênior e justifica salários maiores.',
  lessons: [
    { id: 'eng-1', realmId: 'eng', title: 'Código limpo: nomes, funções e comentários', minutes: 20, objectives: ['Escrever código legível', 'Comentar o porquê, não o quê'], topics: ['nomes que revelam intenção', 'funções pequenas', 'DRY', 'comentários úteis', 'código que se explica'] },
    { id: 'eng-2', realmId: 'eng', title: 'Princípios SOLID na prática', minutes: 25, objectives: ['Entender os 5 princípios', 'Aplicar sem exagero'], topics: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP', 'quando não aplicar'], interview: ['Explique o S de SOLID com um exemplo.'] },
    { id: 'eng-3', realmId: 'eng', title: 'Testes: unitário, integração e TDD', minutes: 25, objectives: ['Escrever testes que valem a pena', 'Entender a pirâmide de testes'], topics: ['unitário vs integração', 'pirâmide de testes', 'mocks', 'TDD', 'cobertura (e sua ilusão)'], refs: [{ project: 'speak-ai', path: 'test', hint: 'O Speak AI tem testes com supertest. Veja como as rotas são testadas.' }], interview: ['O que você testaria primeiro numa API nova?'] },
    { id: 'eng-4', realmId: 'eng', title: 'Padrões de projeto que aparecem no dia a dia', minutes: 25, objectives: ['Reconhecer padrões comuns', 'Usar quando fazem sentido'], topics: ['factory', 'strategy', 'adapter', 'singleton', 'observer', 'injeção de dependência'], refs: [{ project: 'trading-bot', path: 'src/broker/BrokerAdapter.js', hint: 'Padrão Adapter: a mesma interface para Mercado Bitcoin e MT5.' }] },
    { id: 'eng-5', realmId: 'eng', title: 'Refatoração e dívida técnica', minutes: 20, objectives: ['Refatorar com segurança', 'Gerenciar dívida técnica'], topics: ['code smells', 'refatorar em passos pequenos', 'dívida técnica', 'quando refatorar vs reescrever'] },
    { id: 'eng-6', realmId: 'eng', title: 'Complexidade de algoritmos (Big O) para o dia a dia', minutes: 25, objectives: ['Avaliar custo de tempo e espaço', 'Evitar armadilhas comuns'], topics: ['notação Big O', 'O(1), O(n), O(n²), O(log n)', 'loop dentro de loop', 'estruturas certas (Map vs array)'], interview: ['Qual o Big O de buscar num objeto/Map vs num array?'] },
    { id: 'eng-7', realmId: 'eng', title: 'Arquitetura: monolito, serviços e escala', minutes: 25, objectives: ['Comparar arquiteturas', 'Saber quando escalar'], topics: ['monolito', 'microserviços', 'cache', 'fila de mensagens', 'escala horizontal vs vertical', 'quando NÃO usar microserviços'], interview: ['Monolito ou microserviços para um produto novo?'] },
    { id: 'eng-8', realmId: 'eng', title: 'Boss: revise e melhore um módulo real', minutes: 25, boss: true, objectives: ['Aplicar limpeza, SOLID e testes num código seu'], topics: ['tudo do reino'] },
  ],
};

export const devops: Realm = {
  id: 'devops',
  title: 'DevOps & Deploy',
  emoji: '🚀',
  color: 'teal',
  tagline: 'Levar o código até o usuário, com segurança',
  why: 'Você já faz deploy na sua VPS. Dominar Linux, Docker, nginx e observabilidade te dá autonomia total: do código ao ar, sem depender de ninguém.',
  lessons: [
    { id: 'ops-1', realmId: 'devops', title: 'Linux para desenvolvedores', minutes: 25, objectives: ['Navegar e administrar pelo terminal', 'Entender permissões e processos'], topics: ['sistema de arquivos', 'permissões', 'processos', 'pipes e redirecionamento', 'systemd'] },
    { id: 'ops-2', realmId: 'devops', title: 'Gerenciando apps com PM2', minutes: 15, objectives: ['Rodar apps em produção', 'Ver logs e reinícios'], topics: ['pm2 start/list/logs', 'cluster mode', 'reinício automático', 'ecosystem.config'], refs: [{ project: 'trading-bot', path: 'ecosystem.config.cjs', hint: 'A configuração de PM2 do seu bot.' }] },
    { id: 'ops-3', realmId: 'devops', title: 'nginx: proxy reverso, HTTPS e headers', minutes: 25, objectives: ['Configurar um proxy reverso', 'Entender o certificado TLS'], topics: ['proxy reverso', 'server blocks', 'Lets Encrypt', 'headers de segurança', 'WebSocket no nginx'], refs: [{ project: 'speak-ai', path: 'nginx.conf', hint: 'Compare com a config real do speak.mhsilvadev.com.br no servidor.' }] },
    { id: 'ops-4', realmId: 'devops', title: 'Docker: containers do zero', minutes: 25, objectives: ['Entender imagens e containers', 'Escrever um Dockerfile'], topics: ['imagem vs container', 'Dockerfile', 'camadas', 'volumes', 'docker compose', 'por que containers'], interview: ['Qual a diferença entre uma imagem e um container?'] },
    { id: 'ops-5', realmId: 'devops', title: 'Variáveis de ambiente e configuração por ambiente', minutes: 15, objectives: ['Separar config do código', 'Gerir dev/prod'], topics: ['12-factor', '.env', 'config por ambiente', 'segredos em produção'] },
    { id: 'ops-6', realmId: 'devops', title: 'Observabilidade: logs, métricas e alertas', minutes: 20, objectives: ['Saber o que está acontecendo em produção', 'Ser avisado antes do usuário reclamar'], topics: ['logs centralizados', 'métricas', 'health checks', 'alertas', 'uptime'] },
    { id: 'ops-7', realmId: 'devops', title: 'Boss: faça o deploy de um app do zero', minutes: 25, boss: true, objectives: ['App + PM2 + nginx + HTTPS + domínio'], topics: ['tudo do reino'] },
  ],
};

export const pentest: Realm = {
  id: 'pentest',
  title: 'Pentest Ético',
  emoji: '🥷',
  color: 'rose',
  tagline: 'Aprender a invadir — do jeito legal, em ambientes que te autorizam',
  why: 'Entender o ataque de ponta a ponta é o que forma o profissional de segurança mais completo (e bem pago). Aqui você treina em labs feitos para serem invadidos, nunca em sistemas de terceiros.',
  lessons: [
    {
      id: 'pt-1',
      realmId: 'pentest',
      title: 'As regras do jogo: ética, lei e laboratórios legais',
      minutes: 20,
      objectives: ['Saber o que é e o que não é legal', 'Conhecer as plataformas onde treinar é permitido', 'Montar seu ambiente de estudo'],
      topics: ['autorização por escrito', 'Lei 12.737 e art. 154-A', 'escopo de um pentest', 'bug bounty', 'VM isolada em casa'],
      content: {
        hook: 'Existe uma única diferença entre um pentester (bem pago e respeitado) e um criminoso: **autorização**. A técnica é a mesma. O que muda é *onde* e *com permissão de quem* você aponta ela.',
        concept: `## A linha que você nunca cruza
Invadir sistema de terceiros **sem autorização** é crime no Brasil (Lei 12.737/2012, art. 154-A do Código Penal), **mesmo sem causar dano**. "Era só pra aprender" não é defesa.

A boa notícia: existe um mundo inteiro de lugares **feitos para você invadir**, legalmente.

## Onde treinar (tudo autorizado)
| Plataforma | Para quê | Link |
|---|---|---|
| **DevQuest — Lab Hacker** | Começo imediato, aqui mesmo | o menu 🧪 ao lado |
| **PortSwigger Web Security Academy** | Web, o melhor e gratuito | portswigger.net/web-security |
| **TryHackMe** | Trilhas guiadas, do zero | tryhackme.com |
| **Hack The Box** | Máquinas realistas | hackthebox.com |
| **OverTheWire (Bandit)** | "Entrar em servidor" via SSH, passo a passo | overthewire.org/wargames/bandit |
| **PicoCTF** | CTF para iniciantes | picoctf.org |
| **DVWA / Metasploitable** | Alvos para subir na sua VM | github.com/digininja/DVWA |

## Bug bounty
Empresas **pagam** você para achar falhas nos sistemas delas, com autorização: **HackerOne** e **Bugcrowd**. É a forma legal de testar sistemas reais.

## Seu laboratório em casa
O ideal: uma **VM isolada** (VirtualBox) rodando um alvo vulnerável (DVWA/Metasploitable) + uma VM com **Kali Linux** (as ferramentas). Rede interna só entre elas, sem tocar na internet.`,
        analogy: 'É como artes marciais: você treina golpes de verdade, mas num tatame, com um parceiro que consentiu. Usar na rua contra alguém é agressão. O tatame do hacker são esses labs.',
        memoryHook: 'Mesma técnica + **autorização** = profissão. Sem autorização = cadeia.',
        practice: {
          prompt: 'Crie seu plano: escolha 2 plataformas da lista para começar esta semana e escreva por que cada uma, e o que você quer aprender nelas.',
          checklist: ['Escolheu plataformas reais da lista', 'Justificou a escolha', 'Definiu um objetivo de aprendizado', 'Demonstrou entender o limite legal'],
        },
        feynman: 'Explique para um amigo empolgado a diferença entre hacking ético e crime, e por que treinar nesses labs é o caminho certo.',
        cards: [
          { front: 'O que separa pentest de crime?', back: 'Autorização (por escrito) do dono do sistema, ou um ambiente feito para ser testado.' },
          { front: 'Invadir sistema de terceiros sem dano é crime no Brasil?', back: 'Sim. Lei 12.737/2012, art. 154-A, mesmo sem causar prejuízo.' },
          { front: 'Melhor lab gratuito de segurança web', back: 'PortSwigger Web Security Academy.' },
          { front: 'Onde aprender a "entrar em servidor" via SSH legalmente', back: 'OverTheWire Bandit (wargame feito para isso).' },
          { front: 'Como testar sistemas reais legalmente?', back: 'Programas de bug bounty (HackerOne, Bugcrowd), que autorizam e pagam.' },
        ],
        quiz: [
          { q: 'Um amigo pede para você "testar se o site dele é seguro". O que falta antes?', options: ['Nada, ele pediu', 'Autorização por escrito definindo o escopo', 'Um bom antivírus', 'Uma VPN'], answer: 1, explain: 'Pedido verbal não basta: pentest profissional tem autorização escrita e escopo definido.' },
          { q: 'Onde é legal praticar invasão?', options: ['No WiFi do vizinho', 'Em labs como TryHackMe/HTB e bug bounty', 'Em qualquer site com formulário', 'No sistema da faculdade'], answer: 1, explain: 'Só em ambientes que te autorizam explicitamente.' },
          { q: 'Qual a melhor forma de testar um sistema real sem risco legal?', options: ['Fazer escondido', 'Programa de bug bounty', 'Avisar depois', 'Usar Tor'], answer: 1, explain: 'Bug bounty é autorização formal da empresa para testar e reportar.' },
        ],
      },
    },
    { id: 'pt-2', realmId: 'pentest', title: 'Reconhecimento: mapeando o alvo', minutes: 25, objectives: ['Coletar informação antes de atacar', 'Usar as ferramentas certas'], topics: ['OSINT', 'nmap (varredura de portas)', 'enumeração de serviços', 'subdomínios', 'o que é footprinting'], interview: ['Qual a primeira fase de um pentest e por quê?'] },
    { id: 'pt-3', realmId: 'pentest', title: 'Invadindo aplicações web na prática (PortSwigger)', minutes: 30, objectives: ['Explorar as falhas web mais comuns em labs legais', 'Usar o Burp Suite'], topics: ['Burp Suite', 'laboratórios da PortSwigger', 'SQLi/XSS/CSRF na prática guiada', 'autenticação quebrada', 'IDOR'] },
    { id: 'pt-4', realmId: 'pentest', title: 'Acesso a servidores: SSH, serviços e escalonamento', minutes: 30, objectives: ['Entender como se ganha acesso a uma máquina', 'Escalar privilégios em lab'], topics: ['OverTheWire Bandit', 'serviços expostos', 'credenciais fracas', 'escalonamento de privilégio (conceito)', 'por que patch e hardening importam'], interview: ['O que é escalonamento de privilégio e como se defende?'] },
    { id: 'pt-5', realmId: 'pentest', title: 'Relatório de pentest: a parte que vale dinheiro', minutes: 20, objectives: ['Documentar achados de forma útil', 'Priorizar por risco', 'Recomendar correções'], topics: ['estrutura do relatório', 'severidade (CVSS)', 'prova de conceito', 'recomendações acionáveis', 'comunicação com o cliente'] },
    { id: 'pt-6', realmId: 'pentest', title: 'Boss: resolva uma máquina de ponta a ponta', minutes: 30, boss: true, objectives: ['Recon → exploração → documentação num lab legal'], topics: ['tudo do reino'] },
  ],
};

export const carreira: Realm = {
  id: 'carreira',
  title: 'Carreira & Entrevistas',
  emoji: '🎯',
  color: 'yellow',
  tagline: 'Transformar conhecimento em oportunidade',
  why: 'Saber muito não basta: você precisa saber mostrar. Este reino te prepara para destravar em entrevistas, negociar e se destacar, usando os seus projetos como prova.',
  lessons: [
    { id: 'car-1', realmId: 'carreira', title: 'Contando a história dos seus projetos (método STAR)', minutes: 20, objectives: ['Estruturar respostas com STAR', 'Transformar projeto em narrativa'], topics: ['STAR', 'problema-solução-resultado', 'falar de decisões técnicas', 'o que aprendi'], interview: ['Me conte sobre um projeto desafiador que você fez.'] },
    { id: 'car-2', realmId: 'carreira', title: 'Perguntas técnicas: como pensar em voz alta', minutes: 25, objectives: ['Raciocinar na frente do entrevistador', 'Não travar'], topics: ['pensar alto', 'pedir esclarecimento', 'começar simples', 'o que fazer quando não sabe'], interview: ['Como você implementaria um encurtador de URL?'] },
    { id: 'car-3', realmId: 'carreira', title: 'System design para iniciantes', minutes: 25, objectives: ['Abordar um problema de design', 'Falar de trade-offs'], topics: ['requisitos', 'estimativas', 'componentes', 'banco e cache', 'gargalos', 'trade-offs'], interview: ['Como você projetaria o backend de um app como o seu FinanceFlow para 1 milhão de usuários?'] },
    { id: 'car-4', realmId: 'carreira', title: 'Comportamental: fit cultural e pontos fracos', minutes: 20, objectives: ['Responder perguntas de comportamento', 'Falar de fraquezas sem se queimar'], topics: ['trabalho em equipe', 'conflito', 'ponto fraco', 'por que essa empresa', 'perguntas para o entrevistador'], interview: ['Qual seu maior ponto fraco?', 'Conte sobre um conflito num projeto.'] },
    { id: 'car-5', realmId: 'carreira', title: 'Entrevista técnica em inglês', minutes: 25, objectives: ['Dominar o vocabulário técnico em inglês', 'Responder com confiança'], topics: ['vocabulário técnico', 'frases prontas', 'ganhar tempo', 'small talk', 'descrever código em inglês'], refs: [{ project: 'speak-ai', path: 'src/languages/en.js', hint: 'Seu próprio app de inglês! Use o modo Entrevista em inglês para praticar.' }] },
    { id: 'car-6', realmId: 'carreira', title: 'Currículo, portfólio e GitHub que impressionam', minutes: 20, objectives: ['Montar um perfil forte', 'Destacar seus projetos'], topics: ['currículo enxuto', 'README de projeto', 'perfil do GitHub', 'o que recrutadores olham'] },
    { id: 'car-7', realmId: 'carreira', title: 'Boss: simulação de entrevista completa', minutes: 30, boss: true, objectives: ['Técnica + design + comportamental numa sessão só'], topics: ['tudo do reino'] },
  ],
};
