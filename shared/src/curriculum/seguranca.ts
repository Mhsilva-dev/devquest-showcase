import type { Realm } from '../types.js';

export const seguranca: Realm = {
  id: 'sec',
  title: 'Cibersegurança',
  emoji: '🛡️',
  color: 'red',
  tagline: 'Pensar como atacante para construir como defensor',
  why: 'A maioria dos devs não sabe proteger o que constrói. Quem domina segurança vira referência no time, passa nas perguntas difíceis de entrevista e pode seguir carreira em AppSec/Pentest, uma das áreas mais bem pagas.',
  lessons: [
    {
      id: 'sec-1',
      realmId: 'sec',
      title: 'Mentalidade hacker: CIA, superfície de ataque e modelagem de ameaças',
      minutes: 20,
      objectives: ['Entender a tríade CIA', 'Mapear a superfície de ataque de um sistema', 'Fazer uma modelagem de ameaças simples (STRIDE)'],
      topics: ['confidencialidade, integridade, disponibilidade', 'superfície de ataque', 'STRIDE', 'defesa em profundidade', 'princípio do menor privilégio'],
      refs: [{ project: 'financeflow', path: 'src/middleware/auth.js', hint: 'Veja o comentário: "um usuário nunca enxerga o que pertence a outro". Isso é confidencialidade garantida por código.' }],
      interview: ['O que é defesa em profundidade? Dê um exemplo de um projeto seu.', 'Como você começaria a avaliar a segurança de uma aplicação nova?'],
      content: {
        hook: 'Seu FinanceFlow guarda o extrato bancário de pessoas reais. Se um atacante tivesse **uma hora** com acesso à internet e à URL, **o que ele tentaria primeiro?**\n\nSe você não sabe responder, alguém mal-intencionado sabe. Esta aula muda isso.',
        concept: `## A tríade CIA: o que estamos protegendo
| Letra | Significa | Ataque típico | Defesa no seu código |
|---|---|---|---|
| **C**onfidencialidade | Só quem pode, vê | Ver dados de outro usuário (IDOR) | Filtrar tudo por \`req.uid\` (FinanceFlow) |
| **I**ntegridade | Ninguém altera sem permissão | Adulterar dados, CSRF | AES-GCM com tag de autenticação (Trading Bot) |
| **D**isponibilidade | O sistema continua no ar | DDoS, força bruta | \`express-rate-limit\` (Speak AI) |

## Superfície de ataque
Tudo que um atacante pode tocar: **rotas da API, formulários, uploads, cookies, headers, portas abertas no servidor, dependências npm, e até você** (phishing).

> Quanto menor a superfície, menor o risco. Rota que não existe não pode ser atacada.

## STRIDE: checklist de ameaças da Microsoft
- **S**poofing: fingir ser outro (roubo de sessão)
- **T**ampering: adulterar dados
- **R**epudiation: negar que fez algo (por isso existem logs)
- **I**nformation disclosure: vazar dados (stack trace na tela, .env exposto)
- **D**enial of service: derrubar o sistema
- **E**levation of privilege: virar admin sem ser

## Defesa em profundidade
Nunca confie em **uma** barreira só. Seu Trading Bot já faz isso: o token CSRF é a primeira barreira e o cookie \`SameSite=strict\` é a **segunda**. Se uma falhar, a outra segura.

## Menor privilégio
Cada parte do sistema com **o mínimo** de permissão. Por isso o banco do DevQuest tem um usuário \`devquest\` próprio, e não o superusuário.`,
        analogy: 'Pense num banco físico: tem porta com trava (autenticação), crachá que só abre certas salas (autorização), cofre dentro de outra sala (defesa em profundidade), câmeras (logs) e o caixa só tem a chave da gaveta dele (menor privilégio).',
        memoryHook: '**CIA** protege, **STRIDE** ataca. Defesa em camadas, como uma cebola 🧅.',
        practice: {
          prompt: 'Faça uma mini modelagem de ameaças do **FinanceFlow**: liste 5 pontos da superfície de ataque, associe cada um a uma letra do STRIDE e escreva uma defesa para cada.',
          checklist: ['Listou 5 pontos reais (login, upload de extrato, API, cookies, servidor…)', 'Associou corretamente ao STRIDE', 'Propôs defesas concretas', 'Pensou em mais de uma camada de defesa'],
        },
        feynman: 'Explique a tríade CIA e defesa em profundidade para alguém que acha que "só ter senha já é seguro".',
        cards: [
          { front: 'O que significa CIA em segurança?', back: 'Confidencialidade, Integridade e Disponibilidade.' },
          { front: 'O que é superfície de ataque?', back: 'Todos os pontos que um atacante pode tocar: rotas, formulários, uploads, portas, dependências, pessoas.' },
          { front: 'STRIDE significa…', back: 'Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.' },
          { front: 'Exemplo de defesa em profundidade no Trading Bot', back: 'Token CSRF no header + cookie SameSite=strict: duas barreiras independentes.' },
          { front: 'Princípio do menor privilégio', back: 'Cada usuário/processo tem somente as permissões mínimas necessárias.' },
        ],
        quiz: [
          { q: 'Um usuário consegue ver o extrato de outro mudando o ID na URL. Qual pilar da CIA foi violado?', options: ['Disponibilidade', 'Confidencialidade', 'Integridade', 'Nenhum'], answer: 1, explain: 'Dados vistos por quem não deveria = quebra de confidencialidade (é um IDOR).' },
          { q: 'Rate limit no login protege principalmente contra…', options: ['XSS', 'Força bruta / negação de serviço', 'SQL Injection', 'CSRF'], answer: 1, explain: 'Limitar tentativas impede adivinhar senhas em massa e reduz abuso.' },
          { q: 'Mostrar o stack trace do erro para o usuário é qual ameaça STRIDE?', options: ['Spoofing', 'Information disclosure', 'Repudiation', 'Tampering'], answer: 1, explain: 'Stack trace revela caminhos, versões e lógica interna para o atacante.' },
        ],
      },
    },
    {
      id: 'sec-2',
      realmId: 'sec',
      title: 'Senhas: hash, salt e por que bcrypt',
      minutes: 20,
      objectives: ['Diferenciar hash, criptografia e encoding', 'Entender salt e rainbow tables', 'Saber por que bcrypt/argon2 são lentos de propósito'],
      topics: ['função hash', 'MD5/SHA vs bcrypt', 'salt', 'rainbow tables', 'custo/work factor', 'argon2', 'nunca guardar senha em texto'],
      refs: [{ project: 'speak-ai', path: 'src/services/auth.service.js', hint: 'Procure onde a senha é transformada em hash no cadastro e comparada no login.' }],
      interview: ['Como você armazenaria senhas de usuários?', 'Por que não usar SHA-256 para senhas?'],
      content: {
        hook: 'Em 2012, o LinkedIn vazou **6,5 milhões** de senhas. Estavam em SHA-1, **sem salt**. Em poucos dias, 90% foram quebradas.\n\nVocê usa bcrypt nos seus projetos. Mas **sabe por quê**?',
        concept: `## Três coisas que todo mundo confunde
| | Reversível? | Para quê | Exemplo |
|---|---|---|---|
| **Encoding** | Sim, sem chave | Transportar dados | Base64 |
| **Criptografia** | Sim, **com chave** | Esconder e recuperar depois | AES-GCM do vault do Trading Bot |
| **Hash** | **Não** | Verificar sem guardar o original | bcrypt de senhas |

> Senha **nunca** é criptografada. É **hasheada**. Você não precisa saber a senha do usuário, só conferir se ele digitou a mesma.

## Como o login funciona
1. Cadastro: \`hash = bcrypt(senha)\` → salva só o hash
2. Login: \`bcrypt.compare(senhaDigitada, hashSalvo)\` → true/false

## Salt: por que dois usuários com "123456" têm hashes diferentes
Sem salt, o atacante pré-calcula o hash de milhões de senhas comuns (**rainbow table**) e só compara. O **salt** é um valor aleatório misturado em cada senha, o que torna a tabela inútil. O bcrypt já gera e guarda o salt **dentro** do próprio hash:
\`\`\`
$2b$12$KIXQJ5f1v9a8...   ← $versão$custo$salt+hash
\`\`\`

## Lento de propósito
SHA-256 é **rápido demais**: uma GPU testa **bilhões** por segundo. bcrypt tem um **custo** (ex.: 12) que faz cada tentativa levar ~250 ms. Para o usuário isso não é nada. Para quem quer testar 1 bilhão de senhas, são **8 anos**.

**Hoje:** bcrypt (custo ≥ 12) ou **argon2id** (o mais recomendado pela OWASP).`,
        analogy: 'Hash é como moer carne: dá para conferir se dois pedaços viraram a mesma carne moída, mas impossível remontar o bife. O salt é um tempero secreto diferente para cada pessoa, então a carne moída de duas pessoas nunca fica igual.',
        memoryHook: 'Senha se **moe** (hash), não se **tranca** (criptografia). Sal em cada prato, fogo lento.',
        example: {
          lang: 'ts',
          code: `import bcrypt from 'bcryptjs';

// Cadastro
const hash = await bcrypt.hash(senha, 12); // 12 = custo (2^12 rodadas)
await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hash]);

// Login
const ok = await bcrypt.compare(senhaDigitada, user.password_hash);
if (!ok) return res.status(401).json({ error: 'E-mail ou senha inválidos' }); // mensagem genérica!`,
          explanation: 'Repare na mensagem genérica no login: dizer "senha errada" confirma ao atacante que o e-mail existe (enumeração de usuários).',
        },
        practice: {
          prompt: 'Escreva (em TypeScript ou pseudocódigo) uma função de cadastro e uma de login seguras. Depois responda: o que um atacante consegue fazer se roubar seu banco inteiro de hashes bcrypt?',
          checklist: ['Usa bcrypt/argon2 com custo adequado', 'Nunca salva a senha original', 'Mensagem de erro genérica no login', 'Explica que o atacante precisaria de força bruta lenta por senha', 'Menciona salt'],
        },
        feynman: 'Explique a diferença entre hash e criptografia, e por que senhas usam hash lento com salt.',
        cards: [
          { front: 'Hash é reversível?', back: 'Não. É uma função de mão única: dá para verificar, mas não recuperar o original.' },
          { front: 'Para que serve o salt?', back: 'Valor aleatório por senha que torna hashes únicos e inutiliza rainbow tables.' },
          { front: 'Por que não usar SHA-256 para senhas?', back: 'É rápido demais: GPUs testam bilhões por segundo. Senhas precisam de hash lento (bcrypt/argon2).' },
          { front: 'Formato de um hash bcrypt', back: '$2b$<custo>$<salt de 22 chars><hash>: o salt fica dentro do próprio hash.' },
          { front: 'Algoritmo de senha mais recomendado pela OWASP hoje', back: 'argon2id (bcrypt com custo ≥ 10–12 ainda é aceitável).' },
        ],
        quiz: [
          { q: 'Qual destas é REVERSÍVEL com uma chave?', options: ['bcrypt', 'SHA-256', 'AES', 'argon2'], answer: 2, explain: 'AES é criptografia simétrica: com a chave você recupera o dado.' },
          { q: 'Base64 protege uma senha?', options: ['Sim, é criptografia', 'Não, é só encoding, qualquer um decodifica', 'Sim, se tiver salt', 'Só em HTTPS'], answer: 1, explain: 'Base64 é encoding: reversível por qualquer pessoa, sem chave.' },
          { q: 'Login retorna "este e-mail não existe". Qual o problema?', options: ['Nenhum', 'Enumeração de usuários', 'XSS', 'CSRF'], answer: 1, explain: 'O atacante descobre quais e-mails estão cadastrados e foca neles.' },
        ],
      },
    },
    {
      id: 'sec-3',
      realmId: 'sec',
      title: 'Injeção de SQL: entender e prevenir',
      minutes: 20,
      objectives: ['Entender por que misturar código e dados é perigoso', 'Usar sempre queries parametrizadas', 'Aplicar menor privilégio no banco'],
      topics: ['concatenação de strings em SQL', 'queries parametrizadas ($1, ?)', 'ORMs e query builders', 'validação de entrada', 'usuário de banco com menor privilégio'],
      refs: [{ project: 'speak-ai', path: 'src/db/pool.js', hint: 'query(text, params): o texto e os parâmetros viajam separados até o Postgres. É isso que previne a injeção.' }],
      interview: ['O que é SQL Injection e como você previne?', 'ORM previne 100% de injeção?'],
    },
    {
      id: 'sec-4',
      realmId: 'sec',
      title: 'XSS: quando o navegador executa o que não devia',
      minutes: 20,
      objectives: ['Entender os tipos de XSS', 'Escapar saída corretamente', 'Usar CSP como segunda barreira'],
      topics: ['XSS armazenado, refletido e DOM', 'escape de saída', 'React e dangerouslySetInnerHTML', 'Content-Security-Policy', 'cookies httpOnly'],
      interview: ['Como o React ajuda a prevenir XSS? Onde ele não ajuda?'],
    },
    {
      id: 'sec-5',
      realmId: 'sec',
      title: 'Controle de acesso quebrado e IDOR',
      minutes: 20,
      objectives: ['Diferenciar autenticação de autorização', 'Garantir que cada consulta filtre pelo dono', 'Proteger rotas de admin'],
      topics: ['autenticação vs autorização', 'IDOR', 'filtrar por usuário em toda query', 'checagem de papel no servidor', 'OWASP A01'],
      refs: [{ project: 'financeflow', path: 'src/middleware/auth.js', hint: 'exigirAdmin consulta o banco a cada requisição para o papel valer na hora.' }],
      interview: ['Qual a diferença entre autenticação e autorização?'],
    },
    {
      id: 'sec-6',
      realmId: 'sec',
      title: 'Sessões, cookies e JWT',
      minutes: 25,
      objectives: ['Comparar sessão no servidor e JWT', 'Configurar cookies com segurança', 'Revogar sessões'],
      topics: ['sessão server-side', 'JWT: estrutura e assinatura', 'httpOnly, secure, sameSite', 'revogação e versão de sessão', 'onde guardar o token no front'],
      refs: [
        { project: 'speak-ai', path: 'src/middleware/auth.js', hint: 'Cookie httpOnly + sameSite lax + versão de sessão (sv) para invalidar tokens antigos.' },
        { project: 'trading-bot', path: 'src/server/sessionStore.js', hint: 'Sessão guardada no servidor: compare com o JWT do Speak AI.' },
      ],
      interview: ['JWT ou sessão? Quando usar cada um?', 'Como invalidar um JWT antes de expirar?'],
    },
    {
      id: 'sec-7',
      realmId: 'sec',
      title: 'CSRF e a política de mesma origem',
      minutes: 20,
      objectives: ['Entender como o navegador envia cookies', 'Proteger com token CSRF e SameSite', 'Configurar CORS sem abrir demais'],
      topics: ['same-origin policy', 'CSRF', 'token CSRF', 'SameSite', 'CORS', 'comparação em tempo constante'],
      refs: [{ project: 'trading-bot', path: 'src/server/security.js', hint: 'csrfProtection usa crypto.timingSafeEqual. Descubra por que comparar com === seria um risco.' }],
      interview: ['O que é CORS? Ele protege o servidor?'],
    },
    {
      id: 'sec-8',
      realmId: 'sec',
      title: 'Criptografia na prática: AES-GCM, chaves e TLS',
      minutes: 25,
      objectives: ['Diferenciar simétrica e assimétrica', 'Entender IV, tag e AAD', 'Saber como o HTTPS funciona'],
      topics: ['AES-256-GCM', 'IV/nonce', 'tag de autenticação', 'AAD', 'RSA e curvas elípticas', 'handshake TLS', 'gestão de chaves'],
      refs: [{ project: 'trading-bot', path: 'src/security/vault.js', hint: 'Seu cofre de credenciais: IV aleatório, tag GCM e AAD amarrando o segredo ao dono.' }],
      interview: ['Como você guardaria uma chave de API de terceiros no banco?'],
    },
    {
      id: 'sec-9',
      realmId: 'sec',
      title: 'Segredos, .env e dependências',
      minutes: 15,
      objectives: ['Nunca vazar segredos no Git', 'Rotacionar chaves', 'Auditar dependências'],
      topics: ['.env e .gitignore', 'segredo vazado no histórico', 'rotação de chaves', 'npm audit', 'supply chain', 'lockfile'],
      interview: ['Você commitou uma chave de API por engano. O que faz?'],
    },
    {
      id: 'sec-10',
      realmId: 'sec',
      title: 'Headers de segurança, rate limit e validação',
      minutes: 20,
      objectives: ['Configurar helmet e CSP', 'Limitar abuso', 'Validar toda entrada com zod'],
      topics: ['helmet', 'HSTS', 'CSP', 'X-Frame-Options', 'express-rate-limit', 'validação com zod', 'upload seguro'],
      refs: [{ project: 'trading-bot', path: 'src/server/security.js', hint: 'validate() com zod e csvCell() contra injeção de fórmula em planilhas.' }],
    },
    {
      id: 'sec-11',
      realmId: 'sec',
      title: 'Blindando seu servidor Linux',
      minutes: 25,
      objectives: ['Proteger o SSH', 'Configurar firewall', 'Manter o sistema atualizado'],
      topics: ['SSH com chave e sem senha', 'ufw', 'fail2ban', 'atualizações automáticas', 'portas expostas', 'usuários sem root'],
      interview: ['Quais os primeiros passos para proteger uma VPS nova?'],
    },
    {
      id: 'sec-12',
      realmId: 'sec',
      title: 'Redes para quem programa: TCP/IP, DNS e HTTP',
      minutes: 25,
      objectives: ['Entender o caminho de uma requisição', 'Saber o papel do DNS e das portas', 'Ler uma requisição HTTP crua'],
      topics: ['modelo TCP/IP', 'IP e portas', 'DNS', 'HTTP/1.1 e HTTP/2', 'proxy reverso', 'o que acontece quando você digita uma URL'],
      interview: ['O que acontece quando você digita uma URL no navegador?'],
    },
    {
      id: 'sec-13',
      realmId: 'sec',
      title: 'OWASP Top 10: o mapa completo',
      minutes: 25,
      objectives: ['Conhecer as 10 categorias', 'Relacionar cada uma a uma defesa', 'Revisar seus projetos com essa lista'],
      topics: ['A01 a A10', 'SSRF', 'falhas de log e monitoramento', 'design inseguro', 'componentes vulneráveis'],
      interview: ['Cite 3 itens do OWASP Top 10 e como você se protege.'],
    },
    {
      id: 'sec-14',
      realmId: 'sec',
      title: 'Logs, monitoramento e resposta a incidentes',
      minutes: 20,
      objectives: ['Registrar o que importa sem vazar dados', 'Detectar comportamento estranho', 'Ter um plano para quando algo der errado'],
      topics: ['logs estruturados', 'o que nunca logar', 'alertas', 'plano de incidente', 'backups e restauração'],
      refs: [{ project: 'trading-bot', path: 'src/monitoring/logger.js', hint: 'Como o bot registra eventos.' }],
    },
    {
      id: 'sec-16',
      realmId: 'sec',
      title: 'Como senhas são quebradas (e como blindar as suas)',
      minutes: 25,
      objectives: ['Entender dicionário, força bruta, máscara e rainbow tables', 'Saber por que hash lento + salt atrapalha o atacante', 'Criar senhas e políticas que não caem'],
      topics: ['ataque de dicionário', 'força bruta e máscara', 'rainbow tables', 'hashcat e John the Ripper (o que fazem)', 'por que senha longa vence complexidade', 'gerenciador de senhas', '2FA', 'por que bcrypt/argon2 freiam o ataque'],
      refs: [{ project: 'speak-ai', path: 'src/services/auth.service.js', hint: 'O hash de senha que você usa é justamente a defesa contra os ataques desta aula.' }],
      interview: ['Por que uma senha longa e simples costuma ser mais forte que uma curta e complexa?', 'Como um vazamento de hashes é explorado e como você reduz o dano?'],
    },
    {
      id: 'sec-17',
      realmId: 'sec',
      title: 'Segurança de WiFi: WPA2, WPA3 e por que redes caem',
      minutes: 25,
      objectives: ['Entender como o WPA2/WPA3 protege a rede', 'Saber por que senhas fracas de WiFi são quebradas offline', 'Configurar sua rede para não cair'],
      topics: ['WPA2 vs WPA3', 'o handshake de 4 vias (conceito)', 'ataque offline a partir do handshake capturado', 'por que a frase-senha longa é decisiva', 'WPS é perigoso', 'rede de convidados e isolamento', 'bom roteador = firmware atualizado'],
      interview: ['Por que WPA3 é mais resistente a ataque offline que WPA2?', 'O que você muda num roteador para deixá-lo seguro?'],
    },
    {
      id: 'sec-15',
      realmId: 'sec',
      title: 'Carreira em segurança: AppSec, ética e certificações',
      minutes: 15,
      objectives: ['Conhecer as áreas de segurança', 'Entender os limites legais e éticos', 'Montar um plano de estudo'],
      topics: ['AppSec, pentest, blue team', 'só testar com autorização', 'bug bounty', 'CTFs e laboratórios legais', 'certificações (Security+, eJPT, OSCP)'],
    },
  ],
};
