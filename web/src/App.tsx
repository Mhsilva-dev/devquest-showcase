import { useEffect, useState, lazy, Suspense } from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import type { Me } from '@devquest/shared';
import { api } from './lib/api.js';
import { InstallButton } from './components/InstallButton.js';

const Scene3D = lazy(() => import('./components/Scene3D.js').then((m) => ({ default: m.Scene3D })));

// Layout com verificação de sessão. Computador: menu lateral. Celular: abas embaixo + menu em gaveta (cara de app).
export function App() {
  const nav = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setMenu(false); }, [pathname]);

  useEffect(() => {
    api.get<Me>('/auth/me').then(setMe).catch(() => nav('/login')).finally(() => setLoading(false));
  }, [nav]);

  if (loading) return <div className="aurora min-h-screen grid place-items-center text-violet-300">Carregando…</div>;
  if (!me) return null;

  const link = (to: string, icon: string, label: string, end = false) => (
    <NavLink key={to} to={to} end={end} className={({ isActive }: { isActive: boolean }) =>
      `flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${isActive ? 'bg-violet-500/20 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
      <span className="text-lg">{icon}</span><span className="font-medium">{label}</span>
    </NavLink>
  );

  const navList = (
    <nav className="flex flex-col gap-1">
      {SECTIONS.map((sec, i) => (
        <div key={sec.title}>
          <p className={`eyebrow px-4 pb-1 ${i ? 'pt-4' : 'pt-1'} ${sec.color}`}>{sec.title}</p>
          {sec.links.map(([to, icon, label, end]) => link(to, icon, label, end))}
        </div>
      ))}
    </nav>
  );

  const stats = (
    <div className="text-sm">
      <div className="flex items-center justify-between px-2">
        <span className="text-zinc-400">Nível {me.level}</span>
        <span className="text-amber-300 font-semibold">{me.xp} XP</span>
      </div>
      <div className="flex items-center justify-between px-2 mt-1">
        <span className="text-zinc-400">🔥 Sequência</span>
        <span className="text-orange-300 font-semibold">{me.streak} {me.streak === 1 ? 'dia' : 'dias'}</span>
      </div>
      <InstallButton className="mt-3 w-full" />
      <button onClick={() => api.post('/auth/logout').then(() => nav('/login'))}
        className="mt-3 w-full text-xs text-zinc-500 hover:text-zinc-300">Sair</button>
    </div>
  );

  const logo = (
    <div className="flex items-center gap-2">
      <span className="text-2xl">🧭</span>
      <span className="font-display text-xl font-extrabold tracking-tight glow-text">Dev<span className="text-violet-400">Quest</span></span>
    </div>
  );

  return (
    <div className="aurora min-h-screen">
      <Suspense fallback={null}><Scene3D /></Suspense>

      {/* Celular: barra de topo + abas embaixo + menu em gaveta */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#07070e]/85 backdrop-blur border-b border-white/5" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        {logo}
        <span className="text-sm"><span className="text-orange-300">🔥 {me.streak}</span> · <span className="text-amber-300 font-semibold">{me.xp} XP</span></span>
      </header>

      <div className="mx-auto max-w-6xl flex flex-col md:flex-row gap-4 p-4 pb-28 md:pb-4">
        <aside className="hidden md:block md:w-60 shrink-0">
          <div className="card p-4 md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto">
            <div className="px-2 mb-4">{logo}</div>
            {navList}
            <div className="mt-4 pt-4 border-t border-white/10">{stats}</div>
          </div>
        </aside>
        <main className="flex-1 min-w-0"><Outlet /></main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 bg-[#0b0b14]/95 backdrop-blur border-t border-white/10" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map(([to, icon, label, end]) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }: { isActive: boolean }) =>
            `flex flex-col items-center gap-0.5 py-2.5 text-[0.68rem] ${isActive && !menu ? 'text-violet-300' : 'text-zinc-400'}`}>
            <span className="text-xl leading-none">{icon}</span>{label}
          </NavLink>
        ))}
        <button onClick={() => setMenu(true)} className={`flex flex-col items-center gap-0.5 py-2.5 text-[0.68rem] ${menu ? 'text-violet-300' : 'text-zinc-400'}`}>
          <span className="text-xl leading-none">☰</span>Menu
        </button>
      </nav>

      {menu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMenu(false)}>
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-[#0d0d17] border-l border-white/10 overflow-y-auto p-4 pop" onClick={(e) => e.stopPropagation()}
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
            <div className="flex items-center justify-between mb-4 px-2">{logo}<button onClick={() => setMenu(false)} aria-label="Fechar" className="text-zinc-400 text-2xl">✕</button></div>
            <div className="mb-4 pb-4 border-b border-white/10">{stats}</div>
            {navList}
          </div>
        </div>
      )}
    </div>
  );
}

type NavItem = [to: string, icon: string, label: string, end?: boolean];

const SECTIONS: { title: string; color: string; links: NavItem[] }[] = [
  { title: '⚡ Ferramentas', color: '!text-rose-400', links: [['/foco', '🍅', 'Foco'], ['/captura', '📥', 'Captura']] },
  { title: '💻 Programação', color: '', links: [['/', '🏰', 'Mapa', true], ['/review', '🔁', 'Revisão'], ['/interview', '🎤', 'Entrevista'], ['/labs', '🧪', 'Lab Hacker'], ['/explore', '🔍', 'Meu código']] },
  { title: '🎖️ Concursos', color: '!text-emerald-400', links: [['/concursos', '📋', 'Painel', true], ['/concursos/plano', '🗓️', 'Plano de estudos'], ['/concursos/simulado', '📝', 'Simulado'], ['/concursos/redacao', '✍️', 'Redação'], ['/concursos/revisao', '🔁', 'Caderno de erros'], ['/concursos/guia', '🧭', 'Guia de concursos']] },
  { title: '💰 Finanças', color: '!text-amber-400', links: [['/financas', '📈', 'Painel', true], ['/financas/plano', '🎯', 'Plano financeiro'], ['/financas/biblioteca', '📚', 'Biblioteca'], ['/financas/calculadoras', '🧮', 'Calculadoras'], ['/financas/revisao', '🔁', 'Revisão']] },
  { title: '🔥 Disciplina', color: '!text-orange-400', links: [['/mente', '🔥', 'Painel', true], ['/mente/protocolo', '🛡️', 'Meu protocolo'], ['/mente/dia-ruim', '🆘', 'Dia ruim'], ['/mente/biblioteca', '📚', 'Biblioteca'], ['/mente/revisao', '🔁', 'Revisão']] },
  { title: '💬 Comunicação', color: '!text-sky-400', links: [['/social', '💬', 'Painel', true], ['/social/conversa', '🎭', 'Simulador'], ['/social/mensagem', '✉️', 'Reescrever mensagem'], ['/social/biblioteca', '📚', 'Biblioteca'], ['/social/revisao', '🔁', 'Revisão']] },
];

// Abas fixas do celular (o resto fica no menu)
const TABS: NavItem[] = [['/', '🏰', 'Início', true], ['/foco', '🍅', 'Foco'], ['/concursos', '🎖️', 'Concursos'], ['/mente', '🔥', 'Disciplina']];
