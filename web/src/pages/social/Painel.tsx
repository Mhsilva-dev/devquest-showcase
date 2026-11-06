import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ConversaSummary, Realm, SocialOverview } from '@devquest/shared';
import { socialBooks } from '@devquest/shared';
import { api } from '../../lib/api.js';

// Painel da trilha Comunicação & Relações.
export function SocialPainel() {
  const nav = useNavigate();
  const [ov, setOv] = useState<SocialOverview | null>(null);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [convs, setConvs] = useState<ConversaSummary[]>([]);

  useEffect(() => {
    api.get<SocialOverview>('/social/overview').then(setOv).catch(() => {});
    api.get<Realm[]>('/social/realms').then(setRealms).catch(() => {});
    api.get<ConversaSummary[]>('/social/conversas').then(setConvs).catch(() => {});
  }, []);

  if (!ov) return <div className="text-sky-300 p-8">Carregando…</div>;

  const total = realms.reduce((n, r) => n + r.lessons.length, 0);
  const done = Object.values(ov.progress).filter((p) => p.status === 'done').length;

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow !text-sky-400">💬 Comunicação & Relações</p>
        <h1 className="text-3xl font-bold mt-1">Se comunicar melhor com as pessoas</h1>
        <p className="text-zinc-400 text-sm mt-1">Escutar, puxar assunto, dizer não, resolver conflitos e falar em público, com base nos livros e treinando em conversas simuladas.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => nav('/social/conversa')} className="card card-hover p-6 text-left bg-gradient-to-br from-sky-600/20 via-cyan-600/10 to-transparent border-sky-500/30">
          <div className="text-3xl">🎭</div>
          <h2 className="text-xl font-bold mt-2">Simulador de conversas</h2>
          <p className="text-sm text-zinc-300 mt-1">Treine uma conversa difícil com a IA no papel da outra pessoa: pedir aumento, dizer não, discordar, apoiar um amigo… No final, nota e como dizer melhor.</p>
        </button>
        <button onClick={() => nav('/social/mensagem')} className="card card-hover p-6 text-left border-white/10">
          <div className="text-3xl">✉️</div>
          <h2 className="text-xl font-bold mt-2">Reescrever mensagem</h2>
          <p className="text-sm text-zinc-300 mt-1">Vai mandar algo delicado no WhatsApp ou por e-mail? Cole aqui e veja como vai soar e 3 versões melhores antes de enviar.</p>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat icon="📚" label="Aulas" value={`${done}`} unit={`de ${total}`} />
        <Stat icon="🎭" label="Conversas" value={`${ov.conversas}`} unit={ov.media !== null ? `média ${ov.media}` : ''} onClick={() => nav('/social/conversa')} />
        <Stat icon="📖" label="Biblioteca" value={`${socialBooks.length}`} unit="livros" onClick={() => nav('/social/biblioteca')} />
        <Stat icon="🔁" label="Revisar" value={`${ov.dueCards}`} unit="cards" highlight={ov.dueCards > 0} onClick={() => nav('/social/revisao')} />
      </div>

      {convs.length > 0 && (
        <section className="card p-5">
          <h3 className="font-bold mb-3">🕒 Últimas conversas</h3>
          <div className="divide-y divide-white/5">
            {convs.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/social/conversa/${c.id}`} className="flex items-center gap-3 py-2.5 text-sm hover:bg-white/5 -mx-2 px-2 rounded-lg">
                <span>{c.emoji}</span>
                <span className="flex-1 min-w-0 truncate">{c.titulo}</span>
                <span className="text-xs text-zinc-500">{c.dificuldade}</span>
                {c.score === null ? <span className="text-xs text-amber-300">em andamento</span> : <span className={`font-semibold ${c.score >= 70 ? 'text-emerald-300' : c.score >= 50 ? 'text-amber-300' : 'text-red-300'}`}>{c.score}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-lg font-bold mb-3">🗺️ Trilhas</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {realms.map((r) => {
            const t = r.lessons.length;
            const d = r.lessons.filter((l) => ov.progress[l.id]?.status === 'done').length;
            const pct = Math.round((d / t) * 100);
            return (
              <Link key={r.id} to={`/social/trilha/${r.id}`} className="card card-hover p-5 group">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{r.emoji}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${pct === 100 ? 'bg-emerald-500/20 text-emerald-300' : d ? 'bg-sky-500/20 text-sky-300' : 'bg-white/5 text-zinc-500'}`}>{pct === 100 ? '✓ completo' : `${d}/${t}`}</span>
                </div>
                <h4 className="font-bold mt-3 group-hover:text-sky-300 transition">{r.title}</h4>
                <p className="text-sm text-zinc-400 mt-0.5 line-clamp-2">{r.tagline}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${pct}%` }} />
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
    <div onClick={onClick} className={`card p-4 ${onClick ? 'cursor-pointer card-hover' : ''} ${highlight ? 'border-sky-500/40 bg-sky-500/5' : ''}`}>
      <div className="flex items-center gap-2 text-zinc-400 text-xs"><span className="text-base">{icon}</span>{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-xs text-zinc-500">{unit}</span>}
      </div>
    </div>
  );
}
