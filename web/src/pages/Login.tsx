import { useEffect, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

const Scene3D = lazy(() => import('../components/Scene3D.js').then((m) => ({ default: m.Scene3D })));

export function Login() {
  const nav = useNavigate();
  const [needsSetup, setNeedsSetup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<{ needsSetup: boolean }>('/auth/status').then((s) => setNeedsSetup(s.needsSetup)).catch(() => {});
    api.get('/auth/me').then(() => nav('/')).catch(() => {});
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (needsSetup) await api.post('/auth/setup', { name, email, password, setupCode });
      else await api.post('/auth/login', { email, password });
      nav('/');
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="aurora min-h-screen grid place-items-center p-4">
      <Suspense fallback={null}><Scene3D /></Suspense>
      <div className="card p-8 w-full max-w-sm pop backdrop-blur-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🧭</div>
          <h1 className="text-3xl font-extrabold glow-text">Dev<span className="text-violet-400">Quest</span></h1>
          <p className="text-sm text-zinc-400 mt-1">{needsSetup ? 'Crie sua conta de mestre' : 'Continue sua jornada'}</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {needsSetup && <Input value={name} onChange={setName} placeholder="Seu nome" />}
          <Input value={email} onChange={setEmail} placeholder="E-mail" type="email" />
          <Input value={password} onChange={setPassword} placeholder="Senha (mín. 8)" type="password" />
          {needsSetup && <Input value={setupCode} onChange={setSetupCode} placeholder="Código de setup (do .env)" />}
          {err && <p className="text-sm text-red-400">{err}</p>}
          <button disabled={busy} className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold disabled:opacity-50 transition">
            {busy ? '…' : needsSetup ? 'Começar' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type}
    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 outline-none transition" />;
}
