import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import type { Career, Realm, StudyPlan, StudyPlanInput } from '@devquest/shared';
import { api } from '../../lib/api.js';

type PlanResp = { input: StudyPlanInput; plan: StudyPlan; updatedAt: string } | null;

// Plano de estudos estratégico: formulário → IA monta ciclo de estudos + semana + metas.
export function Plano() {
  const [params] = useSearchParams();
  const [careers, setCareers] = useState<Career[]>([]);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [saved, setSaved] = useState<PlanResp>(null);
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [careerId, setCareerId] = useState<string>(params.get('carreira') ?? '');
  const [target, setTarget] = useState('');
  const [hoursPerDay, setHours] = useState(2);
  const [daysPerWeek, setDays] = useState(6);
  const [examDate, setExamDate] = useState('');
  const [levels, setLevels] = useState<Record<string, 1 | 2 | 3>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<Career[]>('/concursos/careers').then(setCareers),
      api.get<Realm[]>('/concursos/realms').then(setRealms),
      api.get<PlanResp>('/concursos/plan').then((p) => {
        setSaved(p);
        if (p) {
          setCareerId(params.get('carreira') ?? p.input.careerId ?? ''); setTarget(p.input.target); setHours(p.input.hoursPerDay);
          setDays(p.input.daysPerWeek); setExamDate(p.input.examDate ?? ''); setLevels(p.input.levels);
        }
        if (!p || params.get('carreira')) setEditing(true);
      }),
    ]).catch(() => {}).finally(() => setLoaded(true));
  }, [params]);

  const career = careers.find((c) => c.id === careerId);
  useEffect(() => { if (career) setTarget(`${career.name} — ${career.orgao}`); }, [career]);

  const materias = (career?.materias ?? realms.filter((r) => r.id !== 'c-estrategia').map((r) => r.id))
    .map((id) => realms.find((r) => r.id === id)).filter((r): r is Realm => Boolean(r));

  async function generate() {
    setBusy(true); setErr('');
    try {
      const lv = Object.fromEntries(materias.map((m) => [m.id, levels[m.id] ?? 2]));
      const r = await api.post<PlanResp>('/concursos/plan', {
        careerId: careerId || undefined, target, hoursPerDay, daysPerWeek, examDate: examDate || undefined, levels: lv,
      });
      setSaved(r); setEditing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  if (!loaded) return <div className="text-emerald-300 p-8">Carregando…</div>;

  if (saved && !editing) return <PlanView data={saved} realms={realms} onEdit={() => setEditing(true)} />;

  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow !text-emerald-400">🎖️ Modo Concurso</p>
        <h1 className="text-2xl font-bold mt-1">Plano de estudos estratégico</h1>
        <p className="text-zinc-400 text-sm mt-1">Quanto mais honesto você for sobre tempo e nível, melhor o plano. Depois dos simulados, gere de novo: a IA usa seu desempenho real.</p>
      </header>

      <div className="card p-5 space-y-5">
        <div>
          <label className="font-semibold text-sm">1. Concurso-alvo</label>
          <select value={careerId} onChange={(e) => setCareerId(e.target.value)} className="mt-2 w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-sm">
            <option value="">Outro / ainda não sei (base geral)</option>
            <optgroup label="Nível médio">{careers.filter((c) => c.escolaridade === 'medio').map((c) => <option key={c.id} value={c.id}>{c.name} — {c.orgao} ({c.salario})</option>)}</optgroup>
            <optgroup label="Nível superior">{careers.filter((c) => c.escolaridade === 'superior').map((c) => <option key={c.id} value={c.id}>{c.name} — {c.orgao} ({c.salario})</option>)}</optgroup>
          </select>
          {!careerId && (
            <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Ex.: Área policial em geral, Câmara de Campinas…" className="mt-2 w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-sm" />
          )}
          {career && <p className="text-xs text-zinc-400 mt-2">💡 {career.dica}</p>}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-sm">2. Horas por dia</label>
            <input type="number" min={0.5} max={12} step={0.5} value={hoursPerDay} onChange={(e) => setHours(Number(e.target.value))} className="mt-2 w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-sm" />
          </div>
          <div>
            <label className="font-semibold text-sm">Dias por semana</label>
            <input type="number" min={1} max={7} value={daysPerWeek} onChange={(e) => setDays(Number(e.target.value))} className="mt-2 w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-sm" />
          </div>
          <div>
            <label className="font-semibold text-sm">Data da prova <span className="text-zinc-500 font-normal">(se souber)</span></label>
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="mt-2 w-full p-2.5 rounded-xl bg-black/30 border border-white/10 text-sm" />
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm mb-2">3. Seu nível em cada matéria</p>
          <div className="space-y-1.5">
            {materias.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{m.emoji} {m.title}</span>
                <div className="flex gap-1 shrink-0">
                  {([[1, 'Fraco'], [2, 'Médio'], [3, 'Forte']] as const).map(([v, l]) => (
                    <button key={v} onClick={() => setLevels((x) => ({ ...x, [m.id]: v }))}
                      className={`px-2.5 py-1 rounded-lg border text-xs ${(levels[m.id] ?? 2) === v ? (v === 1 ? 'border-red-500 bg-red-500/15' : v === 2 ? 'border-amber-500 bg-amber-500/15' : 'border-emerald-500 bg-emerald-500/15') : 'border-white/10'}`}>{l}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {err && <p className="text-red-400 text-sm">{err}</p>}
        <div className="flex gap-3">
          <button disabled={busy || target.length < 2} onClick={generate} className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold disabled:opacity-40 transition">
            {busy ? 'Montando sua estratégia…' : '🗓️ Gerar meu plano'}
          </button>
          {saved && <button onClick={() => setEditing(false)} className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm">Cancelar</button>}
        </div>
      </div>
    </div>
  );
}

function PlanView({ data, realms, onEdit }: { data: NonNullable<PlanResp>; realms: Realm[]; onEdit: () => void }) {
  const { plan, input } = data;
  const totalH = plan.ciclo.reduce((n, c) => n + c.horas, 0) || 1;
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="eyebrow !text-emerald-400">🗓️ Seu plano</p>
          <h1 className="text-2xl font-bold mt-1">{input.target}</h1>
          <p className="text-zinc-400 text-sm mt-1">{input.hoursPerDay}h/dia · {input.daysPerWeek} dias/semana{input.examDate && ` · prova em ${new Date(input.examDate + 'T12:00').toLocaleDateString('pt-BR')}`}</p>
        </div>
        <button onClick={onEdit} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm shrink-0">↻ Refazer plano</button>
      </header>

      <div className="card p-5 border-emerald-500/30"><p className="text-zinc-200">{plan.resumo}</p></div>

      <section className="card p-5">
        <h3 className="font-bold">🔄 Ciclo de estudos <span className="text-zinc-500 font-normal text-sm">({totalH}h por volta)</span></h3>
        <p className="text-xs text-zinc-500 mt-1">Estude na ordem; terminou a volta, começa de novo. Atrasou um dia? Continua de onde parou — o ciclo não "vence".</p>
        <div className="space-y-2 mt-4">
          {plan.ciclo.map((c, i) => {
            const r = realms.find((x) => x.id === c.realmId);
            return (
              <Link key={i} to={`/concursos/materia/${c.realmId}`} className="block card card-hover p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{r?.emoji}</span>
                  <span className="flex-1 font-medium">{c.materia}</span>
                  <span className="text-emerald-300 font-semibold">{c.horas}h</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${(c.horas / totalH) * 100}%` }} /></div>
                <p className="text-xs text-zinc-400 mt-2">🎯 {c.foco}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="card p-5">
        <h3 className="font-bold mb-3">📅 Semana-modelo</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {plan.semana.map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5">
              <p className="font-semibold text-sm text-emerald-300">{d.dia}</p>
              <ul className="text-sm text-zinc-300 mt-1 space-y-0.5 list-disc pl-4">{d.blocos.map((b, j) => <li key={j}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h3 className="font-bold mb-2">♟️ Estratégia</h3>
          <ul className="text-sm text-zinc-300 space-y-1.5 list-disc pl-4">{plan.estrategia.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </section>
        <section className="card p-5">
          <h3 className="font-bold mb-2">🏁 Metas</h3>
          <div className="space-y-2 text-sm">{plan.metas.map((m, i) => (
            <div key={i}><span className="text-emerald-300 font-semibold">{m.prazo}:</span> <span className="text-zinc-300">{m.meta}</span></div>
          ))}</div>
        </section>
      </div>

      {plan.alertas?.length > 0 && (
        <section className="card p-5 border-amber-500/30 bg-amber-500/5">
          <h3 className="font-bold mb-2 text-amber-200">⚠️ Atenção</h3>
          <ul className="text-sm text-amber-100/90 space-y-1 list-disc pl-4">{plan.alertas.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </section>
      )}
    </div>
  );
}
