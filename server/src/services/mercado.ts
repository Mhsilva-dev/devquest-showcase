import type { Indicador, Indicadores } from '@devquest/shared';

// Indicadores públicos: séries SGS do Banco Central (mudam 1x por dia) e ticker do Mercado Bitcoin (ao vivo).
const SGS = { cdiDiario: 12, cdiAnual: 4389, selic: 432, ipca12m: 13522, dolarPtax: 1 } as const;
const BCB_TTL = 60 * 60_000;
const LIVE_TTL = 30_000;

let bcb: { at: number; data: Pick<Indicadores, keyof typeof SGS> } | null = null;
let live: { at: number; data: Pick<Indicadores, 'dolar' | 'btc' | 'btcVar24h'> } | null = null;

async function getJSON(url: string): Promise<any> {
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.json();
}

// A API do BC recusa rajadas: busca uma série por vez, com uma nova tentativa.
async function serie(id: number): Promise<Indicador | null> {
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    try {
      const [d] = await getJSON(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${id}/dados/ultimos/1?formato=json`);
      return d ? { valor: Number(d.valor), data: d.data } : null;
    } catch { await new Promise((r) => setTimeout(r, 800)); }
  }
  return null;
}

async function loadBcb() {
  if (bcb && Date.now() - bcb.at < BCB_TTL) return bcb.data;
  const keys = Object.keys(SGS) as (keyof typeof SGS)[];
  const vals: (Indicador | null)[] = [];
  for (const k of keys) vals.push(await serie(SGS[k]));
  const data = Object.fromEntries(keys.map((k, i) => [k, vals[i] ?? bcb?.data[k] ?? null])) as Pick<Indicadores, keyof typeof SGS>;
  // Se alguma série falhou, tenta de novo em 5 min em vez de esperar 1h.
  if (vals.some(Boolean)) bcb = { at: Date.now() - (vals.every(Boolean) ? 0 : BCB_TTL - 5 * 60_000), data };
  return data;
}

async function loadLive() {
  if (live && Date.now() - live.at < LIVE_TTL) return live.data;
  try {
    const rows: any[] = await getJSON('https://api.mercadobitcoin.net/api/v4/tickers?symbols=BTC-BRL,USDT-BRL');
    const pick = (p: string) => rows.find((r) => r.pair === p);
    const btc = pick('BTC-BRL'), usdt = pick('USDT-BRL');
    const quando = (r: any) => new Date(Number(r.date) * 1000).toISOString();
    const data = {
      btc: btc ? { valor: Number(btc.last), data: quando(btc) } : null,
      dolar: usdt ? { valor: Number(usdt.last), data: quando(usdt) } : null,
      btcVar24h: btc ? ((Number(btc.last) / Number(btc.open)) - 1) * 100 : null,
    };
    live = { at: Date.now(), data };
    return data;
  } catch {
    return live?.data ?? { btc: null, dolar: null, btcVar24h: null };
  }
}

export async function indicadores(): Promise<Indicadores> {
  const [a, b] = await Promise.all([loadBcb(), loadLive()]);
  return { ...a, ...b, atualizadoEm: new Date().toISOString() };
}
