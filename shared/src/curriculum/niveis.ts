import type { Lesson } from '../types.js';
import { level } from '../levels.js';

// Níveis 2 (Avançado) e 3 (Expert) da trilha de programação.
// Cada nível de um reino libera quando você termina o nível anterior DO MESMO reino (ver prerequisiteOf).

export const devLevels: Record<string, Lesson[]> = {
  metodo: [
    ...level('metodo', 'metodo', 2, [
      ['Aprendizado baseado em projetos', 'escolher um projeto que puxa o estudo; just-in-time x just-in-case; escopo mínimo; terminar o que começa'],
      ['Lendo documentação e código dos outros', 'como navegar uma doc; ler código-fonte de libs; git blame e histórico; anotar enquanto lê'],
      ['Notas que viram conhecimento', 'segundo cérebro; notas atômicas; Zettelkasten; ligar ideias; revisar notas'],
      ['Prática deliberada para programadores', 'zona de desconforto; feedback rápido; katas; refazer o mesmo projeto melhor'],
      ['Foco profundo e energia', 'deep work; pomodoro; eliminar distrações; sono e exercício; ritmo sustentável'],
    ]),
    ...level('metodo', 'metodo', 3, [
      ['Aprender uma tecnologia nova em uma semana', 'roteiro de 7 dias; mapa do território; projeto-piloto; o que ignorar no começo'],
      ['Ensinar para aprender: escrever e mostrar', 'blog técnico; aprender em público; README que ensina; palestras curtas'],
      ['Metacognição: saber o que você não sabe', 'ilusão de competência; autoavaliação; mapear lacunas; plano de estudo trimestral'],
      ['Sistema anual de evolução', 'metas de carreira; revisão trimestral; portfólio como prova; evitar tutorial hell'],
    ]),
  ],
  js: [
    ...level('js', 'js', 2, [
      ['Event loop a fundo: microtasks, macrotasks e timers', 'call stack; fila de microtasks; setTimeout x setImmediate x process.nextTick; starvation'],
      ['Erros assíncronos e cancelamento', 'try/catch com await; unhandledRejection; AbortController; timeouts; Promise.allSettled e race'],
      ['Iteradores, geradores e async iterators', 'protocolo de iteração; function*; for await; streams como iteráveis'],
      ['Tipos avançados: mapped, conditional e template literal types', 'keyof; infer; tipos condicionais; template literal types; satisfies'],
      ['Narrowing e modelagem de domínio com tipos', 'discriminated unions; type guards; exhaustive check com never; branded types'],
      ['Zod e validação em runtime', 'schema como fonte da verdade; z.infer; parse x safeParse; validar fronteiras do sistema'],
    ]),
    ...level('js', 'js', 3, [
      ['Memória e garbage collector do V8', 'heap e stack; vazamento de memória; closures que prendem referências; heap snapshot'],
      ['Performance de JavaScript', 'hidden classes; JIT; medir com performance.now e --prof; evitar trabalho no loop'],
      ['Streams e backpressure no Node', 'Readable, Writable, Transform; pipeline; backpressure; processar arquivo grande'],
      ['Worker threads e concorrência', 'CPU-bound x I/O-bound; worker_threads; SharedArrayBuffer; quando usar fila'],
      ['Monorepo e publicação de pacotes TS', 'workspaces; tsconfig references; build de lib; exports no package.json; versionamento semântico'],
    ]),
  ],
  git: [
    ...level('git', 'git', 2, [
      ['Histórico limpo: rebase interativo e commits atômicos', 'squash; fixup; reword; commit atômico; mensagem de commit que explica o porquê'],
      ['Estratégias de branch', 'trunk-based; GitHub Flow; Git Flow; feature flags; branches de vida curta'],
      ['Investigando bugs com git bisect e blame', 'git bisect; git log -S e -G; blame ignorando formatação; achar quando o bug entrou'],
      ['Hooks e automação local', 'pre-commit; husky; lint-staged; commitlint; validar antes de subir'],
      ['Releases, tags e changelog', 'tags anotadas; semver; conventional commits; changelog automático; GitHub Releases'],
    ]),
    ...level('git', 'git', 3, [
      ['Git por dentro: objetos, refs e packfiles', 'blob, tree, commit; SHA; .git por dentro; refs e HEAD; gc'],
      ['CI/CD avançado no GitHub Actions', 'matrix; cache; ambientes e aprovação; deploy por tag; reusable workflows'],
      ['Segurança no repositório', 'segredos vazados e como remover do histórico; secret scanning; Dependabot; branch protection; commits assinados'],
      ['Open source: contribuindo de verdade', 'achar issues boas; fork e upstream; PR que é aceito; código de conduta; manter um projeto'],
    ]),
  ],
  backend: [
    ...level('backend', 'be', 2, [
      ['Autenticação e autorização robustas', 'sessão x JWT; refresh token; RBAC; OAuth2 e OpenID Connect; logout de verdade'],
      ['Cache: quando, onde e como invalidar', 'cache em memória; Redis; HTTP cache e ETag; cache-aside; invalidação; stampede'],
      ['Filas e processamento assíncrono', 'BullMQ; retry com backoff; idempotência; dead letter queue; jobs agendados'],
      ['Upload, arquivos e storage', 'multipart; limites; S3 e URLs assinadas; validar tipo real do arquivo; processamento em background'],
      ['Paginação, filtros e busca', 'offset x cursor; ordenação estável; filtros seguros; busca full-text no Postgres'],
      ['Documentação de API e contratos', 'OpenAPI; gerar tipos do schema; versionamento de API; mudanças compatíveis'],
    ]),
    ...level('backend', 'be', 3, [
      ['Resiliência: timeouts, retries e circuit breaker', 'timeout em toda chamada externa; retry com jitter; circuit breaker; degradação graciosa'],
      ['Idempotência e consistência em sistemas distribuídos', 'chave de idempotência; exactly-once é mito; outbox pattern; sagas'],
      ['Rate limiting e proteção contra abuso', 'token bucket; limite por usuário e IP; proteção de login; custo por requisição'],
      ['Performance de API em produção', 'profiling; N+1; connection pool; compressão; medir p95 e p99'],
      ['GraphQL, gRPC e quando sair do REST', 'GraphQL e DataLoader; gRPC e protobuf; tRPC; trade-offs de cada um'],
    ]),
  ],
  db: [
    ...level('db', 'db', 2, [
      ['SQL avançado: CTEs e window functions', 'WITH; CTE recursiva; ROW_NUMBER; RANK; LAG/LEAD; somas acumuladas'],
      ['EXPLAIN ANALYZE: lendo o plano de execução', 'seq scan x index scan; custo; rows estimadas x reais; ajustar a query'],
      ['Índices avançados', 'índice composto e ordem das colunas; índice parcial; índice de expressão; GIN para JSONB; covering index'],
      ['JSONB e dados semiestruturados no Postgres', 'quando usar JSONB; operadores; índices GIN; não virar NoSQL dentro do SQL'],
      ['ORMs e query builders sem sofrimento', 'Prisma, Drizzle, Knex; N+1 de ORM; quando escrever SQL puro; migrations geradas'],
    ]),
    ...level('db', 'db', 3, [
      ['Níveis de isolamento e locks', 'read committed; repeatable read; serializable; deadlock; SELECT FOR UPDATE; advisory locks'],
      ['Replicação, réplicas de leitura e alta disponibilidade', 'replicação streaming; lag; failover; leitura em réplica; backup PITR'],
      ['Particionamento e dados em grande volume', 'particionamento por data; arquivamento; VACUUM e bloat; tabelas com milhões de linhas'],
      ['Redis e bancos especializados', 'estruturas do Redis; pub/sub; time-series; busca (Elastic/Meilisearch); vetoriais (pgvector)'],
      ['Migrações sem downtime', 'expand and contract; adicionar coluna sem travar; backfill em lotes; rollback seguro'],
    ]),
  ],
  sec: [
    ...level('sec', 'sec', 2, [
      ['OWASP Top 10 na prática: defesa em cada item', 'controle de acesso quebrado; falhas criptográficas; injeção; design inseguro; configuração errada'],
      ['Segurança de sessões, cookies e CSRF', 'HttpOnly, Secure, SameSite; tokens anti-CSRF; fixação de sessão; expiração'],
      ['Content Security Policy e cabeçalhos de segurança', 'CSP com nonce; HSTS; X-Frame-Options; Permissions-Policy; testar headers'],
      ['SSRF e validação de URLs no servidor', 'o que é SSRF; bloquear IPs internos; redirecionamentos; allowlist de domínios'],
      ['Segredos e gestão de chaves', '.env e cofres de segredos; rotação de chaves; mínimo privilégio; vazamento em logs'],
      ['Dependências e cadeia de suprimentos', 'npm audit; lockfile; pacotes maliciosos e typosquatting; SBOM; atualizar com segurança'],
    ]),
    ...level('sec', 'sec', 3, [
      ['Modelagem de ameaças', 'STRIDE; diagrama de fluxo de dados; superfícies de ataque; priorizar riscos'],
      ['Criptografia aplicada sem se enrolar', 'hash x criptografia x assinatura; AES-GCM; chaves assimétricas; TLS; não inventar cripto'],
      ['Logs de segurança, detecção e resposta a incidentes', 'o que logar; alertas; fail2ban; plano de resposta; post-mortem'],
      ['Code review de segurança', 'checklist de revisão; SAST e DAST; revisar autenticação e autorização; testes de segurança automatizados'],
      ['LGPD para desenvolvedores', 'dados pessoais e sensíveis; base legal; minimização; direito de exclusão; incidente e comunicação à ANPD'],
    ]),
  ],
  front: [
    ...level('front', 'fe', 2, [
      ['Formulários robustos', 'controlados x não controlados; React Hook Form; validação com Zod; acessibilidade de formulários'],
      ['Buscando dados: TanStack Query', 'cache de servidor; stale-while-revalidate; mutations; invalidação; estados de loading e erro'],
      ['Roteamento e layouts', 'rotas aninhadas; loaders; rotas protegidas; code splitting por rota'],
      ['Acessibilidade (a11y) na prática', 'HTML semântico; foco e teclado; ARIA na medida; contraste; testar com leitor de tela'],
      ['Testes de frontend', 'Testing Library; testar comportamento, não implementação; mocks de API com MSW; testes E2E com Playwright'],
      ['Design system com Tailwind', 'tokens; componentes reutilizáveis; variantes; tema escuro; consistência visual'],
    ]),
    ...level('front', 'fe', 3, [
      ['Renderização: CSR, SSR, SSG e Server Components', 'quando usar cada um; hidratação; Next.js App Router; streaming'],
      ['Web Vitals e performance real', 'LCP, INP, CLS; bundle analyzer; imagens; fontes; medir em produção'],
      ['Estado complexo: máquinas de estado e reducers', 'useReducer; estados impossíveis; XState; modelar fluxos'],
      ['PWA e offline', 'service worker; cache de assets; manifest; instalar no celular; sincronização em background'],
      ['Arquitetura de frontend grande', 'organização por feature; limites entre módulos; monorepo; micro-frontends e quando não usar'],
    ]),
  ],
  rt: [
    ...level('rt', 'rt', 2, [
      ['Escalando WebSockets', 'sticky sessions; vários servidores; Redis pub/sub; heartbeat e reconexão'],
      ['Presença, salas e chat em tempo real', 'salas; quem está online; digitando…; histórico; ordem das mensagens'],
      ['Autenticação e segurança em conexões em tempo real', 'autenticar no handshake; autorização por sala; limites; validar mensagens'],
      ['Streaming de respostas de IA', 'SSE com fetch; streaming do modelo para o navegador; cancelamento; UX de texto chegando'],
    ]),
    ...level('rt', 'rt', 3, [
      ['Colaboração em tempo real: CRDTs e OT', 'edição simultânea; conflitos; CRDT; Yjs; offline-first'],
      ['WebRTC: áudio, vídeo e P2P', 'peer connection; STUN e TURN; sinalização; quando usar SFU'],
      ['Arquitetura orientada a eventos', 'eventos x comandos; Kafka e NATS; consumidores; reprocessamento; ordem e duplicidade'],
      ['Observando sistemas em tempo real', 'métricas de conexões; latência; vazamento de sockets; testes de carga com k6'],
    ]),
  ],
  ia: [
    ...level('ia', 'ia', 2, [
      ['Embeddings e busca semântica', 'o que é um embedding; similaridade de cosseno; pgvector; busca híbrida'],
      ['RAG de produção', 'chunking; re-ranking; citações; avaliar se a resposta veio do documento; atualização da base'],
      ['Avaliação de IA (evals)', 'conjunto de testes; LLM como juiz; métricas; regressão ao trocar modelo ou prompt'],
      ['Custos, latência e cache de prompts', 'tokens; escolher modelo por tarefa; cache de prompt; streaming; limites por usuário'],
      ['Function calling avançado e MCP', 'ferramentas bem descritas; validação dos argumentos; Model Context Protocol; servidores MCP'],
    ]),
    ...level('ia', 'ia', 3, [
      ['Agentes confiáveis', 'loop de agente; planejamento; memória; limites de passos; humano no meio; quando não usar agente'],
      ['Segurança de aplicações com IA', 'prompt injection; dados não confiáveis no contexto; vazamento de dados; permissões das ferramentas'],
      ['Multimodal: imagem, áudio e documentos', 'visão; transcrição; voz em tempo real; extrair dados de PDF; custos'],
      ['Fine-tuning x prompt x RAG: decidindo', 'quando ajustar modelo; dados de treino; modelos locais; trade-offs'],
      ['Produto com IA: UX e confiança', 'expectativa do usuário; mostrar incerteza; feedback; fallback quando a IA falha'],
    ]),
  ],
  eng: [
    ...level('eng', 'eng', 2, [
      ['Testes que dão confiança', 'pirâmide de testes; testes de integração com banco real; fixtures; testes que não quebram à toa'],
      ['Domain-Driven Design essencial', 'linguagem ubíqua; entidades e value objects; agregados; bounded contexts'],
      ['Arquitetura hexagonal e limpa', 'portas e adaptadores; inversão de dependência; regras de negócio isoladas; quando é exagero'],
      ['Tratamento de erros como design', 'erros esperados x inesperados; Result type; mensagens úteis; não engolir exceção'],
      ['Estruturas de dados que resolvem problemas reais', 'hash map; set; fila e pilha; heap; árvore; grafo; escolher pela operação'],
    ]),
    ...level('eng', 'eng', 3, [
      ['System design: projetando sistemas grandes', 'requisitos; estimativa de carga; gargalos; cache; filas; banco; trade-offs'],
      ['Sistemas distribuídos: o que pode dar errado', 'teorema CAP; consistência eventual; relógios; falhas parciais; as falácias da computação distribuída'],
      ['Documentação de decisões (ADR) e RFCs', 'architecture decision records; escrever proposta técnica; alinhar com o time'],
      ['Código legado: mudando sem quebrar', 'testes de caracterização; strangler fig; refatoração segura em passos pequenos'],
      ['Algoritmos para entrevistas e para a vida', 'dois ponteiros; janela deslizante; BFS e DFS; programação dinâmica básica; busca binária'],
    ]),
  ],
  devops: [
    ...level('devops', 'ops', 2, [
      ['Docker Compose e ambientes completos', 'compose com app + banco + redis; volumes; redes; healthcheck; dev igual a produção'],
      ['Dockerfile de produção', 'multi-stage build; imagem pequena; usuário não-root; cache de camadas; .dockerignore'],
      ['Deploy sem downtime', 'blue-green; rolling; health checks; migrations no deploy; rollback rápido'],
      ['Backups e recuperação de desastre', 'regra 3-2-1; backup automatizado; testar restauração; RPO e RTO'],
      ['Hardening de servidor Linux', 'SSH por chave; firewall (ufw); fail2ban; atualizações automáticas; mínimo de serviços expostos'],
    ]),
    ...level('devops', 'ops', 3, [
      ['Infraestrutura como código', 'Terraform; estado; módulos; ambientes; revisar infra por PR'],
      ['Kubernetes: o essencial', 'pods, deployments, services; ingress; config e secrets; quando NÃO usar Kubernetes'],
      ['Observabilidade completa: OpenTelemetry', 'logs estruturados; métricas; tracing distribuído; Grafana e Prometheus; SLOs'],
      ['Cloud: AWS e afins sem susto na fatura', 'serviços principais; IAM; custos e alertas de billing; serverless; CDN'],
      ['Plantão e resposta a incidentes', 'alertas acionáveis; runbooks; comunicação durante incidente; post-mortem sem culpa'],
    ]),
  ],
  pentest: [
    ...level('pentest', 'pt', 2, [
      ['Metodologias de teste: OWASP WSTG e PTES', 'fases de um pentest; checklist do WSTG; escopo e regras de engajamento; documentar evidências'],
      ['Burp Suite em laboratórios', 'proxy; repeater; intruder; analisar requisições; usar só em labs autorizados como PortSwigger Academy'],
      ['Falhas de lógica de negócio e controle de acesso', 'IDOR; escalonamento horizontal e vertical; fluxos pulados; como o desenvolvedor previne'],
      ['Autenticação fraca: o que testar e como corrigir', 'política de senha; força bruta e rate limit; recuperação de senha; MFA; JWT mal configurado'],
      ['Bug bounty: começando do jeito certo', 'escolher programas; ler o escopo; relatório reproduzível; duplicatas; ética e safe harbor'],
    ]),
    ...level('pentest', 'pt', 3, [
      ['Segurança de APIs (OWASP API Top 10)', 'BOLA; mass assignment; exposição excessiva de dados; testes em APIs de laboratório; correções'],
      ['Segurança de nuvem e containers', 'configurações erradas comuns; buckets públicos; IAM excessivo; imagens vulneráveis; ferramentas de auditoria'],
      ['Do achado ao relatório executivo', 'CVSS; impacto de negócio; recomendações priorizadas; reteste; comunicar para gestores'],
      ['Carreira em segurança: certificações e caminho', 'eJPT, OSCP, CompTIA Security+; red team x blue team x AppSec; portfólio com writeups de labs'],
    ]),
  ],
  carreira: [
    ...level('carreira', 'car', 2, [
      ['System design na entrevista', 'roteiro de 45 minutos; requisitos; desenho; aprofundar um componente; trade-offs falados em voz alta'],
      ['Live coding sem travar', 'entender o problema; começar simples; testar; comunicar; quando pedir dica'],
      ['Negociação de salário e oferta', 'pesquisar faixa; CLT x PJ; benefícios; contraproposta; não dizer o primeiro número'],
      ['Trabalho remoto e vagas internacionais', 'onde achar vagas; receber do exterior; fuso horário; comunicação assíncrona; inglês no dia a dia'],
      ['LinkedIn e marca pessoal', 'perfil que atrai recrutador; postar projetos; networking sem ser chato'],
    ]),
    ...level('carreira', 'car', 3, [
      ['De pleno a sênior: o que muda', 'autonomia; impacto além do código; mentoria; decisões técnicas; escrever bem'],
      ['Liderança técnica e staff engineer', 'tech lead; influência sem autoridade; alinhamento; dívida técnica como estratégia'],
      ['Freelance e produtos próprios', 'precificar projeto; contrato; escopo; transformar projeto em SaaS; cobrança recorrente'],
      ['Carreira de longo prazo', 'especialista x generalista; evitar burnout; aprender sempre; plano de 5 anos'],
    ]),
  ],
};
