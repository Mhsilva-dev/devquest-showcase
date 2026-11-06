import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { Lesson as LessonT, LessonContent, Grade, QuizQuestion, Track } from '@devquest/shared';
import { api } from '../lib/api.js';
import { TRACK_UI } from '../lib/tracks.js';

type Resp = { lesson: LessonT; content: LessonContent | null; aiGenerated: boolean; track: Track };

export function Lesson() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState<Resp | null>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setStep(0); setData(null); setError('');
    api.get<Resp>(`/learn/lesson/${id}`).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="card p-6"><p className="text-red-400">{error}</p><Link to="/" className="text-violet-400 text-sm">← Voltar</Link></div>;
  if (!data) return <div className="text-violet-300 p-8">Preparando a missão…</div>;
  if (!data.content) return (
    <div className="card p-6">
      <h1 className="text-xl font-bold">{data.lesson.title}</h1>
      <p className="text-amber-200 mt-3 text-sm">Esta aula é gerada pela IA e a <code>GEMINI_API_KEY</code> não está configurada ainda. Assim que você adicionar a chave, o conteúdo completo aparece aqui.</p>
      <div className="mt-4 text-sm text-zinc-300">
        <p className="font-semibold">Objetivos:</p>
        <ul className="list-disc pl-5 mt-1">{data.lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
        <p className="font-semibold mt-3">Tópicos:</p>
        <p className="text-zinc-400">{data.lesson.topics.join(' · ')}</p>
      </div>
      <Link to="/" className="inline-block mt-4 text-violet-400 text-sm">← Mapa</Link>
    </div>
  );

  const c = data.content;
  const concurso = data.track === 'concurso';
  // Finanças, Disciplina e Comunicação usam o mesmo formato de aula (caso prático + exercício escrito)
  const financas = data.track !== 'dev' && !concurso;
  const trail = `${TRACK_UI[data.track].realmPath}/${data.lesson.realmId}`;
  const steps = [
    { icon: '🎣', label: 'Gancho', node: <Prose md={c.hook} /> },
    { icon: '💡', label: concurso ? 'Teoria' : 'Conceito', node: <><Prose md={c.concept} /><Analogy text={c.analogy} hook={c.memoryHook} /></> },
    ...(c.example ? [{ icon: concurso ? '📄' : financas ? '🧮' : '👨‍💻', label: concurso ? 'Questão comentada' : financas ? 'Caso prático' : 'Exemplo', node: <Example ex={c.example} concurso={concurso || financas} /> }] : []),
    ...(data.lesson.refs?.length ? [{ icon: '🔍', label: 'No seu código', node: <Refs refs={data.lesson.refs} /> }] : []),
    { icon: '⚔️', label: concurso ? 'Discursiva' : financas ? 'Exercício' : 'Prática', node: <GradedTask lessonId={data.lesson.id} kind="practice" prompt={c.practice.prompt} checklist={c.practice.checklist} concurso={concurso || financas} /> },
    { icon: '🗣️', label: 'Ensine', node: <GradedTask lessonId={data.lesson.id} kind="feynman" prompt={c.feynman} /> },
    { icon: '🎯', label: 'Quiz', node: <Quiz questions={c.quiz} lessonId={data.lesson.id} boss={data.lesson.boss} onDone={() => nav(trail)} /> },
  ];
  const cur = steps[step];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link to={trail} className="text-sm text-zinc-400 hover:text-white">← {concurso ? 'Matéria' : 'Trilha'}</Link>
        <div className="flex gap-1">{steps.map((s, i) => (
          <div key={i} className={`w-7 h-7 grid place-items-center rounded-lg text-sm ${i === step ? 'bg-violet-600' : i < step ? 'bg-violet-900/60' : 'bg-white/5'}`} title={s.label}>{s.icon}</div>
        ))}</div>
      </div>

      <div className="card p-6 pop" key={step}>
        <p className="eyebrow">{cur.icon} {cur.label}</p>
        <h1 className="text-xl font-bold mt-1.5 mb-4">{data.lesson.title}</h1>
        {cur.node}
      </div>

      <div className="flex justify-between">
        <button disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="px-4 py-2 rounded-xl bg-white/5 disabled:opacity-30 hover:bg-white/10 transition">← Anterior</button>
        {step < steps.length - 1 && <button onClick={() => setStep((s) => s + 1)} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold transition">Próximo →</button>}
      </div>
    </div>
  );
}

function Prose({ md }: { md: string }) { return <div className="prose-dq"><Markdown>{md}</Markdown></div>; }

function Analogy({ text, hook }: { text: string; hook: string }) {
  return (
    <div className="mt-4 space-y-2">
      <div className="card p-3 bg-cyan-500/5 border-cyan-500/20 text-sm"><span className="font-semibold text-cyan-300">🔗 Analogia: </span>{text}</div>
      <div className="card p-3 bg-fuchsia-500/5 border-fuchsia-500/20 text-sm"><span className="font-semibold text-fuchsia-300">🧠 Para gravar: </span><span className="prose-dq inline"><Markdown>{hook}</Markdown></span></div>
    </div>
  );
}

function Example({ ex, concurso }: { ex: NonNullable<LessonContent['example']>; concurso?: boolean }) {
  if (concurso) return (
    <div>
      <div className="card p-4 bg-white/5 whitespace-pre-line text-zinc-100">{ex.code}</div>
      <details className="mt-3"><summary className="cursor-pointer text-emerald-300 text-sm">Tente responder antes · ver resolução</summary>
        <div className="prose-dq mt-2"><Markdown>{ex.explanation}</Markdown></div>
      </details>
    </div>
  );
  return (
    <div>
      <div className="prose-dq"><pre><code>{ex.code}</code></pre></div>
      <p className="text-sm text-zinc-300 mt-2">💬 {ex.explanation}</p>
    </div>
  );
}

function Refs({ refs }: { refs: NonNullable<LessonT['refs']> }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-300">Isto não é teoria solta: veja onde aparece nos seus próprios projetos.</p>
      {refs.map((r, i) => (
        <div key={i} className="card p-3 text-sm">
          <div className="font-mono text-xs text-violet-300">{r.project} · {r.path}</div>
          <p className="text-zinc-300 mt-1">{r.hint}</p>
          <Link to={`/explore?project=${r.project}&path=${encodeURIComponent(r.path)}`} className="text-xs text-cyan-400 hover:underline mt-1 inline-block">Abrir e explicar com a IA →</Link>
        </div>
      ))}
    </div>
  );
}

function GradedTask({ lessonId, kind, prompt, checklist, concurso }: { lessonId: string; kind: 'practice' | 'feynman'; prompt: string; checklist?: string[]; concurso?: boolean }) {
  const [answer, setAnswer] = useState('');
  const [grade, setGrade] = useState<Grade | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit() {
    setBusy(true); setErr('');
    try { setGrade(await api.post<Grade>('/learn/grade', { lessonId, kind, answer })); }
    catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="space-y-3">
      <p className="text-zinc-200">{kind === 'feynman' ? '🗣️ Explique com suas palavras (técnica Feynman): ' : concurso ? '✍️ Questão discursiva: ' : '⚔️ Desafio: '}{prompt}</p>
      {checklist && <ul className="text-xs text-zinc-500 list-disc pl-5">{checklist.map((c, i) => <li key={i}>{c}</li>)}</ul>}
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={6}
        placeholder="Escreva sua resposta aqui…" className={`w-full p-3 rounded-xl bg-black/30 border border-white/10 focus:border-violet-500 outline-none text-sm ${concurso ? '' : 'font-mono'}`} />
      {err && <p className="text-sm text-red-400">{err}</p>}
      <button disabled={busy || answer.length < 3} onClick={submit} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold disabled:opacity-40 transition">
        {busy ? 'Avaliando…' : 'Enviar para correção da IA'}
      </button>
      {grade && (
        <div className="card p-4 pop space-y-2">
          <div className="flex items-center gap-3">
            <div className={`text-3xl font-bold ${grade.score >= 70 ? 'text-emerald-400' : grade.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{grade.score}</div>
            <p className="text-sm text-zinc-200">{grade.verdict}</p>
          </div>
          {grade.strengths?.length > 0 && <div className="text-sm"><span className="text-emerald-400 font-semibold">✓ Pontos fortes: </span>{grade.strengths.join('; ')}</div>}
          {grade.gaps?.length > 0 && <div className="text-sm"><span className="text-amber-400 font-semibold">△ Para melhorar: </span>{grade.gaps.join('; ')}</div>}
          {grade.idealAnswer && <details className="text-sm"><summary className="cursor-pointer text-violet-300">Ver resposta modelo</summary><div className="prose-dq mt-2"><Markdown>{grade.idealAnswer}</Markdown></div></details>}
        </div>
      )}
    </div>
  );
}

function Quiz({ questions, lessonId, boss, onDone }: { questions: QuizQuestion[]; lessonId: string; boss?: boolean; onDone: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ xpGain: number; level: number } | null>(null);

  const score = Math.round((questions.filter((q, i) => answers[i] === q.answer).length / questions.length) * 100);

  async function finish() {
    setSubmitted(true);
    try { setResult(await api.post('/learn/complete', { lessonId, quizScore: score })); } catch { /* ignore */ }
  }

  if (result) return (
    <div className="text-center py-6 pop">
      <div className="text-5xl mb-2">{score >= 70 ? '🎉' : '💪'}</div>
      <h2 className="text-2xl font-bold">Missão concluída!</h2>
      <p className="text-zinc-300 mt-1">Nota do quiz: <b>{score}</b></p>
      <p className="text-amber-300 mt-2 text-lg">+{result.xpGain} XP {boss && '(bônus de chefão!)'}</p>
      <p className="text-sm text-zinc-400 mt-1">Os conceitos viraram cards de revisão. 🔁</p>
      <button onClick={onDone} className="mt-5 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold transition">Voltar à trilha →</button>
    </div>
  );

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <div key={i} className="card p-4">
          <p className="font-medium whitespace-pre-line">{i + 1}. {q.q}</p>
          <div className="mt-2 space-y-1.5">
            {q.options.map((opt, j) => {
              const picked = answers[i] === j;
              const right = submitted && j === q.answer;
              const wrong = submitted && picked && j !== q.answer;
              return (
                <button key={j} disabled={submitted} onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition ${right ? 'border-emerald-500 bg-emerald-500/10' : wrong ? 'border-red-500 bg-red-500/10' : picked ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-white/25'}`}>
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && <p className="text-xs text-zinc-400 mt-2">💬 {q.explain}</p>}
        </div>
      ))}
      {!submitted
        ? <button disabled={Object.keys(answers).length < questions.length} onClick={finish} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold disabled:opacity-40 transition">Finalizar quiz</button>
        : !result && <p className="text-violet-300">Salvando…</p>}
    </div>
  );
}
