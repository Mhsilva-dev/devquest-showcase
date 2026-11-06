import { useState } from 'react';
import { createPortal } from 'react-dom';
import { installSteps, promptInstall, useCanInstall } from '../lib/install.js';

// Botão "Instalar o app": usa a instalação nativa quando existe; senão mostra o passo a passo do aparelho.
export function InstallButton({ className = '' }: { className?: string }) {
  const can = useCanInstall();
  const [help, setHelp] = useState(false);
  if (!can) return null;
  const info = installSteps();

  return (
    <>
      <button onClick={async () => { if (!(await promptInstall())) setHelp(true); }}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/90 hover:bg-violet-500 font-semibold text-sm transition ${className}`}>
        📲 Instalar o app
      </button>
      {help && createPortal(
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setHelp(false); }}>
          <div role="dialog" aria-modal="true" className="card w-full max-w-sm p-5 pop" style={{ background: '#12121c' }}>
            <div className="flex items-center justify-between"><b className="text-lg">{info.title}</b><button onClick={() => setHelp(false)} aria-label="Fechar" className="text-zinc-400 hover:text-white text-xl">✕</button></div>
            <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-white/5">
              <img src="/icons/icon-192.png" alt="" width={48} height={48} className="rounded-xl" />
              <div><b>DevQuest</b><p className="text-xs text-zinc-400">Abre em tela cheia, como um app</p></div>
            </div>
            <p className="text-sm text-zinc-400 mt-4">{info.text}</p>
            <ol className="mt-3 space-y-2">
              {info.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm"><span className="w-6 h-6 shrink-0 grid place-items-center rounded-full bg-violet-500/25 text-violet-200 text-xs font-bold">{i + 1}</span><span className="text-zinc-200">{s}</span></li>
              ))}
            </ol>
            <button onClick={() => setHelp(false)} className="mt-5 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold">Entendi</button>
          </div>
        </div>,
        document.body, // fora dos cartões: backdrop-filter prenderia o position:fixed dentro deles
      )}
    </>
  );
}
