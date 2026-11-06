import type { Realm, Lesson } from '../types.js';
import { level } from '../levels.js';

// Trilha de FINANÇAS & INVESTIMENTOS — separada das outras. Ids começam com "f-".
// Cada aula se apoia nas ideias de livros clássicos (campo books) e no contexto brasileiro.
// Conteúdo educativo: não é recomendação de investimento.

function realm(r: Omit<Realm, 'lessons' | 'track'>, lessons: Lesson[]): Realm {
  return { ...r, track: 'financas', lessons };
}

export const financasRealms: Realm[] = [
  realm({ id: 'f-mente', title: 'Mentalidade Financeira', emoji: '🧠', color: 'violet', tagline: 'Comece aqui: dinheiro é mais comportamento do que matemática', why: 'Quem enriquece não é quem sabe mais fórmulas, é quem tem os hábitos certos por muito tempo. Esta é a base de tudo.' }, [
    ...level('f-mente', 'f-mente', 1, [
      ['Dinheiro é comportamento', 'ninguém é louco; sorte e risco; o suficiente; riqueza invisível', 'A Psicologia Financeira — Morgan Housel'],
      ['Ativos x passivos: a lição do Pai Rico', 'ativo põe dinheiro no bolso; passivo tira; fluxo de caixa; corrida dos ratos', 'Pai Rico, Pai Pobre — Robert Kiyosaki'],
      ['Pague-se primeiro: as leis do ouro', 'guardar 10% primeiro; controlar gastos; fazer o dinheiro trabalhar; proteger o patrimônio', 'O Homem Mais Rico da Babilônia — George S. Clason'],
      ['Juros compostos: a oitava maravilha', 'tempo x taxa; regra dos 72; começar cedo; efeito bola de neve'],
      ['Seu dinheiro ou sua vida: dinheiro como energia vital', 'custo em horas de vida; gastos alinhados a valores; suficiente', 'Your Money or Your Life — Vicki Robin'],
    ]),
    ...level('f-mente', 'f-mente', 2, [
      ['A riqueza que você não vê', 'gastar para parecer rico; frugalidade; o milionário mora ao lado', 'O Milionário Mora ao Lado — Thomas Stanley'],
      ['Quadrante do fluxo de caixa', 'empregado; autônomo; dono de negócio; investidor', 'Quadrante do Fluxo de Caixa — Robert Kiyosaki'],
      ['Riqueza x renda: liberdade como objetivo', 'controle do tempo; margem de segurança; independência', 'A Psicologia Financeira — Morgan Housel'],
      ['Hábitos financeiros que se acumulam', 'pequenas melhorias; automação; identidade', 'Hábitos Atômicos — James Clear'],
    ]),
    ...level('f-mente', 'f-mente', 3, [
      ['Construindo sua filosofia de investimento', 'princípios pessoais; horizonte; tolerância a risco; escrever sua política de investimentos'],
      ['Dinheiro, felicidade e propósito', 'esteira hedônica; experiências; generosidade; quando parar de acumular', 'Die With Zero — Bill Perkins'],
      ['Dinheiro na família e no casal', 'conversas sobre dinheiro; contas conjuntas; educação financeira dos filhos'],
    ]),
  ]),

  realm({ id: 'f-orcamento', title: 'Orçamento, Dívidas e Reserva', emoji: '💰', color: 'emerald', tagline: 'Arrumar a casa antes de investir', why: 'Investir com dívida cara é encher balde furado. Orçamento, saída das dívidas e reserva de emergência são o alicerce.' }, [
    ...level('f-orcamento', 'f-orc', 1, [
      ['Diagnóstico financeiro: para onde vai seu dinheiro', 'anotar gastos; gastos fixos e variáveis; patrimônio líquido pessoal'],
      ['Métodos de orçamento: 50/30/20, envelopes e base zero', '50/30/20; envelopes; orçamento base zero; escolher o seu'],
      ['Saindo das dívidas: bola de neve x avalanche', 'método bola de neve; método avalanche; negociação; juros do cartão e cheque especial', 'A Transformação Total do Seu Dinheiro — Dave Ramsey'],
      ['Reserva de emergência', 'quanto guardar; onde guardar (Tesouro Selic, CDB de liquidez diária, caixinhas como a do Nubank); liquidez diária; quando usar'],
      ['Cartão de crédito e crédito inteligente', 'rotativo; parcelamento; score; quando crédito faz sentido'],
    ]),
    ...level('f-orcamento', 'f-orc', 2, [
      ['Automatizar as finanças', 'transferências automáticas; contas separadas; pague-se primeiro automático', 'Eu Te Ensino a Ficar Rico — Ramit Sethi'],
      ['Gastar sem culpa no que importa', 'gastos conscientes; cortar o que não importa; plano de gastos', 'Eu Te Ensino a Ficar Rico — Ramit Sethi'],
      ['Grandes decisões: casa, carro e financiamentos', 'comprar x alugar; custo total do carro; SAC x Price; consórcio'],
    ]),
    ...level('f-orcamento', 'f-orc', 3, [
      ['Planejamento financeiro de longo prazo', 'metas de curto, médio e longo prazo; fluxo de caixa projetado'],
      ['Finanças para quem tem renda variável', 'autônomo; freelancer; colchão maior; pró-labore pessoal'],
    ]),
  ]),

  realm({ id: 'f-macro', title: 'Economia para Investidores', emoji: '🌐', color: 'sky', tagline: 'Juros, inflação, câmbio e ciclos', why: 'Entender Selic, inflação e ciclos econômicos explica por que seus investimentos sobem e caem.' }, [
    ...level('f-macro', 'f-macro', 1, [
      ['Inflação: o imposto invisível', 'IPCA; IGP-M; poder de compra; juro real'],
      ['Selic, CDI e política monetária', 'Copom; Banco Central; CDI; como juros afetam investimentos'],
      ['Câmbio e dólar', 'o que move o câmbio; reservas; impacto na sua vida'],
      ['PIB, emprego e o ciclo econômico', 'expansão; recessão; indicadores antecedentes'],
    ]),
    ...level('f-macro', 'f-macro', 2, [
      ['Como a máquina econômica funciona', 'produtividade; ciclo de dívida curto e longo; desalavancagem', 'Como a Máquina Econômica Funciona — Ray Dalio'],
      ['Política fiscal e risco país', 'dívida pública; déficit; curva de juros; risco fiscal'],
      ['Ciclos de mercado e bolhas', 'euforia e pânico; bolhas históricas; ciclos de crédito', 'Dominando o Ciclo de Mercado — Howard Marks'],
    ]),
    ...level('f-macro', 'f-macro', 3, [
      ['Crises financeiras históricas', '1929; 2008; crises brasileiras; lições para o investidor', 'Princípios para Navegar Grandes Crises de Dívida — Ray Dalio'],
      ['Curva de juros e expectativas de mercado', 'Boletim Focus; curva DI; inclinação; o que o mercado precifica'],
    ]),
  ]),

  realm({ id: 'f-rendafixa', title: 'Renda Fixa no Brasil', emoji: '🏦', color: 'teal', tagline: 'Tesouro, CDB, LCI, LCA, debêntures', why: 'No Brasil, a renda fixa paga bem e é a base de qualquer carteira. Saber escolher é ganhar mais com menos risco.' }, [
    ...level('f-rendafixa', 'f-rf', 1, [
      ['O que é renda fixa: pré, pós e híbrido', 'prefixado; pós-fixado (CDI/Selic); IPCA+; quando cada um vale'],
      ['Tesouro Direto na prática', 'Tesouro Selic; Prefixado; IPCA+; Renda+; Educa+; taxas'],
      ['CDB, LCI e LCA', 'emissão bancária; isenção de IR; liquidez; percentual do CDI'],
      ['FGC: a proteção dos seus investimentos', 'limite por CPF e instituição; o que cobre; o que não cobre'],
      ['Comparando investimentos: rentabilidade líquida', 'IR regressivo; taxa equivalente; isento x tributado'],
      ['Caixinhas e contas que rendem (Nubank e bancos digitais)', 'o que é a Caixinha do Nubank (RDB); % do CDI e rendimento diário em dia útil; IR regressivo por depósito e IOF antes de 30 dias; FGC e risco do banco; caixinha x poupança x Tesouro Selic x CDB de liquidez diária; usar caixinhas por objetivo (reserva, viagem, metas); como conferir o rendimento no app'],
    ]),
    ...level('f-rendafixa', 'f-rf', 2, [
      ['Marcação a mercado', 'preço x taxa; por que título público "cai"; vender antes do vencimento'],
      ['Debêntures, CRI e CRA', 'crédito privado; incentivadas; rating; risco de crédito'],
      ['Fundos de renda fixa e fundos DI', 'taxa de administração; come-cotas; quando faz sentido'],
    ]),
    ...level('f-rendafixa', 'f-rf', 3, [
      ['Duration e risco de taxa', 'duration; convexidade (noção); sensibilidade a juros'],
      ['Montando uma carteira de renda fixa', 'escada de vencimentos; liquidez; diversificação por indexador'],
    ]),
  ]),

  realm({ id: 'f-acoes', title: 'Ações: Fundamentos', emoji: '📈', color: 'amber', tagline: 'Ser sócio de empresas, com a cabeça de Graham e Buffett', why: 'No longo prazo, ações são das classes que mais geram riqueza. Os clássicos ensinam a não fazer besteira.' }, [
    ...level('f-acoes', 'f-acoes', 1, [
      ['O que é uma ação e como funciona a bolsa', 'B3; corretora; ON e PN; home broker; liquidação'],
      ['Investidor x especulador', 'investimento é análise; segurança do principal; retorno adequado', 'O Investidor Inteligente — Benjamin Graham'],
      ['Sr. Mercado e margem de segurança', 'Sr. Mercado; preço x valor; margem de segurança', 'O Investidor Inteligente — Benjamin Graham'],
      ['Dividendos e proventos', 'dividendos; JCP; dividend yield; data com'],
      ['Riscos das ações e diversificação', 'risco específico x sistemático; volatilidade; horizonte'],
    ]),
    ...level('f-acoes', 'f-acoes', 2, [
      ['Investindo no que você conhece', 'categorias de empresas; dez baggers; investir no dia a dia', 'O Jeito Peter Lynch de Investir — Peter Lynch'],
      ['Empresas de crescimento: o método Fisher', '15 pontos; scuttlebutt; gestão; longo prazo', 'Ações Comuns, Lucros Extraordinários — Philip Fisher'],
      ['As lições das cartas de Buffett', 'círculo de competência; vantagem competitiva; longo prazo', 'Os Ensaios de Warren Buffett — Lawrence Cunningham'],
      ['Vantagem competitiva (moat)', 'marca; custo de troca; efeito rede; escala; custo baixo', 'O Pequeno Livro que Constrói Fortunas — Pat Dorsey'],
    ]),
    ...level('f-acoes', 'f-acoes', 3, [
      ['Investimento em valor moderno', 'qualidade a preço justo; armadilha de valor; Munger', 'Poor Charlie\'s Almanack — Charlie Munger'],
      ['Small caps, turnarounds e situações especiais', 'empresas pequenas; recuperação; spin-offs', 'Você Pode Ser um Gênio da Bolsa — Joel Greenblatt'],
      ['Montando e acompanhando sua carteira de ações', 'quantidade de empresas; peso; acompanhar resultados; quando vender'],
    ]),
  ]),

  realm({ id: 'f-valuation', title: 'Análise Fundamentalista e Valuation', emoji: '🔬', color: 'orange', tagline: 'Ler balanços e estimar quanto vale uma empresa', why: 'É a habilidade que separa quem segue dica de quem decide sozinho com base em números.' }, [
    ...level('f-valuation', 'f-val', 1, [
      ['Lendo o balanço patrimonial', 'ativos; passivos; patrimônio líquido; dívida líquida'],
      ['DRE: receita, margens e lucro', 'receita líquida; margem bruta, EBITDA e líquida'],
      ['Fluxo de caixa: o que a empresa realmente gera', 'fluxo operacional; capex; fluxo de caixa livre'],
      ['Indicadores essenciais', 'P/L; P/VP; ROE; ROIC; dívida/EBITDA; dividend yield'],
    ]),
    ...level('f-valuation', 'f-val', 2, [
      ['Valuation por múltiplos', 'comparação entre empresas; EV/EBITDA; armadilhas dos múltiplos', 'Valuation — Aswath Damodaran'],
      ['Fluxo de caixa descontado (DCF)', 'projeção; taxa de desconto; WACC; valor terminal', 'Valuation — Aswath Damodaran'],
      ['A fórmula mágica e investimento quantitativo', 'ROIC alto + preço baixo; regras; disciplina', 'O Mais Simples Livro sobre Investimentos — Joel Greenblatt'],
      ['Analisando setores: bancos, elétricas, varejo', 'indicadores específicos de cada setor; regulação'],
    ]),
    ...level('f-valuation', 'f-val', 3, [
      ['Narrativa e números', 'contar a história da empresa; transformar em premissas', 'Narrativa e Números — Aswath Damodaran'],
      ['Contabilidade criativa e sinais de alerta', 'qualidade do lucro; receita agressiva; partes relacionadas'],
      ['Seu relatório de análise de uma empresa real', 'tese de investimento; riscos; preço-alvo; revisão'],
    ]),
  ]),

  realm({ id: 'f-fii', title: 'Fundos Imobiliários', emoji: '🏢', color: 'lime', tagline: 'Renda mensal com imóveis via bolsa', why: 'FIIs são uma forma popular no Brasil de gerar renda mensal, com vantagens e riscos próprios.' }, [
    ...level('f-fii', 'f-fii', 1, [
      ['O que são FIIs e como funcionam', 'cotas; gestora; rendimentos mensais; isenção para pessoa física (regras)'],
      ['Tipos de FII: tijolo, papel, FOF e híbridos', 'lajes; logística; shoppings; recebíveis; fundos de fundos'],
      ['Indicadores de FII', 'dividend yield; P/VP; vacância; inadimplência; liquidez'],
    ]),
    ...level('f-fii', 'f-fii', 2, [
      ['Analisando um FII de tijolo', 'qualidade dos imóveis; contratos; localização; inquilinos'],
      ['Analisando um FII de papel', 'CRIs; indexadores; garantias; risco de crédito'],
      ['FII x imóvel físico', 'liquidez; custos; diversificação; alavancagem'],
    ]),
    ...level('f-fii', 'f-fii', 3, [
      ['Montando uma carteira de FIIs para renda', 'diversificação por segmento; reinvestimento; metas de renda'],
      ['Ciclo imobiliário e juros', 'impacto da Selic; ciclos do setor; oportunidades'],
    ]),
  ]),

  realm({ id: 'f-passivo', title: 'Índices, ETFs e Investimento Passivo', emoji: '🧺', color: 'cyan', tagline: 'Comprar o mercado inteiro com custo baixo', why: 'A maioria dos gestores não bate o índice no longo prazo. Investir passivo é simples, barato e funciona.' }, [
    ...level('f-passivo', 'f-pas', 1, [
      ['Por que é difícil bater o mercado', 'custos; gestores x índice; mercado eficiente', 'Um Passeio Aleatório por Wall Street — Burton Malkiel'],
      ['O bom senso do investimento em índices', 'possuir o mercado; custos baixos; longo prazo', 'O Pequeno Livro do Investimento de Bom Senso — John Bogle'],
      ['ETFs no Brasil: BOVA11, IVVB11 e outros', 'como funcionam; taxas; tributação; replicação'],
    ]),
    ...level('f-passivo', 'f-pas', 2, [
      ['Fundos de investimento: como escolher', 'taxa de administração e performance; gestor; histórico; lâmina'],
      ['Investimento passivo x ativo: o debate', 'evidências; quando ativo faz sentido; custos'],
      ['Carteira de três fundos (Boglehead)', 'ações nacionais; internacionais; renda fixa; simplicidade'],
    ]),
    ...level('f-passivo', 'f-pas', 3, [
      ['Fatores: valor, tamanho, momentum e qualidade', 'investimento em fatores; smart beta; evidências'],
      ['Aportes regulares e preço médio', 'dollar-cost averaging; disciplina; não tentar acertar o fundo'],
    ]),
  ]),

  realm({ id: 'f-global', title: 'Investindo no Exterior', emoji: '🗽', color: 'indigo', tagline: 'Dolarizar e diversificar além do Brasil', why: 'O Brasil é menos de 1% do mercado mundial. Diversificar internacionalmente reduz risco.' }, [
    ...level('f-global', 'f-glob', 1, [
      ['Por que investir fora do Brasil', 'risco país; diversificação cambial; mercado global'],
      ['BDRs e ETFs internacionais na B3', 'BDRs; IVVB11; vantagens e limitações'],
      ['Abrindo conta no exterior', 'corretoras internacionais; envio de dinheiro; custos de câmbio'],
    ]),
    ...level('f-global', 'f-glob', 2, [
      ['ETFs americanos e mercados globais', 'VT; VOO; mercados desenvolvidos e emergentes'],
      ['Tributação de investimentos no exterior', 'regras atuais; declaração; ganho de capital; dividendos'],
      ['Renda fixa internacional e dólar', 'treasuries; títulos em dólar; proteção cambial'],
    ]),
    ...level('f-global', 'f-glob', 3, [
      ['Planejamento sucessório internacional', 'riscos de herança no exterior; estruturas comuns'],
      ['Montando sua alocação global', 'peso Brasil x exterior; rebalanceamento; câmbio'],
    ]),
  ]),

  realm({ id: 'f-carteira', title: 'Alocação e Gestão de Carteira', emoji: '⚖️', color: 'fuchsia', tagline: 'A decisão que mais define seu resultado', why: 'Estudos mostram que a alocação entre classes de ativos explica a maior parte do resultado de uma carteira.' }, [
    ...level('f-carteira', 'f-cart', 1, [
      ['Risco e retorno', 'volatilidade; drawdown; perfil de investidor; horizonte'],
      ['Diversificação de verdade', 'correlação; classes de ativos; não colocar ovos na mesma cesta'],
      ['Rebalanceamento', 'vender o que subiu; comprar o que caiu; periodicidade'],
    ]),
    ...level('f-carteira', 'f-cart', 2, [
      ['Teoria moderna de portfólio', 'Markowitz; fronteira eficiente; Sharpe'],
      ['All Weather: carteira para todas as estações', 'paridade de risco; cenários econômicos', 'Dinheiro: Domine Esse Jogo — Tony Robbins'],
      ['Modelo de Yale e grandes investidores', 'alocação de fundos patrimoniais; diversificação ampla', 'Pioneering Portfolio Management — David Swensen'],
    ]),
    ...level('f-carteira', 'f-cart', 3, [
      ['Escrevendo sua política de investimentos (IPS)', 'objetivos; restrições; alocação-alvo; regras de rebalanceamento'],
      ['Gestão de risco e cauda gorda', 'eventos raros; antifragilidade; seguro de carteira', 'A Lógica do Cisne Negro — Nassim Taleb'],
    ]),
  ]),

  realm({ id: 'f-comport', title: 'Finanças Comportamentais', emoji: '🎭', color: 'rose', tagline: 'O maior inimigo do investidor é ele mesmo', why: 'Vieses fazem pessoas comprarem caro e venderem barato. Conhecê-los protege seu patrimônio.' }, [
    ...level('f-comport', 'f-comp', 1, [
      ['Sistema 1 e Sistema 2', 'pensamento rápido x lento; heurísticas', 'Rápido e Devagar — Daniel Kahneman'],
      ['Aversão à perda e efeito disposição', 'perdas doem mais; vender ganhadores cedo; segurar perdedores'],
      ['Excesso de confiança e efeito manada', 'overconfidence; FOMO; bolhas'],
    ]),
    ...level('f-comport', 'f-comp', 2, [
      ['Contabilidade mental e ancoragem', 'dinheiro "da sorte"; ancoragem no preço de compra', 'Misbehaving — Richard Thaler'],
      ['Nudges: desenhando bons comportamentos', 'arquitetura de escolha; padrões automáticos', 'Nudge — Richard Thaler e Cass Sunstein'],
      ['Psicologia do trader', 'disciplina; pensar em probabilidades; consistência', 'Trading in the Zone — Mark Douglas'],
    ]),
    ...level('f-comport', 'f-comp', 3, [
      ['Seu diário de decisões de investimento', 'registrar tese; revisar decisões; aprender com erros'],
      ['Pensar em probabilidades', 'decisão x resultado; apostas; calibração', 'Pensar em Apostas — Annie Duke'],
    ]),
  ]),

  realm({ id: 'f-ir', title: 'Impostos e Declaração', emoji: '🧾', color: 'yellow', tagline: 'Pagar o imposto certo, nem mais nem menos', why: 'Imposto mal calculado vira multa, e imposto mal planejado come seu retorno.' }, [
    ...level('f-ir', 'f-ir', 1, [
      ['IR sobre investimentos: visão geral', 'tabela regressiva; isenções; come-cotas; DARF'],
      ['IR em ações e ETFs', 'isenção de vendas até o limite mensal (ações); day trade; compensação de prejuízo'],
      ['Declarando investimentos no IRPF', 'bens e direitos; rendimentos isentos e tributáveis; informes'],
    ]),
    ...level('f-ir', 'f-ir', 2, [
      ['Planejamento tributário legal para pessoa física', 'escolha de produtos; PGBL e dedução; prazos'],
      ['Tributação de cripto, FIIs e exterior', 'regras específicas; declaração; mudanças recentes (conferir legislação atual)'],
    ]),
  ]),

  realm({ id: 'f-aposentar', title: 'Aposentadoria e Independência Financeira', emoji: '🏝️', color: 'emerald', tagline: 'Quanto você precisa para viver de renda', why: 'Independência financeira é o objetivo final: trabalhar porque quer, não porque precisa.' }, [
    ...level('f-aposentar', 'f-apos', 1, [
      ['Quanto preciso para viver de renda', 'regra dos 4%; taxa de retirada segura; ajuste para o Brasil'],
      ['INSS: o que esperar da previdência pública', 'regras gerais; teto; complementar com investimentos'],
      ['PGBL x VGBL', 'diferenças; tabela progressiva x regressiva; taxas'],
    ]),
    ...level('f-aposentar', 'f-apos', 2, [
      ['Movimento FIRE', 'taxa de poupança; lean, fat e barista FIRE', 'Your Money or Your Life — Vicki Robin'],
      ['Fase de acumulação x fase de usufruto', 'risco de sequência de retornos; colchão de liquidez'],
      ['Planejamento de aposentadoria passo a passo', 'meta; prazo; aporte necessário; revisão anual'],
    ]),
    ...level('f-aposentar', 'f-apos', 3, [
      ['Estratégias de retirada', 'balde de liquidez; retirada dinâmica; proteção contra inflação'],
      ['Sucessão e herança', 'inventário; testamento; previdência na sucessão'],
    ]),
  ]),

  realm({ id: 'f-cripto', title: 'Criptoativos', emoji: '₿', color: 'orange', tagline: 'Bitcoin, blockchain e riscos reais', why: 'Você já tem um bot de trading de cripto. Entender a fundo o ativo e os riscos protege seu dinheiro.' }, [
    ...level('f-cripto', 'f-cri', 1, [
      ['Blockchain e Bitcoin: como funcionam', 'blockchain; mineração; escassez; halving', 'O Padrão Bitcoin — Saifedean Ammous'],
      ['Ethereum, stablecoins e altcoins', 'contratos inteligentes; stablecoins; riscos de altcoins'],
      ['Custódia e segurança', 'carteiras quentes e frias; seed phrase; golpes comuns'],
    ]),
    ...level('f-cripto', 'f-cri', 2, [
      ['Cripto na carteira: quanto alocar', 'volatilidade; tamanho da posição; ETFs de cripto'],
      ['Regulação e tributação de cripto no Brasil', 'exchanges; declaração; regras atuais (conferir legislação)'],
      ['DeFi e seus riscos', 'protocolos; liquidez; riscos de contrato; perdas'],
    ]),
  ]),

  realm({ id: 'f-trading', title: 'Trading, Análise Técnica e Gestão de Risco', emoji: '📉', color: 'red', tagline: 'Com realismo: a maioria dos traders perde dinheiro', why: 'Seu trading bot já faz isso. Aqui você aprende a base com honestidade: gestão de risco, backtest e expectativa matemática.' }, [
    ...level('f-trading', 'f-trd', 1, [
      ['Trading x investimento: a dura realidade', 'estatísticas de traders; custos; jogo de soma zero'],
      ['Análise técnica: gráficos e tendências', 'candles; suporte e resistência; tendências; volume'],
      ['Indicadores técnicos', 'médias móveis; RSI; MACD; bandas de Bollinger; limitações'],
    ]),
    ...level('f-trading', 'f-trd', 2, [
      ['Gestão de risco e tamanho de posição', 'risco por operação; stop loss; relação risco/retorno', 'Trade Your Way to Financial Freedom — Van K. Tharp'],
      ['Expectativa matemática e backtest', 'taxa de acerto x payoff; overfitting; amostra; custos e taxas'],
      ['Trading automatizado', 'regras objetivas; robôs; monitoramento; riscos operacionais'],
    ]),
    ...level('f-trading', 'f-trd', 3, [
      ['Avaliando uma estratégia com dados', 'drawdown máximo; Sharpe; walk-forward; paper trading'],
      ['Mentalidade e disciplina do trader', 'seguir o plano; lidar com perdas; diário de trades', 'Trading in the Zone — Mark Douglas'],
    ]),
  ]),

  realm({ id: 'f-renda', title: 'Aumentar a Renda', emoji: '🚀', color: 'blue', tagline: 'Investir bem ajuda; ganhar mais ajuda muito mais', why: 'No começo, aumentar a renda move muito mais o ponteiro do que a rentabilidade. Use suas habilidades de dev.' }, [
    ...level('f-renda', 'f-ren', 1, [
      ['Carreira: negociar salário e crescer', 'pesquisa de mercado; negociação; promoções'],
      ['Freelancer como dev', 'precificação; plataformas; contratos; clientes recorrentes'],
      ['Renda extra com o que você sabe', 'produtos digitais; ensino; serviços'],
    ]),
    ...level('f-renda', 'f-ren', 2, [
      ['Microempreendedorismo e MEI', 'MEI; limites; notas; quando virar empresa'],
      ['Criando um negócio com pouco dinheiro', 'validação; cliente pagante; lucro rápido', 'A Startup de $100 — Chris Guillebeau'],
      ['SaaS e produtos digitais recorrentes', 'receita recorrente; churn; precificação'],
    ]),
    ...level('f-renda', 'f-ren', 3, [
      ['Escalando: de autônomo a dono de negócio', 'sistemas; delegação; processos', 'O Mito do Empreendedor — Michael Gerber'],
      ['Alavancagem: código, mídia, capital e pessoas', 'formas de alavancagem; ativos que trabalham por você', 'O Almanaque de Naval Ravikant — Eric Jorgenson'],
    ]),
  ]),

  realm({ id: 'f-protecao', title: 'Proteção Patrimonial e Golpes', emoji: '🛡️', color: 'slate', tagline: 'Não perder o que você construiu', why: 'Um golpe ou um imprevisto sem proteção pode apagar anos de economia.' }, [
    ...level('f-protecao', 'f-prot', 1, [
      ['Golpes financeiros mais comuns', 'pirâmides; promessas de retorno garantido; golpe do PIX; falsos investimentos'],
      ['Como identificar um investimento furado', 'retorno alto demais; falta de registro na CVM; pressão para decidir'],
      ['Seguros que fazem sentido', 'seguro de vida; saúde; residencial; quando não contratar'],
    ]),
    ...level('f-protecao', 'f-prot', 2, [
      ['Segurança digital das suas finanças', 'autenticação; senhas; aplicativos de banco; dispositivos'],
      ['Planejamento sucessório básico', 'testamento; seguro de vida na sucessão; organização de documentos'],
    ]),
  ]),
];
