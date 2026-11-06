import type { Career } from '../types.js';

// Guia de carreiras. Salários são APROXIMADOS (remuneração inicial de editais recentes) e mudam com reajustes:
// sempre confira o edital mais novo antes de decidir.

export const careers: Career[] = [
  // ---------- Nível médio, acima de R$ 3 mil ----------
  {
    id: 'inss', name: 'Técnico do Seguro Social', orgao: 'INSS', escolaridade: 'medio', salario: '≈ R$ 5.900',
    banca: 'Cebraspe', area: 'administrativo',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-prev'],
    fases: ['Prova objetiva (certo/errado)'],
    dica: 'Um dos melhores de nível médio. Previdenciário pesa muito; Cebraspe pune chute (uma errada anula uma certa).',
  },
  {
    id: 'bb', name: 'Escriturário (Agente Comercial)', orgao: 'Banco do Brasil', escolaridade: 'medio', salario: '≈ R$ 3.600 + benefícios',
    banca: 'Cesgranrio', area: 'bancario',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-banc', 'c-redacao'],
    fases: ['Prova objetiva', 'Redação', 'Procedimento de heteroidentificação/perícia quando aplicável'],
    dica: 'Edital frequente e matérias previsíveis. Tem PLR e plano de carreira; ótima porta de entrada enquanto estuda para algo maior.',
  },
  {
    id: 'caixa', name: 'Técnico Bancário Novo', orgao: 'Caixa Econômica Federal', escolaridade: 'medio', salario: '≈ R$ 3.700 + benefícios',
    banca: 'Cesgranrio', area: 'bancario',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-banc', 'c-redacao'],
    fases: ['Prova objetiva', 'Redação'],
    dica: 'Muito parecido com o BB — estudar para um já te prepara para o outro.',
  },
  {
    id: 'pp', name: 'Policial Penal (estadual)', orgao: 'Secretarias de Administração Penitenciária', escolaridade: 'medio', salario: '≈ R$ 3.000 a R$ 6.000 (varia por estado)',
    banca: 'Varia (Cebraspe, IBFC, Vunesp, AOCP…)', area: 'policial',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-penal', 'c-procpen', 'c-legesp', 'c-policial'],
    fases: ['Prova objetiva', 'TAF', 'Avaliação psicológica', 'Investigação social', 'Curso de formação'],
    dica: 'Em vários estados ainda aceita nível médio. Confira se o seu estado exige superior.',
  },
  {
    id: 'pm', name: 'Soldado PM / Bombeiro', orgao: 'Polícias Militares estaduais', escolaridade: 'medio', salario: '≈ R$ 3.000 a R$ 7.000 (varia por estado)',
    banca: 'Varia (Vunesp, IBADE, Cebraspe…)', area: 'militar',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-penal', 'c-legesp', 'c-policial'],
    fases: ['Prova objetiva', 'TAF', 'Exame médico', 'Psicológico', 'Investigação social'],
    dica: 'Vários estados passaram a exigir nível superior — confira o seu. Idade máxima costuma ser exigida.',
  },
  {
    id: 'essa', name: 'Sargento de Carreira', orgao: 'Exército (EsSA)', escolaridade: 'medio', salario: '≈ R$ 4.000+ após formação',
    banca: 'Exército', area: 'militar',
    materias: ['c-port', 'c-rlm', 'c-atual', 'c-ingles', 'c-redacao'],
    fases: ['Prova objetiva (inclui matemática, história, geografia, inglês)', 'Redação', 'Inspeção de saúde', 'TAF'],
    dica: 'Tem limite de idade. A prova cobra matérias do ensino médio (história, geografia, inglês) que não estão nesta trilha.',
  },
  {
    id: 'legis', name: 'Assistente / Técnico Legislativo', orgao: 'Câmaras Municipais e Assembleias Legislativas', escolaridade: 'medio', salario: '≈ R$ 2.500 a R$ 10.000 (varia muito)',
    banca: 'Varia (FGV, Vunesp, FCC, Quadrix…)', area: 'legislativo',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-legis', 'c-redacao'],
    fases: ['Prova objetiva', 'às vezes discursiva'],
    dica: 'Assembleias e câmaras de capitais pagam bem acima de R$ 3 mil. Sempre estude o regimento interno da casa do edital.',
  },
  {
    id: 'guarda', name: 'Guarda Municipal / Agente de Trânsito', orgao: 'Prefeituras', escolaridade: 'medio', salario: '≈ R$ 2.500 a R$ 5.000 (capitais pagam mais)',
    banca: 'Varia', area: 'policial',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-transito', 'c-penal'],
    fases: ['Prova objetiva', 'TAF', 'Psicológico'],
    dica: 'Bom para treinar provas policiais e ter renda enquanto mira PRF/PF.',
  },

  // ---------- Nível superior (qualquer área) ----------
  {
    id: 'prf', name: 'Policial Rodoviário Federal', orgao: 'PRF', escolaridade: 'superior', salario: '≈ R$ 10.000+',
    banca: 'Cebraspe', area: 'policial',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-penal', 'c-procpen', 'c-legesp', 'c-transito', 'c-policial', 'c-redacao'],
    fases: ['Prova objetiva (certo/errado)', 'Discursiva', 'TAF', 'Avaliação psicológica', 'Exame de saúde', 'Investigação social', 'Curso de formação'],
    dica: 'Aceita graduação em QUALQUER área + CNH categoria B. Trânsito é a matéria de maior peso.',
  },
  {
    id: 'pf', name: 'Agente / Escrivão de Polícia Federal', orgao: 'PF', escolaridade: 'superior', salario: '≈ R$ 14.000',
    banca: 'Cebraspe', area: 'policial',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-penal', 'c-procpen', 'c-legesp', 'c-policial', 'c-contab', 'c-arquivo', 'c-redacao'],
    fases: ['Prova objetiva (certo/errado)', 'Discursiva', 'TAF', 'Exame médico', 'Psicológico', 'Investigação social', 'Curso de formação'],
    dica: 'Graduação em qualquer área + CNH B. Informática e estatística pesam — sua vantagem como dev.',
  },
  {
    id: 'pc', name: 'Agente / Investigador / Escrivão de Polícia Civil', orgao: 'Polícias Civis estaduais', escolaridade: 'superior', salario: '≈ R$ 4.000 a R$ 12.000 (varia por estado)',
    banca: 'Varia (Cebraspe, FGV, Vunesp, AOCP…)', area: 'policial',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-penal', 'c-procpen', 'c-legesp', 'c-policial'],
    fases: ['Prova objetiva', 'TAF', 'Psicológico', 'Investigação social', 'Curso de formação'],
    dica: 'A maioria dos estados hoje exige nível superior. Processo Penal (inquérito) pesa muito.',
  },
  {
    id: 'tj', name: 'Técnico Judiciário', orgao: 'Tribunais (TRF, TRT, TRE, TJ)', escolaridade: 'superior', salario: '≈ R$ 5.000 a R$ 9.000',
    banca: 'FCC, FGV, Cebraspe', area: 'tribunais',
    materias: ['c-port', 'c-rlm', 'c-info', 'c-const', 'c-adm', 'c-civil', 'c-admgeral', 'c-arquivo', 'c-redacao'],
    fases: ['Prova objetiva', 'às vezes discursiva'],
    dica: 'Nos tribunais federais a exigência mudou para nível superior (2022); em alguns TJs estaduais ainda é médio. Confira o edital.',
  },
];

export function findCareer(id: string): Career | undefined {
  return careers.find((c) => c.id === id);
}
