import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { Banca, Realm, SimQuestion, SimuladoResult, SimuladoSummary } from '@devquest/shared';
import { api } from '../../lib/api.js';

const BANCAS: { id: Banca; label: string; hint: string }[] = [
  { id: 'cebraspe', label: 'Cebraspe', hint: 'Certo/Errado · PRF, PF, INSS' },
  { id: 'fgv', label: 'FGV', hint: 'Interpretação · tribunais, legislativo' },
  { id: 'fcc', label: 'FCC', hint: 'Letra da lei · tribunais' },
  { id: 'cesgranrio', label: 'Cesgranrio', hint: 'BB, Caixa' },
  { id: 'vunesp', label: 'Vunesp', hint: 'Polícias de SP' },
  { id: 'mista', label: 'Mista', hint: 'C/E + múltipla escolha' },
];

type Started = { id: number; banca: Banca; questions: SimQuestion[] };

export function Simulado() {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [history, setHistory] = useState<SimuladoSummary[]>([]);
  const [sel, setSel] = useState<string[]>([]);
  const [banca, setBanca] = useState<Banca>('cebraspe');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<'facil' | 'media' | 'dificil'>('media');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sim, setSim] = useState<Started | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<SimuladoResult | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    api.get<Realm[]>('/concursos/realms').then((rs) => setRealms(rs.filter((r) => r.id !== 'c-estrategia'))).catch(() => {});
    api.get<SimuladoSummary[]>('/concursos/simulados').then(setHistory).catch(() => {});
  }, [result]);

  useEffect(() => {
    if (!sim || result) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [sim, result]);

  async function start() {
    setBusy(true); setErr(''); setResult(null); setAnswers({});
    try {
      const s = await api.post<Started>('/concursos/simulado', { realmIds: sel, banca, count, difficulty });
      setSim(s); setStartedAt(Date.now()); setNow(Date.now());
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  async function submit() {
    if (!sim) return;
    const blank = sim.questions.length - Object.keys(answers).length;
    if (blank > 0 && !confirm(`${blank} questão(ões) em branco. Entregar mesmo assim?`)) return;
    setBusy(true);
    try {
      const arr = sim.questions.map((_, i) => answers[i] ?? -1);
      setResult(await api.post<SimuladoResult>(`/concursos/simulado/${sim.id}/submit`, { answers: arr }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  const realmName = (id: string) => realms.find((r) => r.id === id)?.title ?? id;

  // ---------- Resultado ----------
  if (result) {
    const elapsed = Math.round((now - startedAt) / 60000);
    return (
      <div className="space-y-4">
        <div className="card p-6 text-center pop">
          <div className="text-5xl">{result.score >= 80 ? '🏆' : result.score >= 60 ? '💪' : '📚'}</div>
          <h1 className="text-3xl font-bold mt-2">{result.score}%</h1>
          <p className="text-zinc-300 mt-1">{result.correct} de {result.total} certas{sim?.banca === 'cebraspe' && ' · nota líquida Cebraspe (errada anula certa)'}</p>
          <p className="text-sm text-zinc-500 mt-1">{elapsed} min · <span className="text-amber-300">+{result.xpGain} XP</span> · questões erradas foram para o caderno de erros 🔁</p>
          <div className="flex justify-center gap-3 mt-5">
            <button onClick={() => { setSim(null); setResult(null); }} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition">Novo simulado</button>
            <Link to="/concursos/revisao" className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition">Revisar erros</Link>
          </div>
        </div>
        {result.questions.map((q, i) => {
          const ok = q.picked === q.answer;
          return (
            <div key={i} className={`card p-4 ${q.picked == null ? 'border-zinc-500/30' : ok ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              <p className="text-xs text-zinc-500">{realmName(q.realmId)}{q.topic && ` · ${q.topic}`} · {q.picked == null ? 'em branco' : ok ? '✅ acertou' : '❌ errou'}</p>
              <p className="font-medium mt-1 whitespace-pre-line">{i + 1}. {q.q}</p>
              <div className="mt-2 space-y-1">
                {q.options.map((o, j) => (
                  <div key={j} className={`px-3 py-1.5 rounded-lg text-sm border ${j === q.answer ? 'border-emerald-500 bg-emerald-500/10' : j === q.picked ? 'border-red-500 bg-red-500/10' : 'border-white/5'}`}>
                    {q.options.length > 2 && <b className="mr-2">{String.fromCharCode(65 + j)})</b>}{o}
                  </div>
                ))}
              </div>
              <div className="prose-dq text-sm text-zinc-300 mt-3 border-l-2 border-emerald-500/50 pl-3"><Markdown>{q.explain}</Markdown></div>
            </div>
          );
        })}
      </div>
    );
  }

  // ---------- Prova em andamento ----------
  if (sim) {
    const secs = Math.floor((now - startedAt) / 1000);
    const answered = Object.keys(answers).length;
    return (
      <div className="space-y-4">
        <div className="card p-3 flex items-center justify-between sticky top-2 z-10">
          <span className="text-sm">📝 {answered}/{sim.questions.length} respondidas</span>
          <span className="font-mono text-emerald-300">⏱ {String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}</span>
        </div>
        {sim.banca === 'cebraspe' && <p className="text-xs text-amber-200 px-1">⚠️ Cebraspe: cada errada anula uma certa. Se não souber, deixe em branco (clique de novo para desmarcar).</p>}
        {sim.questions.map((q, i) => (
          <div key={i} className="card p-4">
            <p className="text-xs text-zinc-500">{realmName(q.realmId)}</p>
            <p className="font-medium mt-1 whitespace-pre-line">{i + 1}. {q.q}</p>
            <div className={`mt-2 ${q.options.length === 2 ? 'flex gap-2' : 'space-y-1.5'}`}>
              {q.options.map((o, j) => {
                const picked = answers[i] === j;
                return (
                  <button key={j} onClick={() => setAnswers((a) => { const n = { ...a }; if (picked) delete n[i]; else n[i] = j; return n; })}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition ${q.options.length === 2 ? 'flex-1 text-center' : 'w-full'} ${picked ? 'border-emerald-500 bg-emerald-500/15' : 'border-white/10 hover:border-white/25'}`}>
                    {q.options.length > 2 && <b className="mr-2">{String.fromCharCode(65 + j)})</b>}{o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button disabled={busy} onClick={submit} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold disabled:opacity-40 transition">
          {busy ? 'Corrigindo…' : 'Entregar prova'}
        </button>
      </div>
    );
  }

  // ---------- Montar simulado ----------
  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow !text-emerald-400">🎖️ Modo Concurso</p>
        <h1 className="text-2xl font-bold mt-1">Simulado no estilo da banca</h1>
        <p className="text-zinc-400 text-sm mt-1">Questões inéditas geradas pela IA, com comentário de professor. O que você errar vira card no caderno de erros.</p>
      </header>

      <div className="card p-5 space-y-5">
        <div>
          <p className="font-semibold text-sm mb-2">1. Matérias <span className="text-zinc-500 font-normal">(até 6)</span></p>
          <div className="flex flex-wrap gap-2">
            {realms.map((r) => {
              const on = sel.includes(r.id);
              return (
                <button key={r.id} onClick={() => setSel((s) => on ? s.filter((x) => x !== r.id) : s.length < 6 ? [...s, r.id] : s)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition ${on ? 'border-emerald-500 bg-emerald-500/15' : 'border-white/10 hover:border-white/25'}`}>
                  {r.emoji} {r.title}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm mb-2">2. Banca</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BANCAS.map((b) => (
              <button key={b.id} onClick={() => setBanca(b.id)} className={`p-2.5 rounded-lg border text-left transition ${banca === b.id ? 'border-emerald-500 bg-emerald-500/15' : 'border-white/10 hover:border-white/25'}`}>
                <div className="font-semibold text-sm">{b.label}</div><div className="text-xs text-zinc-500">{b.hint}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="font-semibold text-sm mb-2">3. Questões</p>
            <div className="flex gap-2">{[5, 10, 15, 20].map((n) => (
              <button key={n} onClick={() => setCount(n)} className={`w-12 py-1.5 rounded-lg border text-sm ${count === n ? 'border-emerald-500 bg-emerald-500/15' : 'border-white/10'}`}>{n}</button>
            ))}</div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">4. Dificuldade</p>
            <div className="flex gap-2">{([['facil', 'Fácil'], ['media', 'Prova real'], ['dificil', 'Difícil']] as const).map(([v, l]) => (
              <button key={v} onClick={() => setDifficulty(v)} className={`px-3 py-1.5 rounded-lg border text-sm ${difficulty === v ? 'border-emerald-500 bg-emerald-500/15' : 'border-white/10'}`}>{l}</button>
            ))}</div>
          </div>
        </div>
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button disabled={busy || sel.length === 0} onClick={start} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold disabled:opacity-40 transition">
          {busy ? 'A banca está elaborando sua prova… (até 1 min)' : '▶ Gerar simulado'}
        </button>
      </div>

      {history.length > 0 && (
        <section className="card p-5">
          <h3 className="font-bold mb-3">Histórico</h3>
          <div className="space-y-1.5 text-sm">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between gap-3 py-1 border-b border-white/5 last:border-0">
                <span className="text-zinc-400 shrink-0">{new Date(h.createdAt).toLocaleDateString('pt-BR')}</span>
                <span className="flex-1 truncate text-zinc-300">{h.realmIds.map(realmName).join(', ')}</span>
                <span className="text-zinc-500 uppercase text-xs">{h.banca}</span>
                <span className={`font-semibold w-12 text-right ${(h.score ?? 0) >= 80 ? 'text-emerald-400' : (h.score ?? 0) >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{h.score}%</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
