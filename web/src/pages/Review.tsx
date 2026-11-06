import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ReviewCard, Track } from '@devquest/shared';
import { api } from '../lib/api.js';
import { TRACK_UI } from '../lib/tracks.js';

// Revisão espaçada: mostra a frente, você tenta lembrar, revela, e diz se acertou.
export function Review({ track = 'dev' }: { track?: Track }) {
  const home = TRACK_UI[track].home;
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); setI(0); setRevealed(false);
    api.get<ReviewCard[]>(`/learn/review?track=${track}`).then(setCards).finally(() => setLoading(false));
  }, [track]);

  async function answer(remembered: boolean) {
    const card = cards[i];
    await api.post('/learn/review', { cardId: card.id, remembered }).catch(() => {});
    setRevealed(false);
    setI((x) => x + 1);
  }

  if (loading) return <div className="text-violet-300 p-8">Carregando…</div>;
  if (cards.length === 0) return <Empty home={home} text={track === 'concurso' ? 'Caderno de erros em dia! Questões que você errar nos simulados e os cards das aulas aparecem aqui. 🎉' : 'Nenhum card para revisar agora. Volte amanhã! 🎉'} />;
  if (i >= cards.length) return <Empty home={home} text={`Revisão concluída! Você revisou ${cards.length} cards. 🔥`} />;

  const card = cards[i];
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to={home} className="text-sm text-zinc-400 hover:text-white">← Voltar</Link>
        <span className="text-sm text-zinc-500">{i + 1} / {cards.length}</span>
      </div>
      <div className="card p-8 min-h-[16rem] flex flex-col justify-center pop" key={card.id}>
        <p className="text-xs uppercase tracking-widest text-violet-300 text-center mb-4">🔁 Recordação ativa</p>
        <p className="text-lg text-center font-medium whitespace-pre-line">{card.front}</p>
        {revealed && <><hr className="my-5 border-white/10" /><p className="text-center text-emerald-200 whitespace-pre-line">{card.back}</p></>}
      </div>
      {!revealed
        ? <button onClick={() => setRevealed(true)} className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold transition">Revelar resposta</button>
        : (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => answer(false)} className="py-3 rounded-xl bg-red-600/80 hover:bg-red-500 font-semibold transition">❌ Esqueci</button>
            <button onClick={() => answer(true)} className="py-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 font-semibold transition">✅ Lembrei</button>
          </div>
        )}
    </div>
  );
}

function Empty({ text, home }: { text: string; home: string }) {
  return <div className="card p-10 text-center"><div className="text-4xl mb-3">🗓️</div><p className="text-zinc-300">{text}</p><Link to={home} className="inline-block mt-4 text-violet-400">← Voltar</Link></div>;
}
