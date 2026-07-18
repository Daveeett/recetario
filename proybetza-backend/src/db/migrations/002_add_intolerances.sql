-- ============================================================
-- MIGRACIÓN 002 — Agregar columna de intolerancias
-- ============================================================

ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS intolerances TEXT[] NOT NULL DEFAULT '{}';
