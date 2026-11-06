import { useEffect, useState } from 'react';
import type { Indicadores } from '@devquest/shared';
import { api } from '../../lib/api.js';

// Calculadoras financeiras rodando no navegador (sem IA, instantâneas).
const brl = (v: number) => (isFinite(v) ? v : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export function Calculadoras() {
  const tabs = [
    ['caixinha', '🟣 Caixinha Nubank'], ['juros', '📈 Juros compostos'], ['rendafixa', '🏦 CDB x LCI'], ['reserva', '🛟 Reserva de emergência'], ['orcamento', '🧾 Orçamento 50/30/20'],
    ['parcelado', '🛒 À vista x parcelado'], ['horas', '⏱️ Custo em horas'], ['financiamento', '🏠 Financiamento SAC x Price'],
    ['carro', '🚗 Carro: como ter?'], ['imovel', '🏡 Alugar x comprar'],
    ['fire', '🏝️ Independência'], ['divida', '💳 Dívidas'], ['real', '📉 Juro real'],
  ] as const;
  const [tab, setTab] = useState<(typeof tabs)[number][0]>('caixinha');
  const ind = useIndicadores();
  const cdi = ind?.cdiAnual?.valor ?? null;
  return (
    <div className="space-y-5">
      <header>
        <p className="eyebrow !text-amber-400">💰 Finanças</p>
        <h1 className="text-2xl font-bold mt-1">Calculadoras</h1>
        <p className="text-zinc-400 text-sm mt-1">Simulações educativas, com premissas simples. A realidade varia.</p>
      </header>
      <PainelIndicadores ind={ind} />
      <div className="flex flex-wrap gap-2">{tabs.map(([v, l]) => (
        <button key={v} onClick={() => setTab(v)} className={`px-3 py-1.5 rounded-lg border text-sm ${tab === v ? 'border-amber-500 bg-amber-500/15' : 'border-white/10'}`}>{l}</button>
      ))}</div>
      {tab === 'juros' && <Juros />}
      {tab === 'fire' && <Fire />}
      {tab === 'divida' && <Divida />}
      {tab === 'real' && <Real />}
      {tab === 'rendafixa' && <RendaFixa cdiAtual={cdi} />}
      {tab === 'caixinha' && <Caixinha cdiAtual={cdi} />}
      {tab === 'carro' && <Carro cdiAtual={cdi} />}
      {tab === 'imovel' && <Imovel cdiAtual={cdi} />}
      {tab === 'reserva' && <Reserva />}
      {tab === 'orcamento' && <Orcamento />}
      {tab === 'parcelado' && <Parcelado />}
      {tab === 'horas' && <Horas />}
      {tab === 'financiamento' && <Financiamento />}
    </div>
  );
}

function Field({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold">{label}</span>
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1.5 w-full p-2.5 rounded-xl bg-black/30 border border-white/10" />
    </label>
  );
}

function Result({ items }: { items: [string, string, boolean?][] }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {items.map(([l, v, hi]) => (
        <div key={l} className={`card p-4 ${hi ? 'border-amber-500/40 bg-amber-500/5' : ''}`}><p className="text-xs text-zinc-400">{l}</p><p className={`text-xl font-bold mt-1 ${hi ? 'text-amber-300' : ''}`}>{v}</p></div>
      ))}
    </div>
  );
}

function Juros() {
  const [inicial, setInicial] = useState(1000);
  const [aporte, setAporte] = useState(500);
  const [taxa, setTaxa] = useState(10);
  const [anos, setAnos] = useState(20);
  const i = Math.pow(1 + taxa / 100, 1 / 12) - 1;
  const rows: { ano: number; total: number; investido: number }[] = [];
  let total = inicial;
  for (let m = 1; m <= anos * 12; m++) {
    total = total * (1 + i) + aporte;
    if (m % 12 === 0) rows.push({ ano: m / 12, total, investido: inicial + aporte * m });
  }
  const last = rows[rows.length - 1] ?? { total: inicial, investido: inicial };
  const max = Math.max(...rows.map((r) => r.total), 1);
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-4 gap-3">
        <Field label="Valor inicial (R$)" value={inicial} onChange={setInicial} />
        <Field label="Aporte mensal (R$)" value={aporte} onChange={setAporte} />
        <Field label="Rentabilidade (% ao ano)" value={taxa} onChange={setTaxa} step={0.5} />
        <Field label="Prazo (anos)" value={anos} onChange={(v) => setAnos(Math.max(1, Math.min(60, v)))} />
      </div>
      <Result items={[['Total investido', brl(last.investido)], ['Juros ganhos', brl(last.total - last.investido)], ['Valor final', brl(last.total), true]]} />
      <div className="card p-5">
        <p className="text-sm font-semibold mb-3">Evolução (laranja = juros, cinza = o que você aportou)</p>
        <div className="flex items-end gap-1 h-40">
          {rows.map((r) => (
            <div key={r.ano} className="flex-1 flex flex-col justify-end h-full" title={`Ano ${r.ano}: ${brl(r.total)}`}>
              <div className="bg-amber-500 rounded-t-sm" style={{ height: `${((r.total - r.investido) / max) * 100}%` }} />
              <div className="bg-zinc-600" style={{ height: `${(r.investido / max) * 100}%` }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-500 mt-2">Valores nominais, sem impostos e taxas. Use uma taxa real (acima da inflação) para ver em "dinheiro de hoje".</p>
      </div>
    </div>
  );
}

function Fire() {
  const [gasto, setGasto] = useState(5000);
  const [retirada, setRetirada] = useState(4);
  const [tem, setTem] = useState(20000);
  const [aporte, setAporte] = useState(1500);
  const [real, setReal] = useState(5);
  const meta = (gasto * 12) / (retirada / 100);
  const i = Math.pow(1 + real / 100, 1 / 12) - 1;
  let total = tem, meses = 0;
  while (total < meta && meses < 12 * 80) { total = total * (1 + i) + aporte; meses++; }
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-3 gap-3">
        <Field label="Gasto mensal desejado (R$)" value={gasto} onChange={setGasto} />
        <Field label="Taxa de retirada (% ao ano)" value={retirada} onChange={setRetirada} step={0.25} />
        <Field label="Patrimônio atual (R$)" value={tem} onChange={setTem} />
        <Field label="Aporte mensal (R$)" value={aporte} onChange={setAporte} />
        <Field label="Rentabilidade real (% a.a.)" value={real} onChange={setReal} step={0.5} />
      </div>
      <Result items={[['Patrimônio necessário', brl(meta), true], ['Tempo estimado', meses >= 960 ? '80+ anos' : `${Math.floor(meses / 12)} anos e ${meses % 12} meses`, true], ['Renda passiva mensal', brl(gasto)]]} />
      <p className="text-xs text-zinc-500">A "regra dos 4%" vem de estudos com dados dos EUA. Para o Brasil, muitos usam 3% a 4% por prudência. Tudo em valores reais (descontada a inflação).</p>
    </div>
  );
}

function Divida() {
  const [saldo, setSaldo] = useState(5000);
  const [juros, setJuros] = useState(12);
  const [parcela, setParcela] = useState(600);
  const i = juros / 100;
  let s = saldo, meses = 0, pago = 0;
  while (s > 0 && meses < 600) { s = s * (1 + i) - parcela; pago += parcela + Math.min(0, s); meses++; }
  const impossivel = parcela <= saldo * i;
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-3 gap-3">
        <Field label="Saldo da dívida (R$)" value={saldo} onChange={setSaldo} />
        <Field label="Juros (% ao mês)" value={juros} onChange={setJuros} step={0.5} />
        <Field label="Quanto você paga por mês (R$)" value={parcela} onChange={setParcela} />
      </div>
      {impossivel
        ? <div className="card p-5 border-red-500/40 bg-red-500/5 text-red-200">⚠️ A parcela não cobre nem os juros ({brl(saldo * i)}/mês). A dívida só cresce: renegocie ou troque por um crédito mais barato.</div>
        : <Result items={[['Tempo para quitar', `${meses} meses`, true], ['Total pago', brl(pago)], ['Só de juros', brl(pago - saldo), true]]} />}
      <p className="text-xs text-zinc-500">Juros do rotativo do cartão chegam a passar de 10% ao mês. Trocar por um crédito pessoal ou consignado mais barato costuma ser o primeiro passo.</p>
    </div>
  );
}

function Real() {
  const [nominal, setNominal] = useState(12);
  const [inflacao, setInflacao] = useState(4.5);
  const [ir, setIr] = useState(15);
  const liquido = nominal * (1 - ir / 100);
  const real = ((1 + liquido / 100) / (1 + inflacao / 100) - 1) * 100;
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-3 gap-3">
        <Field label="Rentabilidade bruta (% a.a.)" value={nominal} onChange={setNominal} step={0.25} />
        <Field label="Inflação (% a.a.)" value={inflacao} onChange={setInflacao} step={0.25} />
        <Field label="IR sobre o rendimento (%)" value={ir} onChange={setIr} step={2.5} />
      </div>
      <Result items={[['Rentabilidade líquida', `${liquido.toFixed(2)}% a.a.`], ['Juro real (acima da inflação)', `${real.toFixed(2)}% a.a.`, true], ['Em R$ 10 mil, ganho real/ano', brl(100 * real)]]} />
      <p className="text-xs text-zinc-500">Juro real = quanto seu poder de compra realmente cresce. Fórmula de Fisher: (1 + líquido) ÷ (1 + inflação) − 1.</p>
    </div>
  );
}

// IR regressivo da renda fixa (CDB, Tesouro, debêntures comuns) pelo prazo em dias corridos.
const irRegressivo = (dias: number) => (dias <= 180 ? 22.5 : dias <= 360 ? 20 : dias <= 720 ? 17.5 : 15);

function RendaFixa({ cdiAtual }: { cdiAtual: number | null }) {
  const [cdi, setCdi] = useCdi(cdiAtual);
  const [valor, setValor] = useState(10000);
  const [dias, setDias] = useState(365);
  const [pctCdb, setPctCdb] = useState(110);
  const [pctLci, setPctLci] = useState(92);
  const anos = Math.max(1, dias) / 365;
  const ir = irRegressivo(dias);
  const rend = (pct: number) => valor * (Math.pow(1 + (cdi / 100) * (pct / 100), anos) - 1);
  const cdb = rend(pctCdb) * (1 - ir / 100);
  const lci = rend(pctLci);
  const equivalente = pctLci / (1 - ir / 100);
  const vence = lci > cdb ? 'LCI/LCA' : 'CDB';
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-3 gap-3">
        <Field label="CDI (% a.a.)" value={cdi} onChange={setCdi} step={0.25} />
        <Field label="Valor aplicado (R$)" value={valor} onChange={setValor} />
        <Field label="Prazo (dias corridos)" value={dias} onChange={setDias} step={30} />
        <Field label="CDB / Tesouro: % do CDI" value={pctCdb} onChange={setPctCdb} />
        <Field label="LCI / LCA (isenta): % do CDI" value={pctLci} onChange={setPctLci} />
      </div>
      <Result items={[[`CDB líquido (IR ${ir}%)`, brl(cdb), vence === 'CDB'], ['LCI/LCA líquido', brl(lci), vence !== 'CDB'], ['LCI equivale a um CDB de', `${equivalente.toFixed(0)}% do CDI`]]} />
      <p className="text-xs text-zinc-500">IR regressivo: até 180 dias 22,5% · até 360 dias 20% · até 720 dias 17,5% · acima 15%. LCI, LCA, CRI e CRA são isentos para pessoa física. Lembre do FGC (até R$ 250 mil por instituição) e da liquidez: muita LCI só pode ser resgatada no vencimento.</p>
    </div>
  );
}

function Reserva() {
  const [gasto, setGasto] = useState(3500);
  const [meses, setMeses] = useState(6);
  const [tem, setTem] = useState(2000);
  const [guarda, setGuarda] = useState(500);
  const meta = gasto * meses;
  const falta = Math.max(0, meta - tem);
  const tempo = guarda > 0 ? Math.ceil(falta / guarda) : Infinity;
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-4 gap-3">
        <Field label="Custo de vida mensal (R$)" value={gasto} onChange={setGasto} />
        <Field label="Meses de proteção" value={meses} onChange={setMeses} />
        <Field label="Já tenho guardado (R$)" value={tem} onChange={setTem} />
        <Field label="Consigo guardar/mês (R$)" value={guarda} onChange={setGuarda} />
      </div>
      <Result items={[['Meta da reserva', brl(meta), true], ['Falta', brl(falta)], ['Tempo para completar', falta === 0 ? 'Completa! 🎉' : isFinite(tempo) ? `${Math.floor(tempo / 12)} anos e ${tempo % 12} meses` : '—', true]]} />
      <div className="card p-4"><div className="h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (tem / Math.max(1, meta)) * 100)}%` }} /></div><p className="text-xs text-zinc-400 mt-2">{Math.min(100, (tem / Math.max(1, meta)) * 100).toFixed(0)}% da reserva</p></div>
      <p className="text-xs text-zinc-500">Referência: servidor público 3–6 meses · CLT 6 meses · autônomo/PJ 12 meses. Onde guardar: Tesouro Selic ou CDB com liquidez diária (≥ 100% do CDI). Não é lugar para buscar rentabilidade, e sim segurança e saque rápido.</p>
    </div>
  );
}

function Orcamento() {
  const [renda, setRenda] = useState(4000);
  const [nec, setNec] = useState(50);
  const [des, setDes] = useState(30);
  const inv = Math.max(0, 100 - nec - des);
  const partes: [string, number, string][] = [['🏠 Necessidades (aluguel, contas, mercado, transporte)', nec, 'bg-zinc-500'], ['🎉 Desejos (lazer, delivery, assinaturas)', des, 'bg-sky-500'], ['📈 Futuro (reserva, investimentos, dívidas)', inv, 'bg-amber-500']];
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-3 gap-3">
        <Field label="Renda líquida mensal (R$)" value={renda} onChange={setRenda} />
        <Field label="Necessidades (%)" value={nec} onChange={setNec} step={5} />
        <Field label="Desejos (%)" value={des} onChange={setDes} step={5} />
      </div>
      <div className="card p-5 space-y-3">
        <div className="flex h-4 rounded-full overflow-hidden">{partes.map(([l, p, c]) => <div key={l} className={c} style={{ width: `${p}%` }} />)}</div>
        {partes.map(([l, p]) => <div key={l} className="flex justify-between text-sm"><span>{l} · {p}%</span><span className="font-bold">{brl((renda * p) / 100)}</span></div>)}
      </div>
      <p className="text-xs text-zinc-500">Ponto de partida, não regra fixa. Se as necessidades passam de 50%, o primeiro corte costuma ser moradia/carro. Com dívida cara, jogue os "desejos" para quitar ela antes.</p>
    </div>
  );
}

// Taxa mensal embutida num parcelamento (busca binária): valor presente das parcelas = preço à vista.
function taxaEmbutida(aVista: number, parcela: number, n: number) {
  if (parcela * n <= aVista) return 0;
  let lo = 0, hi = 1;
  for (let k = 0; k < 100; k++) {
    const mid = (lo + hi) / 2;
    const pv = (parcela * (1 - Math.pow(1 + mid, -n))) / mid;
    if (pv > aVista) lo = mid; else hi = mid;
  }
  return lo * 100;
}

function Parcelado() {
  const [preco, setPreco] = useState(3000);
  const [n, setN] = useState(10);
  const [desconto, setDesconto] = useState(8);
  const [rende, setRende] = useState(0.85);
  const parcela = preco / Math.max(1, n);
  const aVista = preco * (1 - desconto / 100);
  const r = rende / 100;
  // Quanto preciso deixar aplicado hoje para pagar todas as parcelas (1ª em 30 dias).
  const precisaHoje = r > 0 ? (parcela * (1 - Math.pow(1 + r, -n))) / r : preco;
  const melhor = aVista <= precisaHoje ? 'À vista' : 'Parcelado';
  const embutida = taxaEmbutida(aVista, parcela, n);
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-4 gap-3">
        <Field label="Preço parcelado total (R$)" value={preco} onChange={setPreco} />
        <Field label="Nº de parcelas" value={n} onChange={setN} />
        <Field label="Desconto à vista (%)" value={desconto} onChange={setDesconto} step={0.5} />
        <Field label="Seu dinheiro rende (% a.m. líquido)" value={rende} onChange={setRende} step={0.05} />
      </div>
      <Result items={[['Pagando à vista', brl(aVista), melhor === 'À vista'], ['Custo real parcelando (hoje)', brl(precisaHoje), melhor === 'Parcelado'], ['Juro escondido no parcelado', `${embutida.toFixed(2)}% a.m.`]]} />
      <p className="text-sm">👉 Melhor opção: <b className="text-amber-300">{melhor}</b>{melhor === 'À vista' ? ` (economia de ${brl(precisaHoje - aVista)})` : ` (você ganha ${brl(aVista - precisaHoje)} deixando o dinheiro rendendo)`}.</p>
      <p className="text-xs text-zinc-500">Se o juro escondido for maior que o que seu dinheiro rende, pague à vista. Só vale parcelar se você REALMENTE deixar o dinheiro aplicado e não gastar.</p>
    </div>
  );
}

function Horas() {
  const [salario, setSalario] = useState(3500);
  const [horas, setHoras] = useState(176);
  const [preco, setPreco] = useState(800);
  const [real, setReal] = useState(5);
  const porHora = salario / Math.max(1, horas);
  const h = preco / porHora;
  const em10 = preco * Math.pow(1 + real / 100, 10);
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-4 gap-3">
        <Field label="Salário líquido (R$)" value={salario} onChange={setSalario} />
        <Field label="Horas trabalhadas/mês" value={horas} onChange={setHoras} />
        <Field label="Preço da compra (R$)" value={preco} onChange={setPreco} />
        <Field label="Rentabilidade real (% a.a.)" value={real} onChange={setReal} step={0.5} />
      </div>
      <Result items={[['Sua hora vale', brl(porHora)], ['Essa compra custa', `${h.toFixed(1)} h (${(h / 8).toFixed(1)} dias)`, true], ['Se investisse, em 10 anos', brl(em10)]]} />
      <p className="text-xs text-zinc-500">Inclua nas horas o tempo de deslocamento para uma visão mais honesta. Antes de comprar, pergunte: "vale {h.toFixed(0)} horas da minha vida?"</p>
    </div>
  );
}

function Financiamento() {
  const [valor, setValor] = useState(300000);
  const [entrada, setEntrada] = useState(60000);
  const [jurosAno, setJurosAno] = useState(11);
  const [meses, setMeses] = useState(360);
  const P = Math.max(0, valor - entrada);
  const n = Math.max(1, meses);
  const i = Math.pow(1 + jurosAno / 100, 1 / 12) - 1;
  const pmt = i > 0 ? (P * i) / (1 - Math.pow(1 + i, -n)) : P / n;
  const amort = P / n;
  const sac1 = amort + P * i;
  const sacUlt = amort * (1 + i);
  const jurosSac = (i * P * (n + 1)) / 2;
  const jurosPrice = pmt * n - P;
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-4 gap-3">
        <Field label="Valor do imóvel/bem (R$)" value={valor} onChange={setValor} />
        <Field label="Entrada (R$)" value={entrada} onChange={setEntrada} />
        <Field label="Juros (% a.a.)" value={jurosAno} onChange={setJurosAno} step={0.25} />
        <Field label="Prazo (meses)" value={meses} onChange={setMeses} step={12} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="card p-4 space-y-1 text-sm"><p className="font-bold">SAC (parcela cai com o tempo)</p><p>1ª parcela: <b>{brl(sac1)}</b></p><p>Última: <b>{brl(sacUlt)}</b></p><p>Total de juros: <b className="text-amber-300">{brl(jurosSac)}</b></p></div>
        <div className="card p-4 space-y-1 text-sm"><p className="font-bold">Price (parcela fixa)</p><p>Parcela: <b>{brl(pmt)}</b></p><p>&nbsp;</p><p>Total de juros: <b className="text-amber-300">{brl(jurosPrice)}</b></p></div>
      </div>
      <p className="text-sm">SAC economiza <b className="text-amber-300">{brl(jurosPrice - jurosSac)}</b> em juros, mas começa com parcela {brl(sac1 - pmt)} maior.</p>
      <p className="text-xs text-zinc-500">Sem TR, seguros (MIP/DFI) e taxas, que aumentam o custo real (veja o CET). Amortizar antes, reduzindo o PRAZO, é o que mais corta juros. Regra comum dos bancos: parcela até 30% da renda.</p>
    </div>
  );
}

// Busca os indicadores ao abrir e a cada 30s (o servidor faz cache: BC 1h, cripto/dólar 30s).
function useIndicadores() {
  const [ind, setInd] = useState<Indicadores | null>(null);
  useEffect(() => {
    const load = () => api.get<Indicadores>('/financas/indicadores').then(setInd).catch(() => {});
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, []);
  return ind;
}

// Campo de CDI que começa no valor do dia, mas o usuário pode mudar para simular.
function useCdi(cdiAtual: number | null) {
  const [cdi, setCdi] = useState(cdiAtual ?? 14);
  const [mexeu, setMexeu] = useState(false);
  useEffect(() => { if (cdiAtual != null && !mexeu) setCdi(cdiAtual); }, [cdiAtual, mexeu]);
  return [cdi, (v: number) => { setMexeu(true); setCdi(v); }] as const;
}

const pct = (v: number, d = 2) => `${v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })}%`;
const reais = (v: number, d = 2) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: d, maximumFractionDigits: d });

function PainelIndicadores({ ind }: { ind: Indicadores | null }) {
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick((n) => n + 1), 1000); return () => clearInterval(t); }, []);
  if (!ind) return <div className="card p-4 text-sm text-zinc-400">Carregando indicadores do mercado…</div>;
  const seg = Math.round((Date.now() - new Date(ind.atualizadoEm).getTime()) / 1000);
  const cards: [string, string, string, string?][] = [
    ['CDI', ind.cdiAnual ? `${pct(ind.cdiAnual.valor)} a.a.` : '—', ind.cdiAnual ? `${pct(ind.cdiDiario?.valor ?? 0, 4)} ao dia · ${ind.cdiAnual.data}` : ''],
    ['Selic (meta)', ind.selic ? `${pct(ind.selic.valor)} a.a.` : '—', 'definida pelo Copom'],
    ['IPCA 12 meses', ind.ipca12m ? pct(ind.ipca12m.valor) : '—', ind.ipca12m ? `até ${ind.ipca12m.data.slice(3)}` : ''],
    ['Dólar', ind.dolar ? reais(ind.dolar.valor, 3) : '—', ind.dolarPtax ? `PTAX ${reais(ind.dolarPtax.valor, 4)} · ${ind.dolarPtax.data}` : 'ao vivo'],
    ['Bitcoin', ind.btc ? reais(ind.btc.valor, 0) : '—', ind.btcVar24h != null ? `${ind.btcVar24h >= 0 ? '▲' : '▼'} ${pct(Math.abs(ind.btcVar24h))} no dia` : '', ind.btcVar24h != null ? (ind.btcVar24h >= 0 ? 'text-emerald-400' : 'text-red-400') : undefined],
  ];
  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {cards.map(([l, v, sub, cor]) => (
          <div key={l} className="card p-3"><p className="text-xs text-zinc-400">{l}</p><p className="text-lg font-bold">{v}</p><p className={`text-[11px] ${cor ?? 'text-zinc-500'}`}>{sub}</p></div>
        ))}
      </div>
      <p className="text-[11px] text-zinc-500 flex items-center gap-1.5"><span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Ao vivo · atualizado há {seg}s. Fontes: Banco Central (CDI, Selic, IPCA, PTAX, publicados 1x por dia útil) e Mercado Bitcoin (dólar via USDT e BTC, a cada 30s).</p>
    </div>
  );
}

// IOF regressivo nos primeiros 30 dias (% do rendimento cobrado), dia 1 → 96%, dia 30 → 0%.
const IOF = [96, 93, 90, 86, 83, 80, 76, 73, 70, 66, 63, 60, 56, 53, 50, 46, 43, 40, 36, 33, 30, 26, 23, 20, 16, 13, 10, 6, 3, 0];
const iofDia = (dias: number) => (dias >= 30 ? 0 : IOF[Math.max(0, dias - 1)]);
// Dias corridos → dias úteis aproximados (o CDI só rende em dia útil).
const diasUteis = (dias: number) => Math.round(dias * (252 / 365));

function Caixinha({ cdiAtual }: { cdiAtual: number | null }) {
  const [cdi, setCdi] = useCdi(cdiAtual);
  const [valor, setValor] = useState(5000);
  const [pctCdi, setPctCdi] = useState(100);
  const [dias, setDias] = useState(365);
  const taxaDia = Math.pow(1 + (cdi / 100) * (pctCdi / 100), 1 / 252) - 1;
  const simula = (d: number) => {
    const bruto = valor * (Math.pow(1 + taxaDia, diasUteis(d)) - 1);
    const iof = bruto * (iofDia(d) / 100);
    const ir = (bruto - iof) * (irRegressivo(d) / 100);
    return { bruto, iof, ir, liquido: bruto - iof - ir };
  };
  const r = simula(Math.max(1, dias));
  const hoje = valor * taxaDia;
  const poupanca = valor * (Math.pow(1.005, Math.max(1, dias) / 30.4) - 1); // 0,5% a.m. (+TR, ignorada) quando Selic > 8,5%
  const prazos = [30, 90, 180, 365, 730];
  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-4 gap-3">
        <Field label="Valor na caixinha (R$)" value={valor} onChange={setValor} step={100} />
        <Field label="Rende % do CDI" value={pctCdi} onChange={setPctCdi} step={5} />
        <Field label="Deixar por (dias)" value={dias} onChange={setDias} step={30} />
        <Field label="CDI (% a.a.) · valor de hoje" value={cdi} onChange={setCdi} step={0.05} />
      </div>
      <Result items={[
        ['Rende por dia útil (bruto)', reais(hoje)],
        [`Líquido em ${dias} dias`, reais(r.liquido), true],
        ['Saldo final', reais(valor + r.liquido), true],
      ]} />
      <div className="card p-4 text-sm grid sm:grid-cols-4 gap-2">
        <p>Bruto: <b>{reais(r.bruto)}</b></p>
        <p>IOF: <b className="text-red-300">−{reais(r.iof)}</b> {iofDia(dias) > 0 && <span className="text-xs text-zinc-500">({iofDia(dias)}%)</span>}</p>
        <p>IR ({irRegressivo(dias)}%): <b className="text-red-300">−{reais(r.ir)}</b></p>
        <p>Poupança no mesmo prazo: <b>{reais(poupanca)}</b></p>
      </div>
      <div className="card p-5 overflow-x-auto">
        <p className="text-sm font-semibold mb-2">Quanto sobra no bolso por prazo</p>
        <table className="w-full text-sm">
          <thead><tr className="text-zinc-400 text-xs text-left"><th className="py-1">Prazo</th><th>Imposto</th><th>Rendimento líquido</th><th>Rende/mês (média)</th></tr></thead>
          <tbody>{prazos.map((d) => { const x = simula(d); return (
            <tr key={d} className="border-t border-white/5"><td className="py-1.5">{d} dias</td><td>IR {irRegressivo(d)}%</td><td className="font-bold">{reais(x.liquido)}</td><td>{reais(x.liquido / (d / 30.4))}</td></tr>
          ); })}</tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-500">A Caixinha do Nubank é um RDB com liquidez diária, protegido pelo FGC até R$ 250 mil. O rendimento entra todo dia útil, mas o IR só é descontado no resgate (sobre o dinheiro que sai), com alíquota pelo tempo que cada depósito ficou lá. Resgatar antes de 30 dias também paga IOF. Confira no app o % do CDI da sua caixinha: algumas modalidades rendem mais que 100%.</p>
    </div>
  );
}

// Rendimento líquido aproximado de deixar o dinheiro aplicado: 100% do CDI menos IR de 15%.
const cdiLiquido = (cdi: number | null) => (cdi == null ? null : Math.round(cdi * 0.85 * 100) / 100);
const mensal = (aa: number) => Math.pow(1 + aa / 100, 1 / 12) - 1;

// Compara opções pelo PATRIMÔNIO no fim do período: quem começa com o mesmo dinheiro e,
// mês a mês, paga cada cenário e deixa o resto rendendo. Custo = quanto ficou abaixo de só investir.
function Carro({ cdiAtual }: { cdiAtual: number | null }) {
  const [preco, setPreco] = useState(80000);
  const [anos, setAnos] = useState(5);
  const [km, setKm] = useState(1000);
  const [rende, setRende] = useCdi(cdiLiquido(cdiAtual));
  const [deprec, setDeprec] = useState(10);
  const [ipva, setIpva] = useState(4);
  const [seguro, setSeguro] = useState(5);
  const [manut, setManut] = useState(2500);
  const [kmL, setKmL] = useState(11);
  const [litro, setLitro] = useState(6.2);
  const [entrada, setEntrada] = useState(30);
  const [jurosFin, setJurosFin] = useState(1.8);
  const [parcFin, setParcFin] = useState(48);
  const [taxaAdm, setTaxaAdm] = useState(18);
  const [prazoCons, setPrazoCons] = useState(60);
  const [contempla, setContempla] = useState(30);
  const [porKm, setPorKm] = useState(2.6);

  const N = Math.max(1, Math.round(anos * 12));
  const r = mensal(rende);
  const dm = mensal(-deprec);
  const valorCarro = (idade: number) => preco * Math.pow(1 + dm, idade);
  const combustivel = (km / Math.max(1, kmL)) * litro;
  const custoUso = (idade: number) => (valorCarro(idade) * (ipva + seguro)) / 100 / 12 + manut / 12 + combustivel;
  const app = km * porKm;

  // Simula: pot começa com `preco`, cada mês rende e paga a saída do cenário; no fim soma a revenda e tira dívidas.
  const simula = (saida: (m: number) => number, fim: number) => {
    let pot = preco;
    for (let m = 1; m <= N; m++) pot = pot * (1 + r) - saida(m);
    return pot + fim;
  };
  const base = preco * Math.pow(1 + r, N);

  const aVista = simula((m) => (m === 1 ? preco : 0) + custoUso(m), valorCarro(N));

  const financiado = preco * (1 - entrada / 100);
  const jf = jurosFin / 100;
  const pmt = jf > 0 ? (financiado * jf) / (1 - Math.pow(1 + jf, -parcFin)) : financiado / parcFin;
  const saldoFin = (pagas: number) => (pagas >= parcFin ? 0 : jf > 0 ? (pmt * (1 - Math.pow(1 + jf, -(parcFin - pagas)))) / jf : pmt * (parcFin - pagas));
  const fin = simula((m) => (m === 1 ? (preco * entrada) / 100 : 0) + (m <= parcFin ? pmt : 0) + custoUso(m), valorCarro(N) - saldoFin(N));

  const parcCons = (preco * (1 + taxaAdm / 100)) / Math.max(1, prazoCons);
  const k = Math.min(contempla, prazoCons);
  const consFim = (k <= N ? valorCarro(N - k) : 0) - Math.max(0, prazoCons - N) * parcCons;
  const cons = simula((m) => (m <= prazoCons ? parcCons : 0) + (m > k ? custoUso(m - k) : app), consFim);

  const apl = simula(() => app, 0);

  const ops = [
    ['💵 À vista', aVista, `Paga ${brl(preco)} e tem o carro na hora.`],
    ['🏦 Financiado', fin, `Entrada ${brl((preco * entrada) / 100)} + ${parcFin}x de ${brl(pmt)} (total ${brl(pmt * parcFin)}).`],
    ['🤝 Consórcio', cons, `${prazoCons}x de ${brl(parcCons)}; carro só no mês ${k} (antes disso, usa aplicativo).`],
    ['📱 Só aplicativo', apl, `${brl(app)}/mês de corrida; o dinheiro do carro fica rendendo.`],
  ] as const;
  const melhor = Math.max(...ops.map((o) => o[1]));

  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-4 gap-3">
        <Field label="Preço do carro (R$)" value={preco} onChange={setPreco} step={1000} />
        <Field label="Comparar em (anos)" value={anos} onChange={setAnos} />
        <Field label="Km rodados por mês" value={km} onChange={setKm} step={100} />
        <Field label="Dinheiro aplicado rende (% a.a. líq.)" value={rende} onChange={setRende} step={0.25} />
      </div>
      <details className="card p-5">
        <summary className="cursor-pointer text-sm font-semibold">⚙️ Ajustar custos do carro, financiamento, consórcio e aplicativo</summary>
        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <Field label="Desvalorização (% a.a.)" value={deprec} onChange={setDeprec} />
          <Field label="IPVA (% do valor)" value={ipva} onChange={setIpva} step={0.5} />
          <Field label="Seguro (% do valor/ano)" value={seguro} onChange={setSeguro} step={0.5} />
          <Field label="Manutenção (R$/ano)" value={manut} onChange={setManut} step={100} />
          <Field label="Consumo (km/l)" value={kmL} onChange={setKmL} step={0.5} />
          <Field label="Combustível (R$/l)" value={litro} onChange={setLitro} step={0.1} />
          <Field label="Financ.: entrada (%)" value={entrada} onChange={setEntrada} step={5} />
          <Field label="Financ.: juros (% a.m.)" value={jurosFin} onChange={setJurosFin} step={0.1} />
          <Field label="Financ.: parcelas" value={parcFin} onChange={setParcFin} step={6} />
          <Field label="Consórcio: taxa adm. total (%)" value={taxaAdm} onChange={setTaxaAdm} />
          <Field label="Consórcio: prazo (meses)" value={prazoCons} onChange={setPrazoCons} step={6} />
          <Field label="Consórcio: contemplado no mês" value={contempla} onChange={setContempla} />
          <Field label="Aplicativo: R$ por km" value={porKm} onChange={setPorKm} step={0.1} />
        </div>
      </details>
      <div className="grid sm:grid-cols-2 gap-3">
        {ops.map(([nome, fim, desc]) => {
          const custo = base - fim;
          return (
            <div key={nome} className={`card p-4 ${fim === melhor ? 'border-amber-500/40 bg-amber-500/5' : ''}`}>
              <p className="font-bold">{nome} {fim === melhor && <span className="text-xs text-amber-300">· mais barato</span>}</p>
              <p className="text-2xl font-bold mt-1">{brl(custo)}</p>
              <p className="text-xs text-zinc-400">custo total em {anos} anos · {brl(custo / N)}/mês</p>
              <p className="text-xs text-zinc-500 mt-2">{desc}</p>
            </div>
          );
        })}
      </div>
      <div className="card p-4 text-sm">Custo mensal de manter o carro: <b>{brl(custoUso(1))}</b> no 1º ano (IPVA + seguro + manutenção + {brl(combustivel)} de combustível), fora a desvalorização de ~{brl((preco * deprec) / 100 / 12)}/mês.</div>
      <p className="text-xs text-zinc-500">"Custo" = quanto seu patrimônio fica abaixo do que seria se você só deixasse {brl(preco)} aplicado, já contando a revenda do carro no fim. Inclui o rendimento que você deixa de ganhar. Consórcio sem reajuste da carta, e contemplação por sorteio é incerta. Carro também tem valor de conforto e segurança que a conta não mede.</p>
    </div>
  );
}

function Imovel({ cdiAtual }: { cdiAtual: number | null }) {
  const [valor, setValor] = useState(400000);
  const [aluguel, setAluguel] = useState(2000);
  const [anos, setAnos] = useState(20);
  const [rende, setRende] = useCdi(cdiLiquido(cdiAtual));
  const [entrada, setEntrada] = useState(20);
  const [juros, setJuros] = useState(11.5);
  const [prazo, setPrazo] = useState(360);
  const [valoriza, setValoriza] = useState(5);
  const [reajuste, setReajuste] = useState(5);
  const [custoCompra, setCustoCompra] = useState(5);
  const [manut, setManut] = useState(1);

  const N = Math.max(1, Math.round(anos * 12));
  const r = mensal(rende);
  const i = mensal(juros);
  const P = valor * (1 - entrada / 100);
  const n = Math.max(1, prazo);
  const amort = P / n; // SAC, o mais comum no financiamento imobiliário
  const inicial = valor * (entrada + custoCompra) / 100;

  let comprador = 0, inquilino = inicial, saldo = P, alug = aluguel, imovel = valor;
  const anual: { ano: number; compra: number; aluga: number }[] = [];
  let primeira = 0;
  for (let m = 1; m <= N; m++) {
    const parcela = m <= n ? amort + saldo * i : 0;
    if (m === 1) primeira = parcela;
    saldo = Math.max(0, saldo - (m <= n ? amort : 0));
    const saidaCompra = parcela + (imovel * manut) / 100 / 12;
    const orcamento = Math.max(saidaCompra, alug);
    comprador = comprador * (1 + r) + (orcamento - saidaCompra);
    inquilino = inquilino * (1 + r) + (orcamento - alug);
    imovel *= 1 + mensal(valoriza);
    if (m % 12 === 0) { alug *= 1 + reajuste / 100; anual.push({ ano: m / 12, compra: imovel - saldo + comprador, aluga: inquilino }); }
  }
  const fim = anual[anual.length - 1] ?? { compra: valor - P, aluga: inicial };
  const vence = fim.compra >= fim.aluga ? 'Comprar' : 'Alugar e investir';
  const max = Math.max(1, ...anual.flatMap((a) => [a.compra, a.aluga]));
  const virada = anual.find((a) => a.compra >= a.aluga)?.ano;

  return (
    <div className="space-y-4">
      <div className="card p-5 grid sm:grid-cols-4 gap-3">
        <Field label="Valor do imóvel (R$)" value={valor} onChange={setValor} step={10000} />
        <Field label="Aluguel de um igual (R$/mês)" value={aluguel} onChange={setAluguel} step={100} />
        <Field label="Comparar em (anos)" value={anos} onChange={(v) => setAnos(Math.max(1, Math.min(40, v)))} />
        <Field label="Investimentos rendem (% a.a. líq.)" value={rende} onChange={setRende} step={0.25} />
      </div>
      <details className="card p-5">
        <summary className="cursor-pointer text-sm font-semibold">⚙️ Ajustar financiamento, valorização e custos</summary>
        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <Field label="Entrada (%)" value={entrada} onChange={setEntrada} step={5} />
          <Field label="Juros do financ. (% a.a.)" value={juros} onChange={setJuros} step={0.25} />
          <Field label="Prazo (meses)" value={prazo} onChange={setPrazo} step={12} />
          <Field label="Valorização do imóvel (% a.a.)" value={valoriza} onChange={setValoriza} step={0.5} />
          <Field label="Reajuste do aluguel (% a.a.)" value={reajuste} onChange={setReajuste} step={0.5} />
          <Field label="ITBI + cartório (% do valor)" value={custoCompra} onChange={setCustoCompra} step={0.5} />
          <Field label="IPTU + manutenção (% a.a.)" value={manut} onChange={setManut} step={0.25} />
        </div>
      </details>
      <Result items={[[`🏡 Comprando: patrimônio em ${anos} anos`, brl(fim.compra), vence === 'Comprar'], [`📈 Alugando e investindo`, brl(fim.aluga), vence !== 'Comprar'], ['Diferença', brl(Math.abs(fim.compra - fim.aluga))]]} />
      <p className="text-sm">👉 Nesse cenário, <b className="text-amber-300">{vence}</b> deixa você mais rico{virada && vence === 'Comprar' ? ` (comprar passa a valer a partir do ano ${virada})` : ''}. Aluguel = <b>{((aluguel / valor) * 100).toFixed(2)}%</b> do valor do imóvel por mês; 1ª parcela (SAC) = <b>{brl(primeira)}</b>.</p>
      <div className="card p-5">
        <p className="text-sm font-semibold mb-3">Patrimônio ano a ano (laranja = comprar, azul = alugar e investir)</p>
        <div className="flex items-end gap-1 h-40">
          {anual.map((a) => (
            <div key={a.ano} className="flex-1 flex items-end gap-px h-full" title={`Ano ${a.ano}: comprar ${brl(a.compra)} · alugar ${brl(a.aluga)}`}>
              <div className="flex-1 bg-amber-500 rounded-t-sm" style={{ height: `${(Math.max(0, a.compra) / max) * 100}%` }} />
              <div className="flex-1 bg-sky-500 rounded-t-sm" style={{ height: `${(Math.max(0, a.aluga) / max) * 100}%` }} />
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-zinc-500">Os dois começam com o mesmo dinheiro (entrada + ITBI/cartório) e o mesmo orçamento mensal: quem gasta menos no mês investe a diferença. Funciona só se o inquilino REALMENTE investir. Regra de bolso: aluguel abaixo de ~0,4% do valor do imóvel ao mês costuma favorecer alugar. Sem TR, seguros do financiamento e custos de venda. Casa própria também tem valor de estabilidade que a conta não mede.</p>
    </div>
  );
}
