-- Phase 7: Email + password authentication
--
-- Replaces the single ADMIN_PASSWORD_HASH env-var auth with a users table.
-- Existing sessions are dropped and recreated so they carry the owning user's
-- email. Any currently-active admin sessions are invalidated by this migration
-- (users must log in again with their email + password).

-- `email` is stored as lowercase/trimmed by the create-user.mjs script and
-- by normalizeEmail() in src/lib/server/auth.ts. The COLLATE NOCASE + CHECK
-- constraint enforces that contract at the schema level so that rows
-- inserted outside those helpers (e.g. ad-hoc wrangler d1 execute) still
-- match lookups and cannot create case-variant duplicates.
CREATE TABLE users (
  email TEXT PRIMARY KEY COLLATE NOCASE
    CHECK (email = lower(trim(email))),
  password_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

DROP TABLE IF EXISTS sessions;

CREATE TABLE sessions (
  token TEXT PRIMARY KEY,
  user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_user_email ON sessions(user_email);
