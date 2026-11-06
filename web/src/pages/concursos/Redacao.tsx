import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Career, RedacaoBanca, RedacaoFull, RedacaoSummary, RedacaoTipo } from '@devquest/shared';
import { api } from '../../lib/api.js';

const BANCAS: { id: RedacaoBanca; label: string; hint: string }[] = [
  { id: 'cebraspe', label: 'Cebraspe', hint: 'NPD = NC − 2·NE/TL · PF, PRF' },
  { id: 'fgv', label: 'FGV', hint: 'Conteúdo 60 · forma 40' },
  { id: 'fcc', label: 'FCC', hint: 'Conteúdo 40 · estrutura 30 · expressão 30' },
  { id: 'vunesp', label: 'Vunesp', hint: 'Polícias de SP' },
  { id: 'cesgranrio', label: 'Cesgranrio', hint: 'BB, Caixa, Petrobras' },
  { id: 'enem', label: 'ENEM', hint: '5 competências · 1000 pts' },
];
const TIPOS: { id: RedacaoTipo; label: string }[] = [
  { id: 'dissertativa', label: '📰 Redação (atualidades)' },
  { id: 'discursiva', label: '⚖️ Discursiva técnica' },
  { id: 'estudo-caso', label: '🚓 Estudo de caso' },
];

// Mesma estimativa do servidor: ~70 caracteres por linha, cada parágrafo começa linha nova
const lines = (t: string) => t.split(/\n+/).map((p) => p.trim()).filter(Boolean).reduce((n, p) => n + Math.max(1, Math.ceil(p.length / 70)), 0);
const DRAFT = (id: number) => `dq-redacao-${id}`;

export function Redacao() {
  const { id } = useParams();
  return id ? <Editor id={Number(id)} /> : <Inicio />;
}

function Inicio() {
  const nav = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [hist, setHist] = useState<RedacaoSummary[]>([]);
  const [banca, setBanca] = useState<RedacaoBanca>('cebraspe');
  const [tipo, setTipo] = useState<RedacaoTipo>('dissertativa');
  const [careerId, setCareerId] = useState('');
  const [assunto, setAssunto] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get<Career[]>('/concursos/careers').then(setCareers).catch(() => {});
    api.get<RedacaoSummary[]>('/redacao').then(setHist).catch(() => {});
  }, []);

  async function gerar() {
    setBusy(true); setErr('');
    try {
      const r = await api.post<RedacaoFull>('/redacao/tema', { banca, tipo, assunto: assunto.trim() || undefined, careerId: careerId || undefined });
      nav(`/concursos/redacao/${r.id}`);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  const graded = hist.filter((h) => h.nota !== null);
  const avg = graded.length ? Math.round(graded.reduce((n, h) => n + h.nota!, 0) / graded.length) : null;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow !text-emerald-400">✍️ Redação e discursiva</p>
        <h1 className="text-3xl font-bold mt-1">Corretor no padrão da banca</h1>
        <p className="text-zinc-400 text-sm mt-1">A IA cria a proposta, você escreve como na prova e recebe nota por critério, erros apontados e um parágrafo-modelo. Cada erro vira card no caderno de erros.</p>
      </header>

      <div className="card p-6 space-y-5">
        <div>
          <p className="text-sm font-semibold mb-2">Banca</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BANCAS.map((b) => (
              <button key={b.id} onClick={() => setBanca(b.id)} className={`text-left p-3 rounded-xl border transition ${banca === b.id ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                <div className="font-semibold text-sm">{b.label}</div><div className="text-xs text-zinc-400">{b.hint}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Tipo</p>
          <div className="flex flex-wrap gap-2">
            {TIPOS.map((t) => (
              <button key={t.id} onClick={() => setTipo(t.id)} className={`px-4 py-2 rounded-xl text-sm border transition ${tipo === t.id ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="text-zinc-400">Cargo-alvo (opcional)</span>
            <select value={careerId} onChange={(e) => setCareerId(e.target.value)} className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2">
              <option value="">— Qualquer —</option>
              {careers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.orgao})</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-zinc-400">Assunto (opcional)</span>
            <input value={assunto} maxLength={200} onChange={(e) => setAssunto(e.target.value)} placeholder={tipo === 'discursiva' ? 'ex.: atos administrativos, Lei 8.112' : 'ex.: violência no trânsito, IA na segurança pública'}
              className="mt-1 w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2" />
          </label>
        </div>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button onClick={gerar} disabled={busy} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition disabled:opacity-60">
          {busy ? '⏳ Criando proposta…' : '✨ Gerar proposta'}
        </button>
      </div>

      {hist.length > 0 && (
        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">📚 Suas redações</h3>
            {avg !== null && <span className="text-sm text-zinc-400">média <span className="text-emerald-300 font-semibold">{avg}</span> · {graded.length} corrigidas</span>}
          </div>
          <div className="divide-y divide-white/5">
            {hist.map((h) => (
              <Link key={h.id} to={`/concursos/redacao/${h.id}`} className="flex items-center gap-3 py-2.5 text-sm hover:bg-white/5 -mx-2 px-2 rounded-lg">
                <span className="text-zinc-500 w-20 shrink-0">{new Date(h.createdAt).toLocaleDateString('pt-BR')}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-zinc-400 shrink-0">{h.banca}</span>
                <span className="flex-1 min-w-0 truncate">{h.tema}</span>
                {h.nota === null ? <span className="text-xs text-amber-300">escrever</span> : <span className={`font-semibold ${h.nota >= 70 ? 'text-emerald-300' : h.nota >= 50 ? 'text-amber-300' : 'text-red-300'}`}>{h.nota}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Editor({ id }: { id: number }) {
  const nav = useNavigate();
  const [red, setRed] = useState<RedacaoFull | null>(null);
  const [texto, setTexto] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [xp, setXp] = useState(0);

  useEffect(() => {
    api.get<RedacaoFull>(`/redacao/${id}`).then((r) => {
      setRed(r);
      let draft = '';
      try { draft = localStorage.getItem(DRAFT(id)) ?? ''; } catch { /* sem storage */ }
      setTexto(r.texto ?? draft);
    }).catch((e) => setErr(e.message));
  }, [id]);

  function edit(v: string) {
    setTexto(v);
    try { localStorage.setItem(DRAFT(id), v); } catch { /* sem storage */ }
  }

  async function corrigir() {
    if (!red) return;
    const n = lines(texto);
    if (n < red.proposta.linhas.min && !confirm(`Seu texto tem ~${n} linhas e o mínimo é ${red.proposta.linhas.min}. Na prova isso zera ou desconta. Enviar mesmo assim?`)) return;
    setBusy(true); setErr('');
    try {
      const r = await api.post<RedacaoFull & { xpGain: number }>(`/redacao/${id}/corrigir`, { texto });
      setRed(r); setXp(r.xpGain);
      try { localStorage.removeItem(DRAFT(id)); } catch { /* sem storage */ }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  if (err && !red) return <div className="card p-8 text-red-300">{err} <Link to="/concursos/redacao" className="text-emerald-300 ml-2">← voltar</Link></div>;
  if (!red) return <div className="text-emerald-300 p-8">Carregando…</div>;

  const p = red.proposta;
  const n = lines(texto);
  const words = texto.trim() ? texto.trim().split(/\s+/).length : 0;
  const c = red.correcao;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/concursos/redacao" className="text-sm text-zinc-400 hover:text-white">← Redações</Link>
        <button onClick={() => confirm('Apagar esta redação?') && api.del(`/redacao/${id}`).then(() => nav('/concursos/redacao'))} className="text-xs text-zinc-500 hover:text-red-400">apagar</button>
      </div>

      {c && (
        <div className="card p-6 pop border-emerald-500/30">
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-bold ${c.nota >= 70 ? 'text-emerald-300' : c.nota >= 50 ? 'text-amber-300' : 'text-red-300'}`}>{c.nota}</div>
              <div className="text-xs text-zinc-500">de 100</div>
            </div>
            <div className="flex-1 min-w-[12rem]">
              <p className="font-semibold">{c.notaBanca}</p>
              <p className="text-sm text-zinc-400 mt-1">{c.erros.length} erro(s) apontado(s){c.erros.length ? ' — foram para o caderno de erros 🔁' : ''}{xp ? <> · <span className="text-amber-300">+{xp} XP</span></> : null}</p>
            </div>
            <Link to="/concursos/redacao" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold">Nova redação</Link>
          </div>
          <div className="mt-5 space-y-3">
            {c.criterios.map((k) => (
              <div key={k.nome}>
                <div className="flex justify-between text-sm"><span className="font-medium">{k.nome}</span><span className="text-zinc-400">{k.max ? `${k.nota} / ${k.max}` : k.nota}</span></div>
                {k.max > 0 && <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-1"><div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (k.nota / k.max) * 100)}%` }} /></div>}
                <p className="text-xs text-zinc-400 mt-1">{k.comentario}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-6">
        <p className="eyebrow !text-emerald-300">{red.banca.toUpperCase()} · {TIPOS.find((t) => t.id === red.tipo)?.label}</p>
        <h1 className="text-2xl font-bold mt-2">{p.tema}</h1>
        {p.textosMotivadores.map((t, i) => <blockquote key={i} className="mt-3 border-l-2 border-emerald-500/50 pl-3 text-sm text-zinc-300 whitespace-pre-line">{t}</blockquote>)}
        <p className="mt-4 text-sm whitespace-pre-line">{p.comando}</p>
        {p.aspectos.length > 0 && (
          <ol className="mt-3 space-y-1 text-sm">
            {p.aspectos.map((a, i) => {
              const cov = c?.aspectosCobertos.find((x) => x.aspecto === a) ?? c?.aspectosCobertos[i];
              return <li key={i} className="flex gap-2"><span className="text-emerald-400 font-semibold">{c ? (cov?.ok ? '✅' : '❌') : `${i + 1})`}</span><span>{a}{cov && c && <span className="block text-xs text-zinc-400">{cov.comentario}</span>}</span></li>;
            })}
          </ol>
        )}
        <p className="mt-3 text-xs text-zinc-500">Extensão: {p.linhas.min} a {p.linhas.max} linhas.</p>
      </div>

      {!c ? (
        <div className="card p-5">
          <textarea value={texto} onChange={(e) => edit(e.target.value)} rows={22} spellCheck={false}
            placeholder="Escreva como na folha de prova. Sem corretor ortográfico, igual à prova de verdade."
            className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 text-[0.95rem] leading-7 font-serif resize-y focus:outline-none focus:border-emerald-500/50" />
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <span className={`text-sm ${n < p.linhas.min ? 'text-amber-300' : n > p.linhas.max ? 'text-red-300' : 'text-emerald-300'}`}>
              ~{n} linhas · {words} palavras {n > p.linhas.max && '· passou do máximo (a banca ignora o excesso)'}
            </span>
            <button onClick={corrigir} disabled={busy || texto.trim().length < 200} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition disabled:opacity-50">
              {busy ? '⏳ Corrigindo (até 1 min)…' : '📝 Corrigir como a banca'}
            </button>
          </div>
          {err && <p className="text-sm text-red-400 mt-2">{err}</p>}
          <p className="text-xs text-zinc-500 mt-2">O rascunho fica salvo neste navegador enquanto você escreve.</p>
        </div>
      ) : (
        <>
          <section className="card p-5">
            <h3 className="font-bold mb-3">🖍️ Seu texto</h3>
            <div className="text-[0.95rem] leading-7 font-serif whitespace-pre-line"><Highlight text={red.texto ?? ''} marks={c.erros.map((e) => e.trecho)} /></div>
          </section>
          {c.erros.length > 0 && (
            <section className="card p-5">
              <h3 className="font-bold mb-3">❌ Erros ({c.erros.length})</h3>
              <div className="space-y-3">
                {c.erros.map((e, i) => (
                  <div key={i} className="text-sm border-l-2 border-red-500/60 pl-3">
                    <p><span className="text-xs px-1.5 py-0.5 rounded bg-red-500/15 text-red-300 mr-2">{e.tipo}</span><span className="line-through text-zinc-400">{e.trecho}</span></p>
                    <p className="text-emerald-300 mt-1">✔ {e.correcao}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{e.regra}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <section className="card p-5"><h3 className="font-bold mb-2">💪 Pontos fortes</h3><ul className="list-disc pl-5 text-sm space-y-1 text-zinc-300">{c.fortes.map((x, i) => <li key={i}>{x}</li>)}</ul></section>
            <section className="card p-5"><h3 className="font-bold mb-2">🎯 Para a próxima</h3><ul className="list-disc pl-5 text-sm space-y-1 text-zinc-300">{c.melhorar.map((x, i) => <li key={i}>{x}</li>)}</ul></section>
          </div>
          {c.reescrita && (
            <section className="card p-5 border-emerald-500/30">
              <h3 className="font-bold mb-2">✨ Parágrafo-modelo</h3>
              <p className="text-sm text-zinc-200 font-serif leading-7 whitespace-pre-line">{c.reescrita}</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// Grifa no texto os trechos que a banca apontou como erro
function Highlight({ text, marks }: { text: string; marks: string[] }) {
  const valid = [...new Set(marks.filter((m) => m && text.includes(m)))].sort((a, b) => b.length - a.length);
  if (!valid.length) return <>{text}</>;
  const esc = valid.map((m) => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${esc.join('|')})`, 'g'));
  return <>{parts.map((p, i) => valid.includes(p) ? <mark key={i} className="bg-red-500/25 text-red-100 rounded px-0.5">{p}</mark> : <span key={i}>{p}</span>)}</>;
}
