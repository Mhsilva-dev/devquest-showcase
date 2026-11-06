// Resumo de estudo de livro gerado pela IA e cacheado em book_summaries (compartilhado entre usuários).
import type { BookSummary } from '@devquest/shared';
import { query } from '../db/pool.js';
import { askJSON } from './ai.js';

type BookRef = { id: string; title: string; author: string };

export async function cachedSummary(id: string): Promise<BookSummary | null> {
  return (await query('SELECT summary FROM book_summaries WHERE book_id=$1', [id])).rows[0]?.summary ?? null;
}

export async function summarizeBook(book: BookRef, leitor: string, system: string): Promise<BookSummary> {
  const prompt = `Faça um resumo de estudo do livro "${book.title}", de ${book.author}, para ${leitor}.
Explique tudo com suas próprias palavras (não reproduza trechos do livro). Seja honesto sobre o que tem base científica e o que é opinião do autor.

Responda em JSON:
{
  "ideia": "a ideia central do livro em 2-3 frases",
  "licoes": [{"titulo":"lição curta","explicacao":"explicação em 3-5 frases com um exemplo prático do dia a dia"}],
  "citacoesParafraseadas": ["ideias marcantes do autor, parafraseadas"],
  "planoDeAcao": ["passo concreto para aplicar esta semana", "..."],
  "criticas": ["limitações, exageros ou pontos contestados"],
  "paraQuem": "para quem este livro é mais útil"
}
Gere de 7 a 10 lições, 4 ideias marcantes, 5 passos de ação e 2-3 críticas.`;
  const summary = await askJSON<BookSummary>(prompt, { system, temperature: 0.4, timeoutMs: 90000 });
  await query('INSERT INTO book_summaries (book_id, summary) VALUES ($1,$2) ON CONFLICT (book_id) DO UPDATE SET summary=$2', [book.id, JSON.stringify(summary)]);
  return summary;
}
