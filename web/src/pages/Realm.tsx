import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Realm as RealmT, Track } from '@devquest/shared';
import { TIER_NAMES } from '@devquest/shared';
import { api } from '../lib/api.js';
import { TRACK_UI } from '../lib/tracks.js';

type Prog = { progress: Record<string, { status: string; score: number | null }> };

export function Realm({ track = 'dev' }: { track?: Track }) {
  const { id } = useParams();
  const [realm, setRealm] = useState<RealmT | null>(null);
  const [ov, setOv] = useState<Prog | null>(null);
  const { api: base, home, homeLabel, realmLabel } = TRACK_UI[track];

  useEffect(() => {
    api.get<RealmT[]>(`${base}/realms`).then((rs) => setRealm(rs.find((r) => r.id === id) ?? null));
    api.get<Prog>(`${base}/overview`).then(setOv);
  }, [id, base]);

  if (!realm || !ov) return <div className="text-violet-300 p-8">Carregando…</div>;

  const total = realm.lessons.length;
  const done = realm.lessons.filter((l) => ov.progress[l.id]?.status === 'done').length;
  const pct = Math.round((done / total) * 100);
  let prevDone = true; // a trilha é sequencial
  return (
    <div className="space-y-5">
      <Link to={home} className="text-sm text-zinc-400 hover:text-white">← {homeLabel}</Link>
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-6 text-[7rem] opacity-10 select-none">{realm.emoji}</div>
        <p className="eyebrow">{realmLabel}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-4xl">{realm.emoji}</span>
          <h1 className="text-2xl font-bold">{realm.title}</h1>
        </div>
        <p className="text-zinc-400 mt-2">{realm.tagline}</p>
        <p className="text-sm text-violet-200 mt-3 border-l-2 border-violet-500 pl-3">💪 {realm.why}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-zinc-400 shrink-0">{done}/{total} · {pct}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {realm.lessons.map((l, i) => {
          const status = ov.progress[l.id]?.status;
          const locked = !prevDone && status !== 'done';
          const score = ov.progress[l.id]?.score;
          prevDone = status === 'done';
          const tier = l.tier ?? 1;
          const newTier = i === 0 || (realm.lessons[i - 1].tier ?? 1) !== tier;
          const tierLessons = realm.lessons.filter((x) => (x.tier ?? 1) === tier);
          const tierDone = tierLessons.filter((x) => ov.progress[x.id]?.status === 'done').length;
          return (
            <div key={l.id}>
              {newTier && (
                <div className="flex items-center gap-3 pt-4 pb-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${tier === 1 ? 'bg-sky-500/15 text-sky-300' : tier === 2 ? 'bg-violet-500/15 text-violet-300' : 'bg-amber-500/15 text-amber-300'}`}>
                    {'★'.repeat(tier)} Nível {tier} · {TIER_NAMES[tier] ?? ''}
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-zinc-500">{tierDone}/{tierLessons.length}</span>
                </div>
              )}
              <LessonRow index={i + 1} id={l.id} title={l.title} minutes={l.minutes}
                boss={l.boss} status={status} score={score} locked={locked} books={l.books} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonRow({ index, id, title, minutes, boss, status, score, locked, books }:
  { index: number; id: string; title: string; minutes: number; boss?: boolean; status?: string; score?: number | null; locked: boolean; books?: string[] }) {
  const done = status === 'done';
  const badge = done
    ? <span className="w-9 h-9 grid place-items-center rounded-xl bg-emerald-500/20 text-emerald-300 text-lg shrink-0">✓</span>
    : locked
      ? <span className="w-9 h-9 grid place-items-center rounded-xl bg-white/5 text-zinc-500 text-sm shrink-0">🔒</span>
      : boss
        ? <span className="w-9 h-9 grid place-items-center rounded-xl bg-amber-500/20 text-amber-300 text-lg shrink-0">👑</span>
        : <span className="w-9 h-9 grid place-items-center rounded-xl bg-violet-500/15 text-violet-300 font-semibold text-sm shrink-0">{index}</span>;
  const inner = (
    <div className={`card p-3.5 flex items-center gap-3 ${locked ? 'opacity-50' : 'card-hover'} ${boss ? 'border-amber-500/30' : ''}`}>
      {badge}
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{boss && <span className="text-amber-400">Chefão · </span>}{title}</div>
        <div className="text-xs text-zinc-500 truncate">{minutes} min{score != null && ` · nota ${score}`}{books?.length ? ` · 📚 ${books.join(' · ')}` : ''}</div>
      </div>
      {!locked && !done && <span className="text-zinc-500 text-sm">→</span>}
    </div>
  );
  return locked ? <div>{inner}</div> : <Link to={`/lesson/${id}`}>{inner}</Link>;
}
