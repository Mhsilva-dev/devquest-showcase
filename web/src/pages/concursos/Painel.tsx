import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ConcursoOverview, Realm, StudyPlan } from '@devquest/shared';
import { api } from '../../lib/api.js';

type PlanResp = { input: { target: string }; plan: StudyPlan; updatedAt: string } | null;

// Painel do Modo Concurso: separado da trilha de programação.
export function Painel() {
  const nav = useNavigate();
  const [ov, setOv] = useState<ConcursoOverview | null>(null);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [plan, setPlan] = useState<PlanResp>(null);

  useEffect(() => {
    api.get<ConcursoOverview>('/concursos/overview').then(setOv).catch(() => {});
    api.get<Realm[]>('/concursos/realms').then(setRealms).catch(() => {});
    api.get<PlanResp>('/concursos/plan').then(setPlan).catch(() => {});
  }, []);

  if (!ov) return <div className="text-emerald-300 p-8">Carregando…</div>;

  const total = realms.reduce((n, r) => n + r.lessons.length, 0);
  const done = Object.values(ov.progress).filter((p) => p.status === 'done').length;
  const answered = ov.stats.reduce((n, s) => n + s.answered, 0);
  const correct = ov.stats.reduce((n, s) => n + s.correct, 0);
  const acc = answered ? Math.round((correct / answered) * 100) : 0;
  // Ordem: matérias do ciclo do plano primeiro
  const inPlan = new Set(plan?.plan.ciclo.map((c) => c.realmId) ?? []);
  const sorted = [...realms].sort((a, b) => Number(inPlan.has(b.id)) - Number(inPlan.has(a.id)));

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow !text-emerald-400">🎖️ Modo Concurso</p>
        <h1 className="text-3xl font-bold mt-1">{ov.target ? `Rumo a: ${ov.target}` : 'Sua preparação para concursos'}</h1>
        <p className="text-zinc-400 text-sm mt-1">Método + matérias que caem em quase todo edital + simulados no estilo da banca.</p>
      </header>

      {!plan ? (
        <div className="card p-6 bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-transparent border-emerald-500/30">
          <p className="eyebrow !text-emerald-300">Passo 1</p>
          <h2 className="text-2xl font-bold mt-2">Monte seu plano estratégico</h2>
          <p className="text-zinc-300 mt-2 max-w-xl text-sm">Escolha o concurso-alvo, diga quanto tempo você tem e onde está fraco. A IA monta seu ciclo de estudos e a semana.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => nav('/concursos/plano')} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition">🗓️ Criar meu plano</button>
            <button onClick={() => nav('/concursos/guia')} className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm">🧭 Ver concursos (médio ≥ R$ 3 mil)</button>
          </div>
        </div>
      ) : (
        <div className="card p-6 border-emerald-500/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow !text-emerald-300">Seu ciclo de estudos</p>
              <p className="text-sm text-zinc-300 mt-2 max-w-2xl">{plan.plan.resumo}</p>
            </div>
            <Link to="/concursos/plano" className="text-xs text-emerald-300 hover:underline shrink-0">ver plano completo →</Link>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {plan.plan.ciclo.map((c) => (
              <Link key={c.realmId} to={`/concursos/materia/${c.realmId}`} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm hover:bg-emerald-500/20 transition">
                {c.materia} <span className="text-emerald-300 font-semibold">{c.horas}h</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon="📚" label="Aulas" value={`${done}`} unit={`de ${total}`} />
        <Stat icon="📝" label="Simulados" value={`${ov.simulados}`} onClick={() => nav('/concursos/simulado')} />
        <Stat icon="🎯" label="Acerto geral" value={answered ? `${acc}%` : '—'} unit={answered ? `${answered} questões` : ''} />
        <Stat icon="🔁" label="Caderno de erros" value={`${ov.dueCards}`} unit="p/ revisar" highlight={ov.dueCards > 0} onClick={() => nav('/concursos/revisao')} />
      </div>

      {ov.stats.length > 0 && (
        <section className="card p-5">
          <h3 className="font-bold mb-3">📊 Desempenho por matéria</h3>
          <div className="space-y-2.5">
            {[...ov.stats].sort((a, b) => a.pct - b.pct).map((s) => {
              const r = realms.find((x) => x.id === s.realmId);
              const color = s.pct >= 80 ? 'bg-emerald-500' : s.pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
              return (
                <div key={s.realmId} className="flex items-center gap-3 text-sm">
                  <span className="w-48 truncate text-zinc-300">{r?.emoji} {r?.title ?? s.realmId}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden"><div className={`h-full ${color}`} style={{ width: `${s.pct}%` }} /></div>
                  <span className="w-24 text-right text-zinc-400">{s.pct}% · {s.answered}q</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-zinc-500 mt-3">Abaixo de 60% = prioridade. A meta de aprovação costuma ser 80%+.</p>
        </section>
      )}

      <section>
        <h3 className="text-lg font-bold mb-3">📚 Matérias</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((r) => {
            const t = r.lessons.length;
            const d = r.lessons.filter((l) => ov.progress[l.id]?.status === 'done').length;
            const pct = Math.round((d / t) * 100);
            return (
              <Link key={r.id} to={`/concursos/materia/${r.id}`} className={`card card-hover p-5 group ${inPlan.has(r.id) ? 'border-emerald-500/30' : ''}`}>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{r.emoji}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pct === 100 ? 'bg-emerald-500/20 text-emerald-300' : d ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-zinc-500'}`}>
                    {inPlan.has(r.id) && pct < 100 ? '⭐ no plano · ' : ''}{pct === 100 ? '✓ completo' : `${d}/${t}`}
                  </span>
                </div>
                <h4 className="font-bold mt-3 group-hover:text-emerald-300 transition">{r.title}</h4>
                <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">{r.tagline}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value, unit, highlight, onClick }: { icon: string; label: string; value: string; unit?: string; highlight?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`card p-4 ${onClick ? 'cursor-pointer card-hover' : ''} ${highlight ? 'border-emerald-500/40 bg-emerald-500/5' : ''}`}>
      <div className="flex items-center gap-2 text-zinc-400 text-xs"><span className="text-base">{icon}</span>{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-xs text-zinc-500">{unit}</span>}
      </div>
    </div>
  );
}
