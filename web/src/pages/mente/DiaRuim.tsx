import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MenteOverview, MenteProtocol } from '@devquest/shared';
import { api } from '../../lib/api.js';

// Modo 🆘: a tela para abrir no dia em que você quer largar tudo. Lembra o porquê e pede só o mínimo.
const ESTOICOS = [
  ['Marco Aurélio', 'O impedimento à ação faz a ação avançar. O que está no caminho vira o caminho.'],
  ['Sêneca', 'Sofremos mais na imaginação do que na realidade.'],
  ['Epicteto', 'Não são as coisas que nos perturbam, mas a opinião que temos sobre elas.'],
  ['Marco Aurélio', 'Você tem poder sobre a sua mente, não sobre os acontecimentos. Perceba isso e encontrará força.'],
  ['Sêneca', 'Enquanto adiamos, a vida passa.'],
  ['Epicteto', 'Nenhuma grande coisa nasce de repente. Primeiro a flor, depois o fruto, depois o amadurecer.'],
];
const PADRAO = [
  'Respire fundo 5 vezes. A vontade de desistir é uma emoção, não uma decisão.',
  'Não decida nada importante hoje. Hoje você só precisa não zerar.',
  'Faça a versão mínima: 10 minutos, um bloco de questões, uma página.',
  'Marque o check-in. A corrente continua.',
  'Durma cedo. Amanhã o dia recomeça normal.',
];

export function DiaRuim() {
  const [prot, setProt] = useState<MenteProtocol | null>(null);
  const [ov, setOv] = useState<MenteOverview | null>(null);
  const [done, setDone] = useState('');
  const q = useMemo(() => ESTOICOS[Math.floor(Math.random() * ESTOICOS.length)], []);

  useEffect(() => {
    api.get<{ protocol: MenteProtocol } | null>('/mente/protocol').then((r) => setProt(r?.protocol ?? null)).catch(() => {});
    api.get<MenteOverview>('/mente/overview').then(setOv).catch(() => {});
  }, []);

  async function minimo() {
    const r = await api.post<{ xpGain: number; overview: MenteOverview }>('/mente/checkin', { kind: 'minimo' }).catch(() => null);
    if (r) { setOv(r.overview); setDone('Feito. Hoje não foi zero, e é isso que separa quem chega de quem desiste. 🔥'); }
  }

  const steps = prot?.diaRuim.length ? prot.diaRuim : PADRAO;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/mente" className="text-sm text-zinc-400 hover:text-white">← Painel</Link>

      <div className="card p-8 text-center border-orange-500/30 bg-gradient-to-b from-orange-600/15 to-transparent">
        <div className="text-5xl">🆘</div>
        <h1 className="text-2xl font-bold mt-3">{prot ? `“${prot.frase}”` : 'Hoje você não precisa de motivação.'}</h1>
        <p className="text-zinc-300 mt-3">Você não precisa estar a fim. Não precisa fazer tudo. Só não pode ser zero.</p>
        {ov && ov.run > 0 && <p className="text-sm text-orange-300 mt-3">🔥 {ov.run === 1 ? 'Ontem você começou uma sequência.' : `São ${ov.run} dias seguidos.`} Não entregue isso por causa de um dia ruim.</p>}
      </div>

      {prot && (
        <section className="card p-5">
          <p className="eyebrow !text-orange-300">Lembra por quê</p>
          <p className="mt-2 text-zinc-200 whitespace-pre-line">{prot.porque}</p>
          <p className="mt-3 text-sm text-orange-100">{prot.identidade}</p>
        </section>
      )}

      <section className="card p-6 border-amber-500/40">
        <p className="eyebrow !text-amber-300">O mínimo de hoje</p>
        <p className="text-lg font-semibold mt-2">{prot?.minimo ?? '10 minutos da sua meta. Só isso.'}</p>
        {ov?.today ? (
          <p className="mt-4 text-emerald-300 text-sm">{done || '✅ Check-in de hoje já está feito. Agora descanse sem culpa.'}</p>
        ) : (
          <button onClick={minimo} className="mt-4 w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-semibold transition">🪫 Fiz o mínimo</button>
        )}
      </section>

      <section className="card p-5">
        <h3 className="font-bold mb-2">🌧️ Roteiro do dia ruim</h3>
        <ol className="list-decimal pl-5 text-sm space-y-1.5 text-zinc-300">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        {!prot && <Link to="/mente/protocolo" className="inline-block mt-3 text-xs text-orange-300 hover:underline">montar o meu roteiro personalizado →</Link>}
      </section>

      <blockquote className="card p-5 text-center">
        <p className="italic text-zinc-200">“{q[1]}”</p>
        <p className="text-xs text-zinc-500 mt-2">— {q[0]} (paráfrase)</p>
      </blockquote>

      <p className="text-xs text-zinc-500 text-center px-4">
        Se não é só um dia ruim e você está mal de verdade há um tempo, conversar com alguém ajuda: procure um psicólogo ou ligue para o CVV no 188 (24h, gratuito).
      </p>
    </div>
  );
}
