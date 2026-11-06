import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { ChatMessage, InterviewPersona, InterviewLevel, InterviewFeedback } from '@devquest/shared';
import { api } from '../lib/api.js';

const PERSONAS: { id: InterviewPersona; label: string; emoji: string; desc: string }[] = [
  { id: 'techlead', label: 'Tech Lead (BR)', emoji: '👨‍💼', desc: 'Entrevista técnica em português' },
  { id: 'senior', label: 'Sênior exigente', emoji: '🧔', desc: 'Profundidade e "por quê?"' },
  { id: 'security', label: 'Especialista em segurança', emoji: '🛡️', desc: 'Ameaças e defesas' },
  { id: 'gringo', label: 'Gringo (inglês)', emoji: '🌎', desc: 'Interview in English' },
  { id: 'rh', label: 'RH / comportamental', emoji: '🤝', desc: 'Método STAR, fit cultural' },
];
const LEVELS: { id: InterviewLevel; label: string }[] = [
  { id: 'junior', label: 'Júnior' }, { id: 'pleno', label: 'Pleno' }, { id: 'senior', label: 'Sênior' },
];
const TOPICS = ['JavaScript', 'TypeScript', 'Node.js e Express', 'Bancos de dados e SQL', 'Segurança', 'React', 'Meus projetos', 'System Design', 'Git', 'IA / LLMs'];

export function Interview() {
  const [persona, setPersona] = useState<InterviewPersona>('techlead');
  const [level, setLevel] = useState<InterviewLevel>('pleno');
  const [topic, setTopic] = useState('Meus projetos');
  const [id, setId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [err, setErr] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, feedback]);

  async function start() {
    setBusy(true); setErr('');
    try {
      const r = await api.post<{ id: number; messages: ChatMessage[] }>('/interview/start', { persona, level, topic });
      setId(r.id); setMessages(r.messages); setFeedback(null);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  async function send() {
    if (!input.trim() || !id) return;
    const answer = input; setInput('');
    setMessages((m) => [...m, { role: 'candidate', text: answer }]);
    setBusy(true);
    try {
      const r = await api.post<{ reply: string; messages: ChatMessage[] }>(`/interview/${id}/reply`, { answer });
      setMessages(r.messages);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  async function finish() {
    if (!id) return;
    setBusy(true);
    try { const r = await api.post<{ feedback: InterviewFeedback }>(`/interview/${id}/finish`); setFeedback(r.feedback); }
    catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  // Tela de configuração
  if (!id) return (
    <div className="space-y-5">
      <Link to="/" className="text-sm text-zinc-400 hover:text-white">← Mapa</Link>
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-6 text-[7rem] opacity-10 select-none">🎤</div>
        <p className="eyebrow">Simulador</p>
        <h1 className="text-2xl font-bold mt-1">Modo Entrevista</h1>
        <p className="text-zinc-400 mt-2">Treine com um entrevistador de IA. Ao final, nota e pontos a melhorar.</p>
      </div>
      <Section title="Quem vai te entrevistar?">
        <div className="grid sm:grid-cols-2 gap-2">
          {PERSONAS.map((p) => (
            <button key={p.id} onClick={() => setPersona(p.id)} className={`card p-4 text-left ${persona === p.id ? 'border-violet-500 bg-violet-500/10' : 'card-hover'}`}>
              <div className="text-2xl">{p.emoji}</div>
              <div className="font-semibold mt-1">{p.label}</div>
              <div className="text-xs text-zinc-400">{p.desc}</div>
            </button>
          ))}
        </div>
      </Section>
      <Section title="Nível">
        <div className="flex gap-2">{LEVELS.map((l) => (
          <button key={l.id} onClick={() => setLevel(l.id)} className={`px-4 py-2 rounded-xl transition ${level === l.id ? 'bg-violet-600' : 'bg-white/5 hover:bg-white/10'}`}>{l.label}</button>
        ))}</div>
      </Section>
      <Section title="Assunto">
        <div className="flex flex-wrap gap-2">{TOPICS.map((t) => (
          <button key={t} onClick={() => setTopic(t)} className={`px-3 py-1.5 rounded-lg text-sm transition ${topic === t ? 'bg-violet-600' : 'bg-white/5 hover:bg-white/10'}`}>{t}</button>
        ))}</div>
      </Section>
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <button disabled={busy} onClick={start} className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold disabled:opacity-50 transition">
        {busy ? 'Preparando entrevistador…' : '▶ Iniciar entrevista'}
      </button>
    </div>
  );

  // Tela da conversa
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={() => { setId(null); setMessages([]); setFeedback(null); }} className="text-sm text-zinc-400 hover:text-white">← Nova entrevista</button>
        {!feedback && <button onClick={finish} disabled={busy} className="text-sm px-3 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-500 transition">Encerrar e avaliar</button>}
      </div>

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
            <div className={`card p-3 max-w-[85%] text-sm ${m.role === 'candidate' ? 'bg-violet-600/20 border-violet-500/30' : ''}`}>
              <div className="text-xs text-zinc-500 mb-1">{m.role === 'candidate' ? 'Você' : '🎤 Entrevistador'}</div>
              <div className="prose-dq"><Markdown>{m.text}</Markdown></div>
            </div>
          </div>
        ))}
        {busy && <div className="text-sm text-violet-300">…</div>}
        <div ref={endRef} />
      </div>

      {feedback ? (
        <div className="card p-5 pop space-y-3">
          <div className="flex items-center gap-3">
            <div className={`text-4xl font-bold ${feedback.score >= 70 ? 'text-emerald-400' : feedback.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{feedback.score}</div>
            <p className="text-sm">{feedback.summary}</p>
          </div>
          <Block title="✓ Pontos fortes" items={feedback.strengths} color="text-emerald-400" />
          <Block title="△ A melhorar" items={feedback.weaknesses} color="text-amber-400" />
          <Block title="📚 Estude isto" items={feedback.studyNext} color="text-cyan-400" />
          {feedback.perQuestion?.length > 0 && (
            <details className="text-sm"><summary className="cursor-pointer text-violet-300">Análise pergunta por pergunta</summary>
              <div className="mt-2 space-y-2">{feedback.perQuestion.map((p, i) => (
                <div key={i} className="border-l-2 border-white/10 pl-3"><p className="text-zinc-300">{p.question} <span className="text-zinc-500">({p.score})</span></p><p className="text-zinc-400 text-xs mt-0.5">💡 {p.better}</p></div>
              ))}</div>
            </details>
          )}
        </div>
      ) : (
        <div className="flex gap-2 sticky bottom-2">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(); }}
            placeholder="Sua resposta… (Ctrl+Enter envia)" className="flex-1 p-3 rounded-xl bg-black/40 border border-white/10 focus:border-violet-500 outline-none text-sm" />
          <button disabled={busy || !input.trim()} onClick={send} className="px-5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold disabled:opacity-40 transition">Enviar</button>
        </div>
      )}
      {err && <p className="text-red-400 text-sm">{err}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h3 className="font-semibold mb-2">{title}</h3>{children}</div>;
}
function Block({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (!items?.length) return null;
  return <div className="text-sm"><span className={`font-semibold ${color}`}>{title}:</span><ul className="list-disc pl-5 mt-1 text-zinc-300">{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>;
}
