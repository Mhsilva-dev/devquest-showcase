import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Career, Realm } from '@devquest/shared';
import { api } from '../../lib/api.js';

// Guia de concursos: carreiras com salário, banca, matérias e fases.
export function Guia() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [nivel, setNivel] = useState<'todos' | 'medio' | 'superior'>('todos');

  useEffect(() => {
    api.get<Career[]>('/concursos/careers').then(setCareers).catch(() => {});
    api.get<Realm[]>('/concursos/realms').then(setRealms).catch(() => {});
  }, []);

  const list = careers.filter((c) => nivel === 'todos' || c.escolaridade === nivel);

  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow !text-emerald-400">🎖️ Modo Concurso</p>
        <h1 className="text-2xl font-bold mt-1">Guia de concursos</h1>
        <p className="text-zinc-400 text-sm mt-1">Carreiras que pagam a partir de ~R$ 3 mil, com o que cai em cada uma.</p>
      </header>

      <div className="card p-4 border-amber-500/30 bg-amber-500/5 text-sm text-amber-100">
        ⚠️ Salários são <b>aproximados</b> (remuneração inicial de editais recentes) e requisitos mudam. <b>Sempre confira o edital mais novo</b> antes de decidir.
      </div>

      <div className="card p-4 text-sm text-zinc-300">
        <b className="text-emerald-300">♟️ A estratégia:</b> escolha uma <b>área</b> (policial, bancária, administrativa, legislativa), não um concurso só.
        Português, RLM, Informática, Constitucional e Administrativo caem em quase todos. Estudando a base, você fica pronto para vários editais ao mesmo tempo.
      </div>

      <div className="flex gap-2">
        {([['todos', 'Todos'], ['medio', 'Nível médio'], ['superior', 'Nível superior']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setNivel(v)} className={`px-3 py-1.5 rounded-lg border text-sm ${nivel === v ? 'border-emerald-500 bg-emerald-500/15' : 'border-white/10'}`}>{l}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {list.map((c) => (
          <div key={c.id} className="card p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold">{c.name}</h3>
                <p className="text-sm text-zinc-400">{c.orgao}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${c.escolaridade === 'medio' ? 'bg-sky-500/20 text-sky-300' : 'bg-violet-500/20 text-violet-300'}`}>
                {c.escolaridade === 'medio' ? 'Nível médio' : 'Superior (qualquer área)'}
              </span>
            </div>
            <p className="text-emerald-300 font-semibold mt-3">{c.salario}</p>
            <p className="text-xs text-zinc-500">Banca: {c.banca}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {c.materias.map((m) => {
                const r = realms.find((x) => x.id === m);
                return r ? <Link key={m} to={`/concursos/materia/${m}`} className="text-xs px-2 py-0.5 rounded bg-white/5 hover:bg-white/10">{r.emoji} {r.title}</Link> : null;
              })}
            </div>
            <p className="text-xs text-zinc-400 mt-3"><b className="text-zinc-300">Fases:</b> {c.fases.join(' → ')}</p>
            <p className="text-sm text-zinc-300 mt-2 flex-1">💡 {c.dica}</p>
            <Link to={`/concursos/plano?carreira=${c.id}`} className="mt-4 text-center py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-sm font-semibold transition">Montar plano para este</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
