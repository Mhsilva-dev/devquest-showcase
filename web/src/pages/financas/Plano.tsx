import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FinancePlan, FinancePlanInput, Realm } from '@devquest/shared';
import { api } from '../../lib/api.js';

type PlanResp = { input: FinancePlanInput; plan: FinancePlan; updatedAt: string } | null;

const EMPTY: FinancePlanInput = { rendaMensal: 0, gastosMensais: 0, dividas: 0, reserva: 0, investido: 0, idade: 25, objetivo: '', perfil: 'moderado', prazoAnos: 10 };
const brl = (v: number) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

// Plano financeiro estratégico gerado pela IA a partir da situação real do usuário.
export function FinPlano() {
  const [realms, setRealms] = useState<Realm[]>([]);
  const [saved, setSaved] = useState<PlanResp>(null);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [f, setF] = useState<FinancePlanInput>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<Realm[]>('/financas/realms').then(setRealms),
      api.get<PlanResp>('/financas/plan').then((p) => { setSaved(p); if (p) setF(p.input); else setEditing(true); }),
    ]).catch(() => {}).finally(() => setLoaded(true));
  }, []);

  const set = <K extends keyof FinancePlanInput>(k: K, v: FinancePlanInput[K]) => setF((x) => ({ ...x, [k]: v }));

  async function generate() {
    setBusy(true); setErr('');
    try {
      const r = await api.post<PlanResp>('/financas/plan', { ...f, jurosDividaMes: f.jurosDividaMes || undefined });
      setSaved(r); setEditing(false); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  async function remove() {
    if (!confirm('Apagar seu plano financeiro? Isso não dá para desfazer (mas você pode gerar outro quando quiser).')) return;
    try {
      await api.del('/financas/plan');
      setSaved(null); setF(EMPTY); setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) { setErr(e.message); }
  }

  if (!loaded) return <div className="text-amber-300 p-8">Carregando…</div>;
  if (saved && !editing) return <PlanView data={saved} realms={realms} onEdit={() => setEditing(true)} onDelete={remove} />;

  const num = (k: keyof FinancePlanInput, label: string, hint?: string) => (
    <div>
      <label className="font-semibold text-sm">{label}</label>
      <input type="number" min={0} value={(f[k] as number) || ''} onChange={(e) => set(k, Number(e.target.value) as any)}
        className="mt-1.5 w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-sm" placeholder="0" />
      {hint && <p className="text-xs text-zinc-500 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow !text-amber-400">💰 Finanças</p>
        <h1 className="text-2xl font-bold mt-1">Plano financeiro estratégico</h1>
        <p className="text-zinc-400 text-sm mt-1">Os dados ficam só na sua conta. Valores aproximados já bastam.</p>
      </header>
      <div className="card p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {num('rendaMensal', 'Renda líquida mensal (R$)')}
          {num('gastosMensais', 'Gastos mensais (R$)')}
          {num('dividas', 'Total em dívidas (R$)')}
          {num('jurosDividaMes', 'Juros da dívida (% ao mês)', 'Cartão/cheque especial costumam passar de 8% ao mês')}
          {num('reserva', 'Reserva de emergência atual (R$)')}
          {num('investido', 'Já investido (R$)')}
          {num('idade', 'Idade')}
          {num('prazoAnos', 'Prazo do objetivo (anos)')}
        </div>
        <div>
          <label className="font-semibold text-sm">Objetivo principal</label>
          <input value={f.objetivo} onChange={(e) => set('objetivo', e.target.value)} placeholder="Ex.: independência financeira, comprar casa, sair das dívidas…" className="mt-1.5 w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-sm" />
        </div>
        <div>
          <p className="font-semibold text-sm mb-2">Perfil de risco</p>
          <div className="flex gap-2">{(['conservador', 'moderado', 'arrojado'] as const).map((p) => (
            <button key={p} onClick={() => set('perfil', p)} className={`px-3 py-1.5 rounded-lg border text-sm capitalize ${f.perfil === p ? 'border-amber-500 bg-amber-500/15' : 'border-white/10'}`}>{p}</button>
          ))}</div>
        </div>
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <div className="flex gap-3">
          <button disabled={busy || f.objetivo.length < 2 || !f.rendaMensal} onClick={generate} className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-semibold disabled:opacity-40 transition">
            {busy ? 'Montando seu plano…' : '🎯 Gerar meu plano'}
          </button>
          {saved && <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm">Cancelar</button>}
        </div>
      </div>
    </div>
  );
}

function PlanView({ data, realms, onEdit, onDelete }: { data: NonNullable<PlanResp>; realms: Realm[]; onEdit: () => void; onDelete: () => void }) {
  const { plan, input } = data;
  const COLORS = ['bg-amber-500', 'bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-rose-500', 'bg-teal-500', 'bg-orange-500'];
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow !text-amber-400">🎯 Seu plano</p>
          <h1 className="text-2xl font-bold mt-1">{input.objetivo}</h1>
          <p className="text-zinc-400 text-sm mt-1">{brl(input.rendaMensal)}/mês · perfil {input.perfil} · {input.prazoAnos} anos</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onEdit} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm">↻ Refazer</button>
          <button onClick={onDelete} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm">🗑️ Apagar plano</button>
        </div>
      </header>

      <div className="card p-5 border-amber-500/30"><p className="text-zinc-200">{plan.diagnostico}</p></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Box label="Aporte mensal sugerido" v={brl(plan.numeros.aporteMensalSugerido)} />
        <Box label="Reserva ideal" v={brl(plan.numeros.reservaIdeal)} />
        <Box label="Meta de independência" v={brl(plan.numeros.metaIndependencia)} />
        <Box label="Anos para a meta" v={String(plan.numeros.anosParaMeta)} />
      </div>

      <section className="card p-5">
        <h3 className="font-bold mb-3">🪜 Fases</h3>
        <div className="space-y-3">
          {plan.fases.map((fa, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5">
              <div className="flex justify-between gap-2"><p className="font-semibold text-amber-300">{fa.fase}</p><span className="text-xs text-zinc-400 shrink-0">{fa.prazo}</span></div>
              <ul className="text-sm text-zinc-300 mt-1 list-disc pl-4 space-y-0.5">{fa.acoes.map((a, j) => <li key={j}>{a}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h3 className="font-bold mb-3">🥧 Alocação por classe de ativo</h3>
        <div className="flex h-4 rounded-full overflow-hidden">
          {plan.alocacao.map((a, i) => <div key={i} className={COLORS[i % COLORS.length]} style={{ width: `${a.percentual}%` }} title={a.classe} />)}
        </div>
        <div className="space-y-2 mt-4">
          {plan.alocacao.map((a, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className={`w-3 h-3 rounded-sm mt-1 shrink-0 ${COLORS[i % COLORS.length]}`} />
              <div><span className="font-semibold">{a.classe} · {a.percentual}%</span><p className="text-zinc-400">{a.porque}</p></div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h3 className="font-bold mb-2">🗺️ Estude nesta ordem</h3>
          <div className="space-y-2">{plan.trilha.map((t, i) => {
            const r = realms.find((x) => x.id === t.realmId);
            return (
              <Link key={i} to={`/financas/trilha/${t.realmId}`} className="block p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm">
                <span className="font-semibold">{i + 1}. {r?.emoji} {r?.title}</span><p className="text-zinc-400 text-xs mt-0.5">{t.motivo}</p>
              </Link>
            );
          })}</div>
        </section>
        <section className="card p-5">
          <h3 className="font-bold mb-2">📚 Livros para você</h3>
          <ul className="text-sm text-zinc-300 space-y-1.5 list-disc pl-4">{plan.livros.map((l, i) => <li key={i}>{l}</li>)}</ul>
          <Link to="/financas/biblioteca" className="text-xs text-amber-300 hover:underline mt-3 inline-block">Abrir biblioteca →</Link>
        </section>
      </div>

      <section className="card p-5 border-amber-500/30 bg-amber-500/5">
        <h3 className="font-bold mb-2 text-amber-200">⚠️ Atenção</h3>
        <ul className="text-sm text-amber-100/90 space-y-1 list-disc pl-4">{plan.alertas.map((a, i) => <li key={i}>{a}</li>)}</ul>
      </section>
    </div>
  );
}

function Box({ label, v }: { label: string; v: string }) {
  return <div className="card p-4"><p className="text-xs text-zinc-400">{label}</p><p className="text-lg font-bold text-amber-300 mt-1">{v}</p></div>;
}
