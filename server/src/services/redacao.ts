// Redação e discursiva de concurso: a IA cria a proposta no estilo da banca e corrige pelos critérios dela.
import type { RedacaoBanca, RedacaoTipo, RedacaoTema, RedacaoCorrecao } from '@devquest/shared';
import { findCareer } from '@devquest/shared';
import { askJSON } from './ai.js';

const SYSTEM = `Você é examinador de redações e provas discursivas de concursos públicos brasileiros (Cebraspe, FGV, FCC, Vunesp, Cesgranrio) e do ENEM.
Conhece os espelhos de correção de cada banca, é rigoroso como a banca real (não infla notas) e didático no feedback. Português do Brasil. Responde em JSON.`;

const CRITERIOS: Record<RedacaoBanca, string> = {
  cebraspe: `Cebraspe. Nota de conteúdo (NC) de 0 a 10, dividida em: "Apresentação e estrutura textual" (0–2, legibilidade/margens/paragrafação) e "Desenvolvimento do tema" (0–8, repartido igualmente entre os aspectos/quesitos da proposta).
Erros (NE) contados em: grafia/acentuação, morfossintaxe, propriedade vocabular. Nota final NPD = NC − 2 × NE ÷ TL (TL = número de linhas efetivamente escritas). Texto abaixo do mínimo de linhas ou fuga ao tema = nota 0.
Em "criterios" devolva: Apresentação e estrutura (max 2), cada aspecto do tema (max = 8 ÷ nº de aspectos), e um item "Erros (NE)" com nota = quantidade de erros e max 0. notaBanca no formato "NPD 6,85 de 10 (NC 7,5 · NE 5 · TL 28)".`,
  fgv: `FGV. Critérios: "Conteúdo" (adequação ao tema, abordagem dos aspectos pedidos, argumentação) max 60; "Estrutura" (organização, coesão, coerência, paragrafação) max 20; "Expressão / norma culta" (gramática, vocabulário) max 20. notaBanca: "XX de 100".`,
  fcc: `FCC. Critérios: "Conteúdo" (perspectiva crítica, argumentação, adequação ao tema) max 40; "Estrutura" (gênero, coesão, coerência, progressão) max 30; "Expressão" (norma padrão, clareza, vocabulário) max 30. notaBanca: "XX de 100".`,
  vunesp: `Vunesp. Critérios: "Tema e gênero" (adequação à proposta e ao tipo dissertativo) max 30; "Estrutura e argumentação" (coerência, progressão, coesão) max 40; "Expressão" (norma culta, pontuação, vocabulário) max 30. notaBanca: "XX de 100".`,
  cesgranrio: `Cesgranrio. Critérios: "Conteúdo e adequação ao tema" max 40; "Estrutura e organização" max 30; "Expressão e norma culta" max 30. notaBanca: "XX de 100".`,
  enem: `ENEM. 5 competências de 0 a 200 cada (múltiplos de 40): C1 norma culta; C2 compreensão da proposta e repertório; C3 seleção e organização de argumentos; C4 coesão; C5 proposta de intervenção (agente, ação, modo, finalidade, detalhamento) com respeito aos direitos humanos. notaBanca: "XXX de 1000".`,
};

const TIPOS: Record<RedacaoTipo, string> = {
  dissertativa: 'redação dissertativo-argumentativa sobre tema de atualidades (segurança pública, tecnologia, sociedade, administração pública)',
  discursiva: 'questão discursiva técnica de uma matéria do edital (ex.: Direito Administrativo, Constitucional, Penal, Informática), com aspectos objetivos a abordar',
  'estudo-caso': 'estudo de caso: situação concreta do dia a dia do cargo em que o candidato deve analisar e propor solução fundamentada',
};

export async function generateTema(banca: RedacaoBanca, tipo: RedacaoTipo, assunto?: string, careerId?: string): Promise<RedacaoTema> {
  const career = careerId ? findCareer(careerId) : undefined;
  const prompt = `Crie uma proposta INÉDITA de ${TIPOS[tipo]}, no estilo exato da banca ${banca.toUpperCase()}.
${career ? `Cargo-alvo: ${career.name} (${career.orgao}). A proposta deve ter cara de prova desse cargo.` : ''}
${assunto ? `Assunto pedido pelo aluno: ${assunto}` : 'Escolha um assunto com alta chance de cair em 2026–2027.'}

Responda em JSON:
{"tema":"título curto","comando":"o comando da prova, como a banca escreve (ex.: 'Considerando que o texto acima tem caráter unicamente motivador, redija um texto dissertativo acerca de... Ao elaborar seu texto, aborde os seguintes aspectos:')","textosMotivadores":["1 a 3 textos curtos de apoio (dados, trechos de lei ou notícia plausível; não invente estatística precisa como se fosse oficial)"],"aspectos":["2 a 4 aspectos/quesitos obrigatórios"],"linhas":{"min":${banca === 'enem' ? 7 : 20},"max":30}}`;
  const t = await askJSON<RedacaoTema>(prompt, { system: SYSTEM, temperature: 0.9, timeoutMs: 60000 });
  if (!t?.tema || !t?.comando) throw new Error('A IA gerou uma proposta inválida. Tente de novo.');
  return {
    tema: String(t.tema), comando: String(t.comando),
    textosMotivadores: (t.textosMotivadores ?? []).map(String).slice(0, 3),
    aspectos: (t.aspectos ?? []).map(String).slice(0, 5),
    linhas: { min: Number(t.linhas?.min) || 20, max: Number(t.linhas?.max) || 30 },
  };
}

/** Linhas estimadas como numa folha de prova (~70 caracteres por linha, cada parágrafo começa linha nova). */
export function estimateLines(texto: string): number {
  return texto.split(/\n+/).map((p) => p.trim()).filter(Boolean).reduce((n, p) => n + Math.max(1, Math.ceil(p.length / 70)), 0);
}

export async function gradeRedacao(banca: RedacaoBanca, tipo: RedacaoTipo, proposta: RedacaoTema, texto: string): Promise<RedacaoCorrecao> {
  const linhas = estimateLines(texto);
  const prompt = `Corrija este texto como a banca corrigiria.

CRITÉRIOS DA BANCA: ${CRITERIOS[banca]}

PROPOSTA (${TIPOS[tipo]}):
Tema: ${proposta.tema}
Comando: ${proposta.comando}
Aspectos obrigatórios: ${proposta.aspectos.map((a, i) => `${i + 1}) ${a}`).join(' ')}
Extensão: ${proposta.linhas.min} a ${proposta.linhas.max} linhas. O texto do aluno tem ~${linhas} linhas (estimativa: 70 caracteres por linha).

TEXTO DO ALUNO:
"""
${texto}
"""

Responda em JSON:
{
 "nota": <0-100, nota normalizada>,
 "notaBanca": "nota no formato da banca",
 "criterios": [{"nome":"...","nota":<n>,"max":<n>,"comentario":"por que perdeu ou ganhou pontos"}],
 "aspectosCobertos": [{"aspecto":"...","ok":true|false,"comentario":"..."}],
 "erros": [{"trecho":"trecho EXATO copiado do texto","tipo":"grafia|acentuação|concordância|regência|crase|pontuação|vocabulário|coesão|...","correcao":"como fica certo","regra":"regra curta"}],
 "fortes": ["..."],
 "melhorar": ["dicas práticas e concretas para a próxima"],
 "reescrita": "o parágrafo mais fraco do aluno reescrito como modelo nota máxima"
}
Liste TODOS os erros de norma culta que a banca descontaria (até 25).
Se o texto zerar por regra (abaixo do mínimo de linhas, fuga ao tema), "nota" e "notaBanca" seguem a regra da banca, MAS em "criterios" avalie cada um normalmente (nota que o texto teria) e diga no comentário que na prova seria zerado — o aluno precisa do feedback de conteúdo.`;
  const c = await askJSON<RedacaoCorrecao>(prompt, { system: SYSTEM, temperature: 0.2, timeoutMs: 120000 });
  return {
    nota: Math.max(0, Math.min(100, Math.round(Number(c.nota) || 0))),
    notaBanca: String(c.notaBanca ?? ''),
    criterios: (c.criterios ?? []).map((x) => ({ nome: String(x.nome), nota: Number(x.nota) || 0, max: Number(x.max) || 0, comentario: String(x.comentario ?? '') })),
    aspectosCobertos: (c.aspectosCobertos ?? []).map((x) => ({ aspecto: String(x.aspecto), ok: Boolean(x.ok), comentario: String(x.comentario ?? '') })),
    erros: (c.erros ?? []).filter((e) => e?.trecho).map((e) => ({ trecho: String(e.trecho), tipo: String(e.tipo ?? ''), correcao: String(e.correcao ?? ''), regra: String(e.regra ?? '') })),
    fortes: (c.fortes ?? []).map(String),
    melhorar: (c.melhorar ?? []).map(String),
    reescrita: String(c.reescrita ?? ''),
  };
}
