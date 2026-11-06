import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Reescrita } from '@devquest/shared';
import { api } from '../../lib/api.js';

// Reescrever mensagem: antes de mandar algo delicado, veja como vai soar e versões melhores.
export function Mensagem() {
  const [texto, setTexto] = useState('');
  const [contexto, setContexto] = useState('');
  const [r, setR] = useState<Reescrita | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(-1);

  async function go() {
    setBusy(true); setErr(''); setR(null);
    try { setR(await api.post<Reescrita>('/social/reescrever', { texto, contexto: contexto.trim() || undefined })); }
    catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  function copy(i: number, t: string) {
    navigator.clipboard?.writeText(t).then(() => { setCopied(i); setTimeout(() => setCopied(-1), 1500); }).catch(() => {});
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <header>
        <Link to="/social" className="text-sm text-zinc-400 hover:text-white">← Comunicação</Link>
        <p className="eyebrow !text-sky-400 mt-3">✉️ Reescrever mensagem</p>
        <h1 className="text-3xl font-bold mt-1">Antes de enviar, confira o tom</h1>
        <p className="text-zinc-400 text-sm mt-1">Cole a mensagem que você quer mandar. A IA diz como ela pode ser recebida e sugere 3 versões, sem mudar o que você quer dizer.</p>
      </header>

      <div className="card p-5 space-y-3">
        <textarea value={texto} rows={6} maxLength={4000} onChange={(e) => setTexto(e.target.value)} placeholder="Ex.: Cara, de novo você não lavou a louça. Tô cansado de ser o único que faz as coisas aqui."
          className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-500/50" />
        <input value={contexto} maxLength={600} onChange={(e) => setContexto(e.target.value)} placeholder="Contexto (opcional): para quem é e o que aconteceu"
          className="w-full bg-zinc-950/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500/50" />
        <button onClick={go} disabled={busy || texto.trim().length < 3} className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-semibold transition disabled:opacity-50">{busy ? '⏳ Analisando…' : '✨ Analisar e reescrever'}</button>
        {err && <p className="text-sm text-red-400">{err}</p>}
      </div>

      {r && (
        <div className="space-y-4 pop">
          <section className="card p-5 border-amber-500/30">
            <h3 className="font-bold mb-1">👀 Como a sua mensagem pode ser recebida</h3>
            <p className="text-sm text-zinc-300">{r.analise}</p>
          </section>
          {r.versoes.map((v, i) => (
            <section key={i} className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-sky-200">{v.tom}</h3>
                <button onClick={() => copy(i, v.texto)} className="text-xs px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15">{copied === i ? '✓ copiado' : '📋 copiar'}</button>
              </div>
              <p className="text-sm text-zinc-200 mt-2 whitespace-pre-line">{v.texto}</p>
            </section>
          ))}
          {r.dicas.length > 0 && (
            <section className="card p-5">
              <h3 className="font-bold mb-2">💡 O que mudou</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-zinc-300">{r.dicas.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
