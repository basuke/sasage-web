-- Phase 5: Initial D1 schema for sasage-web
-- Migrates data from images.json + collections.json to Cloudflare D1

CREATE TABLE images (
  id TEXT PRIMARY KEY,
  format TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  title TEXT,
  title_ja TEXT,
  description TEXT,
  description_ja TEXT,
  sha1 TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE collections (
  name TEXT NOT NULL,
  image_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  PRIMARY KEY (name, image_id)
);

CREATE TABLE works (
  id TEXT PRIMARY KEY,
  cover_image_id TEXT,
  title TEXT NOT NULL,
  title_ja TEXT,
  subtitle TEXT,
  subtitle_ja TEXT,
  position INTEGER NOT NULL
);

CREATE TABLE work_images (
  work_id TEXT NOT NULL,
  image_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  PRIMARY KEY (work_id, image_id),
  FOREIGN KEY (work_id) REFERENCES works(id)
);
