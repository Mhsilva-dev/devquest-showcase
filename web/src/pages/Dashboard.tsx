import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Overview, Realm } from '@devquest/shared';
import { api } from '../lib/api.js';

export function Dashboard() {
  const nav = useNavigate();
  const [ov, setOv] = useState<Overview | null>(null);
  const [realms, setRealms] = useState<Realm[]>([]);

  useEffect(() => {
    api.get<Overview>('/learn/overview').then(setOv).catch(() => {});
    api.get<Realm[]>('/learn/realms').then(setRealms).catch(() => {});
  }, []);

  if (!ov) return <div className="text-violet-300 p-8">Carregando mapa…</div>;

  const totalLessons = realms.reduce((n, r) => n + r.lessons.length, 0);
  const done = Object.values(ov.progress).filter((p) => p.status === 'done').length;
  const pctAll = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{greet}</p>
          <h1 className="text-3xl font-bold mt-1">Olá, {ov.me.name.split(' ')[0]} 👋</h1>
          <p className="text-zinc-400 text-sm mt-1">{done} de {totalLessons} missões · {pctAll}% da jornada</p>
        </div>
        <LevelRing level={ov.me.level} pct={pctAll} />
      </header>

      {/* Hero: próxima missão */}
      {ov.next && (
        <div className="card p-6 relative overflow-hidden bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent border-violet-500/30">
          <p className="eyebrow">Continuar de onde parou</p>
          <h2 className="text-2xl font-bold mt-2 max-w-xl">{ov.next.title}</h2>
          <div className="flex items-center gap-3 mt-5">
            <button onClick={() => nav(`/lesson/${ov.next!.lessonId}`)}
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-lg transition shadow-lg shadow-violet-900/40">
              ▶ Começar missão
            </button>
            {ov.dueCards > 0 && (
              <button onClick={() => nav('/review')} className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm">
                🔁 Revisar {ov.dueCards} cards
              </button>
            )}
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon="🔥" label="Sequência" value={`${ov.me.streak}`} unit="dias" />
        <Stat icon="🍅" label="Foco hoje" value={`${ov.todayMinutes}`} unit="min" onClick={() => nav('/foco')} />
        <Stat icon="📚" label="Concluídas" value={`${done}`} unit={`de ${totalLessons}`} />
        <Stat icon="🔁" label="Revisar hoje" value={`${ov.dueCards}`} unit="cards" highlight={ov.dueCards > 0} onClick={() => nav('/review')} />
      </div>

      {!ov.me.aiEnabled && (
        <div className="card p-4 border-amber-500/30 bg-amber-500/5 text-sm text-amber-200">
          💡 A IA está desligada. Adicione <code>GEMINI_API_KEY</code> no <code>.env</code> para liberar correção automática, geração de aulas e o modo entrevista.
        </div>
      )}

      {/* Mapa de reinos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">🗺️ Mapa de habilidades</h3>
          <span className="text-xs text-zinc-500">{realms.length} reinos</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {realms.map((r) => {
            const total = r.lessons.length;
            const rdone = r.lessons.filter((l) => ov.progress[l.id]?.status === 'done').length;
            const pct = Math.round((rdone / total) * 100);
            const started = rdone > 0;
            return (
              <Link key={r.id} to={`/realm/${r.id}`} className="card card-hover p-5 group relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <span className="text-3xl drop-shadow">{r.emoji}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pct === 100 ? 'bg-emerald-500/20 text-emerald-300' : started ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-zinc-500'}`}>
                    {pct === 100 ? '✓ completo' : `${rdone}/${total}`}
                  </span>
                </div>
                <h4 className="font-bold mt-3 group-hover:text-violet-300 transition">{r.title}</h4>
                <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">{r.tagline}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function LevelRing({ level, pct }: { level: number; pct: number }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 64 64" className="w-20 h-20 -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="url(#g)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} />
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#ec4899" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><div className="text-lg font-bold leading-none">{level}</div><div className="text-[0.6rem] text-zinc-400">nível</div></div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, unit, highlight, onClick }: { icon: string; label: string; value: string; unit?: string; highlight?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`card p-4 ${onClick ? 'cursor-pointer card-hover' : ''} ${highlight ? 'border-cyan-500/40 bg-cyan-500/5' : ''}`}>
      <div className="flex items-center gap-2 text-zinc-400 text-xs"><span className="text-base">{icon}</span>{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-xs text-zinc-500">{unit}</span>}
      </div>
    </div>
  );
}
