import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Book, BookSummary, Realm } from '@devquest/shared';
import { api } from '../../lib/api.js';

type BookBase = Omit<Book, 'theme'>;
type BookItem = BookBase & { hasSummary: boolean };
const LEVEL = { 1: 'Iniciante', 2: 'Intermediário', 3: 'Avançado' } as const;

// Cada trilha com biblioteca (Finanças, Disciplina) usa esta mesma tela; muda só a API, as cores e os textos.
const CFG = {
  financas: {
    base: '/financas', trail: '/financas/trilha', eyebrow: '💰 Finanças', accent: '!text-amber-400', strong: 'text-amber-300', light: 'text-amber-200',
    pill: 'border-amber-500 bg-amber-500/15', chip: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
    order: 'A Psicologia Financeira → Homem Mais Rico da Babilônia → Eu Te Ensino a Ficar Rico → Bogle → O Investidor Inteligente → Rápido e Devagar → Valuation.',
  },
  mente: {
    base: '/mente', trail: '/mente/trilha', eyebrow: '🔥 Disciplina & Mente', accent: '!text-orange-400', strong: 'text-orange-300', light: 'text-orange-200',
    pill: 'border-orange-500 bg-orange-500/15', chip: 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20',
    order: 'Hábitos Atômicos → Mindset → Garra → O Obstáculo é o Caminho → Trabalho Focado → Em Busca de Sentido → Meditações.',
  },
  social: {
    base: '/social', trail: '/social/trilha', eyebrow: '💬 Comunicação & Relações', accent: '!text-sky-400', strong: 'text-sky-300', light: 'text-sky-200',
    pill: 'border-sky-500 bg-sky-500/15', chip: 'bg-sky-500/10 border-sky-500/20 hover:bg-sky-500/20',
    order: 'Como Fazer Amigos e Influenciar Pessoas → Comunicação Não-Violenta → Você Não Está Escutando → Conversas Difíceis → Negocie Como se Sua Vida Dependesse Disso.',
  },
} as const;
type Lib = keyof typeof CFG;

// Biblioteca: os clássicos com resumo de estudo + plano de ação gerados pela IA.
export function Biblioteca({ track = 'financas' }: { track?: Lib }) {
  const cfg = CFG[track];
  const { id } = useParams();
  const [list, setList] = useState<BookItem[]>([]);
  const [realms, setRealms] = useState<Realm[]>([]);
  const [lvl, setLvl] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    api.get<BookItem[]>(`${cfg.base}/books`).then(setList).catch(() => {});
    api.get<Realm[]>(`${cfg.base}/realms`).then(setRealms).catch(() => {});
  }, [id, cfg.base]);

  if (id) return <BookPage id={id} realms={realms} track={track} />;

  const shown = list.filter((b) => !lvl || b.level === lvl);
  return (
    <div className="space-y-5">
      <header>
        <p className={`eyebrow ${cfg.accent}`}>{cfg.eyebrow}</p>
        <h1 className="text-2xl font-bold mt-1">Biblioteca</h1>
        <p className="text-zinc-400 text-sm mt-1">{list.length} clássicos. Abra um livro para ver o resumo de estudo, as lições e um plano de ação.</p>
      </header>
      <div className="card p-4 text-sm text-zinc-300">
        <b className={cfg.strong}>Ordem sugerida:</b> {cfg.order}
        <p className="text-xs text-zinc-500 mt-1">Os resumos ajudam a estudar, mas não substituem ler o livro.</p>
      </div>
      <div className="flex gap-2">{([[0, 'Todos'], [1, 'Iniciante'], [2, 'Intermediário'], [3, 'Avançado']] as const).map(([v, l]) => (
        <button key={v} onClick={() => setLvl(v)} className={`px-3 py-1.5 rounded-lg border text-sm ${lvl === v ? cfg.pill : 'border-white/10'}`}>{l}</button>
      ))}</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shown.map((b) => (
          <Link key={b.id} to={`${cfg.base}/biblioteca/${b.id}`} className="card card-hover p-4 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">📖</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">{LEVEL[b.level]}</span>
            </div>
            <h3 className="font-bold mt-2">{b.title}</h3>
            <p className="text-xs text-zinc-500">{b.author}</p>
            <p className="text-sm text-zinc-300 mt-2 flex-1">{b.why}</p>
            <p className={`text-xs mt-3 ${cfg.strong}`}>{b.hasSummary ? '✓ resumo pronto' : '✨ gerar resumo'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BookPage({ id, realms, track }: { id: string; realms: Realm[]; track: Lib }) {
  const cfg = CFG[track];
  const [data, setData] = useState<{ book: BookBase; summary: BookSummary } | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setData(null); setErr('');
    api.get<{ book: BookBase; summary: BookSummary }>(`${cfg.base}/books/${id}`).then(setData).catch((e) => setErr(e.message));
  }, [id, cfg.base]);

  if (err) return <div className="card p-6"><p className="text-red-400">{err}</p><Link to={`${cfg.base}/biblioteca`} className={`${cfg.strong} text-sm`}>← Biblioteca</Link></div>;
  if (!data) return <div className={`card p-8 ${cfg.strong}`}>📖 Preparando o resumo de estudo… (na primeira vez leva até 1 minuto)</div>;

  const { book, summary } = data;
  return (
    <div className="space-y-4">
      <Link to={`${cfg.base}/biblioteca`} className="text-sm text-zinc-400 hover:text-white">← Biblioteca</Link>
      <div className="card p-6">
        <p className={`eyebrow ${cfg.accent}`}>📖 Resumo de estudo</p>
        <h1 className="text-2xl font-bold mt-1">{book.title}</h1>
        <p className="text-zinc-400 text-sm">{book.author}</p>
        <p className="text-zinc-200 mt-4">{summary.ideia}</p>
        <p className="text-xs text-zinc-500 mt-3">👤 {summary.paraQuem}</p>
      </div>
      <section className="card p-5">
        <h3 className="font-bold mb-3">💡 Lições principais</h3>
        <div className="space-y-3">{summary.licoes.map((l, i) => (
          <div key={i}><p className={`font-semibold ${cfg.light}`}>{i + 1}. {l.titulo}</p><p className="text-sm text-zinc-300 mt-0.5">{l.explicacao}</p></div>
        ))}</div>
      </section>
      <div className="grid md:grid-cols-2 gap-4">
        <section className="card p-5">
          <h3 className="font-bold mb-2">🗣️ Ideias marcantes</h3>
          <ul className="text-sm text-zinc-300 space-y-1.5 list-disc pl-4">{summary.citacoesParafraseadas.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </section>
        <section className="card p-5 border-emerald-500/30">
          <h3 className="font-bold mb-2">✅ Plano de ação</h3>
          <ol className="text-sm text-zinc-300 space-y-1.5 list-decimal pl-4">{summary.planoDeAcao.map((c, i) => <li key={i}>{c}</li>)}</ol>
        </section>
      </div>
      <section className="card p-5">
        <h3 className="font-bold mb-2">🤔 Críticas e limitações</h3>
        <ul className="text-sm text-zinc-400 space-y-1 list-disc pl-4">{summary.criticas.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </section>
      <section className="card p-5">
        <h3 className="font-bold mb-2">🗺️ Aprofunde nas trilhas</h3>
        <div className="flex flex-wrap gap-2">{book.realmIds.map((rid) => {
          const r = realms.find((x) => x.id === rid);
          return r ? <Link key={rid} to={`${cfg.trail}/${rid}`} className={`px-3 py-1.5 rounded-lg border text-sm ${cfg.chip}`}>{r.emoji} {r.title}</Link> : null;
        })}</div>
      </section>
    </div>
  );
}
