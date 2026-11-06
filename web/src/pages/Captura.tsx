import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { CapturaFull, CapturaSource, CapturaSummary, Track } from '@devquest/shared';
import { api } from '../lib/api.js';

const SOURCES: { id: CapturaSource; label: string; hint: string }[] = [
  { id: 'url', label: '🔗 Link', hint: 'Artigo, notícia, documentação, blog' },
  { id: 'youtube', label: '▶️ YouTube', hint: 'Aula, palestra, vídeo público' },
  { id: 'pdf', label: '📄 PDF', hint: 'Apostila, lei, e-book (até 8 MB)' },
  { id: 'texto', label: '📝 Texto', hint: 'Cole anotações ou qualquer texto' },
];
const TRACKS: { id: Track; label: string; review: string }[] = [
  { id: 'concurso', label: '🎖️ Concursos', review: '/concursos/revisao' },
  { id: 'dev', label: '💻 Programação', review: '/review' },
  { id: 'financas', label: '💰 Finanças', review: '/financas/revisao' },
  { id: 'mente', label: '🔥 Disciplina', review: '/mente/revisao' },
  { id: 'social', label: '💬 Comunicação', review: '/social/revisao' },
];
const ICON: Record<CapturaSource, string> = { url: '🔗', youtube: '▶️', pdf: '📄', texto: '📝' };

export function Captura() {
  const { id } = useParams();
  return id ? <Detalhe id={Number(id)} /> : <Nova />;
}

function Nova() {
  const nav = useNavigate();
  const [type, setType] = useState<CapturaSource>('url');
  const [source, setSource] = useState('');
  const [pdf, setPdf] = useState<{ name: string; b64: string } | null>(null);
  const [track, setTrack] = useState<Track>('concurso');
  const [foco, setFoco] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [hist, setHist] = useState<CapturaSummary[]>([]);

  useEffect(() => { api.get<CapturaSummary[]>('/captura').then(setHist).catch(() => {}); }, []);

  function pickPdf(f: File | undefined) {
    setErr('');
    if (!f) return setPdf(null);
    if (f.type !== 'application/pdf') return setErr('Escolha um arquivo PDF.');
    if (f.size > 8 * 1024 * 1024) return setErr('PDF maior que 8 MB. Divida o arquivo ou cole só o trecho.');
    const rd = new FileReader();
    rd.onload = () => setPdf({ name: f.name, b64: String(rd.result).split(',')[1] ?? '' });
    rd.readAsDataURL(f);
  }

  async function enviar() {
    setBusy(true); setErr('');
    try {
      const body = type === 'pdf'
        ? { sourceType: type, source: pdf?.name ?? 'arquivo.pdf', pdfBase64: pdf?.b64, track, foco: foco.trim() || undefined }
        : { sourceType: type, source: source.trim(), track, foco: foco.trim() || undefined };
      const r = await api.post<CapturaFull>('/captura', body);
      nav(`/captura/${r.id}`);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  const ready = type === 'pdf' ? Boolean(pdf) : type === 'texto' ? source.trim().length >= 100 : /^https?:\/\//.test(source.trim());

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow !text-cyan-400">📥 Captura</p>
        <h1 className="text-3xl font-bold mt-1">Qualquer material vira revisão</h1>
        <p className="text-zinc-400 text-sm mt-1">Mande um link, vídeo, PDF ou texto. A IA faz o resumo, cria flashcards na revisão espaçada da trilha que você escolher e um quiz rápido.</p>
      </header>

      <div className="card p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SOURCES.map((s) => (
            <button key={s.id} onClick={() => { setType(s.id); setErr(''); }} className={`text-left p-3 rounded-xl border transition ${type === s.id ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
              <div className="font-semibold text-sm">{s.label}</div><div className="text-xs text-zinc-400">{s.hint}</div>
            </button>
          ))}
        </div>

        {type === 'pdf' ? (
          <label className="block border-2 border-dashed border-white/15 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500/50 transition">
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => pickPdf(e.target.files?.[0])} />
            <span className="text-sm text-zinc-300">{pdf ? `📄 ${pdf.name}` : 'Clique para escolher o PDF'}</span>
          </label>
        ) : type === 'texto' ? (
          <textarea value={source} onChange={(e) => setSource(e.target.value)} rows={10} maxLength={60000} placeholder="Cole aqui o texto (mín. 100 caracteres)…"
            className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500/50" />
        ) : (
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder={type === 'youtube' ? 'https://www.youtube.com/watch?v=…' : 'https://…'}
            className="w-full bg-zinc-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50" />
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-zinc-400 mb-1.5">Cards vão para a revisão de</p>
            <div className="flex flex-wrap gap-2">
              {TRACKS.map((t) => (
                <button key={t.id} onClick={() => setTrack(t.id)} className={`px-3 py-1.5 rounded-lg text-sm border transition ${track === t.id ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>{t.label}</button>
              ))}
            </div>
          </div>
          <label className="text-sm">
            <span className="text-zinc-400">Focar em (opcional)</span>
            <input value={foco} maxLength={200} onChange={(e) => setFoco(e.target.value)} placeholder="ex.: só os prazos e exceções da lei"
              className="mt-1.5 w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2" />
          </label>
        </div>

        {err && <p className="text-sm text-red-400">{err}</p>}
        <button onClick={enviar} disabled={busy || !ready} className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold transition disabled:opacity-50">
          {busy ? `⏳ Processando${type === 'youtube' || type === 'pdf' ? ' (vídeo/PDF pode levar até 2 min)' : ''}…` : '⚡ Gerar resumo + cards'}
        </button>
      </div>

      {hist.length > 0 && (
        <section className="card p-5">
          <h3 className="font-bold mb-3">🗂️ Capturados</h3>
          <div className="divide-y divide-white/5">
            {hist.map((h) => (
              <Link key={h.id} to={`/captura/${h.id}`} className="flex items-center gap-3 py-2.5 text-sm hover:bg-white/5 -mx-2 px-2 rounded-lg">
                <span>{ICON[h.sourceType]}</span>
                <span className="flex-1 min-w-0 truncate">{h.titulo}</span>
                <span className="text-xs text-zinc-500 shrink-0">{TRACKS.find((t) => t.id === h.track)?.label} · {h.cards} cards</span>
                <span className="text-zinc-500 text-xs w-20 text-right shrink-0">{new Date(h.createdAt).toLocaleDateString('pt-BR')}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Detalhe({ id }: { id: number }) {
  const nav = useNavigate();
  const [c, setC] = useState<CapturaFull | null>(null);
  const [err, setErr] = useState('');
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [done, setDone] = useState<{ score: number; xp: number } | null>(null);

  useEffect(() => { api.get<CapturaFull>(`/captura/${id}`).then(setC).catch((e) => setErr(e.message)); }, [id]);

  if (err) return <div className="card p-8 text-red-300">{err} <Link to="/captura" className="text-cyan-300 ml-2">← voltar</Link></div>;
  if (!c) return <div className="text-cyan-300 p-8">Carregando…</div>;

  const r = c.result;
  const review = TRACKS.find((t) => t.id === c.track)!;

  async function corrigir() {
    const ok = r.quiz.filter((q, i) => picked[i] === q.answer).length;
    const score = Math.round((ok / r.quiz.length) * 100);
    const { xpGain } = await api.post<{ xpGain: number }>(`/captura/${id}/quiz`, { score }).catch(() => ({ xpGain: 0 }));
    setDone({ score, xp: xpGain });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/captura" className="text-sm text-zinc-400 hover:text-white">← Captura</Link>
        <button onClick={() => confirm('Apagar esta captura e os cards dela?') && api.del(`/captura/${id}`).then(() => nav('/captura'))} className="text-xs text-zinc-500 hover:text-red-400">apagar</button>
      </div>

      <div className="card p-6 border-cyan-500/30">
        <p className="eyebrow !text-cyan-300">{ICON[c.sourceType]} {review.label}</p>
        <h1 className="text-2xl font-bold mt-2">{r.titulo}</h1>
        {c.sourceType !== 'texto' && c.sourceType !== 'pdf' && <a href={c.source} target="_blank" rel="noreferrer noopener" className="text-xs text-cyan-400 hover:underline break-all">{c.source}</a>}
        <div className="flex flex-wrap gap-3 mt-4">
          <Link to={review.review} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold">🔁 {r.cards.length} cards na revisão</Link>
        </div>
      </div>

      <section className="card p-6">
        <div className="prose-dq text-sm"><Markdown>{r.resumo}</Markdown></div>
      </section>

      {r.pontos.length > 0 && (
        <section className="card p-5">
          <h3 className="font-bold mb-2">📌 Pontos-chave</h3>
          <ul className="list-disc pl-5 text-sm space-y-1 text-zinc-300">{r.pontos.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </section>
      )}

      {r.quiz.length > 0 && (
        <section className="card p-5">
          <h3 className="font-bold mb-3">🧠 Quiz rápido</h3>
          <div className="space-y-5">
            {r.quiz.map((q, i) => (
              <div key={i}>
                <p className="text-sm font-medium">{i + 1}. {q.q}</p>
                <div className="grid gap-1.5 mt-2">
                  {q.options.map((o, j) => {
                    const sel = picked[i] === j;
                    const color = done ? (j === q.answer ? 'border-emerald-500/60 bg-emerald-500/10' : sel ? 'border-red-500/60 bg-red-500/10' : 'border-white/10') : sel ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-white/10 hover:bg-white/5';
                    return <button key={j} disabled={!!done} onClick={() => setPicked({ ...picked, [i]: j })} className={`text-left text-sm px-3 py-2 rounded-lg border transition ${color}`}>{o}</button>;
                  })}
                </div>
                {done && <p className="text-xs text-zinc-400 mt-1.5">💡 {q.explain}</p>}
              </div>
            ))}
          </div>
          {done
            ? <p className="mt-4 font-semibold">{done.score}% de acerto{done.xp ? <span className="text-amber-300"> · +{done.xp} XP</span> : ''}</p>
            : <button onClick={corrigir} disabled={Object.keys(picked).length < r.quiz.length} className="mt-4 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-semibold disabled:opacity-50">Corrigir quiz</button>}
        </section>
      )}

      <section className="card p-5">
        <h3 className="font-bold mb-3">🃏 Cards criados</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {r.cards.map((k, i) => (
            <details key={i} className="rounded-lg bg-white/5 p-3 text-sm">
              <summary className="cursor-pointer">{k.front}</summary>
              <p className="mt-2 text-emerald-200">{k.back}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
