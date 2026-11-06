import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { MenteOverview, MenteProtocol, Realm } from '@devquest/shared';
import { menteBooks } from '@devquest/shared';
import { api } from '../../lib/api.js';

type ProtResp = { protocol: MenteProtocol } | null;

// Painel da trilha Disciplina & Mente: check-in "nunca falhe duas vezes", protocolo e trilhas.
export function MentePainel() {
  const nav = useNavigate();
  const [ov, setOv] = useState<MenteOverview | null>(null);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [prot, setProt] = useState<ProtResp>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get<MenteOverview>('/mente/overview').then(setOv).catch(() => {});
    api.get<Realm[]>('/mente/realms').then(setRealms).catch(() => {});
    api.get<ProtResp>('/mente/protocol').then(setProt).catch(() => {});
  }, []);

  async function checkin(kind: 'minimo' | 'completo') {
    const r = await api.post<{ xpGain: number; overview: MenteOverview }>('/mente/checkin', { kind }).catch(() => null);
    if (!r) return;
    setOv(r.overview);
    setMsg(kind === 'completo' ? `💪 Dia completo registrado${r.xpGain ? ` · +${r.xpGain} XP` : ''}.` : `🪫 Mínimo feito. Dia salvo — a corrente não quebrou${r.xpGain ? ` · +${r.xpGain} XP` : ''}.`);
  }

  if (!ov) return <div className="text-orange-300 p-8">Carregando…</div>;

  const total = realms.reduce((n, r) => n + r.lessons.length, 0);
  const done = Object.values(ov.progress).filter((p) => p.status === 'done').length;
  const danger = !ov.today && !ov.yesterday && ov.best > 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow !text-orange-400">🔥 Disciplina & Mente</p>
          <h1 className="text-3xl font-bold mt-1">{ov.meta ? `Não largar: ${ov.meta}` : 'Disciplina que não depende de motivação'}</h1>
          <p className="text-zinc-400 text-sm mt-1">Hábitos, garra, estoicismo e foco, com base nos livros, e um protocolo feito para você não desistir.</p>
        </div>
        <button onClick={() => nav('/mente/dia-ruim')} className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-500 font-semibold text-sm transition">🆘 Estou quase desistindo</button>
      </header>

      {/* Check-in do dia */}
      <div className={`card p-6 ${danger ? 'border-red-500/50 bg-red-500/5' : ov.today ? 'border-emerald-500/40' : 'border-orange-500/30'}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className={`eyebrow ${danger ? '!text-red-300' : '!text-orange-300'}`}>Hoje</p>
            <h2 className="text-xl font-bold mt-1">
              {ov.today === 'completo' ? '✅ Dia completo. Missão cumprida.' : ov.today === 'minimo' ? '🪫 Mínimo feito. A corrente segue.' : danger ? 'Ontem ficou em branco. Hoje não pode.' : 'Já fez a sua parte hoje?'}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              {danger ? 'Regra de ouro: nunca falhe duas vezes seguidas. Não precisa ser perfeito, só não pode ser zero.' : 'Dia bom: faça o completo. Dia ruim: faça o mínimo. O que não vale é zerar.'}
            </p>
            {prot?.protocol.minimo && <p className="text-sm mt-3 border-l-2 border-orange-500/60 pl-3 text-orange-100"><b>Seu mínimo:</b> {prot.protocol.minimo}</p>}
          </div>
          <div className="text-center shrink-0">
            <div className="text-4xl font-bold text-orange-300">{ov.run}</div>
            <div className="text-xs text-zinc-400">dias seguidos</div>
            <div className="text-[0.7rem] text-zinc-500 mt-1">recorde {ov.best}</div>
          </div>
        </div>
        {ov.today !== 'completo' && (
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => checkin('completo')} className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition">✅ Fiz o dia completo</button>
            {!ov.today && <button onClick={() => checkin('minimo')} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 font-semibold transition">🪫 Fiz só o mínimo</button>}
          </div>
        )}
        {msg && <p className="text-sm text-zinc-300 mt-3">{msg}</p>}

        <div className="mt-5">
          <div className="grid grid-cols-7 gap-1.5 max-w-xs">
            {ov.days.map((d) => (
              <div key={d.date} title={`${new Date(`${d.date}T12:00:00`).toLocaleDateString('pt-BR')}: ${d.kind === 'completo' ? 'completo' : d.kind === 'minimo' ? 'mínimo' : 'sem check-in'}`}
                className={`aspect-square rounded-md ${d.kind === 'completo' ? 'bg-emerald-500' : d.kind === 'minimo' ? 'bg-amber-500/70' : 'bg-white/5'}`} />
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2">Últimas 5 semanas · <span className="text-emerald-400">■</span> completo · <span className="text-amber-400">■</span> mínimo</p>
        </div>
      </div>

      {!prot ? (
        <div className="card p-6 bg-gradient-to-br from-orange-600/20 via-red-600/10 to-transparent border-orange-500/30">
          <p className="eyebrow !text-orange-300">Passo 1</p>
          <h2 className="text-2xl font-bold mt-2">Monte seu protocolo anti-desistência</h2>
          <p className="text-zinc-300 mt-2 max-w-xl text-sm">Conte o que você não quer largar, por que importa e por que desistiu antes. A IA monta suas regras inegociáveis, o mínimo diário, os planos "se acontecer X, faço Y" e o roteiro do dia ruim.</p>
          <button onClick={() => nav('/mente/protocolo')} className="mt-5 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-semibold transition">🛡️ Criar meu protocolo</button>
        </div>
      ) : (
        <div className="card p-6 border-orange-500/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow !text-orange-300">Sua frase</p>
              <p className="text-lg font-semibold mt-2">“{prot.protocol.frase}”</p>
              <p className="text-sm text-zinc-400 mt-2">{prot.protocol.identidade}</p>
            </div>
            <Link to="/mente/protocolo" className="text-xs text-orange-300 hover:underline shrink-0">ver protocolo →</Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon="📚" label="Aulas" value={`${done}`} unit={`de ${total}`} />
        <Stat icon="🔥" label="Sequência" value={`${ov.run}`} unit="dias" />
        <Stat icon="📖" label="Biblioteca" value={`${menteBooks.length}`} unit="livros" onClick={() => nav('/mente/biblioteca')} />
        <Stat icon="🔁" label="Revisar" value={`${ov.dueCards}`} unit="cards" highlight={ov.dueCards > 0} onClick={() => nav('/mente/revisao')} />
      </div>

      <section>
        <h3 className="text-lg font-bold mb-3">🗺️ Trilhas</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {realms.map((r) => {
            const t = r.lessons.length;
            const d = r.lessons.filter((l) => ov.progress[l.id]?.status === 'done').length;
            const pct = Math.round((d / t) * 100);
            return (
              <Link key={r.id} to={`/mente/trilha/${r.id}`} className="card card-hover p-5 group">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{r.emoji}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pct === 100 ? 'bg-emerald-500/20 text-emerald-300' : d ? 'bg-orange-500/20 text-orange-300' : 'bg-white/5 text-zinc-500'}`}>{pct === 100 ? '✓ completo' : `${d}/${t}`}</span>
                </div>
                <h4 className="font-bold mt-3 group-hover:text-orange-300 transition">{r.title}</h4>
                <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">{r.tagline}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${pct}%` }} />
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
    <div onClick={onClick} className={`card p-4 ${onClick ? 'cursor-pointer card-hover' : ''} ${highlight ? 'border-orange-500/40 bg-orange-500/5' : ''}`}>
      <div className="flex items-center gap-2 text-zinc-400 text-xs"><span className="text-base">{icon}</span>{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-xs text-zinc-500">{unit}</span>}
      </div>
    </div>
  );
}
