import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Cenario, ConversaFull, ConversaMsg, ConversaSummary } from '@devquest/shared';
import { api } from '../../lib/api.js';

type Dif = 'facil' | 'realista' | 'dificil';
const DIFS: { id: Dif; label: string; hint: string }[] = [
  { id: 'facil', label: '🙂 Tranquila', hint: 'a pessoa colabora' },
  { id: 'realista', label: '😐 Realista', hint: 'como na vida real' },
  { id: 'dificil', label: '😤 Difícil', hint: 'resistente e emotiva' },
];

// Simulador de conversas: escolha a cena, converse com a IA no papel da outra pessoa e receba o feedback.
export function Conversa() {
  const { id } = useParams();
  return id ? <Chat id={Number(id)} /> : <Escolher />;
}

function Escolher() {
  const nav = useNavigate();
  const [cenas, setCenas] = useState<Cenario[]>([]);
  const [hist, setHist] = useState<ConversaSummary[]>([]);
  const [sel, setSel] = useState<string>('');
  const [dif, setDif] = useState<Dif>('realista');
  const [livre, setLivre] = useState({ situacao: '', pessoa: '', objetivo: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get<Cenario[]>('/social/cenarios').then(setCenas).catch(() => {});
    api.get<ConversaSummary[]>('/social/conversas').then(setHist).catch(() => {});
  }, []);

  async function start() {
    setBusy(true); setErr('');
    try {
      const body = sel === 'livre' ? { dificuldade: dif, livre } : { dificuldade: dif, cenarioId: sel };
      const r = await api.post<ConversaFull>('/social/conversas', body);
      nav(`/social/conversa/${r.id}`);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  const ok = sel === 'livre' ? livre.situacao.trim().length >= 5 && livre.pessoa.trim().length >= 3 && livre.objetivo.trim().length >= 3 : Boolean(sel);
  const input = (k: keyof typeof livre, ph: string) => (
    <textarea rows={2} value={livre[k]} maxLength={k === 'situacao' ? 800 : 400} placeholder={ph} onChange={(e) => setLivre({ ...livre, [k]: e.target.value })}
      className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-sky-500/50" />
  );

  return (
    <div className="space-y-6">
      <header>
        <Link to="/social" className="text-sm text-zinc-400 hover:text-white">← Comunicação</Link>
        <p className="eyebrow !text-sky-400 mt-3">🎭 Simulador de conversas</p>
        <h1 className="text-3xl font-bold mt-1">Treine antes da conversa de verdade</h1>
        <p className="text-zinc-400 text-sm mt-1">A IA faz o papel da outra pessoa e reage ao seu tom. Quando quiser, encerre para receber nota, o que funcionou e como dizer melhor.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cenas.map((c) => (
          <button key={c.id} onClick={() => setSel(c.id)} className={`card p-4 text-left transition ${sel === c.id ? 'border-sky-500/60 bg-sky-500/10' : 'card-hover'}`}>
            <div className="flex items-center gap-2"><span className="text-2xl">{c.emoji}</span><span className="font-semibold text-sm">{c.title}</span></div>
            <p className="text-xs text-zinc-400 mt-2">{c.objetivo}</p>
            <p className="text-[0.7rem] text-sky-300 mt-2">{c.skill}</p>
          </button>
        ))}
        <button onClick={() => setSel('livre')} className={`card p-4 text-left transition ${sel === 'livre' ? 'border-sky-500/60 bg-sky-500/10' : 'card-hover'}`}>
          <div className="flex items-center gap-2"><span className="text-2xl">✨</span><span className="font-semibold text-sm">Uma situação minha</span></div>
          <p className="text-xs text-zinc-400 mt-2">Descreva uma conversa real que você precisa ter e treine antes.</p>
        </button>
      </div>

      {sel === 'livre' && (
        <div className="card p-5 space-y-3">
          {input('situacao', 'A situação: o que está acontecendo? Ex.: meu colega de quarto deixa tudo bagunçado e já falei duas vezes')}
          {input('pessoa', 'Quem é a pessoa e como ela costuma reagir? Ex.: amigo de faculdade, fica na defensiva e faz piada')}
          {input('objetivo', 'O que você quer conseguir? Ex.: combinar uma divisão de tarefas sem estragar a amizade')}
        </div>
      )}

      {sel && (
        <div className="card p-5 flex flex-wrap items-center gap-3">
          {DIFS.map((d) => (
            <button key={d.id} onClick={() => setDif(d.id)} className={`px-4 py-2 rounded-xl border text-sm transition ${dif === d.id ? 'border-sky-500/60 bg-sky-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
              {d.label} <span className="text-xs text-zinc-500">· {d.hint}</span>
            </button>
          ))}
          <button onClick={start} disabled={busy || !ok} className="ml-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-semibold transition disabled:opacity-50">{busy ? '⏳ Preparando a cena…' : '▶ Começar'}</button>
          {err && <p className="w-full text-sm text-red-400">{err}</p>}
        </div>
      )}

      {hist.length > 0 && (
        <section className="card p-5">
          <h3 className="font-bold mb-3">🕒 Suas conversas</h3>
          <div className="divide-y divide-white/5">
            {hist.map((c) => (
              <Link key={c.id} to={`/social/conversa/${c.id}`} className="flex items-center gap-3 py-2.5 text-sm hover:bg-white/5 -mx-2 px-2 rounded-lg">
                <span>{c.emoji}</span><span className="flex-1 min-w-0 truncate">{c.titulo}</span>
                <span className="text-xs text-zinc-500">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                {c.score === null ? <span className="text-xs text-amber-300">continuar</span> : <span className="font-semibold text-sky-300">{c.score}</span>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Chat({ id }: { id: number }) {
  const nav = useNavigate();
  const [cv, setCv] = useState<ConversaFull | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState<'' | 'reply' | 'finish'>('');
  const [err, setErr] = useState('');
  const [xp, setXp] = useState(0);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { api.get<ConversaFull>(`/social/conversas/${id}`).then(setCv).catch((e) => setErr(e.message)); }, [id]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [cv?.messages.length, busy]);

  async function send() {
    if (!cv || !text.trim()) return;
    const mine: ConversaMsg = { role: 'eu', text: text.trim() };
    setCv({ ...cv, messages: [...cv.messages, mine] }); setText(''); setBusy('reply'); setErr('');
    try {
      const r = await api.post<{ messages: ConversaMsg[] }>(`/social/conversas/${id}/reply`, { text: mine.text });
      setCv((c) => (c ? { ...c, messages: r.messages } : c));
    } catch (e: any) {
      setErr(e.message); setText(mine.text);
      setCv((c) => (c ? { ...c, messages: c.messages.slice(0, -1) } : c));
    } finally { setBusy(''); }
  }

  async function finish() {
    setBusy('finish'); setErr('');
    try {
      const r = await api.post<ConversaFull & { xpGain: number }>(`/social/conversas/${id}/finish`);
      setCv(r); setXp(r.xpGain); window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) { setErr(e.message); } finally { setBusy(''); }
  }

  if (err && !cv) return <div className="card p-8 text-red-300">{err} <Link to="/social/conversa" className="text-sky-300 ml-2">← voltar</Link></div>;
  if (!cv) return <div className="text-sky-300 p-8">Carregando…</div>;
  const fb = cv.feedback;
  const mine = cv.messages.filter((m) => m.role === 'eu').length;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/social/conversa" className="text-sm text-zinc-400 hover:text-white">← Simulador</Link>
        <button onClick={() => confirm('Apagar esta conversa?') && api.del(`/social/conversas/${id}`).then(() => nav('/social/conversa'))} className="text-xs text-zinc-500 hover:text-red-400">apagar</button>
      </div>

      {fb && (
        <div className="space-y-4">
          <div className="card p-6 pop border-sky-500/30">
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-center">
                <div className={`text-5xl font-bold ${fb.score >= 70 ? 'text-emerald-300' : fb.score >= 50 ? 'text-amber-300' : 'text-red-300'}`}>{fb.score}</div>
                <div className="text-xs text-zinc-500">de 100</div>
              </div>
              <div className="flex-1 min-w-[14rem]">
                <p className="font-semibold">{fb.objetivo.alcancado ? '🎯 Objetivo alcançado' : '🎯 Objetivo não alcançado'}</p>
                <p className="text-sm text-zinc-300 mt-1">{fb.resumo}</p>
                {xp > 0 && <p className="text-xs text-amber-300 mt-1">+{xp} XP · as reescritas viraram cards de revisão 🔁</p>}
              </div>
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {fb.criterios.map((k) => (
                <div key={k.nome}>
                  <div className="flex justify-between text-sm"><span>{k.nome}</span><span className="text-zinc-400">{k.nota}/10</span></div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-1"><div className="h-full bg-sky-500" style={{ width: `${k.nota * 10}%` }} /></div>
                  <p className="text-xs text-zinc-400 mt-1">{k.comentario}</p>
                </div>
              ))}
            </div>
          </div>
          {fb.melhorMomento && <section className="card p-5 border-emerald-500/30"><h3 className="font-bold mb-1">⭐ Seu melhor momento</h3><p className="text-sm text-zinc-300">{fb.melhorMomento}</p></section>}
          {fb.reescritas.length > 0 && (
            <section className="card p-5">
              <h3 className="font-bold mb-3">🔁 Como dizer melhor</h3>
              <div className="space-y-3">
                {fb.reescritas.map((x, i) => (
                  <div key={i} className="text-sm">
                    <p className="text-zinc-400 line-through">“{x.original}”</p>
                    <p className="text-emerald-200 mt-1">✔ “{x.melhor}”</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{x.porque}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="card p-5">
            <h3 className="font-bold mb-2">🎯 Para a próxima conversa real</h3>
            <ul className="list-disc pl-5 text-sm space-y-1 text-zinc-300">{fb.dicas.map((d, i) => <li key={i}>{d}</li>)}</ul>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/social/conversa" className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-sm font-semibold">Nova conversa</Link>
              {cv.cena.realmId && <Link to={`/social/trilha/${cv.cena.realmId}`} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm">📚 Estudar: {cv.cena.skill}</Link>}
            </div>
          </section>
        </div>
      )}

      <div className="card p-5">
        <p className="eyebrow !text-sky-300">{cv.cena.emoji} {cv.cena.titulo}</p>
        <p className="text-sm text-zinc-300 mt-2">{cv.cena.abertura}</p>
        <p className="text-sm mt-2"><b className="text-sky-200">Seu objetivo:</b> <span className="text-zinc-300">{cv.cena.objetivo}</span></p>
      </div>

      <div className="space-y-3">
        {cv.messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'eu' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${m.role === 'eu' ? 'bg-sky-600/80 rounded-br-md' : 'bg-white/10 rounded-bl-md'}`}>{m.text}</div>
          </div>
        ))}
        {busy === 'reply' && <div className="flex"><div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm text-zinc-400">digitando…</div></div>}
        <div ref={end} />
      </div>

      {!cv.finished && (
        <div className="card p-3 sticky bottom-20 md:bottom-3">
          <div className="flex gap-2">
            <textarea value={text} rows={2} maxLength={2000} onChange={(e) => setText(e.target.value)} placeholder="O que você diria?"
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!busy) send(); } }}
              className="flex-1 bg-zinc-950/60 border border-white/10 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-sky-500/50" />
            <button onClick={send} disabled={!!busy || !text.trim()} className="px-5 rounded-xl bg-sky-600 hover:bg-sky-500 font-semibold disabled:opacity-50">Enviar</button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-zinc-500">Enter envia · Shift+Enter pula linha</span>
            <button onClick={finish} disabled={!!busy || mine < 2} className="text-sm px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-40">
              {busy === 'finish' ? '⏳ Avaliando…' : '🏁 Encerrar e ver feedback'}
            </button>
          </div>
          {err && <p className="text-sm text-red-400 mt-2">{err}</p>}
        </div>
      )}
    </div>
  );
}
