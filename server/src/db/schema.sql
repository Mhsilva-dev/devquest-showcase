-- Schema do DevQuest. Idempotente: roda na subida do servidor.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  xp            INTEGER NOT NULL DEFAULT 0,
  streak        INTEGER NOT NULL DEFAULT 0,
  last_study    DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Progresso por aula
CREATE TABLE IF NOT EXISTS progress (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id  TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'in_progress', -- in_progress | done
  score      INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

-- Cartões de revisão espaçada (repetição espaçada: 1→3→7→14→30)
CREATE TABLE IF NOT EXISTS cards (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id     TEXT,
  front         TEXT NOT NULL,
  back          TEXT NOT NULL,
  interval_days INTEGER NOT NULL DEFAULT 0,
  next_review   TIMESTAMPTZ NOT NULL DEFAULT now(),
  graduated     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(user_id, next_review) WHERE NOT graduated;

-- Conteúdo de aula gerado pela IA (cache, para não gastar à toa)
CREATE TABLE IF NOT EXISTS lesson_cache (
  lesson_id  TEXT PRIMARY KEY,
  content    JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sessões de entrevista
CREATE TABLE IF NOT EXISTS interviews (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  persona    TEXT NOT NULL,
  level      TEXT NOT NULL,
  topic      TEXT NOT NULL,
  messages   JSONB NOT NULL DEFAULT '[]',
  score      INTEGER,
  feedback   JSONB,
  finished   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Diário de aprendizado
CREATE TABLE IF NOT EXISTS journal (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Modo Concurso ----------

-- Simulados gerados pela IA no estilo da banca (gabarito fica só no servidor)
CREATE TABLE IF NOT EXISTS simulados (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  realm_ids  TEXT[] NOT NULL,
  banca      TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  questions  JSONB NOT NULL,          -- [{q, options, answer, explain, topic, realmId}]
  answers    JSONB,                   -- índices marcados (-1 = em branco)
  correct    INTEGER,
  score      INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_simulados_user ON simulados(user_id, created_at DESC);

-- Desempenho por matéria (alimenta o plano de estudos)
CREATE TABLE IF NOT EXISTS concurso_stats (
  user_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  realm_id TEXT NOT NULL,
  answered INTEGER NOT NULL DEFAULT 0,
  correct  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, realm_id)
);

-- Plano de estudos estratégico (um por usuário)
CREATE TABLE IF NOT EXISTS concurso_plans (
  user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  input      JSONB NOT NULL,
  plan       JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Finanças ----------
CREATE TABLE IF NOT EXISTS finance_plans (
  user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  input      JSONB NOT NULL,
  plan       JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Resumos de livros gerados pela IA (compartilhados, não dependem do usuário)
CREATE TABLE IF NOT EXISTS book_summaries (
  book_id    TEXT PRIMARY KEY,
  summary    JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Foco (Pomodoro / horas líquidas) ----------
CREATE TABLE IF NOT EXISTS focus_sessions (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject    TEXT NOT NULL,           -- realmId ou texto livre
  minutes    INTEGER NOT NULL,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_focus_user ON focus_sessions(user_id, created_at DESC);
ALTER TABLE users ADD COLUMN IF NOT EXISTS focus_goal INTEGER NOT NULL DEFAULT 120;

-- ---------- Redação / Discursiva ----------
CREATE TABLE IF NOT EXISTS redacoes (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  banca      TEXT NOT NULL,
  tipo       TEXT NOT NULL,
  proposta   JSONB NOT NULL,
  texto      TEXT,
  correcao   JSONB,
  nota       INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  graded_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_redacoes_user ON redacoes(user_id, created_at DESC);

-- ---------- Captura (link/vídeo/PDF/texto → cards) ----------
CREATE TABLE IF NOT EXISTS capturas (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track       TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source      TEXT NOT NULL,
  result      JSONB NOT NULL,
  quiz_score  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_capturas_user ON capturas(user_id, created_at DESC);

-- ---------- Disciplina & Mente ----------
CREATE TABLE IF NOT EXISTS mente_protocols (
  user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  input      JSONB NOT NULL,
  protocol   JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Check-in diário: "fiz o mínimo" ou "fiz completo" (um por dia, fuso de Brasília)
CREATE TABLE IF NOT EXISTS mente_checkins (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day     DATE NOT NULL,
  kind    TEXT NOT NULL,
  PRIMARY KEY (user_id, day)
);

-- ---------- Comunicação & Relações ----------
-- Simulador de conversas: a IA interpreta a outra pessoa e avalia no final
CREATE TABLE IF NOT EXISTS conversas (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cena        JSONB NOT NULL,
  dificuldade TEXT NOT NULL,
  messages    JSONB NOT NULL DEFAULT '[]',
  feedback    JSONB,
  score       INTEGER,
  finished    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_conversas_user ON conversas(user_id, created_at DESC);
