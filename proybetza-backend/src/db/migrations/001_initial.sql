
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUM types ─────

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE recipe_category AS ENUM ('dulce', 'salada', 'agridulce', 'postre', 'bebida');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE recipe_difficulty AS ENUM ('facil', 'media', 'dificil');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE forum_post_type AS ENUM ('review', 'request');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── TABLA: users ──────────

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          user_role    NOT NULL DEFAULT 'user',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ─── TABLA: recipes ─────────────

CREATE TABLE IF NOT EXISTS recipes (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(200)       NOT NULL,
  category         recipe_category    NOT NULL,
  difficulty       recipe_difficulty  NOT NULL,
  cook_time        VARCHAR(50)        NOT NULL,
  description      TEXT               NOT NULL,
  -- Imagen almacenada en base de datos como binario
  image_data       BYTEA,
  image_mime       VARCHAR(50),
  image_filename   VARCHAR(255),
  -- URL externa de fallback (para las recetas del seed inicial)
  image_url        VARCHAR(500),
  created_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_category   ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty  ON recipes(difficulty);
CREATE INDEX IF NOT EXISTS idx_recipes_title       ON recipes USING gin(to_tsvector('spanish', title));

-- ─── TABLA: recipe_ingredients ──────────────

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id          SERIAL PRIMARY KEY,
  recipe_id   INTEGER      NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name        VARCHAR(200) NOT NULL,
  order_index INTEGER      NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON recipe_ingredients(recipe_id);

-- ─── TABLA: recipe_steps ─────────────────────────

CREATE TABLE IF NOT EXISTS recipe_steps (
  id          SERIAL PRIMARY KEY,
  recipe_id   INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  description TEXT    NOT NULL,
  CONSTRAINT uq_recipe_step UNIQUE (recipe_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_steps_recipe_id ON recipe_steps(recipe_id);

-- ─── TABLA: user_preferences ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_preferences (
  id                    SERIAL PRIMARY KEY,
  user_id               INTEGER           NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  favorite_ingredients  TEXT[]            NOT NULL DEFAULT '{}',
  allergens             TEXT[]            NOT NULL DEFAULT '{}',
  preferred_categories  TEXT[]            NOT NULL DEFAULT '{}',
  preferred_difficulty  recipe_difficulty,
  updated_at            TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON user_preferences(user_id);

-- ─── TABLA: forum_posts ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS forum_posts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200)    NOT NULL,
  content     TEXT            NOT NULL,
  post_type   forum_post_type NOT NULL DEFAULT 'review',
  likes_count INTEGER         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id   ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_post_type ON forum_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created   ON forum_posts(created_at DESC);

-- ─── TABLA: forum_likes ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS forum_likes (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)
);

-- ─── TRIGGER: updated_at automático ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_forum_posts_updated_at
    BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── VISTA: recipes con conteo de ingredientes y pasos ───────────────────────

CREATE OR REPLACE VIEW v_recipes_summary AS
SELECT
  r.id,
  r.title,
  r.category,
  r.difficulty,
  r.cook_time,
  r.description,
  r.image_url,
  CASE WHEN r.image_data IS NOT NULL THEN TRUE ELSE FALSE END AS has_image,
  r.created_at,
  COUNT(DISTINCT ri.id) AS ingredient_count,
  COUNT(DISTINCT rs.id) AS step_count
FROM recipes r
LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
LEFT JOIN recipe_steps rs       ON rs.recipe_id = r.id
GROUP BY r.id;
