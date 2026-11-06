import { useEffect, useMemo, useRef, useState } from 'react';
import type { FocoStats, Realm } from '@devquest/shared';
import { api } from '../lib/api.js';

// Modo Foco: Pomodoro que registra horas líquidas por matéria.
// O timer guarda o horário de término no localStorage, então recarregar a página não perde o bloco.

type Phase = 'foco' | 'pausa';
type Timer = { phase: Phase; total: number; endsAt: number | null; left: number; subject: string };
const KEY = 'dq-foco-timer';
const PRESETS = { foco: [25, 50, 90], pausa: [5, 10, 15] };

function load(): Timer | null {
  try { return JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { return null; }
}
function save(t: Timer | null) {
  try { t ? localStorage.setItem(KEY, JSON.stringify(t)) : localStorage.removeItem(KEY); } catch { /* sem storage */ }
}
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const hm = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}` : `${m} min`);

function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.35, 0.7].forEach((t) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.25, ctx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.3);
    });
  } catch { /* sem áudio */ }
}

export function Foco() {
  const [stats, setStats] = useState<FocoStats | null>(null);
  const [realms, setRealms] = useState<{ track: string; list: Realm[] }[]>([]);
  const [timer, setTimer] = useState<Timer>(() => load() ?? { phase: 'foco', total: 25 * 60, endsAt: null, left: 25 * 60, subject: '' });
  const [now, setNow] = useState(Date.now());
  const [custom, setCustom] = useState('');
  const [msg, setMsg] = useState('');
  const [manual, setManual] = useState({ subject: '', minutes: 60, note: '' });
  const [goalEdit, setGoalEdit] = useState(false);
  const saving = useRef(false);

  useEffect(() => {
    api.get<FocoStats>('/foco/stats').then(setStats).catch(() => {});
    Promise.all([
      api.get<Realm[]>('/concursos/realms').catch(() => []),
      api.get<Realm[]>('/learn/realms').catch(() => []),
      api.get<Realm[]>('/financas/realms').catch(() => []),
      api.get<Realm[]>('/mente/realms').catch(() => []),
      api.get<Realm[]>('/social/realms').catch(() => []),
    ]).then(([c, d, f, m, s]) => setRealms([{ track: '🎖️ Concursos', list: c }, { track: '💻 Programação', list: d }, { track: '💰 Finanças', list: f }, { track: '🔥 Disciplina', list: m }, { track: '💬 Comunicação', list: s }]));
  }, []);

  useEffect(() => { save(timer); }, [timer]);

  const running = timer.endsAt !== null;
  const left = running ? Math.max(0, Math.round((timer.endsAt! - now) / 1000)) : timer.left;

  useEffect(() => {
    if (!running) { document.title = 'DevQuest'; return; }
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (running) document.title = `${fmt(left)} · ${timer.phase === 'foco' ? 'Foco' : 'Pausa'}`;
    if (running && left === 0) finish();
  }, [left, running]); // eslint-disable-line react-hooks/exhaustive-deps

  async function logSession(subject: string, minutes: number, note?: string) {
    const r = await api.post<{ xpGain: number; stats: FocoStats }>('/foco/session', { subject, minutes, note });
    setStats(r.stats);
    return r.xpGain;
  }

  async function finish() {
    if (saving.current) return;
    saving.current = true;
    beep();
    try {
      if (timer.phase === 'foco') {
        const min = Math.round(timer.total / 60);
        const xp = await logSession(timer.subject, min).catch(() => 0);
        setMsg(`✅ ${min} min de foco registrados${xp ? ` · +${xp} XP` : ''}. Hora da pausa!`);
        notify('Bloco de foco concluído! 🍅', 'Hora de uma pausa.');
        const p = PRESETS.pausa[0] * 60;
        setTimer({ ...timer, phase: 'pausa', total: p, left: p, endsAt: null });
      } else {
        setMsg('☕ Pausa acabou. Bora para o próximo bloco!');
        notify('Pausa encerrada', 'Bora para o próximo bloco de foco.');
        const f = PRESETS.foco[0] * 60;
        setTimer({ ...timer, phase: 'foco', total: f, left: f, endsAt: null });
      }
    } finally { saving.current = false; }
  }

  function notify(title: string, body: string) {
    try { if (Notification.permission === 'granted') new Notification(title, { body }); } catch { /* sem suporte */ }
  }

  function start() {
    if (timer.phase === 'foco' && !timer.subject) { setMsg('Escolha a matéria antes de começar.'); return; }
    setMsg('');
    try { if (Notification.permission === 'default') Notification.requestPermission(); } catch { /* sem suporte */ }
    setNow(Date.now());
    setTimer({ ...timer, endsAt: Date.now() + left * 1000 });
  }
  const pause = () => setTimer({ ...timer, endsAt: null, left });
  const setLen = (phase: Phase, min: number) => setTimer({ ...timer, phase, total: min * 60, left: min * 60, endsAt: null });

  // Encerrar antes do fim: salva o tempo já estudado
  async function stopAndSave() {
    const done = Math.floor((timer.total - left) / 60);
    setTimer({ ...timer, endsAt: null, left: timer.total });
    if (timer.phase === 'foco' && done >= 1) {
      const xp = await logSession(timer.subject, done).catch(() => 0);
      setMsg(`💾 ${done} min salvos${xp ? ` · +${xp} XP` : ''}.`);
    }
  }

  async function addManual() {
    if (!manual.subject.trim()) return setMsg('Escolha a matéria do lançamento.');
    const xp = await logSession(manual.subject, manual.minutes, manual.note || undefined).catch((e) => { setMsg(e.message); return null; });
    if (xp !== null) { setMsg(`➕ ${hm(manual.minutes)} lançados · +${xp} XP`); setManual({ ...manual, note: '' }); }
  }

  const subjectOptions = useMemo(() => realms.map((g) => (
    <optgroup key={g.track} label={g.track}>
      {g.list.map((r) => <option key={r.id} value={r.id}>{r.emoji} {r.title}</option>)}
    </optgroup>
  )), [realms]);

  const pct = 1 - left / timer.total;
  const R = 110, C = 2 * Math.PI * R;
  const isFoco = timer.phase === 'foco';
  const maxDay = Math.max(stats?.goalMinutes ?? 60, ...(stats?.days.map((d) => d.minutes) ?? [0]));
  const maxSubj = Math.max(1, ...(stats?.bySubject.map((s) => s.minutes) ?? [0]));

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow !text-rose-400">🍅 Modo Foco</p>
        <h1 className="text-3xl font-bold mt-1">Horas líquidas de estudo</h1>
        <p className="text-zinc-400 text-sm mt-1">Pomodoro por matéria. Cada bloco concluído é registrado e vale 1 XP a cada 5 min.</p>
      </header>

      <div className="grid lg:grid-cols-[1fr_20rem] gap-4">
        {/* Timer */}
        <div className={`card p-6 flex flex-col items-center ${isFoco ? 'border-rose-500/30' : 'border-cyan-500/30'}`}>
          <div className="flex gap-2 mb-4">
            {(['foco', 'pausa'] as Phase[]).map((p) => (
              <button key={p} disabled={running} onClick={() => setLen(p, PRESETS[p][0])}
                className={`px-4 py-1.5 rounded-full text-sm transition disabled:opacity-50 ${timer.phase === p ? (p === 'foco' ? 'bg-rose-500/25 text-rose-200' : 'bg-cyan-500/25 text-cyan-200') : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}>
                {p === 'foco' ? '🍅 Foco' : '☕ Pausa'}
              </button>
            ))}
          </div>

          <div className="relative w-64 h-64">
            <svg viewBox="0 0 240 240" className="w-64 h-64 -rotate-90">
              <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
              <circle cx="120" cy="120" r={R} fill="none" stroke={isFoco ? '#fb7185' : '#22d3ee'} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C - C * pct} style={{ transition: 'stroke-dashoffset .5s linear' }} />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="text-6xl font-bold font-mono tabular-nums">{fmt(left)}</div>
                <div className="text-xs text-zinc-400 mt-1">{isFoco ? (timer.subject ? subjectName(realms, timer.subject) : 'escolha a matéria') : 'descanse longe da tela'}</div>
              </div>
            </div>
          </div>

          {isFoco && (
            <select value={timer.subject} disabled={running} onChange={(e) => setTimer({ ...timer, subject: e.target.value })}
              className="mt-5 w-full max-w-sm bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm disabled:opacity-60">
              <option value="">— Matéria deste bloco —</option>
              {subjectOptions}
              <option value="Outro">📌 Outro</option>
            </select>
          )}

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {PRESETS[timer.phase].map((m) => (
              <button key={m} disabled={running} onClick={() => setLen(timer.phase, m)}
                className={`px-3 py-1 rounded-lg text-sm disabled:opacity-40 ${timer.total === m * 60 ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'}`}>{m} min</button>
            ))}
            <input value={custom} disabled={running} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ''))} placeholder="outro"
              onKeyDown={(e) => { if (e.key === 'Enter' && Number(custom) > 0) setLen(timer.phase, Math.min(180, Number(custom))); }}
              className="w-16 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-sm text-center disabled:opacity-40" />
          </div>

          <div className="flex gap-3 mt-6">
            {!running
              ? <button onClick={start} className={`px-8 py-3 rounded-xl font-semibold text-lg transition ${isFoco ? 'bg-rose-600 hover:bg-rose-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}>▶ {left < timer.total ? 'Continuar' : 'Começar'}</button>
              : <button onClick={pause} className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold text-lg transition">⏸ Pausar</button>}
            {left < timer.total && <button onClick={stopAndSave} className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">{isFoco ? '⏹ Encerrar e salvar' : '⏭ Pular pausa'}</button>}
          </div>
          {msg && <p className="mt-4 text-sm text-zinc-300 text-center">{msg}</p>}
        </div>

        {/* Hoje */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow !text-rose-300">Hoje</p>
              <button onClick={() => setGoalEdit(!goalEdit)} className="text-xs text-zinc-500 hover:text-zinc-300">meta: {hm(stats?.goalMinutes ?? 120)} ✎</button>
            </div>
            <p className="text-4xl font-bold mt-2">{hm(stats?.todayMinutes ?? 0)}</p>
            <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all" style={{ width: `${Math.min(100, ((stats?.todayMinutes ?? 0) / (stats?.goalMinutes ?? 120)) * 100)}%` }} />
            </div>
            {goalEdit && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[60, 120, 180, 240, 300, 360].map((m) => (
                  <button key={m} onClick={() => api.post<FocoStats>('/foco/goal', { minutes: m }).then((s) => { setStats(s); setGoalEdit(false); })}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs">{hm(m)}</button>
                ))}
              </div>
            )}
            <p className="text-xs text-zinc-500 mt-3">Últimos 7 dias: <span className="text-zinc-300 font-semibold">{hm(stats?.weekMinutes ?? 0)}</span></p>
          </div>

          <div className="card p-5">
            <p className="eyebrow">Lançar à mão</p>
            <p className="text-xs text-zinc-500 mt-1">Estudou longe do app? Registre aqui.</p>
            <select value={manual.subject} onChange={(e) => setManual({ ...manual, subject: e.target.value })}
              className="mt-3 w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm">
              <option value="">— Matéria —</option>
              {subjectOptions}
              <option value="Outro">📌 Outro</option>
            </select>
            <div className="flex gap-2 mt-2">
              <input type="number" min={5} max={300} step={5} value={manual.minutes} onChange={(e) => setManual({ ...manual, minutes: Number(e.target.value) })}
                className="w-20 bg-zinc-900 border border-white/10 rounded-lg px-2 py-2 text-sm" />
              <span className="self-center text-xs text-zinc-500">min</span>
              <input value={manual.note} maxLength={300} onChange={(e) => setManual({ ...manual, note: e.target.value })} placeholder="nota (opcional)"
                className="flex-1 min-w-0 bg-zinc-900 border border-white/10 rounded-lg px-2 py-2 text-sm" />
            </div>
            <button onClick={addManual} className="mt-3 w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-semibold">➕ Lançar</button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid lg:grid-cols-2 gap-4">
          <section className="card p-5">
            <h3 className="font-bold mb-4">📅 Últimos 14 dias</h3>
            <div className="flex items-end gap-1.5 h-40">
              {stats.days.map((d) => {
                const hit = d.minutes >= stats.goalMinutes;
                const wd = new Date(`${d.date}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'narrow' });
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end" title={`${new Date(`${d.date}T12:00:00`).toLocaleDateString('pt-BR')}: ${hm(d.minutes)}`}>
                    <div className={`w-full rounded-t-md ${hit ? 'bg-emerald-500' : d.minutes ? 'bg-rose-500/70' : 'bg-white/5'}`} style={{ height: `${Math.max(3, (d.minutes / maxDay) * 100)}%` }} />
                    <span className="text-[0.6rem] text-zinc-500">{wd}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-zinc-500 mt-3">Verde = bateu a meta de {hm(stats.goalMinutes)}.</p>
          </section>

          <section className="card p-5">
            <h3 className="font-bold mb-4">📊 Por matéria (7 dias)</h3>
            {stats.bySubject.length === 0
              ? <p className="text-sm text-zinc-500">Nenhum bloco ainda. Comece um foco acima.</p>
              : <div className="space-y-2.5">
                {stats.bySubject.map((s) => (
                  <div key={s.subject} className="flex items-center gap-3 text-sm">
                    <span className="w-44 truncate text-zinc-300">{s.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${(s.minutes / maxSubj) * 100}%` }} /></div>
                    <span className="w-16 text-right text-zinc-400">{hm(s.minutes)}</span>
                  </div>
                ))}
              </div>}
          </section>

          {stats.recent.length > 0 && (
            <section className="card p-5 lg:col-span-2">
              <h3 className="font-bold mb-3">🕒 Blocos recentes</h3>
              <div className="divide-y divide-white/5">
                {stats.recent.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 py-2 text-sm">
                    <span className="text-zinc-500 w-28 shrink-0">{new Date(s.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex-1 min-w-0 truncate">{s.label}{s.note && <span className="text-zinc-500"> · {s.note}</span>}</span>
                    <span className="text-rose-300 font-semibold">{hm(s.minutes)}</span>
                    <button onClick={() => confirm('Apagar este bloco?') && api.del<FocoStats>(`/foco/session/${s.id}`).then(setStats)} className="text-zinc-600 hover:text-red-400" aria-label="Apagar">✕</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function subjectName(groups: { list: Realm[] }[], id: string) {
  for (const g of groups) { const r = g.list.find((x) => x.id === id); if (r) return `${r.emoji} ${r.title}`; }
  return id;
}
