// Captura: transforma um link, vídeo do YouTube, PDF ou texto em resumo + flashcards + quiz.
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import type { CapturaResult, CapturaSource, Track } from '@devquest/shared';
import { askJSON, type AIPart } from './ai.js';

const MAX_HTML = 3_000_000;
const MAX_TEXT = 60_000;

export const YT_RE = /^https?:\/\/(www\.|m\.)?(youtube\.com\/(watch\?|shorts\/|live\/)|youtu\.be\/)/i;

// Bloqueia IPs internos para o servidor não ser usado como ponte para a rede local (SSRF — veja o Lab Hacker)
function privateIp(ip: string): boolean {
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  if (isIP(ip) === 4) {
    const [a, b] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const v = ip.toLowerCase();
  return v === '::' || v === '::1' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80');
}

async function assertPublic(url: URL) {
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Só links http(s).');
  if (url.port && !['80', '443'].includes(url.port)) throw new Error('Porta não permitida.');
  const addrs = await lookup(url.hostname, { all: true }).catch(() => []);
  if (!addrs.length) throw new Error('Não consegui encontrar esse site.');
  if (addrs.some((a) => privateIp(a.address))) throw new Error('Endereço não permitido.');
}

async function fetchPage(raw: string): Promise<{ title: string; text: string }> {
  let url = new URL(raw);
  for (let hop = 0; hop < 4; hop++) {
    await assertPublic(url);
    const res = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'Mozilla/5.0 (DevQuest; estudo pessoal)', Accept: 'text/html,text/plain;q=0.9' },
    });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) { url = new URL(res.headers.get('location')!, url); continue; }
    if (!res.ok) throw new Error(`O site respondeu ${res.status}.`);
    const type = res.headers.get('content-type') ?? '';
    if (!/text\/(html|plain)|xhtml/.test(type)) throw new Error('Esse link não é uma página de texto (se for PDF, envie o arquivo).');
    // Lê com limite de tamanho
    const reader = res.body!.getReader();
    const chunks: Uint8Array[] = []; let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length; chunks.push(value);
      if (size > MAX_HTML) { await reader.cancel(); break; }
    }
    const html = Buffer.concat(chunks).toString('utf8');
    return type.includes('plain') ? { title: url.hostname, text: html.slice(0, MAX_TEXT) } : htmlToText(html);
  }
  throw new Error('Redirecionamentos demais.');
}

const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function decode(s: string) {
  return s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e: string) =>
    e[0] === '#' ? String.fromCodePoint(parseInt(e.slice(1).replace(/^x/i, ''), e[1]?.toLowerCase() === 'x' ? 16 : 10)) : ENT[e.toLowerCase()] ?? m);
}

function htmlToText(html: string) {
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '');
  const main = html.match(/<(article|main)[\s\S]*<\/\1>/i)?.[0] ?? html;
  const text = decode(main
    .replace(/<(script|style|noscript|svg|nav|footer|header|aside|form)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|br|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim();
  return { title, text: text.slice(0, MAX_TEXT) };
}

const TRACK_CTX: Record<Track, string> = {
  dev: 'estudante de programação full-stack TypeScript (foco em entender e aplicar)',
  concurso: 'candidato a concurso público (foco no que a banca cobra: conceitos, letra da lei, pegadinhas)',
  financas: 'pessoa aprendendo finanças pessoais e investimentos no Brasil (foco prático)',
  mente: 'pessoa construindo disciplina e constância (foco em ideias aplicáveis e exercícios práticos)',
  social: 'pessoa que quer se comunicar melhor com as pessoas (foco em frases, técnicas e situações reais)',
};

const SYSTEM = `Você é um professor que transforma qualquer material em estudo ativo: resumo enxuto, flashcards de recordação ativa e quiz.
Fiel ao material (não invente fatos que não estão nele), em português do Brasil, mesmo se o material for em outro idioma. Responde em JSON.`;

export async function capture(sourceType: CapturaSource, source: string, track: Track, foco?: string, pdfBase64?: string): Promise<CapturaResult> {
  let parts: AIPart[] | undefined;
  let material = '';
  let hintTitle = '';

  if (sourceType === 'youtube') {
    if (!YT_RE.test(source)) throw new Error('Link do YouTube inválido.');
    parts = [{ fileData: { fileUri: source } }];
    material = 'O material é o vídeo do YouTube anexado (use a fala e o que aparece na tela).';
  } else if (sourceType === 'pdf') {
    if (!pdfBase64) throw new Error('Envie o arquivo PDF.');
    parts = [{ inlineData: { mimeType: 'application/pdf', data: pdfBase64 } }];
    material = `O material é o PDF anexado ("${source}").`;
  } else if (sourceType === 'url') {
    const page = await fetchPage(source);
    if (page.text.length < 200) throw new Error('Não consegui ler texto suficiente nessa página (pode exigir login ou JavaScript). Copie e cole o texto.');
    hintTitle = page.title;
    material = `Material (página "${page.title}"):\n"""\n${page.text}\n"""`;
  } else {
    material = `Material:\n"""\n${source.slice(0, MAX_TEXT)}\n"""`;
  }

  const prompt = `Aluno: ${TRACK_CTX[track]}.
${foco ? `O aluno quer focar em: ${foco}` : ''}
${material}

Responda em JSON:
{
 "titulo": "título curto do material${hintTitle ? ' (pode limpar o título da página)' : ''}",
 "resumo": "resumo em markdown com ## seções, 200 a 500 palavras, só o essencial",
 "pontos": ["5 a 10 pontos-chave, uma frase cada"],
 "cards": [{"front":"pergunta de recordação ativa (não sim/não)","back":"resposta curta e completa"}],
 "quiz": [{"q":"pergunta","options":["4 alternativas"],"answer":<índice>,"explain":"por que"}]
}
Gere de 6 a 15 cards (só o que vale lembrar daqui a 1 mês) e 5 questões no quiz, variando a posição da correta.`;

  const out = await askJSON<CapturaResult>(prompt, { system: SYSTEM, temperature: 0.4, timeoutMs: 180000, parts });
  const result: CapturaResult = {
    titulo: String(out.titulo || hintTitle || 'Material capturado').slice(0, 200),
    resumo: String(out.resumo ?? ''),
    pontos: (out.pontos ?? []).map(String).slice(0, 12),
    cards: (out.cards ?? []).filter((c) => c?.front && c?.back).map((c) => ({ front: String(c.front), back: String(c.back) })).slice(0, 20),
    quiz: (out.quiz ?? []).filter((q) => q?.q && Array.isArray(q.options) && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length)
      .map((q) => ({ q: String(q.q), options: q.options.map(String), answer: q.answer, explain: String(q.explain ?? '') })).slice(0, 8),
  };
  if (!result.resumo || !result.cards.length) throw new Error('A IA não conseguiu processar esse material. Tente de novo ou cole o texto.');
  return result;
}
