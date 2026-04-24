-- ServiceLinePro Sales Dashboard — D1 schema

CREATE TABLE IF NOT EXISTS quotes (
  id             TEXT PRIMARY KEY,
  company        TEXT,
  contact        TEXT,
  rep_name       TEXT,
  rep_email      TEXT,
  monthly        REAL DEFAULT 0,
  setup          REAL DEFAULT 0,
  contract_value REAL DEFAULT 0,
  day_one_cash   REAL DEFAULT 0,
  commission     REAL DEFAULT 0,
  payload        TEXT NOT NULL,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_quotes_updated ON quotes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_rep ON quotes(rep_email);
CREATE INDEX IF NOT EXISTS idx_quotes_company ON quotes(company);

CREATE TABLE IF NOT EXISTS responses (
  id          TEXT PRIMARY KEY,
  quote_id    TEXT NOT NULL,
  payload     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_responses_quote ON responses(quote_id);
