import type { Realm, Lesson } from '../types.js';
import { withLevels } from '../levels.js';
import { concursoLevels, novasMaterias } from './niveis.js';

// Trilha de CONCURSOS — separada da trilha de programação.
// Cada matéria é um "reino"; a IA gera o conteúdo das aulas sob demanda, no formato de banca.
// Ids começam com "c-" para nunca colidir com as aulas de dev (e para separar revisão/progresso).

type L = Omit<Lesson, 'realmId' | 'minutes'> & { minutes?: number };

function realm(r: Omit<Realm, 'lessons' | 'track'>, lessons: L[]): Realm {
  return { ...r, track: 'concurso', lessons: lessons.map((l) => ({ minutes: 25, ...l, realmId: r.id })) };
}

export const estrategia = realm({
  id: 'c-estrategia', title: 'Estratégia de Aprovação', emoji: '🧠', color: 'violet',
  tagline: 'Comece aqui: o método vale para QUALQUER concurso',
  why: 'Quem passa não é quem estuda mais horas, é quem estuda o que cai, do jeito que a banca cobra, revisando no tempo certo. Isso aqui vale para PRF, PF, tribunal, banco ou câmara.',
}, [
  { id: 'c-est-1', title: 'Escolhendo o concurso certo para você', objectives: ['Comparar salário, escolaridade, concorrência e frequência de editais', 'Definir um concurso-alvo e uma "área" de concursos parecidos'], topics: ['estudar por área (policial, tribunais, bancário, administrativo)', 'nível médio x superior', 'salário líquido x bruto', 'frequência de editais', 'concorrência real (faltosos)', 'matérias em comum entre concursos'] },
  { id: 'c-est-2', title: 'Destrinchando o edital: o edital verticalizado', objectives: ['Ler um edital e extrair o que importa', 'Montar o edital verticalizado'], topics: ['requisitos e fases', 'conteúdo programático', 'peso das matérias', 'edital verticalizado', 'estudar pelo edital anterior antes do novo sair', 'critérios de eliminação'] },
  { id: 'c-est-3', title: 'Ciclo de estudos x cronograma fixo', objectives: ['Montar um ciclo de estudos', 'Distribuir horas por peso e dificuldade'], topics: ['ciclo de estudos', 'peso x dificuldade x afinidade', 'blocos de 50 min (pomodoro)', 'controle de horas líquidas', 'o que fazer quando atrasa'] },
  { id: 'c-est-4', title: 'Estudo ativo: teoria, lei seca e questões', objectives: ['Usar a proporção certa de teoria x questões', 'Estudar lei seca'], topics: ['estudo ativo x passivo', 'questões desde o 1º dia', 'lei seca (grifo e leitura dirigida)', 'resumos e mapas mentais', 'caderno de erros'] },
  { id: 'c-est-5', title: 'Revisão espaçada: não esquecer o que estudou', objectives: ['Aplicar revisões 24h/7d/30d', 'Usar flashcards e caderno de erros'], topics: ['curva do esquecimento', 'revisões 1-7-30', 'flashcards', 'revisar por questões', 'revisão na reta final'] },
  { id: 'c-est-6', title: 'Como cada banca pensa: Cebraspe, FGV, FCC, Cesgranrio, Vunesp', objectives: ['Reconhecer o estilo de cada banca', 'Ajustar o estudo à banca'], topics: ['Cebraspe: certo/errado, uma errada anula uma certa', 'FGV: interpretação e textos longos', 'FCC: letra da lei', 'Cesgranrio: bancário e matemática', 'Vunesp: polícias de SP', 'quando deixar em branco no Cebraspe'] },
  { id: 'c-est-7', title: 'Simulados, análise de desempenho e reta final', objectives: ['Fazer e analisar simulados', 'Planejar as últimas semanas'], topics: ['simulado cronometrado', 'ordem de resolução da prova', 'gestão de tempo', 'análise de erros por matéria', 'reta final: revisão e não matéria nova'] },
  { id: 'c-est-8', title: 'Além da prova: TAF, psicotécnico, investigação social', objectives: ['Conhecer as fases das carreiras policiais e militares', 'Se preparar para cada uma'], topics: ['TAF (barra, corrida, abdominal)', 'avaliação psicológica', 'investigação social', 'exame médico', 'curso de formação'] },
  { id: 'c-est-9', title: 'Rotina, constância e cabeça no lugar', objectives: ['Estudar trabalhando', 'Lidar com ansiedade e reprovação'], topics: ['estudar com pouco tempo', 'sono e exercício', 'ansiedade de prova', 'reprovação faz parte', 'dia da prova: checklist'] },
]);

export const portugues = realm({
  id: 'c-port', title: 'Língua Portuguesa', emoji: '📝', color: 'sky',
  tagline: 'Cai em 100% dos concursos — e muitas vezes desempata',
  why: 'Português tem peso alto em praticamente todo edital. Dominar interpretação e gramática de prova é a matéria que mais rende ponto por hora estudada.',
}, [
  { id: 'c-port-1', title: 'Interpretação e compreensão de texto', objectives: ['Diferenciar compreender e interpretar', 'Evitar extrapolação'], topics: ['compreensão x interpretação', 'ideia central', 'inferência', 'extrapolação, redução e contradição', 'tipologia e gêneros textuais'] },
  { id: 'c-port-2', title: 'Coesão, coerência e reescrita de frases', objectives: ['Identificar referentes e conectivos', 'Julgar reescritas'], topics: ['pronomes e referência', 'conectivos e valor semântico', 'reescrita mantendo sentido e correção', 'paralelismo'] },
  { id: 'c-port-3', title: 'Ortografia, acentuação e hífen', objectives: ['Aplicar as regras do Novo Acordo'], topics: ['regras de acentuação', 'acento diferencial', 'hífen', 'porque/por que/porquê/por quê', 'mal/mau, há/a'] },
  { id: 'c-port-4', title: 'Classes de palavras e morfologia', objectives: ['Reconhecer classes e funções'], topics: ['substantivo, adjetivo, advérbio', 'pronomes', 'verbos: tempos e modos', 'vozes verbais', 'conjunções'] },
  { id: 'c-port-5', title: 'Sintaxe: termos da oração e período composto', objectives: ['Analisar sintaticamente', 'Classificar orações'], topics: ['sujeito e predicado', 'objetos e complementos', 'adjunto x complemento', 'coordenadas e subordinadas', 'orações adjetivas restritivas x explicativas'] },
  { id: 'c-port-6', title: 'Concordância verbal e nominal', objectives: ['Acertar os casos que mais caem'], topics: ['sujeito posposto', 'verbo haver e fazer impessoais', 'partícula se', 'é proibido / é necessário', 'anexo, meio, bastante'] },
  { id: 'c-port-7', title: 'Regência e crase', objectives: ['Dominar a crase sem decoreba'], topics: ['regência verbal dos verbos clássicos', 'regência nominal', 'crase: regra geral e macete', 'crase proibida e facultativa', 'à moda de'] },
  { id: 'c-port-8', title: 'Pontuação', objectives: ['Usar e julgar vírgulas como a banca'], topics: ['vírgula proibida entre sujeito e verbo', 'vírgula em adjuntos deslocados', 'vírgula e oração adjetiva', 'ponto e vírgula, dois-pontos, travessão'] },
  { id: 'c-port-9', title: 'Colocação pronominal e semântica', objectives: ['Acertar próclise, mesóclise e ênclise', 'Sinônimos e polissemia'], topics: ['palavras atrativas', 'mesóclise', 'sinonímia e antonímia', 'polissemia', 'denotação x conotação'] },
  { id: 'c-port-10', title: 'Chefão: prova de Português', boss: true, objectives: ['Misturar interpretação e gramática como na prova'], topics: ['interpretação', 'concordância', 'crase', 'pontuação', 'reescrita'] },
]);

export const rlm = realm({
  id: 'c-rlm', title: 'Raciocínio Lógico e Matemática', emoji: '🧮', color: 'amber',
  tagline: 'A matéria que separa quem passa de quem quase passa',
  why: 'Muita gente foge de RLM — por isso quem domina ganha vantagem enorme. Como você é dev, lógica proposicional vai ser natural (é if/else com outro nome).',
}, [
  { id: 'c-rlm-1', title: 'Proposições e conectivos lógicos', objectives: ['Identificar proposições', 'Usar e, ou, se-então, se e somente se'], topics: ['proposição simples e composta', 'conectivos', 'tabela-verdade', 'tautologia, contradição, contingência'] },
  { id: 'c-rlm-2', title: 'Equivalências e negações', objectives: ['Negar proposições compostas', 'Aplicar equivalências'], topics: ['leis de De Morgan', 'negação do se-então', 'contrapositiva', 'todo/algum/nenhum e suas negações'] },
  { id: 'c-rlm-3', title: 'Argumentação e diagramas lógicos', objectives: ['Validar argumentos', 'Resolver com diagramas'], topics: ['argumento válido', 'silogismo', 'diagramas de Venn', 'quantificadores'] },
  { id: 'c-rlm-4', title: 'Porcentagem, razão e proporção', objectives: ['Resolver problemas de porcentagem rapidamente'], topics: ['porcentagem e fator multiplicativo', 'aumentos e descontos sucessivos', 'razão e proporção', 'regra de três simples e composta', 'divisão proporcional'] },
  { id: 'c-rlm-5', title: 'Juros e matemática financeira', objectives: ['Calcular juros simples e compostos'], topics: ['juros simples', 'juros compostos', 'taxas equivalentes', 'desconto'] },
  { id: 'c-rlm-6', title: 'Análise combinatória', objectives: ['Saber quando usar arranjo, combinação, permutação'], topics: ['princípio fundamental da contagem', 'permutação (com repetição)', 'arranjo', 'combinação'] },
  { id: 'c-rlm-7', title: 'Probabilidade', objectives: ['Calcular probabilidades de prova'], topics: ['probabilidade simples', 'eventos independentes', 'probabilidade condicional', 'união de eventos'] },
  { id: 'c-rlm-8', title: 'Sequências, conjuntos e problemas', objectives: ['Resolver problemas de lógica de prova'], topics: ['sequências lógicas', 'PA e PG', 'conjuntos e operações', 'problemas de verdade/mentira'] },
  { id: 'c-rlm-9', title: 'Chefão: prova de RLM', boss: true, objectives: ['Resolver questões mistas com tempo'], topics: ['negações', 'porcentagem', 'combinatória', 'probabilidade'] },
]);

export const informatica = realm({
  id: 'c-info', title: 'Informática', emoji: '💻', color: 'cyan',
  tagline: 'Sua vantagem injusta: você já é dev',
  why: 'Informática de concurso é bem mais simples do que o que você faz todo dia. É a matéria onde você pode gabaritar — só precisa aprender a "linguagem da banca".',
}, [
  { id: 'c-info-1', title: 'Hardware, software e sistemas operacionais', objectives: ['Conceitos de prova sobre hardware e SO'], topics: ['CPU, memórias RAM/ROM/cache', 'armazenamento', 'Windows: atalhos e gerenciamento de arquivos', 'Linux: comandos básicos e permissões'] },
  { id: 'c-info-2', title: 'Editores de texto e planilhas', objectives: ['Responder questões de Word/Writer e Excel/Calc'], topics: ['atalhos do Word', 'fórmulas do Excel (SOMA, SE, PROCV, CONT.SE)', 'referência relativa x absoluta ($)', 'erros #DIV/0!, #REF!'] },
  { id: 'c-info-3', title: 'Internet, navegadores e e-mail', objectives: ['Conceitos de internet cobrados'], topics: ['URL, DNS, HTTP/HTTPS', 'navegação anônima, cookies, cache', 'e-mail: CC, CCO, protocolos SMTP/POP/IMAP', 'busca avançada'] },
  { id: 'c-info-4', title: 'Redes de computadores', objectives: ['Conceitos de redes de prova'], topics: ['LAN/MAN/WAN', 'TCP/IP e modelo OSI', 'IP, roteador, switch', 'Wi-Fi e intranet/extranet'] },
  { id: 'c-info-5', title: 'Segurança da informação', objectives: ['Malwares, golpes e proteção'], topics: ['vírus, worm, trojan, ransomware, spyware', 'phishing e engenharia social', 'firewall, antivírus', 'criptografia, assinatura e certificado digital', 'backup (completo, incremental, diferencial)'] },
  { id: 'c-info-6', title: 'Nuvem, Big Data e conceitos modernos', objectives: ['Conceitos que caem nas provas novas (PF/PRF)'], topics: ['IaaS/PaaS/SaaS', 'Big Data (5 Vs)', 'IA e aprendizado de máquina', 'banco de dados e SQL básico', 'LGPD'] },
  { id: 'c-info-7', title: 'Chefão: prova de Informática', boss: true, objectives: ['Gabaritar informática'], topics: ['segurança', 'redes', 'planilhas', 'nuvem'] },
]);

export const constitucional = realm({
  id: 'c-const', title: 'Direito Constitucional', emoji: '📜', color: 'emerald',
  tagline: 'A base de todo o Direito — cai em quase todo edital',
  why: 'Constitucional aparece em concursos policiais, tribunais, legislativo e administrativos. Os artigos 5º, 37 e 144 sozinhos já valem muitos pontos.',
}, [
  { id: 'c-const-1', title: 'Princípios fundamentais (arts. 1º a 4º)', objectives: ['Fundamentos, objetivos e princípios das relações internacionais'], topics: ['fundamentos (SOCIDIVAPLU)', 'objetivos fundamentais', 'separação dos poderes', 'princípios das relações internacionais'] },
  { id: 'c-const-2', title: 'Direitos e garantias individuais (art. 5º)', objectives: ['Dominar os incisos que mais caem'], topics: ['vida, igualdade, liberdade', 'inviolabilidade do domicílio', 'sigilo de comunicações', 'direito de reunião', 'crimes inafiançáveis e imprescritíveis'] },
  { id: 'c-const-3', title: 'Remédios constitucionais', objectives: ['Saber quando cabe cada um'], topics: ['habeas corpus', 'mandado de segurança', 'mandado de injunção', 'habeas data', 'ação popular'] },
  { id: 'c-const-4', title: 'Direitos sociais, nacionalidade e direitos políticos', objectives: ['Regras de nacionalidade e elegibilidade'], topics: ['direitos sociais (art. 6º)', 'brasileiro nato x naturalizado', 'cargos privativos de nato', 'alistamento e elegibilidade', 'inelegibilidades'] },
  { id: 'c-const-5', title: 'Organização do Estado', objectives: ['Entes federativos e competências'], topics: ['União, Estados, DF e Municípios', 'competências privativas x comuns x concorrentes', 'intervenção', 'bens da União'] },
  { id: 'c-const-6', title: 'Administração Pública na CF (arts. 37 a 41)', objectives: ['Princípios e regras dos servidores'], topics: ['LIMPE', 'concurso público e validade', 'acumulação de cargos', 'teto remuneratório', 'estabilidade'] },
  { id: 'c-const-7', title: 'Poderes Legislativo, Executivo e Judiciário', objectives: ['Estrutura e atribuições'], topics: ['Congresso, Câmara, Senado', 'imunidades parlamentares', 'atribuições do Presidente', 'órgãos do Judiciário', 'funções essenciais à justiça'] },
  { id: 'c-const-8', title: 'Segurança pública (art. 144)', objectives: ['Dominar o artigo-chave das carreiras policiais'], topics: ['órgãos da segurança pública', 'PF, PRF, PFF, polícias civis e militares, polícias penais', 'atribuições de cada uma', 'guardas municipais', 'segurança viária'] },
  { id: 'c-const-9', title: 'Chefão: prova de Constitucional', boss: true, objectives: ['Questões mistas de CF'], topics: ['art. 5º', 'remédios', 'art. 37', 'art. 144'] },
]);

export const administrativo = realm({
  id: 'c-adm', title: 'Direito Administrativo', emoji: '🏛️', color: 'teal',
  tagline: 'Como funciona a máquina pública que você vai integrar',
  why: 'Cai em praticamente todo concurso. São conceitos lógicos e muito cobrados: princípios, atos, poderes e licitações.',
}, [
  { id: 'c-adm-1', title: 'Princípios da Administração Pública', objectives: ['Princípios expressos e implícitos'], topics: ['LIMPE', 'supremacia e indisponibilidade do interesse público', 'razoabilidade e proporcionalidade', 'autotutela', 'continuidade'] },
  { id: 'c-adm-2', title: 'Organização administrativa', objectives: ['Administração direta e indireta'], topics: ['centralização x descentralização', 'desconcentração', 'autarquias, fundações, empresas públicas, sociedades de economia mista', 'agências reguladoras', 'terceiro setor'] },
  { id: 'c-adm-3', title: 'Poderes administrativos', objectives: ['Distinguir os poderes e o abuso'], topics: ['vinculado x discricionário', 'hierárquico', 'disciplinar', 'regulamentar', 'poder de polícia', 'abuso: excesso e desvio de poder'] },
  { id: 'c-adm-4', title: 'Atos administrativos', objectives: ['Elementos, atributos e extinção'], topics: ['competência, finalidade, forma, motivo, objeto', 'presunção, imperatividade, autoexecutoriedade', 'anulação x revogação', 'convalidação'] },
  { id: 'c-adm-5', title: 'Agentes públicos e Lei 8.112/90', objectives: ['Regras dos servidores federais'], topics: ['cargo, emprego e função', 'provimento e vacância', 'direitos e vantagens', 'deveres e proibições', 'PAD e penalidades'] },
  { id: 'c-adm-6', title: 'Licitações e contratos (Lei 14.133/21)', objectives: ['Modalidades e regras principais'], topics: ['modalidades (pregão, concorrência, concurso, leilão, diálogo competitivo)', 'dispensa x inexigibilidade', 'fases', 'contratos administrativos'] },
  { id: 'c-adm-7', title: 'Responsabilidade civil do Estado', objectives: ['Teoria do risco e excludentes'], topics: ['responsabilidade objetiva', 'risco administrativo x integral', 'omissão', 'ação de regresso', 'excludentes'] },
  { id: 'c-adm-8', title: 'Improbidade e controle da Administração', objectives: ['Lei 8.429 (com a reforma de 2021) e controles'], topics: ['atos de improbidade', 'dolo exigido após a Lei 14.230', 'sanções', 'controle interno, externo e judicial', 'Tribunais de Contas'] },
  { id: 'c-adm-9', title: 'Chefão: prova de Administrativo', boss: true, objectives: ['Questões mistas'], topics: ['princípios', 'atos', 'poderes', 'licitações'] },
]);

export const penal = realm({
  id: 'c-penal', title: 'Direito Penal', emoji: '⚖️', color: 'red',
  tagline: 'Essencial para PRF, PF, Polícia Civil e Penal',
  why: 'Em concursos policiais Penal tem peso grande. A teoria do crime é a base para entender todo o resto.',
}, [
  { id: 'c-penal-1', title: 'Princípios e aplicação da lei penal', objectives: ['Princípios e lei no tempo/espaço'], topics: ['legalidade e anterioridade', 'insignificância', 'lei penal no tempo (retroatividade benéfica)', 'territorialidade e extraterritorialidade', 'tempo e lugar do crime'] },
  { id: 'c-penal-2', title: 'Teoria do crime: fato típico', objectives: ['Elementos do fato típico'], topics: ['conduta, resultado, nexo, tipicidade', 'dolo e culpa', 'crime consumado e tentado', 'desistência voluntária e arrependimento', 'crime impossível'] },
  { id: 'c-penal-3', title: 'Ilicitude e culpabilidade', objectives: ['Excludentes de ilicitude e culpabilidade'], topics: ['legítima defesa', 'estado de necessidade', 'estrito cumprimento do dever legal', 'imputabilidade', 'erro de tipo x erro de proibição'] },
  { id: 'c-penal-4', title: 'Concurso de pessoas e de crimes', objectives: ['Autoria, participação e concursos'], topics: ['autor, coautor, partícipe', 'concurso material, formal e crime continuado'] },
  { id: 'c-penal-5', title: 'Penas e extinção da punibilidade', objectives: ['Tipos de pena e prescrição'], topics: ['penas privativas, restritivas e multa', 'regimes', 'extinção da punibilidade', 'prescrição (noções)'] },
  { id: 'c-penal-6', title: 'Crimes contra a pessoa', objectives: ['Homicídio, lesão e outros'], topics: ['homicídio e qualificadoras', 'feminicídio', 'lesão corporal', 'crimes contra a honra', 'ameaça e sequestro'] },
  { id: 'c-penal-7', title: 'Crimes contra o patrimônio', objectives: ['Distinguir furto, roubo, extorsão, estelionato'], topics: ['furto e qualificadoras', 'roubo e latrocínio', 'extorsão', 'apropriação indébita', 'estelionato e fraude eletrônica', 'receptação'] },
  { id: 'c-penal-8', title: 'Crimes contra a Administração Pública', objectives: ['Crimes funcionais'], topics: ['peculato', 'concussão x corrupção passiva', 'prevaricação', 'corrupção ativa', 'desacato, resistência, desobediência'] },
  { id: 'c-penal-9', title: 'Chefão: prova de Penal', boss: true, objectives: ['Casos práticos de prova'], topics: ['teoria do crime', 'patrimônio', 'adm. pública'] },
]);

export const processoPenal = realm({
  id: 'c-procpen', title: 'Processo Penal', emoji: '🔎', color: 'orange',
  tagline: 'O dia a dia do policial: inquérito, flagrante, provas',
  why: 'Para Polícia Civil e Federal é obrigatório. Inquérito e prisões caem sempre.',
}, [
  { id: 'c-pp-1', title: 'Princípios e inquérito policial', objectives: ['Características do inquérito'], topics: ['princípios do processo penal', 'características do IP', 'instauração', 'prazos', 'arquivamento', 'notitia criminis'] },
  { id: 'c-pp-2', title: 'Ação penal', objectives: ['Tipos de ação penal'], topics: ['pública incondicionada e condicionada', 'privada', 'representação', 'acordo de não persecução penal'] },
  { id: 'c-pp-3', title: 'Prisões e liberdade provisória', objectives: ['Flagrante, preventiva e temporária'], topics: ['espécies de flagrante', 'audiência de custódia', 'prisão preventiva', 'prisão temporária', 'fiança e medidas cautelares'] },
  { id: 'c-pp-4', title: 'Provas', objectives: ['Regras de prova'], topics: ['provas ilícitas', 'cadeia de custódia', 'exame de corpo de delito', 'busca e apreensão', 'interrogatório e testemunhas'] },
  { id: 'c-pp-5', title: 'Competência, procedimentos e recursos (noções)', objectives: ['Noções gerais'], topics: ['competência', 'procedimento comum', 'Tribunal do Júri', 'recursos principais'] },
  { id: 'c-pp-6', title: 'Chefão: prova de Processo Penal', boss: true, objectives: ['Questões mistas'], topics: ['inquérito', 'prisões', 'provas'] },
]);

export const legislacaoEspecial = realm({
  id: 'c-legesp', title: 'Legislação Penal Especial', emoji: '📕', color: 'rose',
  tagline: 'As leis que todo policial precisa conhecer',
  why: 'Leis extravagantes são cobradas na letra da lei. Drogas, armas e abuso de autoridade caem em quase toda prova policial.',
}, [
  { id: 'c-le-1', title: 'Lei de Drogas (11.343/06)', objectives: ['Uso x tráfico e penas'], topics: ['porte para uso (art. 28)', 'tráfico (art. 33)', 'tráfico privilegiado', 'associação', 'causas de aumento'] },
  { id: 'c-le-2', title: 'Estatuto do Desarmamento (10.826/03)', objectives: ['Posse x porte'], topics: ['posse irregular', 'porte ilegal (uso permitido e restrito)', 'disparo de arma', 'comércio ilegal e tráfico internacional'] },
  { id: 'c-le-3', title: 'Abuso de Autoridade (13.869/19)', objectives: ['Elemento subjetivo e crimes'], topics: ['sujeito ativo', 'dolo específico', 'crimes mais cobrados', 'efeitos da condenação'] },
  { id: 'c-le-4', title: 'Crimes hediondos e tortura', objectives: ['Leis 8.072 e 9.455'], topics: ['rol de hediondos', 'consequências', 'tortura: modalidades', 'tortura por omissão'] },
  { id: 'c-le-5', title: 'Maria da Penha e ECA (pontos de prova)', objectives: ['Medidas protetivas e ato infracional'], topics: ['violência doméstica: formas', 'medidas protetivas', 'descumprimento de medida', 'ECA: ato infracional e medidas'] },
  { id: 'c-le-6', title: 'Organizações criminosas e lavagem de dinheiro', objectives: ['Leis 12.850 e 9.613'], topics: ['conceito de orcrim', 'colaboração premiada', 'infiltração e ação controlada', 'lavagem: fases'] },
  { id: 'c-le-7', title: 'Chefão: legislação especial', boss: true, objectives: ['Questões mistas'], topics: ['drogas', 'armas', 'abuso de autoridade'] },
]);

export const transito = realm({
  id: 'c-transito', title: 'Legislação de Trânsito (PRF)', emoji: '🚓', color: 'yellow',
  tagline: 'A matéria de maior peso da PRF',
  why: 'Na PRF, o CTB é a matéria mais importante da prova. É letra de lei pura: quem estuda certo, gabarita.',
}, [
  { id: 'c-tr-1', title: 'CTB: disposições gerais e Sistema Nacional de Trânsito', objectives: ['Estrutura do SNT'], topics: ['competências dos órgãos', 'CONTRAN, CETRAN, DETRAN, PRF', 'conceitos do Anexo I'] },
  { id: 'c-tr-2', title: 'Normas gerais de circulação e conduta', objectives: ['Regras de circulação'], topics: ['preferências', 'ultrapassagem', 'velocidades máximas', 'uso de faróis', 'pedestres e ciclistas'] },
  { id: 'c-tr-3', title: 'Veículos, registro, licenciamento e habilitação', objectives: ['Regras de documentação'], topics: ['registro e licenciamento', 'categorias de habilitação', 'permissão para dirigir', 'exames e renovação'] },
  { id: 'c-tr-4', title: 'Infrações e penalidades', objectives: ['Gravidade, pontos e multas'], topics: ['natureza das infrações e pontuação', 'suspensão e cassação', 'infrações mais cobradas (álcool, celular, velocidade)', 'multiplicadores'] },
  { id: 'c-tr-5', title: 'Medidas administrativas e processo administrativo', objectives: ['Medidas e defesa'], topics: ['retenção, remoção, recolhimento', 'teste de alcoolemia e recusa', 'autuação e notificação', 'recursos JARI'] },
  { id: 'c-tr-6', title: 'Crimes de trânsito', objectives: ['Crimes do CTB'], topics: ['homicídio e lesão culposa na direção', 'embriaguez ao volante (art. 306)', 'racha', 'omissão de socorro', 'fuga do local'] },
  { id: 'c-tr-7', title: 'Resoluções do CONTRAN mais cobradas', objectives: ['Resoluções-chave'], topics: ['equipamentos obrigatórios', 'transporte de cargas e escolares', 'dispositivos de segurança para crianças', 'sinalização'] },
  { id: 'c-tr-8', title: 'Chefão: prova de Trânsito', boss: true, objectives: ['Questões no estilo PRF'], topics: ['infrações', 'medidas', 'crimes', 'circulação'] },
]);

export const policiais = realm({
  id: 'c-policial', title: 'Específicas Policiais (PRF/PF)', emoji: '🛡️', color: 'indigo',
  tagline: 'Direitos humanos, ética, física e estatística',
  why: 'Matérias que só aparecem nas provas policiais e que pouca gente estuda direito — terreno para ganhar pontos que os outros perdem.',
}, [
  { id: 'c-pol-1', title: 'Direitos Humanos: conceito, gerações e tratados', objectives: ['Base teórica e tratados'], topics: ['características dos DH', 'dimensões/gerações', 'DUDH', 'Pacto de São José da Costa Rica', 'incorporação de tratados (§3º art. 5º)'] },
  { id: 'c-pol-2', title: 'Ética no serviço público', objectives: ['Código de ética e conduta'], topics: ['Decreto 1.171/94', 'deveres e vedações', 'conflito de interesses', 'ética x moral'] },
  { id: 'c-pol-3', title: 'Física para a PRF: cinemática', objectives: ['Resolver questões de movimento'], topics: ['MRU e MRUV', 'velocidade média', 'Torricelli', 'tempo de reação e frenagem'] },
  { id: 'c-pol-4', title: 'Física para a PRF: dinâmica e energia', objectives: ['Leis de Newton aplicadas a acidentes'], topics: ['leis de Newton', 'atrito', 'energia cinética', 'quantidade de movimento e colisões'] },
  { id: 'c-pol-5', title: 'Estatística básica (PF)', objectives: ['Estatística descritiva de prova'], topics: ['média, moda, mediana', 'variância e desvio padrão', 'distribuições', 'correlação e regressão (noções)'] },
  { id: 'c-pol-6', title: 'Chefão: específicas policiais', boss: true, objectives: ['Questões mistas'], topics: ['direitos humanos', 'ética', 'física'] },
]);

export const legislativo = realm({
  id: 'c-legis', title: 'Poder Legislativo & Redação Oficial', emoji: '🏢', color: 'lime',
  tagline: 'Para assistente/técnico legislativo de câmaras e assembleias',
  why: 'Concursos de câmaras municipais e assembleias pagam bem e cobram processo legislativo, regimento interno e redação oficial.',
}, [
  { id: 'c-leg-1', title: 'Processo legislativo (arts. 59 a 69 da CF)', objectives: ['Espécies normativas e tramitação'], topics: ['emendas, leis complementares e ordinárias', 'medidas provisórias', 'iniciativa', 'sanção e veto', 'quórum'] },
  { id: 'c-leg-2', title: 'Funcionamento do Legislativo', objectives: ['Comissões, CPIs e imunidades'], topics: ['sessões e legislatura', 'comissões permanentes e temporárias', 'CPI', 'imunidades e incompatibilidades'] },
  { id: 'c-leg-3', title: 'Regimento interno: como estudar', objectives: ['Estudar o regimento da casa do edital'], topics: ['estrutura de um regimento', 'mesa diretora', 'quóruns', 'proposições', 'como ler regimento de forma eficiente'] },
  { id: 'c-leg-4', title: 'Redação oficial', objectives: ['Manual de Redação da Presidência'], topics: ['atributos da redação oficial', 'pronomes de tratamento', 'padrão ofício', 'fechos', 'e-mail oficial'] },
  { id: 'c-leg-5', title: 'Lei Orgânica e Administração municipal', objectives: ['Noções de lei orgânica'], topics: ['lei orgânica municipal', 'competências do município', 'Câmara e Prefeitura', 'LRF (noções)'] },
  { id: 'c-leg-6', title: 'Chefão: prova legislativa', boss: true, objectives: ['Questões mistas'], topics: ['processo legislativo', 'redação oficial'] },
]);

export const bancario = realm({
  id: 'c-banc', title: 'Conhecimentos Bancários (BB/Caixa)', emoji: '🏦', color: 'blue',
  tagline: 'Nível médio, salário acima de R$ 3 mil e benefícios',
  why: 'Banco do Brasil e Caixa são das melhores portas de entrada de nível médio. As matérias específicas são poucas e muito previsíveis.',
}, [
  { id: 'c-banc-1', title: 'Sistema Financeiro Nacional', objectives: ['Estrutura do SFN'], topics: ['CMN, BACEN, CVM', 'instituições financeiras', 'COPOM e Selic', 'política monetária'] },
  { id: 'c-banc-2', title: 'Produtos e serviços bancários', objectives: ['Produtos mais cobrados'], topics: ['contas, CDB, poupança', 'cartões e crédito', 'consórcio, capitalização, previdência', 'garantias', 'PIX e Open Finance'] },
  { id: 'c-banc-3', title: 'Mercado de capitais e câmbio', objectives: ['Noções de mercado'], topics: ['ações e B3', 'fundos', 'tesouro direto', 'câmbio'] },
  { id: 'c-banc-4', title: 'Prevenção à lavagem de dinheiro e compliance', objectives: ['PLD e regras de conduta'], topics: ['Lei 9.613', 'COAF', 'KYC', 'LGPD no banco', 'Código de Defesa do Consumidor bancário'] },
  { id: 'c-banc-5', title: 'Vendas e negociação', objectives: ['Matéria de vendas do BB/Caixa'], topics: ['técnicas de vendas', 'marketing de relacionamento', 'satisfação do cliente', 'ética em vendas'] },
  { id: 'c-banc-6', title: 'Matemática financeira bancária', objectives: ['Cálculos de prova'], topics: ['juros compostos', 'sistemas de amortização (SAC, Price)', 'taxa nominal x efetiva', 'valor presente e futuro'] },
  { id: 'c-banc-7', title: 'Chefão: prova bancária', boss: true, objectives: ['Questões mistas estilo Cesgranrio'], topics: ['SFN', 'produtos', 'matemática financeira'] },
]);

export const previdenciario = realm({
  id: 'c-prev', title: 'Direito Previdenciário (INSS)', emoji: '👵', color: 'pink',
  tagline: 'Matéria-chave do concurso do INSS',
  why: 'O INSS é um dos concursos de nível médio mais procurados do país, e Previdenciário é o coração da prova.',
}, [
  { id: 'c-prev-1', title: 'Seguridade Social na Constituição', objectives: ['Saúde, previdência e assistência'], topics: ['tripé da seguridade', 'princípios da seguridade', 'financiamento'] },
  { id: 'c-prev-2', title: 'Segurados e dependentes do RGPS', objectives: ['Tipos de segurado'], topics: ['segurados obrigatórios', 'segurado facultativo', 'dependentes e classes', 'qualidade de segurado e período de graça'] },
  { id: 'c-prev-3', title: 'Benefícios previdenciários', objectives: ['Requisitos dos principais benefícios'], topics: ['aposentadorias após a EC 103/19', 'auxílio por incapacidade', 'salário-maternidade', 'pensão por morte', 'carência'] },
  { id: 'c-prev-4', title: 'Custeio e assistência social (LOAS)', objectives: ['Contribuições e BPC'], topics: ['salário de contribuição', 'contribuições do segurado e empresa', 'BPC/LOAS'] },
  { id: 'c-prev-5', title: 'Chefão: Previdenciário', boss: true, objectives: ['Questões mistas estilo INSS'], topics: ['segurados', 'benefícios', 'custeio'] },
]);

export const redacao = realm({
  id: 'c-redacao', title: 'Redação e Discursiva', emoji: '✍️', color: 'fuchsia',
  tagline: 'Corrigida pela IA com critérios de banca',
  why: 'PRF, PF, tribunais e muitos concursos têm discursiva eliminatória. Muita gente boa reprova aqui por falta de treino.',
}, [
  { id: 'c-red-1', title: 'Estrutura do texto dissertativo-argumentativo', objectives: ['Montar introdução, desenvolvimento e conclusão'], topics: ['tese', 'tópico frasal', 'argumentos e repertório', 'conclusão sem fugir do tema'] },
  { id: 'c-red-2', title: 'Como a banca corrige', objectives: ['Conhecer critérios de correção'], topics: ['aspectos macroestruturais (conteúdo)', 'aspectos microestruturais (gramática)', 'fuga ao tema', 'contagem de linhas e erros'] },
  { id: 'c-red-3', title: 'Repertório para temas de segurança pública e sociedade', objectives: ['Ter argumentos prontos'], topics: ['violência e segurança pública', 'tecnologia e crimes digitais', 'trânsito e mortes', 'corrupção e ética', 'dados e leis para citar'] },
  { id: 'c-red-4', title: 'Treino de discursiva', boss: true, objectives: ['Escrever uma discursiva completa'], topics: ['planejamento em 5 minutos', 'escrita', 'revisão'] },
]);

export const concursoRealms: Realm[] = withLevels([
  estrategia, portugues, rlm, informatica, constitucional, administrativo,
  penal, processoPenal, legislacaoEspecial, transito, policiais,
  legislativo, bancario, previdenciario, redacao, ...novasMaterias,
], concursoLevels);
