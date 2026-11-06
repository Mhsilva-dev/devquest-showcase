// Cliente Gemini — mesmo espírito do seu Speak AI: timeout, retry, fallback de modelo e extração de JSON.
// Sem GEMINI_API_KEY no .env, o app funciona normalmente, só os recursos de IA ficam desligados.
import { config, aiEnabled } from '../config.js';

const API = 'https://generativelanguage.googleapis.com/v1beta/models';

export class AIError extends Error {
  retryable: boolean;
  constructor(msg: string, retryable = false) { super(msg); this.retryable = retryable; }
}

function extractJSON<T = unknown>(text: string): T {
  let t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { return JSON.parse(t) as T; } catch { /* tenta reparar */ }
  const start = t.indexOf('{'); const arr = t.indexOf('[');
  const s = start === -1 ? arr : (arr === -1 ? start : Math.min(start, arr));
  const end = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
  if (s === -1 || end <= s) throw new AIError('JSON não encontrado na resposta da IA', true);
  t = t.slice(s, end + 1).replace(/,\s*([}\]])/g, '$1');
  try { return JSON.parse(t) as T; } catch (e) { throw new AIError('JSON inválido da IA', true); }
}

async function post(model: string, payload: unknown, timeoutMs = config.ai.timeoutMs): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API}/${model}:generateContent`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.ai.key },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({})) as any;
    if (!res.ok) {
      const retryable = res.status === 429 || res.status >= 500 || res.status === 404;
      throw new AIError(`Gemini ${res.status}: ${body?.error?.message ?? 'erro'}`, retryable);
    }
    return body?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ?? '';
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new AIError('Timeout da IA', true);
    if (err instanceof AIError) throw err;
    throw new AIError(`Falha de rede com a IA: ${err?.message}`, true);
  } finally {
    clearTimeout(timer);
  }
}

/** Partes extras enviadas junto do prompt: PDF em base64 ou vídeo do YouTube por URL. */
export type AIPart = { inlineData: { mimeType: string; data: string } } | { fileData: { fileUri: string } };

interface AskOpts { system?: string; json?: boolean; temperature?: number; timeoutMs?: number; parts?: AIPart[]; }

/** Percorre os modelos (principal + fallbacks) com retry para erros transitórios. */
export async function ask(prompt: string, opts: AskOpts = {}): Promise<string> {
  if (!aiEnabled()) throw new AIError('IA desligada: configure GEMINI_API_KEY no .env');
  const models = [config.ai.model, ...config.ai.fallbacks];
  const payload: any = {
    contents: [{ role: 'user', parts: [...(opts.parts ?? []), { text: prompt }] }],
    generationConfig: { temperature: opts.temperature ?? 0.7, ...(opts.json ? { responseMimeType: 'application/json' } : {}) },
  };
  if (opts.system) payload.systemInstruction = { parts: [{ text: opts.system }] };

  let lastErr: unknown;
  for (const model of models) {
    for (let attempt = 0; attempt <= config.ai.maxRetries; attempt++) {
      try { return await post(model, payload, opts.timeoutMs); }
      catch (err) {
        lastErr = err;
        if (err instanceof AIError && !err.retryable) break; // erro definitivo: próximo modelo
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
    }
  }
  throw lastErr ?? new AIError('Todos os modelos falharam', true);
}

export async function askJSON<T = unknown>(prompt: string, opts: Omit<AskOpts, 'json'> = {}): Promise<T> {
  const text = await ask(prompt, { ...opts, json: true });
  return extractJSON<T>(text);
}

export { aiEnabled };
