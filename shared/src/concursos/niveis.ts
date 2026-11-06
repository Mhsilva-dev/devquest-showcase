import type { Lesson, Realm } from '../types.js';
import { level } from '../levels.js';

// Níveis 2 (Avançado) e 3 (Expert) das matérias de concurso + matérias novas.

export const concursoLevels: Record<string, Lesson[]> = {
  'c-estrategia': [
    ...level('c-estrategia', 'c-est', 2, [
      ['Estatística da prova: onde estão os pontos', 'incidência de assuntos; Pareto 80/20; provas anteriores; ranking de tópicos por matéria'],
      ['Técnicas de leitura de lei seca', 'leitura dirigida; grifo em cores; prazos e números; quadros comparativos'],
      ['Resumos e mapas que você realmente revisa', 'resumo por questões; mapa mental; fichas; quando parar de resumir'],
      ['Estudo na reta final: últimos 30 dias', 'revisão por questões; simulados semanais; descanso; o que não estudar'],
      ['Concorrência e nota de corte', 'como estimar a nota de corte; cadastro reserva; cotas; recursos contra gabarito'],
    ]),
    ...level('c-estrategia', 'c-est', 3, [
      ['Estudar para vários concursos ao mesmo tempo', 'matriz comum; adaptar o ciclo ao edital aberto; priorizar editais'],
      ['Análise profunda de erros e plano de correção', 'tipo de erro (conteúdo, atenção, interpretação); planilha de erros; ação corretiva'],
      ['Como recorrer de questões', 'prazo de recurso; fundamentação; doutrina e jurisprudência; modelo de recurso'],
      ['Da posse à carreira: estágio probatório e progressão', 'posse e exercício; estágio probatório; progressão; remoção; próximo concurso'],
    ]),
  ],
  'c-port': [
    ...level('c-port', 'c-port', 2, [
      ['Interpretação avançada estilo FGV e Cebraspe', 'pressuposto e subentendido; ironia; modalizadores; tese x argumento'],
      ['Reescrita de frases: a questão mais difícil', 'troca de conectivo; mudança de voz; deslocamento de termos; manutenção de sentido'],
      ['Funções do "que" e do "se"', 'pronome relativo; conjunção integrante; partícula apassivadora; índice de indeterminação'],
      ['Vozes verbais e transposição', 'voz ativa, passiva analítica e sintética; transposição de tempos verbais'],
      ['Figuras de linguagem e funções da linguagem', 'metáfora; metonímia; ironia; funções de Jakobson'],
    ]),
    ...level('c-port', 'c-port', 3, [
      ['Questões nível hard: concordância e regência combinadas', 'casos especiais; verbos de regência dupla; sujeito oracional'],
      ['Pontuação avançada e efeitos de sentido', 'vírgula que muda sentido; aposto x vocativo; pontuação e restrição'],
      ['Correção gramatical de textos inteiros', 'identificar múltiplos erros; revisão em prova discursiva'],
      ['Gêneros textuais e tipologia avançada', 'gêneros oficiais e jornalísticos; sequências textuais; intertextualidade'],
    ]),
  ],
  'c-rlm': [
    ...level('c-rlm', 'c-rlm', 2, [
      ['Lógica de argumentação avançada', 'regras de inferência; modus ponens e tollens; falácias; argumentos inválidos'],
      ['Lógica de primeira ordem e quantificadores', 'quantificadores universal e existencial; negação; diagramas complexos'],
      ['Combinatória avançada', 'permutação circular; combinação com repetição; princípio da inclusão-exclusão'],
      ['Probabilidade avançada', 'probabilidade condicional; teorema de Bayes; distribuição binomial'],
      ['Matemática básica que derruba candidatos', 'frações; potências; equações do 1º e 2º grau; sistemas; MMC e MDC'],
    ]),
    ...level('c-rlm', 'c-rlm', 3, [
      ['Questões Cebraspe de lógica: padrões e atalhos', 'itens certo/errado de lógica; contrapositiva; tabela-verdade rápida'],
      ['Geometria e medidas para concurso', 'áreas; volumes; teorema de Pitágoras; semelhança; escalas'],
      ['Matrizes, determinantes e sistemas', 'operações com matrizes; determinantes; sistemas lineares'],
      ['Estratégias de tempo para RLM na prova', 'quando pular; questões de cálculo longo; estimativa e eliminação'],
    ]),
  ],
  'c-info': [
    ...level('c-info', 'c-info', 2, [
      ['Linux para concursos', 'comandos de arquivos; permissões chmod; usuários; estrutura de diretórios'],
      ['Planilhas avançadas', 'PROCV e PROCX; SE aninhado; SOMASES; tabela dinâmica; formatação condicional'],
      ['Redes avançado: protocolos e portas', 'TCP x UDP; portas comuns; DHCP; NAT; VPN; proxy'],
      ['Segurança avançada: ataques e defesas', 'DoS; força bruta; criptografia simétrica x assimétrica; hash; autenticação multifator'],
      ['Banco de dados para concurso', 'modelo relacional; SQL básico; chaves; normalização; data warehouse'],
    ]),
    ...level('c-info', 'c-info', 3, [
      ['Informática para PF e PRF: tópicos pesados', 'Big Data; mineração de dados; machine learning; Python básico; computação em nuvem'],
      ['Governança de TI e LGPD aprofundada', 'ITIL e COBIT (noções); LGPD: bases legais, ANPD, direitos do titular'],
      ['Questões Cebraspe de informática: pegadinhas', 'generalizações; termos técnicos trocados; itens de segurança'],
      ['Sistemas operacionais e arquitetura', 'processos e threads; memória virtual; sistemas de arquivos; virtualização'],
    ]),
  ],
  'c-const': [
    ...level('c-const', 'c-const', 2, [
      ['Controle de constitucionalidade', 'controle difuso x concentrado; ADI; ADC; ADPF; efeitos da decisão'],
      ['Teoria da Constituição e poder constituinte', 'classificação das constituições; poder originário e derivado; cláusulas pétreas'],
      ['Ordem social: saúde, educação e meio ambiente', 'SUS; educação; meio ambiente; família; povos indígenas'],
      ['Defesa do Estado: estado de defesa e de sítio', 'estado de defesa; estado de sítio; Forças Armadas'],
      ['Tributação e orçamento na CF (noções)', 'princípios tributários; espécies tributárias; leis orçamentárias'],
    ]),
    ...level('c-const', 'c-const', 3, [
      ['Jurisprudência do STF mais cobrada', 'súmulas vinculantes; temas de repercussão geral; direitos fundamentais na jurisprudência'],
      ['Processo legislativo avançado', 'medidas provisórias; emendas; leis delegadas; trancamento de pauta'],
      ['Poder Judiciário e funções essenciais a fundo', 'CNJ; quinto constitucional; Ministério Público; Defensoria; Advocacia Pública'],
      ['Questões discursivas de Constitucional', 'estrutura de resposta jurídica; fundamentação; citação de artigos'],
    ]),
  ],
  'c-adm': [
    ...level('c-adm', 'c-adm', 2, [
      ['Serviços públicos: concessão e permissão', 'conceito; princípios; concessão; permissão; PPPs'],
      ['Processo administrativo federal (Lei 9.784/99)', 'princípios; prazos; recursos; decadência; delegação e avocação'],
      ['Bens públicos e intervenção na propriedade', 'classificação; desapropriação; servidão; requisição; tombamento'],
      ['Lei de Acesso à Informação e transparência', 'LAI; classificação de sigilo; prazos; transparência ativa'],
      ['Controle e Lei Anticorrupção (12.846/13)', 'responsabilidade de empresas; acordo de leniência; CGU'],
    ]),
    ...level('c-adm', 'c-adm', 3, [
      ['Licitações avançado: casos práticos', 'critérios de julgamento; sanções; contratação direta; registro de preços'],
      ['Agentes públicos: regime disciplinar aprofundado', 'PAD; sindicância; prescrição; penalidades; reintegração'],
      ['Jurisprudência de Direito Administrativo', 'súmulas do STF e STJ mais cobradas; nepotismo; responsabilidade do Estado'],
      ['Questões discursivas de Administrativo', 'estrutura de resposta; casos práticos; fundamentação legal'],
    ]),
  ],
  'c-penal': [
    ...level('c-penal', 'c-penal', 2, [
      ['Crimes contra a dignidade sexual (visão de prova)', 'tipos penais; ação penal; vulnerabilidade; causas de aumento'],
      ['Crimes contra a fé pública', 'falsificação de documento; falsidade ideológica; uso de documento falso'],
      ['Crimes contra a paz pública e incolumidade', 'associação criminosa; incêndio; crimes de perigo comum'],
      ['Teoria da pena aprofundada', 'dosimetria trifásica; agravantes e atenuantes; regimes; substituição'],
      ['Erro, tentativa e consumação: casos difíceis', 'erro sobre a pessoa; aberratio ictus; crime tentado x consumado'],
    ]),
    ...level('c-penal', 'c-penal', 3, [
      ['Jurisprudência penal do STF e STJ', 'súmulas mais cobradas; insignificância; crimes patrimoniais'],
      ['Concurso de crimes: casos de prova', 'concurso material, formal e crime continuado em casos complexos'],
      ['Extinção da punibilidade e prescrição a fundo', 'prescrição da pretensão punitiva e executória; marcos interruptivos'],
      ['Discursivas de Direito Penal', 'análise de caso; tipificação; fundamentação'],
    ]),
  ],
  'c-procpen': [
    ...level('c-procpen', 'c-pp', 2, [
      ['Nulidades processuais', 'nulidade absoluta x relativa; prejuízo; preclusão'],
      ['Medidas cautelares diversas da prisão', 'monitoramento eletrônico; recolhimento domiciliar; fiança'],
      ['Interceptação telefônica e meios de obtenção de prova', 'Lei 9.296; requisitos; prazo; captação ambiental'],
      ['Juizados Especiais Criminais (Lei 9.099)', 'menor potencial ofensivo; transação penal; suspensão condicional do processo'],
    ]),
    ...level('c-procpen', 'c-pp', 3, [
      ['Jurisprudência de Processo Penal', 'súmulas mais cobradas; prisão; provas ilícitas'],
      ['Execução penal (Lei 7.210) para policiais penais', 'regimes; progressão; faltas disciplinares; direitos do preso'],
      ['Casos práticos de inquérito e flagrante', 'lavratura do auto; prazos; comunicações obrigatórias'],
    ]),
  ],
  'c-legesp': [
    ...level('c-legesp', 'c-le', 2, [
      ['Crimes ambientais (Lei 9.605/98)', 'responsabilidade da pessoa jurídica; crimes contra a fauna e flora'],
      ['Crimes contra o consumidor e a ordem tributária', 'CDC penal; Lei 8.137; crimes tributários'],
      ['Estatuto da Pessoa Idosa e da Pessoa com Deficiência', 'crimes previstos; medidas de proteção'],
      ['Racismo e injúria racial', 'Lei 7.716; equiparação de injúria racial; imprescritibilidade'],
      ['Interceptação, identificação criminal e prisão temporária', 'Lei 12.037; Lei 7.960; hipóteses'],
    ]),
    ...level('c-legesp', 'c-le', 3, [
      ['Jurisprudência das leis especiais', 'drogas; armas; Maria da Penha nos tribunais superiores'],
      ['Leis especiais em questões Cebraspe', 'pegadinhas típicas; prazos; números de artigos'],
      ['Crimes cibernéticos', 'Lei 12.737; invasão de dispositivo; fraude eletrônica; Marco Civil'],
    ]),
  ],
  'c-transito': [
    ...level('c-transito', 'c-tr', 2, [
      ['Infrações de trânsito: tabela completa', 'infrações gravíssimas; graves; médias; leves; agravamentos'],
      ['Transporte de cargas, produtos perigosos e passageiros', 'resoluções aplicáveis; excesso de peso; documentação'],
      ['Fiscalização: abordagem e documentos', 'documentos obrigatórios; CRLV digital; equipamentos; vistoria'],
      ['Engenharia de tráfego e sinalização', 'sinalização vertical e horizontal; dispositivos auxiliares; semáforos'],
    ]),
    ...level('c-transito', 'c-tr', 3, [
      ['Questões PRF de trânsito: as mais difíceis', 'itens complexos; combinação de artigos; resoluções'],
      ['Jurisprudência e mudanças recentes no CTB', 'alterações legislativas recentes; entendimento dos tribunais'],
      ['Física aplicada a acidentes de trânsito', 'frenagem; velocidade estimada; energia; colisões'],
    ]),
  ],
  'c-policial': [
    ...level('c-policial', 'c-pol', 2, [
      ['Direitos humanos no sistema ONU e interamericano', 'Conselho de Direitos Humanos; Corte Interamericana; casos contra o Brasil'],
      ['Uso da força e direitos humanos na atividade policial', 'princípios de uso da força; legalidade; necessidade; proporcionalidade'],
      ['Física para PRF: trabalho, potência e hidrostática', 'trabalho; potência; pressão; empuxo'],
      ['Estatística inferencial (PF)', 'amostragem; intervalo de confiança; teste de hipótese'],
    ]),
    ...level('c-policial', 'c-pol', 3, [
      ['Questões de direitos humanos estilo Cebraspe', 'tratados; incorporação; jurisprudência'],
      ['Estatística avançada para PF', 'regressão; correlação; probabilidade aplicada'],
      ['Geopolítica e realidade brasileira', 'fronteiras; segurança pública; temas atuais'],
    ]),
  ],
  'c-legis': [
    ...level('c-legis', 'c-leg', 2, [
      ['Técnica legislativa (LC 95/98)', 'estrutura de uma lei; articulação; alteração de leis; cláusula de vigência'],
      ['Orçamento público no Legislativo', 'PPA; LDO; LOA; emendas parlamentares'],
      ['Fiscalização e controle pelo Legislativo', 'Tribunal de Contas; julgamento de contas; pedidos de informação'],
    ]),
    ...level('c-legis', 'c-leg', 3, [
      ['Regimentos de Câmara e Senado: pontos comuns', 'tramitação; urgência; votação; pedido de vista'],
      ['Redação oficial avançada: atos normativos', 'decretos; portarias; exposição de motivos'],
      ['Questões de prova legislativa', 'FGV, Vunesp e Quadrix em casas legislativas'],
    ]),
  ],
  'c-banc': [
    ...level('c-banc', 'c-banc', 2, [
      ['Mercado de crédito e garantias', 'crédito pessoal e consignado; alienação fiduciária; aval e fiança'],
      ['Seguros, previdência e capitalização', 'SUSEP; PGBL e VGBL; tabela progressiva e regressiva'],
      ['Atendimento e qualidade (vendas avançado)', 'jornada do cliente; CRM; indicadores de satisfação; ética'],
    ]),
    ...level('c-banc', 'c-banc', 3, [
      ['Questões Cesgranrio de conhecimentos bancários', 'pegadinhas; atualidades do mercado financeiro'],
      ['Matemática financeira avançada', 'fluxo de caixa; TIR; VPL; equivalência de capitais'],
      ['Atualidades do mercado financeiro', 'Drex; Open Finance; criptoativos; regulação recente'],
    ]),
  ],
  'c-prev': [
    ...level('c-prev', 'c-prev', 2, [
      ['Regras de transição da Reforma da Previdência', 'pedágio; pontos; idade progressiva; aposentadoria especial'],
      ['Cálculo de benefícios', 'salário de benefício; RMI; fator previdenciário; coeficientes'],
      ['Acumulação de benefícios e revisão', 'regras de acumulação; decadência e prescrição; revisões'],
    ]),
    ...level('c-prev', 'c-prev', 3, [
      ['Jurisprudência previdenciária', 'TNU; STJ; temas mais cobrados'],
      ['Questões Cebraspe do INSS', 'itens mais difíceis; pegadinhas recorrentes'],
      ['Regimes próprios (RPPS) e complementar', 'servidores públicos; Funpresp; previdência complementar'],
    ]),
  ],
  'c-redacao': [
    ...level('c-redacao', 'c-red', 2, [
      ['Discursiva jurídica: responder perguntas de caso', 'estrutura em tópicos; fundamentação legal; objetividade'],
      ['Coesão e progressão textual na discursiva', 'conectivos; parágrafos; evitar repetição'],
      ['Temas prováveis e roteiros prontos', 'segurança pública; tecnologia; meio ambiente; administração pública'],
    ]),
    ...level('c-redacao', 'c-red', 3, [
      ['Simulado de discursiva no padrão Cebraspe', 'tempo; número de linhas; critérios de nota'],
      ['Peças técnicas: relatório e parecer', 'estrutura de relatório; parecer; ofício'],
      ['Revisão final: erros que mais tiram ponto', 'erros gramaticais frequentes; fuga ao tema; letra legível'],
    ]),
  ],
};

// ---------- Matérias novas ----------

function newRealm(r: Omit<Realm, 'lessons' | 'track'>, lessons: Lesson[]): Realm {
  return { ...r, track: 'concurso', lessons };
}

export const novasMaterias: Realm[] = [
  newRealm({ id: 'c-atual', title: 'Atualidades e Conhecimentos Gerais', emoji: '🌎', color: 'sky', tagline: 'Política, economia, sociedade e tecnologia', why: 'Cai em polícias, bancos e prefeituras. Quem acompanha os temas certos ganha pontos fáceis.' }, [
    ...level('c-atual', 'c-atual', 1, [
      ['Como estudar atualidades sem se perder', 'fontes confiáveis; recorte de tempo; temas recorrentes'],
      ['Economia brasileira e mundial', 'inflação; juros; desemprego; comércio exterior'],
      ['Política nacional e internacional', 'instituições; eleições; organismos internacionais'],
      ['Meio ambiente, energia e clima', 'acordos climáticos; matriz energética; desmatamento'],
      ['Ciência, tecnologia e sociedade', 'inteligência artificial; redes sociais; saúde pública'],
    ]),
    ...level('c-atual', 'c-atual', 2, [
      ['Segurança pública e violência no Brasil', 'indicadores; políticas públicas; crime organizado'],
      ['Geografia do Brasil para concursos', 'regiões; população; urbanização; recursos naturais'],
      ['História do Brasil essencial', 'colônia; império; república; redemocratização'],
    ]),
  ]),
  newRealm({ id: 'c-admgeral', title: 'Administração Geral e Pública', emoji: '📊', color: 'teal', tagline: 'Gestão, planejamento e governança', why: 'Cai em tribunais, agências e cargos administrativos. Matéria lógica e com muitas questões repetidas.' }, [
    ...level('c-admgeral', 'c-admg', 1, [
      ['Teorias da administração', 'clássica; científica; burocrática; relações humanas; sistêmica'],
      ['Planejamento, organização, direção e controle', 'PODC; planejamento estratégico; SWOT; BSC'],
      ['Gestão de pessoas', 'recrutamento; avaliação de desempenho; motivação; liderança'],
      ['Gestão de processos e qualidade', 'mapeamento de processos; PDCA; 5S; ferramentas da qualidade'],
    ]),
    ...level('c-admgeral', 'c-admg', 2, [
      ['Administração pública: modelos', 'patrimonialista; burocrático; gerencial; nova gestão pública'],
      ['Governança e gestão de riscos no setor público', 'governança; compliance; gestão de riscos; controle interno'],
      ['Gestão de projetos', 'ciclo de vida; PMBOK (noções); métodos ágeis'],
    ]),
  ]),
  newRealm({ id: 'c-arquivo', title: 'Arquivologia', emoji: '🗂️', color: 'amber', tagline: 'Matéria pequena que cai em muitos editais', why: 'Pouca gente estuda, poucas aulas resolvem e cai em PF, tribunais e órgãos administrativos.' }, [
    ...level('c-arquivo', 'c-arq', 1, [
      ['Conceitos fundamentais de arquivologia', 'arquivo; documento; princípios arquivísticos'],
      ['Gestão de documentos e ciclo de vida', 'teoria das três idades; protocolo; tabela de temporalidade'],
      ['Classificação e arquivamento', 'métodos de arquivamento; classificação; avaliação'],
      ['Preservação e documentos digitais', 'conservação; microfilmagem; documento digital; legislação'],
    ]),
  ]),
  newRealm({ id: 'c-contab', title: 'Contabilidade Geral', emoji: '🧾', color: 'lime', tagline: 'Para PF, Receita e cargos de controle', why: 'Contabilidade abre portas em concursos de controle e fiscais, e cai na PF.' }, [
    ...level('c-contab', 'c-cont', 1, [
      ['Patrimônio e equação fundamental', 'ativo; passivo; patrimônio líquido; situações patrimoniais'],
      ['Contas, débito e crédito', 'plano de contas; partidas dobradas; lançamentos'],
      ['Balanço Patrimonial', 'estrutura; grupos de contas; circulante e não circulante'],
      ['Demonstração do Resultado (DRE)', 'receitas; custos; despesas; lucro'],
    ]),
    ...level('c-contab', 'c-cont', 2, [
      ['Operações com mercadorias', 'inventário; CMV; PEPS; custo médio'],
      ['Depreciação, amortização e provisões', 'métodos; vida útil; provisões'],
      ['Análise das demonstrações contábeis', 'índices de liquidez; endividamento; rentabilidade'],
    ]),
  ]),
  newRealm({ id: 'c-ingles', title: 'Inglês para Concursos', emoji: '🇺🇸', color: 'indigo', tagline: 'Interpretação de texto em inglês', why: 'Cai em PF, EsSA, Receita e outros. Foco em leitura, não em conversação.' }, [
    ...level('c-ingles', 'c-ing', 1, [
      ['Estratégias de leitura: skimming e scanning', 'ideia geral; busca de informação; palavras cognatas'],
      ['Falsos cognatos e vocabulário de prova', 'falsos cognatos; vocabulário frequente'],
      ['Gramática essencial para leitura', 'tempos verbais; modais; pronomes; conectivos'],
      ['Interpretação de textos de prova', 'questões de compreensão; inferência; referência'],
    ]),
  ]),
  newRealm({ id: 'c-civil', title: 'Direito Civil (noções)', emoji: '📘', color: 'emerald', tagline: 'Para tribunais e cargos jurídicos', why: 'Cai em técnico judiciário e em muitos cargos de nível superior.' }, [
    ...level('c-civil', 'c-civ', 1, [
      ['LINDB', 'vigência; aplicação; conflito de leis'],
      ['Pessoas naturais e jurídicas', 'personalidade; capacidade; domicílio; pessoas jurídicas'],
      ['Bens e fatos jurídicos', 'classificação dos bens; negócio jurídico; defeitos'],
      ['Prescrição e decadência', 'prazos; interrupção; suspensão'],
    ]),
    ...level('c-civil', 'c-civ', 2, [
      ['Obrigações e contratos', 'modalidades das obrigações; contratos em espécie'],
      ['Responsabilidade civil', 'ato ilícito; dano; nexo; responsabilidade objetiva'],
    ]),
  ]),
];
