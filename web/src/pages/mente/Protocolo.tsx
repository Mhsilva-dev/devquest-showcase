import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MenteProtocol, MenteProtocolInput } from '@devquest/shared';
import { api } from '../../lib/api.js';

type Resp = { input: MenteProtocolInput; protocol: MenteProtocol; updatedAt: string } | null;
const EMPTY: MenteProtocolInput = { meta: '', porque: '', historico: '', obstaculos: '', rotina: '' };

// Protocolo anti-desistência: a IA transforma o seu histórico e os seus obstáculos em regras e planos concretos.
export function MenteProtocolo() {
  const [data, setData] = useState<Resp>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<MenteProtocolInput>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get<Resp>('/mente/protocol').then((r) => { setData(r); if (r) setForm({ ...EMPTY, ...r.input }); }).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  async function gerar() {
    setBusy(true); setErr('');
    try {
      const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, (v ?? '').trim() || undefined])) as MenteProtocolInput;
      setData(await api.post<Resp>('/mente/protocol', clean)); setEditing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  if (!loaded) return <div className="text-orange-300 p-8">Carregando…</div>;

  if (!data || editing) {
    const field = (k: keyof MenteProtocolInput, label: string, hint: string, rows = 3) => (
      <label className="block text-sm">
        <span className="font-semibold">{label}</span>
        <span className="block text-xs text-zinc-500 mb-1.5">{hint}</span>
        <textarea rows={rows} value={form[k] ?? ''} maxLength={k === 'meta' ? 300 : 1500} onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-orange-500/50" />
      </label>
    );
    return (
      <div className="space-y-5">
        <header>
          <Link to="/mente" className="text-sm text-zinc-400 hover:text-white">← Painel</Link>
          <p className="eyebrow !text-orange-400 mt-3">🛡️ Protocolo anti-desistência</p>
          <h1 className="text-3xl font-bold mt-1">Seu plano para não largar</h1>
          <p className="text-zinc-400 text-sm mt-1">Seja sincero: quanto mais real for o seu histórico, mais o protocolo vai acertar nos pontos onde você costuma cair.</p>
        </header>
        <div className="card p-6 space-y-5">
          {field('meta', 'O que você não quer largar de jeito nenhum?', 'Ex.: estudar para a PRF todos os dias até passar', 2)}
          {field('porque', 'Por que isso importa tanto para você?', 'O que muda na sua vida e na de quem você ama. Quanto mais concreto, melhor.', 4)}
          {field('historico', 'Por que você desistiu de coisas antes?', 'Ex.: começo forte, falho um dia e largo tudo; perco o foco no celular; canso depois do trabalho')}
          {field('obstaculos', 'O que pode atrapalhar desta vez?', 'Trabalho, cansaço, família, ansiedade, dinheiro, celular…')}
          {field('rotina', 'Como é sua rotina e sua energia?', 'Horários livres, quando rende mais, dias mais corridos', 2)}
          {err && <p className="text-sm text-red-400">{err}</p>}
          <div className="flex gap-3">
            <button onClick={gerar} disabled={busy || form.meta.trim().length < 3 || form.porque.trim().length < 3}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-semibold transition disabled:opacity-50">{busy ? '⏳ Montando seu protocolo…' : '🛡️ Montar meu protocolo'}</button>
            {data && <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm">Cancelar</button>}
          </div>
        </div>
      </div>
    );
  }

  const p = data.protocol;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/mente" className="text-sm text-zinc-400 hover:text-white">← Painel</Link>
        <div className="flex gap-3 text-xs">
          <button onClick={() => window.print()} className="text-zinc-500 hover:text-zinc-300">🖨️ imprimir</button>
          <button onClick={() => setEditing(true)} className="text-orange-300 hover:underline">refazer</button>
        </div>
      </div>

      <div className="card p-6 border-orange-500/40 bg-gradient-to-br from-orange-600/15 to-transparent">
        <p className="eyebrow !text-orange-300">🛡️ Protocolo anti-desistência · {data.input.meta}</p>
        <p className="text-2xl font-bold mt-3">“{p.frase}”</p>
        <p className="mt-3 text-orange-100">{p.identidade}</p>
        <p className="mt-3 text-sm text-zinc-300 whitespace-pre-line">{p.porque}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="card p-5 border-amber-500/30"><h3 className="font-bold">🪫 Mínimo (dia ruim)</h3><p className="text-sm text-zinc-300 mt-2">{p.minimo}</p></section>
        <section className="card p-5 border-emerald-500/30"><h3 className="font-bold">✅ Completo (dia normal)</h3><p className="text-sm text-zinc-300 mt-2">{p.ideal}</p></section>
      </div>

      <section className="card p-5">
        <h3 className="font-bold mb-2">⚖️ Regras inegociáveis</h3>
        <ol className="list-decimal pl-5 text-sm space-y-1.5 text-zinc-200">{p.regras.map((r, i) => <li key={i}>{r}</li>)}</ol>
      </section>

      <section className="card p-5">
        <h3 className="font-bold mb-3">🔀 Se acontecer… então eu…</h3>
        <div className="space-y-2">
          {p.seEntao.map((x, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2"><span className="text-red-300 font-semibold">Se </span>{x.se}</div>
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2"><span className="text-emerald-300 font-semibold">Então </span>{x.entao}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h3 className="font-bold mb-2">🏠 Ambiente</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 text-zinc-300">{p.ambiente.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
        <section className="card p-5">
          <h3 className="font-bold mb-2">🚨 Sinais de alerta</h3>
          <div className="space-y-2 text-sm">{p.alertas.map((a, i) => <p key={i}><span className="text-amber-300">{a.sinal}</span><span className="text-zinc-400"> → {a.acao}</span></p>)}</div>
        </section>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h3 className="font-bold mb-2">🌧️ Roteiro do dia ruim</h3>
          <ol className="list-decimal pl-5 text-sm space-y-1 text-zinc-300">{p.diaRuim.map((x, i) => <li key={i}>{x}</li>)}</ol>
        </section>
        <section className="card p-5">
          <h3 className="font-bold mb-2">🌱 Voltando depois de parar</h3>
          <ol className="list-decimal pl-5 text-sm space-y-1 text-zinc-300">{p.recaida.map((x, i) => <li key={i}>{x}</li>)}</ol>
        </section>
      </div>

      <section className="card p-5">
        <h3 className="font-bold mb-2">🗓️ Revisão de domingo</h3>
        <ul className="list-disc pl-5 text-sm space-y-1 text-zinc-300">{p.revisaoSemanal.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </section>

      {p.livros.length > 0 && (
        <section className="card p-5">
          <h3 className="font-bold mb-2">📚 Leia agora</h3>
          <div className="space-y-2 text-sm">{p.livros.map((l, i) => <p key={i}><b className="text-orange-200">{l.titulo}</b> <span className="text-zinc-400">— {l.porque}</span></p>)}</div>
          <Link to="/mente/biblioteca" className="inline-block mt-3 text-xs text-orange-300 hover:underline">abrir a biblioteca →</Link>
        </section>
      )}
    </div>
  );
}
