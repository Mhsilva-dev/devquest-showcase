import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { FinancasOverview, FinancePlan, Realm } from '@devquest/shared';
import { api } from '../../lib/api.js';

type PlanResp = { plan: FinancePlan } | null;

// Painel da trilha de Finanças & Investimentos.
export function FinPainel() {
  const nav = useNavigate();
  const [ov, setOv] = useState<FinancasOverview | null>(null);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [plan, setPlan] = useState<PlanResp>(null);

  useEffect(() => {
    api.get<FinancasOverview>('/financas/overview').then(setOv).catch(() => {});
    api.get<Realm[]>('/financas/realms').then(setRealms).catch(() => {});
    api.get<PlanResp>('/financas/plan').then(setPlan).catch(() => {});
  }, []);

  if (!ov) return <div className="text-amber-300 p-8">Carregando…</div>;

  const total = realms.reduce((n, r) => n + r.lessons.length, 0);
  const done = Object.values(ov.progress).filter((p) => p.status === 'done').length;
  const priority = plan?.plan.trilha.map((t) => t.realmId) ?? [];
  const sorted = [...realms].sort((a, b) => {
    const ia = priority.indexOf(a.id), ib = priority.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow !text-amber-400">💰 Finanças & Investimentos</p>
        <h1 className="text-3xl font-bold mt-1">{ov.objetivo ? `Objetivo: ${ov.objetivo}` : 'Sua educação financeira completa'}</h1>
        <p className="text-zinc-400 text-sm mt-1">Do orçamento ao valuation, baseado nos clássicos (Graham, Buffett, Bogle, Housel, Dalio, Kahneman…) e no contexto brasileiro.</p>
      </header>

      {!plan ? (
        <div className="card p-6 bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent border-amber-500/30">
          <p className="eyebrow !text-amber-300">Passo 1</p>
          <h2 className="text-2xl font-bold mt-2">Monte seu plano financeiro</h2>
          <p className="text-zinc-300 mt-2 max-w-xl text-sm">Renda, gastos, dívidas e objetivo. A IA monta as fases (dívidas → reserva → investimentos), a alocação por classe de ativo e o que estudar primeiro.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => nav('/financas/plano')} className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-semibold transition">🎯 Criar meu plano</button>
            <button onClick={() => nav('/financas/biblioteca')} className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm">📚 Ver a biblioteca</button>
          </div>
        </div>
      ) : (
        <div className="card p-6 border-amber-500/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow !text-amber-300">Seu diagnóstico</p>
              <p className="text-sm text-zinc-300 mt-2 max-w-2xl">{plan.plan.diagnostico}</p>
            </div>
            <Link to="/financas/plano" className="text-xs text-amber-300 hover:underline shrink-0">ver plano →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
            <Num label="Aporte mensal" v={plan.plan.numeros.aporteMensalSugerido} />
            <Num label="Reserva ideal" v={plan.plan.numeros.reservaIdeal} />
            <Num label="Meta de independência" v={plan.plan.numeros.metaIndependencia} />
            <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-zinc-400">Anos para a meta</p><p className="font-bold text-amber-300">{plan.plan.numeros.anosParaMeta}</p></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon="📚" label="Aulas" value={`${done}`} unit={`de ${total}`} />
        <Stat icon="🗺️" label="Trilhas" value={`${realms.length}`} />
        <Stat icon="🧮" label="Calculadoras" value="4" onClick={() => nav('/financas/calculadoras')} />
        <Stat icon="🔁" label="Revisar" value={`${ov.dueCards}`} unit="cards" highlight={ov.dueCards > 0} onClick={() => nav('/financas/revisao')} />
      </div>

      <section>
        <h3 className="text-lg font-bold mb-3">🗺️ Trilhas</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((r) => {
            const t = r.lessons.length;
            const d = r.lessons.filter((l) => ov.progress[l.id]?.status === 'done').length;
            const pct = Math.round((d / t) * 100);
            const pri = priority.indexOf(r.id);
            const tiers = new Set(r.lessons.map((l) => l.tier ?? 1)).size;
            return (
              <Link key={r.id} to={`/financas/trilha/${r.id}`} className={`card card-hover p-5 group ${pri !== -1 ? 'border-amber-500/30' : ''}`}>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{r.emoji}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pct === 100 ? 'bg-emerald-500/20 text-emerald-300' : pri !== -1 ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-zinc-500'}`}>
                    {pct === 100 ? '✓ completo' : pri !== -1 ? `prioridade ${pri + 1}` : `${d}/${t}`}
                  </span>
                </div>
                <h4 className="font-bold mt-3 group-hover:text-amber-300 transition">{r.title}</h4>
                <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">{r.tagline}</p>
                <p className="text-xs text-zinc-500 mt-2">{t} aulas · {tiers} níveis</p>
                <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-zinc-500">Conteúdo educativo, não é recomendação de investimento.</p>
    </div>
  );
}

const brl = (v: number) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

function Num({ label, v }: { label: string; v: number }) {
  return <div className="p-3 rounded-xl bg-white/5"><p className="text-xs text-zinc-400">{label}</p><p className="font-bold text-amber-300">{brl(v)}</p></div>;
}

function Stat({ icon, label, value, unit, highlight, onClick }: { icon: string; label: string; value: string; unit?: string; highlight?: boolean; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`card p-4 ${onClick ? 'cursor-pointer card-hover' : ''} ${highlight ? 'border-amber-500/40 bg-amber-500/5' : ''}`}>
      <div className="flex items-center gap-2 text-zinc-400 text-xs"><span className="text-base">{icon}</span>{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-xs text-zinc-500">{unit}</span>}
      </div>
    </div>
  );
}
