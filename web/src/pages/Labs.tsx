import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { LabInfo } from '@devquest/shared';
import { api } from '../lib/api.js';

type AttackResp = { result: { vulnerable: any; secure: any }; solved: boolean };

export function Labs() {
  const [labs, setLabs] = useState<LabInfo[]>([]);
  const [active, setActive] = useState<LabInfo | null>(null);

  useEffect(() => { api.get<LabInfo[]>('/labs').then(setLabs); }, []);

  if (active) return <LabView lab={active} onBack={() => setActive(null)} />;

  return (
    <div className="space-y-4">
      <Link to="/" className="text-sm text-zinc-400 hover:text-white">← Mapa</Link>
      <div className="card p-6 border-red-500/30 bg-red-500/5 relative overflow-hidden">
        <div className="absolute -top-8 -right-6 text-[7rem] opacity-10 select-none">🧪</div>
        <p className="eyebrow" style={{ color: '#fca5a5' }}>Segurança ofensiva · defensiva</p>
        <h1 className="text-2xl font-bold mt-1">Laboratório Hacker</h1>
        <p className="text-zinc-300 mt-2">Ataque alvos <b>falsos e isolados</b> para entender a falha na pele — e aí aprender a se <b>defender</b>. Nada aqui toca sistema real: cada ataque roda num banco de mentira, criado e destruído na hora.</p>
        <p className="text-xs text-amber-300/80 mt-2">⚖️ Use essas técnicas só em sistemas seus ou com autorização. Aqui o objetivo é prevenção.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {labs.map((l) => (
          <button key={l.id} onClick={() => setActive(l)} className="card card-hover p-5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-red-300">{l.owasp}</span>
              <span className="text-xs text-zinc-500" title={`dificuldade ${l.difficulty}`}>{'🔥'.repeat(l.difficulty)}</span>
            </div>
            <h3 className="font-bold mt-2">{l.title}</h3>
            <p className="text-sm text-zinc-400 mt-1">{l.story}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function LabView({ lab, onBack }: { lab: LabInfo; onBack: () => void }) {
  const FIELDS: Record<string, string[]> = {
    'sql-injection': ['username', 'password'],
    'idor': ['noteId'],
    'password-crack': ['password'],
    'jwt-crack': ['secret'],
    'path-traversal': ['filename'],
    'brute-force': [],
    'xss': ['comment'],
  };
  const fields = FIELDS[lab.id] ?? ['input'];
  const [input, setInput] = useState<Record<string, string>>({});
  const [resp, setResp] = useState<AttackResp | null>(null);
  const [busy, setBusy] = useState(false);
  const [showFix, setShowFix] = useState(false);
  const [fix, setFix] = useState('');
  const [grade, setGrade] = useState<any>(null);
  const [hintIdx, setHintIdx] = useState(0);

  async function attack() {
    setBusy(true);
    try { setResp(await api.post<AttackResp>(`/labs/${lab.id}/attack`, { input })); }
    finally { setBusy(false); }
  }
  async function submitFix() {
    setBusy(true);
    try { const r = await api.post<{ grade: any }>(`/labs/${lab.id}/fix`, { code: fix }); setGrade(r.grade); }
    catch (e: any) { setGrade({ verdict: e.message, score: 0 }); }
    finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white">← Laboratórios</button>
      <div className="card p-6">
        <span className="text-xs font-mono text-red-300">{lab.owasp}</span>
        <h1 className="text-2xl font-bold mt-1">🧪 {lab.title}</h1>
        <p className="text-zinc-300 mt-2">{lab.story}</p>
        <p className="text-sm text-violet-200 mt-3 border-l-2 border-violet-500 pl-3">🎯 {lab.goal}</p>
        <div className="prose-dq mt-3"><pre><code>{lab.vulnerableCode}</code></pre></div>
      </div>

      {/* Ataque */}
      <div className="card p-5">
        <h3 className="font-semibold mb-3">⚔️ Seu ataque</h3>
        <div className="space-y-2">
          {fields.map((f) => (
            <input key={f} placeholder={f} value={input[f] ?? ''} onChange={(e) => setInput((p) => ({ ...p, [f]: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-red-500 outline-none font-mono text-sm" />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <button disabled={busy} onClick={attack} className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 font-semibold disabled:opacity-40 transition">{busy ? '…' : 'Atacar alvo'}</button>
          <button onClick={() => setHintIdx((i) => Math.min(i + 1, lab.hints.length))} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition">💡 Dica</button>
        </div>
        {hintIdx > 0 && <ul className="mt-3 text-sm text-amber-200 list-disc pl-5 space-y-1">{lab.hints.slice(0, hintIdx).map((h, i) => <li key={i}><code className="text-amber-100">{h}</code></li>)}</ul>}
      </div>

      {/* Resultado lado a lado */}
      {resp && (
        <div className="space-y-3 pop">
          {resp.solved && <div className="card p-4 border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-semibold">🚩 Ataque bem-sucedido! Flag: <code>{resp.result.vulnerable.flag}</code> — agora aprenda a fechar essa porta ⬇️</div>}
          <div className="grid md:grid-cols-2 gap-3">
            <Panel title="⚠️ Versão VULNERÁVEL" color="red" d={resp.result.vulnerable} />
            <Panel title="✅ Versão SEGURA" color="emerald" d={resp.result.secure} />
          </div>
          <button onClick={() => setShowFix(true)} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold transition">🛡️ Agora corrija (desafio de defesa)</button>
        </div>
      )}

      {/* Desafio de correção */}
      {showFix && (
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold">🛡️ Desafio de defesa</h3>
          <p className="text-sm text-zinc-300">{lab.fixPrompt}</p>
          <textarea value={fix} onChange={(e) => setFix(e.target.value)} rows={7} placeholder="Escreva sua correção e explicação…"
            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 focus:border-violet-500 outline-none font-mono text-sm" />
          <button disabled={busy || fix.length < 10} onClick={submitFix} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold disabled:opacity-40 transition">{busy ? 'Avaliando…' : 'Enviar correção'}</button>
          {grade && (
            <div className="card p-4 pop space-y-2">
              <div className="flex items-center gap-3">
                <div className={`text-3xl font-bold ${grade.secure ? 'text-emerald-400' : 'text-amber-400'}`}>{grade.score ?? 0}</div>
                <p className="text-sm">{grade.secure ? '🛡️ Falha fechada!' : '⚠️ Ainda dá para explorar.'} {grade.verdict}</p>
              </div>
              {grade.gaps?.length > 0 && <div className="text-sm"><span className="text-amber-400 font-semibold">Falta: </span>{grade.gaps.join('; ')}</div>}
              {grade.idealAnswer && <details className="text-sm"><summary className="cursor-pointer text-violet-300">Ver correção modelo</summary><div className="prose-dq mt-2"><Markdown>{grade.idealAnswer}</Markdown></div></details>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Panel({ title, color, d }: { title: string; color: string; d: any }) {
  return (
    <div className={`card p-4 ${color === 'red' ? 'border-red-500/30' : 'border-emerald-500/30'}`}>
      <h4 className={`font-semibold text-sm ${color === 'red' ? 'text-red-300' : 'text-emerald-300'}`}>{title}</h4>
      {d.query && <div className="prose-dq mt-2"><pre className="text-xs"><code>{d.query}</code></pre></div>}
      <p className="text-xs text-zinc-400 mt-2">Resultado:</p>
      <pre className="text-xs bg-black/40 rounded-lg p-2 overflow-x-auto mt-1">{typeof d.leaked === 'string' ? d.leaked : JSON.stringify(d.leaked, null, 2)}</pre>
      <p className="text-sm text-zinc-300 mt-2">{d.explanation}</p>
    </div>
  );
}
