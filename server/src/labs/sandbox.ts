// Laboratório de segurança — 100% ISOLADO e com dados FALSOS.
// Objetivo pedagógico: você ataca um alvo de mentira para ENTENDER a falha e saber se DEFENDER.
// Nada aqui toca sistema real: cada ataque roda num banco SQLite em memória, criado e destruído na hora.
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

// Dados de brincadeira. As "flags" provam que o ataque funcionou.
function seedDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT, secret TEXT);
    INSERT INTO users (username, password, role, secret) VALUES
      ('ana',   'senha-da-ana-123', 'user',  'FLAG{dados_da_ana}'),
      ('bruno', 'bruno#2024',       'user',  'FLAG{dados_do_bruno}'),
      ('admin', 'super-secreta-xyz','admin', 'FLAG{voce_virou_admin}');
    CREATE TABLE notes (id INTEGER PRIMARY KEY, owner_id INTEGER, body TEXT);
    INSERT INTO notes (owner_id, body) VALUES
      (1,'Nota privada da Ana'),(2,'Nota privada do Bruno'),(3,'Config secreta do admin');
  `);
  return db;
}

export interface AttackResult {
  vulnerable: { query?: string; leaked: unknown; explanation: string; flag?: string };
  secure: { query?: string; leaked: unknown; explanation: string };
}

// ───────────────────────── SQL INJECTION ─────────────────────────
// Clássico "login bypass". Mostramos a MESMA entrada nos dois mundos: inseguro (concatenado) x seguro (parametrizado).
function sqlInjection(input: Record<string, string>): AttackResult {
  const db = seedDb();
  const user = input.username ?? '';
  const pass = input.password ?? '';
  try {
    // ⚠️ VULNERÁVEL: concatena a entrada direto no SQL
    const badQuery = `SELECT username, role, secret FROM users WHERE username = '${user}' AND password = '${pass}'`;
    let badRows: unknown[] = [];
    try { badRows = db.prepare(badQuery).all(); } catch (e: any) { badRows = [{ erro: e.message }]; }
    const flag = Array.isArray(badRows) && badRows.length > 0 && (badRows[0] as any)?.secret;

    // ✅ SEGURO: query parametrizada — a entrada nunca vira comando
    const goodRows = db.prepare('SELECT username, role, secret FROM users WHERE username = ? AND password = ?').all(user, pass);

    return {
      vulnerable: {
        query: badQuery,
        leaked: badRows,
        flag: flag || undefined,
        explanation: badRows.length > goodRows.length
          ? 'A injeção funcionou! A query logou (ou vazou) sem a senha correta, porque sua entrada virou parte do comando SQL.'
          : 'Nada vazou com essa entrada. Dica: tente fazer a condição de senha ser sempre verdadeira, ou comentar o resto da query.',
      },
      secure: {
        query: "SELECT ... WHERE username = ? AND password = ?  (parâmetros: ['"+user+"', '"+pass+"'])",
        leaked: goodRows,
        explanation: 'Na versão parametrizada, o banco trata sua entrada como TEXTO, nunca como SQL. A mesma injeção não tem efeito.',
      },
    };
  } finally { db.close(); }
}

// ───────────────────────── IDOR / BROKEN ACCESS CONTROL ─────────────────────────
// Você está logado como Ana (id=1). Tenta ler a nota de outro id.
function idor(input: Record<string, string>): AttackResult {
  const db = seedDb();
  const loggedInId = 1; // você é a Ana
  const requestedId = Number(input.noteId ?? input.id ?? 1);
  try {
    // ⚠️ VULNERÁVEL: confia no id que veio do cliente, sem checar o dono
    const badRow = db.prepare('SELECT * FROM notes WHERE id = ?').get(requestedId) as any;
    const leakedSomeoneElse = badRow && badRow.owner_id !== loggedInId;

    // ✅ SEGURO: filtra SEMPRE pelo dono logado
    const goodRow = db.prepare('SELECT * FROM notes WHERE id = ? AND owner_id = ?').get(requestedId, loggedInId);

    return {
      vulnerable: {
        query: `SELECT * FROM notes WHERE id = ${requestedId}   // sem checar o dono`,
        leaked: badRow ?? 'nada',
        flag: leakedSomeoneElse ? `FLAG{li_a_nota_de_outro_usuario:${badRow.body}}` : undefined,
        explanation: leakedSomeoneElse
          ? 'IDOR! Você (Ana) leu a nota de outra pessoa só trocando o id. O servidor não checou se a nota é sua.'
          : 'Essa nota é sua mesmo (ou não existe). Tente outro id, como 2 ou 3, para ler a de outro usuário.',
      },
      secure: {
        query: `SELECT * FROM notes WHERE id = ${requestedId} AND owner_id = ${loggedInId}`,
        leaked: goodRow ?? 'bloqueado (não é sua)',
        explanation: 'Filtrando pelo dono logado, trocar o id não adianta: você só acessa o que é seu.',
      },
    };
  } finally { db.close(); }
}

// ───────────────────────── XSS (reflected) ─────────────────────────
// Mostra por que ecoar a entrada do usuário sem escapar executa script no navegador.
function xss(input: Record<string, string>): AttackResult {
  const raw = input.comment ?? '';
  const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  const hasScript = /<script|onerror=|onload=|javascript:/i.test(raw);
  return {
    vulnerable: {
      leaked: `<div class="comentario">${raw}</div>`,
      flag: hasScript ? 'FLAG{meu_script_seria_executado}' : undefined,
      explanation: hasScript
        ? 'Perigo! Esse HTML seria inserido na página como está — o navegador EXECUTARIA seu script (roubo de cookie/sessão).'
        : 'Nada executável aqui. Tente algo como <script>alert(1)</script> ou <img src=x onerror=alert(1)>.',
    },
    secure: {
      leaked: `<div class="comentario">${escapeHtml(raw)}</div>`,
      explanation: 'Escapando a saída (ou deixando o React escapar por padrão), o navegador mostra como TEXTO, não executa.',
    },
  };
}

// ───────────────────────── QUEBRA DE SENHA (demo local e defensiva) ─────────────────────────
// Não ataca nada: analisa a SUA senha para mostrar o quão rápido ela cairia e como blindá-la.
const COMMON = ['123456', '123456789', 'senha', 'password', 'qwerty', '12345678', '111111', 'admin',
  'abc123', 'brasil', '000000', 'gabriel', 'love', 'teste', '102030', 'flamengo', 'senha123', '1234'];

function fmtTime(seconds: number): string {
  if (seconds < 1) return 'instantâneo';
  const u: [number, string][] = [[60, 'segundos'], [60, 'minutos'], [24, 'horas'], [365, 'dias'], [100, 'anos'], [1e9, 'séculos']];
  let v = seconds; let label = 'segundos';
  for (const [div, name] of u) { if (v < div) { label = name; break; } v /= div; label = name; }
  if (v > 1e6) return 'bilhões de anos (inviável)';
  return `~${v < 10 ? v.toFixed(1) : Math.round(v)} ${label}`;
}

function passwordCrack(input: Record<string, string>): AttackResult {
  const pw = input.password ?? '';
  const inDict = COMMON.includes(pw.toLowerCase());
  // Tamanho do alfabeto usado
  let charset = 0;
  if (/[a-z]/.test(pw)) charset += 26;
  if (/[A-Z]/.test(pw)) charset += 26;
  if (/[0-9]/.test(pw)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) charset += 33;
  const combos = Math.pow(charset || 1, pw.length);
  const entropy = pw.length ? +(pw.length * Math.log2(charset || 1)).toFixed(1) : 0;
  // Taxas aproximadas de tentativas por segundo (ordem de grandeza, para fins didáticos)
  const GPU_FAST_HASH = 1e11; // MD5/SHA1 numa GPU potente
  const BCRYPT = 1e4;         // bcrypt custo ~12
  const fastTime = inDict ? 0 : combos / GPU_FAST_HASH / 2;
  const slowTime = inDict ? 0 : combos / BCRYPT / 2;

  return {
    vulnerable: {
      leaked: { senha: pw, naLista_de_senhas_comuns: inDict, entropia_bits: entropy, tempo_em_hash_rapido_GPU: fmtTime(fastTime) },
      flag: inDict || fastTime < 3600 ? 'FLAG{essa_senha_cai_rapido}' : undefined,
      explanation: inDict
        ? 'Essa senha está numa lista de senhas comuns: um ataque de dicionário a quebra INSTANTANEAMENTE, não importa o hash.'
        : fastTime < 3600
          ? 'Contra um hash rápido (MD5/SHA1) numa GPU, essa senha cairia em pouco tempo por força bruta. Aumente o tamanho!'
          : 'Resistente a força bruta mesmo em hash rápido. Bom tamanho/variedade.',
    },
    secure: {
      leaked: { mesma_senha_com_bcrypt: pw, tempo_em_hash_lento_bcrypt: fmtTime(slowTime) },
      explanation: inDict
        ? 'Nem o bcrypt salva uma senha óbvia: o dicionário acha na hora. A defesa é NÃO usar senha comum + 2FA.'
        : 'Com hash lento (bcrypt/argon2), a MESMA senha leva muito mais tempo para cair. Some isso a uma frase-senha longa e você fica tranquilo. Para WiFi, vale a mesma regra: frase longa + WPA3.',
    },
  };
}

// ───────────────────────── JWT COM SEGREDO FRACO ─────────────────────────
// Um token é assinado com segredo fraco. O atacante descobre o segredo (dicionário) e FORJA um token de admin.
const JWT_WEAK = 'segredo';
const JWT_DICT = ['123456', 'secret', 'segredo', 'password', 'jwt', 'chave', 'admin', 'token'];
function jwtCrack(input: Record<string, string>): AttackResult {
  // Token legítimo de um usuário comum (é o que o atacante "capturaria")
  const sample = jwt.sign({ user: 'ana', role: 'user' }, JWT_WEAK, { algorithm: 'HS256' });
  const candidate = (input.secret ?? '').trim();

  // ⚠️ VULNERÁVEL: segredo fraco -> achável por dicionário -> dá pra forjar admin
  let cracked = '';
  const tryList = candidate ? [candidate] : JWT_DICT;
  for (const s of tryList) { try { jwt.verify(sample, s); cracked = s; break; } catch { /* erra */ } }
  const forged = cracked ? jwt.sign({ user: 'ana', role: 'admin' }, cracked, { algorithm: 'HS256' }) : '';

  // ✅ SEGURO: segredo forte e aleatório (32+ bytes) -> dicionário não acha
  const strong = crypto.randomBytes(32).toString('hex');
  const strongToken = jwt.sign({ user: 'ana', role: 'user' }, strong, { algorithm: 'HS256' });

  return {
    vulnerable: {
      leaked: { token_capturado: sample.slice(0, 40) + '…', segredo_descoberto: cracked || '(não com essa tentativa)', token_admin_forjado: forged ? forged.slice(0, 40) + '…' : '—' },
      flag: forged ? 'FLAG{forjei_um_token_de_admin}' : undefined,
      explanation: cracked
        ? `Segredo fraco "${cracked}" descoberto! Com ele dá pra assinar um token novo trocando role para admin. O servidor aceitaria.`
        : 'Não achou com essa tentativa. Deixe o campo vazio para rodar o dicionário, ou tente: segredo, secret, 123456…',
    },
    secure: {
      leaked: { segredo: strong.slice(0, 16) + '… (32 bytes aleatórios)', token: strongToken.slice(0, 40) + '…' },
      explanation: 'Com segredo forte e aleatório, o dicionário não acha e o token não pode ser forjado. Guarde o segredo fora do código (.env) e use HS256/RS256 com chave robusta.',
    },
  };
}

// ───────────────────────── PATH TRAVERSAL ─────────────────────────
// Download de arquivo que não limpa o caminho: dá pra escapar da pasta e ler arquivos do sistema.
const FAKE_FS: Record<string, string> = {
  'public/logo.png': '(binário da logo)',
  'public/termos.txt': 'Termos de uso públicos.',
  'etc/flag.txt': 'FLAG{li_um_arquivo_secreto_do_servidor}',
  'etc/shadow': 'root:$6$FAKE$hash...:fake',
};
function pathTraversal(input: Record<string, string>): AttackResult {
  const name = input.filename ?? '';
  // ⚠️ VULNERÁVEL: concatena "public/" + nome sem confinar; com ../ dá pra subir de pasta
  const escaped = /\.\.(\/|\\)/.test(name);
  const badKey = escaped ? name.replace(/^(\.\.(\/|\\))+/, '') : `public/${name}`;
  const badContent = FAKE_FS[badKey] ?? FAKE_FS[name] ?? null;

  // ✅ SEGURO: normaliza e EXIGE que fique dentro de public/
  const safeKey = `public/${name.split('/').pop() ?? ''}`;
  const goodContent = FAKE_FS[safeKey] ?? null;

  return {
    vulnerable: {
      query: `lerArquivo("public/" + "${name}")  // sem confinar`,
      leaked: badContent ?? 'arquivo não encontrado',
      flag: badContent && /FLAG\{/.test(badContent) ? badContent.match(/FLAG\{[^}]+\}/)![0] : undefined,
      explanation: escaped
        ? 'Path traversal! Com ../ você saiu da pasta public e leu um arquivo do sistema que não deveria.'
        : 'Sem ../ você só pega arquivos da pasta pública. Tente: ../etc/flag.txt',
    },
    secure: {
      query: `basename("${name}") -> só o nome do arquivo, sempre dentro de public/`,
      leaked: goodContent ?? 'bloqueado (fora da pasta permitida)',
      explanation: 'Tirando qualquer caminho e confinando na pasta (basename + verificação de prefixo), o ../ não tem efeito.',
    },
  };
}

// ───────────────────────── FORÇA BRUTA x RATE LIMIT ─────────────────────────
// Mostra como um PIN cai sem limite de tentativas, e como o rate limit mata o ataque.
function bruteForce(_input: Record<string, string>): AttackResult {
  const pin = String(Math.floor(Math.random() * 10000)).padStart(4, '0'); // alvo falso
  // ⚠️ VULNERÁVEL: sem limite, um script testa 0000..9999 em instantes
  let tries = 0;
  for (let i = 0; i < 10000; i++) { tries++; if (String(i).padStart(4, '0') === pin) break; }
  // ✅ SEGURO: trava após 5 tentativas erradas
  const allowed = 5;
  const chance = ((allowed / 10000) * 100).toFixed(2);

  return {
    vulnerable: {
      leaked: { pin_alvo: pin, tentativas_ate_achar: tries, tempo: 'segundos (script automatizado)' },
      flag: 'FLAG{pin_quebrado_por_forca_bruta}',
      explanation: `Sem limite de tentativas, testar todos os 10.000 PINs é trivial. Seu alvo caiu em ${tries} tentativas.`,
    },
    secure: {
      leaked: { limite: `${allowed} tentativas e bloqueia`, chance_de_acertar: `${chance}%`, defesa_extra: '2FA + atraso progressivo + captcha' },
      explanation: 'Com rate limit (ex.: express-rate-limit, que você já usa), o atacante só tenta 5 vezes antes de ser barrado. A força bruta deixa de ser viável.',
    },
  };
}

export const SANDBOX: Record<string, (input: Record<string, string>) => AttackResult> = {
  'sql-injection': sqlInjection,
  'idor': idor,
  'xss': xss,
  'password-crack': passwordCrack,
  'jwt-crack': jwtCrack,
  'path-traversal': pathTraversal,
  'brute-force': bruteForce,
};
