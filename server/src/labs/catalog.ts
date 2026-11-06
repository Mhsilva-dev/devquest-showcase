import type { LabInfo } from '@devquest/shared';

// Catálogo dos laboratórios. Cada um conta uma história, dá o objetivo e mostra o código vulnerável.
// Você ataca o alvo FALSO para entender a falha e, no fim, aprende a corrigir (a parte que importa: defesa).
export const LABS: LabInfo[] = [
  {
    id: 'sql-injection',
    title: 'Burlar o login (SQL Injection)',
    owasp: 'A03:2021 — Injection',
    difficulty: 1,
    story: 'Uma loja montou o login concatenando o que você digita direto na query SQL. Você não sabe a senha de ninguém… mas isso vai importar?',
    goal: 'Entrar como "admin" SEM saber a senha dele. Preencha usuário e senha e observe a query que o servidor monta.',
    hints: [
      "No campo senha, pense no que acontece se você fechar a aspa e adicionar uma condição sempre verdadeira.",
      "O caractere -- começa um comentário em SQL: tudo depois dele é ignorado.",
      "Tente usuário: admin  e senha:  ' OR '1'='1",
      "Ou usuário:  admin'--   com qualquer senha (você comenta a checagem de senha).",
    ],
    vulnerableCode: `// ⚠️ NUNCA faça isto
const q = "SELECT * FROM users WHERE username = '" + user + "' AND password = '" + pass + "'";
db.prepare(q).all();`,
    fixPrompt: 'Explique por que essa query é vulnerável e reescreva o login de forma segura (query parametrizada). Cite também uma segunda camada de defesa.',
  },
  {
    id: 'idor',
    title: 'Ler dados de outro usuário (IDOR)',
    owasp: 'A01:2021 — Broken Access Control',
    difficulty: 1,
    story: 'Você está logado como "Ana" (id 1). O app busca notas por /notes/:id, mas esquece de checar se a nota é sua. O que será que tem na nota de id 2 ou 3?',
    goal: 'Ler a nota privada de OUTRO usuário trocando o id. Informe o noteId e veja o que vaza.',
    hints: [
      'Você é a Ana, id 1. Sua nota tem id 1.',
      'Troque o noteId para 2 (Bruno) ou 3 (admin).',
      'Repare: o servidor não verifica o dono — ele confia no id que você mandou.',
    ],
    vulnerableCode: `// ⚠️ confia no id do cliente, sem checar o dono
app.get('/notes/:id', (req, res) => {
  const nota = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
  res.json(nota); // e se não for do usuário logado?
});`,
    fixPrompt: 'Explique o que é IDOR e corrija a rota para que um usuário só acesse as próprias notas. Onde no FinanceFlow você já faz isso certo?',
  },
  {
    id: 'password-crack',
    title: 'Quão rápido sua senha cai (e WiFi)',
    owasp: 'A07:2021 — Identification & Authentication Failures',
    difficulty: 1,
    story: 'Atacantes não "adivinham" sua senha: eles testam bilhões por segundo offline (inclusive o handshake do WiFi). Esta demo roda SÓ no seu navegador/servidor, com a senha que você digitar — nada é enviado para rede alguma. Veja o que te protege de verdade.',
    goal: 'Digite uma senha (ou uma frase-senha de WiFi) e veja: ela está em listas comuns? Quanto tempo levaria para cair num hash rápido vs. bcrypt? Teste uma fraca e uma frase longa.',
    hints: [
      'Tente uma clássica: 123456 ou senha123 — cai instantâneo (dicionário).',
      'Tente uma curta complexa: Xr$9k — ainda cai rápido num hash rápido.',
      'Agora uma frase longa: cavalo-azul-janela-cafe — veja a diferença brutal.',
      'Regra de ouro: tamanho vence complexidade. Frase longa + 2FA + (no WiFi) WPA3.',
    ],
    vulnerableCode: `// Por que cai rápido:
// hash rápido (MD5/SHA1) numa GPU ~ 100.000.000.000 tentativas/segundo
// senha curta ou comum => espaço de busca pequeno => quebra na hora
// WiFi WPA2: o atacante captura o handshake e testa a frase OFFLINE`,
    fixPrompt: 'Explique por que uma frase-senha longa resiste à força bruta mesmo sendo "simples", e liste as defesas práticas para senhas de contas e para o seu WiFi (inclua WPA3, 2FA e gerenciador de senhas).',
  },
  {
    id: 'jwt-crack',
    title: 'Forjar um token de admin (JWT fraco)',
    owasp: 'A02:2021 — Cryptographic Failures',
    difficulty: 2,
    story: 'Um site assina os tokens de sessão (JWT) com um segredo fraco. Você "capturou" o token de um usuário comum. Dá para virar admin?',
    goal: 'Descobrir o segredo do JWT e forjar um token com role=admin. Deixe o campo vazio para rodar o dicionário, ou tente um segredo.',
    hints: [
      'JWT = cabeçalho.payload.assinatura, assinado com um segredo no servidor.',
      'Se o segredo é fraco (ex.: "segredo", "123456"), um dicionário acha rápido.',
      'Com o segredo, você assina um token novo trocando role para admin.',
      'Deixe o campo vazio e clique Atacar para rodar o dicionário embutido.',
    ],
    vulnerableCode: `// ⚠️ segredo fraco e no código
jwt.sign(payload, 'segredo');
// atacante faz: jwt.verify(tokenCapturado, cada_palavra_do_dicionario)`,
    fixPrompt: 'Explique por que um segredo fraco de JWT é perigoso e como corrigir (segredo forte/aleatório, fora do código, rotação, algoritmo). Onde o Speak AI guarda o segredo?',
  },
  {
    id: 'path-traversal',
    title: 'Ler arquivo do servidor (Path Traversal)',
    owasp: 'A01:2021 — Broken Access Control',
    difficulty: 2,
    story: 'Uma rota de download monta o caminho com "public/" + o nome que você manda, sem limpar. E se você mandar ../ para subir de pasta?',
    goal: 'Escapar da pasta public e ler um arquivo secreto do "servidor" (tudo falso e isolado).',
    hints: [
      'Arquivos normais: logo.png, termos.txt',
      'Para subir de pasta, use ../',
      'Tente: ../etc/flag.txt',
    ],
    vulnerableCode: `// ⚠️ não confina o caminho na pasta permitida
const caminho = 'public/' + req.query.file;
res.sendFile(caminho); // '../etc/flag.txt' escapa!`,
    fixPrompt: 'Explique path traversal e corrija: como garantir que o arquivo fique SEMPRE dentro da pasta permitida (basename, normalização, checagem de prefixo). Lembra do readProjectFile do DevQuest?',
  },
  {
    id: 'brute-force',
    title: 'Força bruta vs. Rate Limit',
    owasp: 'A07:2021 — Authentication Failures',
    difficulty: 1,
    story: 'Um login com PIN de 4 dígitos não limita tentativas. Um script testa todos os 10.000 em segundos. O rate limit muda esse jogo?',
    goal: 'Clique em Atacar (sem preencher nada) e veja o PIN cair sem rate limit — e como ele seria barrado com rate limit.',
    hints: [
      'São só 10.000 combinações (0000 a 9999).',
      'Sem limite de tentativas, isso é instantâneo para um script.',
      'Com rate limit (5 tentativas), o atacante é barrado quase na largada.',
    ],
    vulnerableCode: `// ⚠️ login sem limite de tentativas
app.post('/login', (req, res) => { /* verifica o pin, sem contar tentativas */ });`,
    fixPrompt: 'Explique como o rate limit derrota a força bruta e liste as defesas de login (rate limit, lockout, atraso progressivo, 2FA, captcha). Onde você já usa express-rate-limit?',
  },
  {
    id: 'xss',
    title: 'Injetar script num comentário (XSS)',
    owasp: 'A03:2021 — Injection (Cross-Site Scripting)',
    difficulty: 2,
    story: 'Um blog mostra os comentários exatamente como foram escritos, sem escapar. Um comentário pode virar código no navegador de quem lê?',
    goal: 'Enviar um "comentário" que seria executado como script. Compare o HTML inseguro (executa) com o escapado (vira texto).',
    hints: [
      'Tente: <script>alert(document.cookie)</script>',
      'Ou, quando script é filtrado: <img src=x onerror=alert(1)>',
      'O estrago real seria roubar o cookie de sessão de quem lê o comentário.',
    ],
    vulnerableCode: `// ⚠️ ecoa a entrada do usuário sem escapar
elemento.innerHTML = '<div>' + comentario + '</div>';
// no React, o equivalente perigoso é dangerouslySetInnerHTML`,
    fixPrompt: 'Explique os tipos de XSS e como preveni-lo (escape de saída + CSP). Por que o React já ajuda, e quando ele NÃO ajuda?',
  },
];

export const findLab = (id: string) => LABS.find((l) => l.id === id);
