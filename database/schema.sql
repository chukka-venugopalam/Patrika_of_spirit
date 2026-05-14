-- ================================================================
-- AWARENET - Complete Supabase PostgreSQL Schema
-- ================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ================================================================
-- ENUMS
-- ================================================================

CREATE TYPE urgency_level AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE share_platform AS ENUM ('twitter', 'facebook', 'linkedin', 'whatsapp', 'telegram', 'copy', 'email', 'other');

-- ================================================================
-- USERS TABLE (extends Supabase auth.users)
-- ================================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  impact_score INTEGER NOT NULL DEFAULT 0,
  chains_created INTEGER NOT NULL DEFAULT 0,
  total_reach INTEGER NOT NULL DEFAULT 0,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- ================================================================
-- CATEGORIES TABLE
-- ================================================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT NOT NULL DEFAULT '#00f5ff',
  banner_image TEXT,
  post_count INTEGER NOT NULL DEFAULT 0,
  follower_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- AWARENESS POSTS TABLE
-- ================================================================

CREATE TABLE public.awareness_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  hero_image TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  urgency urgency_level NOT NULL DEFAULT 'medium',
  status post_status NOT NULL DEFAULT 'draft',
  problem_explanation TEXT,
  why_it_matters TEXT,
  consequences TEXT,
  real_examples TEXT,
  solutions TEXT,
  reading_time INTEGER NOT NULL DEFAULT 5,
  view_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  chain_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- AWARENESS CHAINS TABLE
-- ================================================================

CREATE TABLE public.awareness_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.awareness_posts(id) ON DELETE CASCADE,
  root_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_chain_id UUID REFERENCES public.awareness_chains(id) ON DELETE SET NULL,
  share_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  depth INTEGER NOT NULL DEFAULT 1,
  total_reach INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- SHARES TABLE
-- ================================================================

CREATE TABLE public.shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.awareness_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  chain_id UUID REFERENCES public.awareness_chains(id) ON DELETE SET NULL,
  platform TEXT NOT NULL DEFAULT 'other',
  ip_hash TEXT, -- anonymized for analytics
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- USER INTERESTS TABLE
-- ================================================================

CREATE TABLE public.user_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

-- ================================================================
-- BADGES TABLE
-- ================================================================

CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#00f5ff',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL DEFAULT 1,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- USER BADGES TABLE
-- ================================================================

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ================================================================
-- COMMENTS TABLE
-- ================================================================

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.awareness_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  like_count INTEGER NOT NULL DEFAULT 0,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

-- ================================================================
-- LIKES TABLE
-- ================================================================

CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.awareness_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ================================================================
-- COMMENT LIKES TABLE
-- ================================================================

CREATE TABLE public.comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- ================================================================
-- INDEXES
-- ================================================================

-- Users
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_impact_score ON public.users(impact_score DESC);

-- Categories
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Awareness posts
CREATE INDEX idx_posts_slug ON public.awareness_posts(slug);
CREATE INDEX idx_posts_category ON public.awareness_posts(category_id);
CREATE INDEX idx_posts_author ON public.awareness_posts(author_id);
CREATE INDEX idx_posts_status ON public.awareness_posts(status);
CREATE INDEX idx_posts_featured ON public.awareness_posts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_posts_published_at ON public.awareness_posts(published_at DESC);
CREATE INDEX idx_posts_urgency ON public.awareness_posts(urgency);
CREATE INDEX idx_posts_view_count ON public.awareness_posts(view_count DESC);
CREATE INDEX idx_posts_tags ON public.awareness_posts USING gin(tags);
-- Full-text search
CREATE INDEX idx_posts_fts ON public.awareness_posts 
  USING gin(to_tsvector('english', title || ' ' || COALESCE(subtitle, '') || ' ' || COALESCE(problem_explanation, '')));

-- Chains
CREATE INDEX idx_chains_post ON public.awareness_chains(post_id);
CREATE INDEX idx_chains_root_user ON public.awareness_chains(root_user_id);
CREATE INDEX idx_chains_share_code ON public.awareness_chains(share_code);
CREATE INDEX idx_chains_parent ON public.awareness_chains(parent_chain_id);

-- Shares
CREATE INDEX idx_shares_post ON public.shares(post_id);
CREATE INDEX idx_shares_user ON public.shares(user_id);
CREATE INDEX idx_shares_chain ON public.shares(chain_id);
CREATE INDEX idx_shares_created ON public.shares(created_at DESC);

-- Likes
CREATE INDEX idx_likes_post ON public.likes(post_id);
CREATE INDEX idx_likes_user ON public.likes(user_id);

-- Comments
CREATE INDEX idx_comments_post ON public.comments(post_id);
CREATE INDEX idx_comments_user ON public.comments(user_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);
CREATE INDEX idx_comments_created ON public.comments(created_at DESC);

-- User interests
CREATE INDEX idx_user_interests_user ON public.user_interests(user_id);
CREATE INDEX idx_user_interests_category ON public.user_interests(category_id);

-- User badges
CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);

-- ================================================================
-- FUNCTIONS
-- ================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Increment post view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.awareness_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment post share count and update user stats
CREATE OR REPLACE FUNCTION handle_new_share()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment share count on the post
  UPDATE public.awareness_posts
  SET share_count = share_count + 1
  WHERE id = NEW.post_id;

  -- Update user impact score if authenticated
  IF NEW.user_id IS NOT NULL THEN
    UPDATE public.users
    SET impact_score = impact_score + 5, total_reach = total_reach + 1
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle new like
CREATE OR REPLACE FUNCTION handle_new_like()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.awareness_posts
  SET like_count = like_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle like deletion
CREATE OR REPLACE FUNCTION handle_deleted_like()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.awareness_posts
  SET like_count = GREATEST(0, like_count - 1)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle new comment
CREATE OR REPLACE FUNCTION handle_new_comment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.awareness_posts
  SET comment_count = comment_count + 1
  WHERE id = NEW.post_id;

  -- Award impact points to commenter
  UPDATE public.users
  SET impact_score = impact_score + 2
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle new chain - update user stats
CREATE OR REPLACE FUNCTION handle_new_chain()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.awareness_posts
  SET chain_count = chain_count + 1
  WHERE id = NEW.post_id;

  UPDATE public.users
  SET chains_created = chains_created + 1, impact_score = impact_score + 10
  WHERE id = NEW.root_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search posts function
CREATE OR REPLACE FUNCTION search_posts(query TEXT)
RETURNS SETOF awareness_posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.awareness_posts
  WHERE
    status = 'published'
    AND to_tsvector('english', title || ' ' || COALESCE(subtitle, '') || ' ' || COALESCE(problem_explanation, ''))
      @@ plainto_tsquery('english', query)
  ORDER BY
    ts_rank(
      to_tsvector('english', title || ' ' || COALESCE(subtitle, '') || ' ' || COALESCE(problem_explanation, '')),
      plainto_tsquery('english', query)
    ) DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get chain tree for visualization
CREATE OR REPLACE FUNCTION get_chain_tree(root_chain_id UUID)
RETURNS TABLE(
  id UUID,
  parent_chain_id UUID,
  root_user_id UUID,
  depth INTEGER,
  total_reach INTEGER,
  share_code TEXT,
  created_at TIMESTAMPTZ
) AS $$
  WITH RECURSIVE chain_tree AS (
    SELECT ac.id, ac.parent_chain_id, ac.root_user_id, ac.depth, ac.total_reach, ac.share_code, ac.created_at
    FROM public.awareness_chains ac
    WHERE ac.id = root_chain_id
    UNION ALL
    SELECT ac.id, ac.parent_chain_id, ac.root_user_id, ac.depth, ac.total_reach, ac.share_code, ac.created_at
    FROM public.awareness_chains ac
    INNER JOIN chain_tree ct ON ac.parent_chain_id = ct.id
  )
  SELECT * FROM chain_tree;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ================================================================
-- TRIGGERS
-- ================================================================

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.awareness_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER on_new_share
  AFTER INSERT ON public.shares
  FOR EACH ROW EXECUTE FUNCTION handle_new_share();

CREATE TRIGGER on_new_like
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION handle_new_like();

CREATE TRIGGER on_deleted_like
  AFTER DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION handle_deleted_like();

CREATE TRIGGER on_new_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION handle_new_comment();

CREATE TRIGGER on_new_chain
  AFTER INSERT ON public.awareness_chains
  FOR EACH ROW EXECUTE FUNCTION handle_new_chain();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awareness_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awareness_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (TRUE);

-- Posts policies
CREATE POLICY "Anyone can view published posts" ON public.awareness_posts
  FOR SELECT USING (status = 'published' OR author_id = auth.uid());
CREATE POLICY "Authenticated users can create posts" ON public.awareness_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.awareness_posts
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON public.awareness_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Chains policies
CREATE POLICY "Anyone can view chains" ON public.awareness_chains FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can create chains" ON public.awareness_chains
  FOR INSERT WITH CHECK (auth.uid() = root_user_id);

-- Shares policies
CREATE POLICY "Anyone can create shares" ON public.shares FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can view own shares" ON public.shares
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

-- User interests policies
CREATE POLICY "Users can view own interests" ON public.user_interests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own interests" ON public.user_interests
  FOR ALL USING (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (TRUE);

-- User badges policies
CREATE POLICY "Anyone can view user badges" ON public.user_badges FOR SELECT USING (TRUE);

-- Comments policies
CREATE POLICY "Anyone can view non-deleted comments" ON public.comments
  FOR SELECT USING (is_deleted = FALSE);
CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can like" ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.likes
  FOR DELETE USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Anyone can view comment likes" ON public.comment_likes FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can like comments" ON public.comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike comments" ON public.comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================================
-- SEED DATA
-- ================================================================

-- Categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Society', 'society', 'Social justice, inequality, human rights, and community issues', '🌍', '#00f5ff'),
  ('Health', 'health', 'Global health crises, mental health, disease prevention, and wellness', '❤️', '#ff6b6b'),
  ('Environment', 'environment', 'Climate change, biodiversity loss, pollution, and sustainability', '🌱', '#00ff88'),
  ('Technology', 'technology', 'Digital rights, AI ethics, cybersecurity, and tech inequality', '⚡', '#b400ff'),
  ('Politics', 'politics', 'Democracy, governance, corruption, and political accountability', '🏛️', '#ff6b00'),
  ('Education', 'education', 'Access to education, literacy, and knowledge equity', '📚', '#ffd700'),
  ('History', 'history', 'Historical events, patterns, and lessons for the present', '📜', '#c0a882'),
  ('Finance', 'finance', 'Economic inequality, financial literacy, and global markets', '💹', '#00ff88'),
  ('Cybersecurity', 'cybersecurity', 'Digital threats, privacy rights, and online safety', '🔒', '#00f5ff'),
  ('AI & Future', 'ai-future', 'Artificial intelligence, automation, and the future of humanity', '🤖', '#b400ff');

-- Badges
INSERT INTO public.badges (name, description, icon, color, requirement_type, requirement_value, rarity) VALUES
  ('First Spark', 'Created your first awareness chain', '✨', '#ffd700', 'chains_created', 1, 'common'),
  ('Chain Starter', 'Created 5 awareness chains', '🔗', '#00f5ff', 'chains_created', 5, 'common'),
  ('Viral Voice', 'Created 25 awareness chains', '📡', '#b400ff', 'chains_created', 25, 'rare'),
  ('Network Node', 'Reached 100 people through your chains', '🌐', '#00ff88', 'total_reach', 100, 'rare'),
  ('Megaphone', 'Reached 1000 people through your chains', '📢', '#ff6b00', 'total_reach', 1000, 'epic'),
  ('Impact Pioneer', 'Reached 10000 people through your chains', '🌟', '#ffd700', 'total_reach', 10000, 'legendary'),
  ('Impact Seeker', 'Earned 50 impact points', '🎯', '#00f5ff', 'impact_score', 50, 'common'),
  ('Awareness Champion', 'Earned 500 impact points', '🏆', '#ffd700', 'impact_score', 500, 'epic');

-- Sample awareness posts (with placeholder category IDs to be resolved)
DO $$
DECLARE
  v_society_id UUID;
  v_env_id UUID;
  v_tech_id UUID;
  v_health_id UUID;
  v_ai_id UUID;
BEGIN
  SELECT id INTO v_society_id FROM public.categories WHERE slug = 'society';
  SELECT id INTO v_env_id FROM public.categories WHERE slug = 'environment';
  SELECT id INTO v_tech_id FROM public.categories WHERE slug = 'technology';
  SELECT id INTO v_health_id FROM public.categories WHERE slug = 'health';
  SELECT id INTO v_ai_id FROM public.categories WHERE slug = 'ai-future';

  -- Note: These would need real author IDs in production.
  -- Seeds use a placeholder system user; in prod, create via signup first.
END $$;
