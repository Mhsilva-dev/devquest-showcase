import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { ProjectId } from '@devquest/shared';
import { api } from '../lib/api.js';

const PROJECTS: { id: ProjectId; label: string }[] = [
  { id: 'financeflow', label: '💰 FinanceFlow' },
  { id: 'speak-ai', label: '🗣️ Speak AI' },
  { id: 'trading-bot', label: '📈 Trading Bot' },
  { id: 'lifequest', label: '🎮 LifeQuest' },
  { id: 'devquest', label: '🧭 DevQuest' },
];

// Explorar o próprio código: abre um arquivo e pede à IA para explicar.
export function Explore() {
  const [sp] = useSearchParams();
  const [project, setProject] = useState<ProjectId>((sp.get('project') as ProjectId) || 'speak-ai');
  const [path, setPath] = useState(sp.get('path') || 'src/db/pool.js');
  const [question, setQuestion] = useState('');
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setBusy(true); setErr(''); setExplanation(null); setCode('');
    try {
      const r = await api.post<{ code: string; explanation: string | null }>('/explain', { project, path, question: question || undefined });
      setCode(r.code); setExplanation(r.explanation);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  useEffect(() => { if (sp.get('path')) load(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="space-y-4">
      <Link to="/" className="text-sm text-zinc-400 hover:text-white">← Mapa</Link>
      <div className="card p-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-6 text-[7rem] opacity-10 select-none">🔍</div>
        <p className="eyebrow">Seus projetos</p>
        <h1 className="text-2xl font-bold mt-1">Aprender com o meu código</h1>
        <p className="text-zinc-400 mt-2">Escolha um arquivo dos seus projetos e a IA explica, linha a linha se você pedir.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {PROJECTS.map((p) => (
            <button key={p.id} onClick={() => setProject(p.id)} className={`px-3 py-1.5 rounded-lg text-sm transition ${project === p.id ? 'bg-violet-600' : 'bg-white/5 hover:bg-white/10'}`}>{p.label}</button>
          ))}
        </div>
        <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="caminho, ex: src/db/pool.js"
          className="w-full mt-3 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 focus:border-violet-500 outline-none font-mono text-sm" />
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Pergunta específica (opcional) — ex: por que usar transação aqui?"
          className="w-full mt-2 px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 focus:border-violet-500 outline-none text-sm" />
        <button disabled={busy} onClick={load} className="mt-3 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold disabled:opacity-50 transition">
          {busy ? 'Lendo e explicando…' : 'Abrir e explicar'}
        </button>
        {err && <p className="text-red-400 text-sm mt-2">{err}</p>}
      </div>

      {code && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-4 overflow-hidden">
            <p className="text-xs text-zinc-500 font-mono mb-2">{project} · {path}</p>
            <div className="prose-dq"><pre><code>{code}</code></pre></div>
          </div>
          <div className="card p-5">
            <p className="text-xs uppercase tracking-widest text-violet-300 font-semibold mb-2">💡 Explicação</p>
            {explanation ? <div className="prose-dq"><Markdown>{explanation}</Markdown></div>
              : <p className="text-amber-200 text-sm">Configure a GEMINI_API_KEY no .env para a explicação da IA. O código já está à esquerda para você ler.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
