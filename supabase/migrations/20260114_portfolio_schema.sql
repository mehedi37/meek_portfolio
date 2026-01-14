-- Portfolio Database Schema Migration
-- This migration sets up all tables for the portfolio website
-- Run this in your Supabase SQL editor

-- =====================================================
-- TABLE: site_profile (singleton - personal information)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  short_name text,
  tagline text,
  about_me text,
  profile_image text,
  resume_url text,
  email text,
  phone text,
  location text,
  status text DEFAULT 'Available for hire',
  status_color text DEFAULT 'success',
  years_experience integer DEFAULT 0,
  completed_projects integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Ensure only one row can exist in site_profile
CREATE OR REPLACE FUNCTION check_single_site_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.site_profile) > 0 AND TG_OP = 'INSERT' THEN
    RAISE EXCEPTION 'Only one site profile can exist. Use UPDATE instead.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_single_site_profile ON public.site_profile;
CREATE TRIGGER enforce_single_site_profile
  BEFORE INSERT ON public.site_profile
  FOR EACH ROW
  EXECUTE FUNCTION check_single_site_profile();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_profile_updated_at ON public.site_profile;
CREATE TRIGGER site_profile_updated_at
  BEFORE UPDATE ON public.site_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- TABLE: social_links
-- =====================================================
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_links_sort ON public.social_links(sort_order);

-- =====================================================
-- TABLE: skill_categories
-- =====================================================
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  color text DEFAULT 'accent',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_categories_sort ON public.skill_categories(sort_order);

-- =====================================================
-- UPDATE: skills table (add new columns)
-- =====================================================
-- Add new columns to existing skills table
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.skill_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_sort ON public.skills(sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_featured ON public.skills(is_featured);

-- =====================================================
-- UPDATE: projects table (add sort_order and is_active)
-- =====================================================
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_projects_sort ON public.projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);

-- =====================================================
-- UPDATE: experiences table (add sort_order and is_current)
-- =====================================================
ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_current boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS company_logo text,
  ADD COLUMN IF NOT EXISTS company_url text;

CREATE INDEX IF NOT EXISTS idx_experiences_sort ON public.experiences(sort_order);

-- =====================================================
-- UPDATE: certifications table (add sort_order and is_active)
-- =====================================================
ALTER TABLE public.certifications
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_certifications_sort ON public.certifications(sort_order);

-- =====================================================
-- UPDATE: blog_posts table (add sort_order)
-- =====================================================
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(is_featured);

-- =====================================================
-- UPDATE: contacts table (add status for read/unread)
-- =====================================================
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS replied_at timestamp with time zone;

-- =====================================================
-- Enable Row Level Security on all tables
-- =====================================================
ALTER TABLE public.site_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies: site_profile
-- =====================================================
DROP POLICY IF EXISTS "Public can read site_profile" ON public.site_profile;
CREATE POLICY "Public can read site_profile" ON public.site_profile
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage site_profile" ON public.site_profile;
CREATE POLICY "Admin can manage site_profile" ON public.site_profile
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies: social_links
-- =====================================================
DROP POLICY IF EXISTS "Public can read active social_links" ON public.social_links;
CREATE POLICY "Public can read active social_links" ON public.social_links
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage social_links" ON public.social_links;
CREATE POLICY "Admin can manage social_links" ON public.social_links
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies: skill_categories
-- =====================================================
DROP POLICY IF EXISTS "Public can read skill_categories" ON public.skill_categories;
CREATE POLICY "Public can read skill_categories" ON public.skill_categories
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage skill_categories" ON public.skill_categories;
CREATE POLICY "Admin can manage skill_categories" ON public.skill_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies: skills
-- =====================================================
DROP POLICY IF EXISTS "Public can read skills" ON public.skills;
CREATE POLICY "Public can read skills" ON public.skills
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage skills" ON public.skills;
CREATE POLICY "Admin can manage skills" ON public.skills
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies: projects
-- =====================================================
DROP POLICY IF EXISTS "Public can read active projects" ON public.projects;
CREATE POLICY "Public can read active projects" ON public.projects
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
CREATE POLICY "Admin can manage projects" ON public.projects
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies: experiences
-- =====================================================
DROP POLICY IF EXISTS "Public can read experiences" ON public.experiences;
CREATE POLICY "Public can read experiences" ON public.experiences
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage experiences" ON public.experiences;
CREATE POLICY "Admin can manage experiences" ON public.experiences
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies: certifications
-- =====================================================
DROP POLICY IF EXISTS "Public can read active certifications" ON public.certifications;
CREATE POLICY "Public can read active certifications" ON public.certifications
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage certifications" ON public.certifications;
CREATE POLICY "Admin can manage certifications" ON public.certifications
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies: blog_posts
-- =====================================================
DROP POLICY IF EXISTS "Public can read published blog_posts" ON public.blog_posts;
CREATE POLICY "Public can read published blog_posts" ON public.blog_posts
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admin can manage blog_posts" ON public.blog_posts;
CREATE POLICY "Admin can manage blog_posts" ON public.blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- RLS Policies: contacts
-- =====================================================
DROP POLICY IF EXISTS "Public can insert contacts" ON public.contacts;
CREATE POLICY "Public can insert contacts" ON public.contacts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage contacts" ON public.contacts;
CREATE POLICY "Admin can manage contacts" ON public.contacts
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- Insert default skill categories
-- =====================================================
INSERT INTO public.skill_categories (name, description, icon, color, sort_order) VALUES
  ('Frontend', 'Client-side technologies and frameworks', 'HiCode', 'accent', 1),
  ('Backend', 'Server-side technologies and APIs', 'HiServer', 'success', 2),
  ('Database', 'Database management systems', 'HiDatabase', 'warning', 3),
  ('DevOps', 'Development operations and deployment', 'HiCloud', 'danger', 4),
  ('Tools', 'Development tools and utilities', 'HiCog', 'default', 5)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- Insert default site_profile (update with your info)
-- =====================================================
INSERT INTO public.site_profile (full_name, short_name, tagline, about_me, email, location, status)
SELECT 'Your Name', 'YN', 'Full Stack Developer',
  'I am a passionate developer who loves building modern web applications.',
  'your.email@example.com', 'Your City, Country', 'Available for hire'
WHERE NOT EXISTS (SELECT 1 FROM public.site_profile);

COMMENT ON TABLE public.site_profile IS 'Singleton table containing personal information for the portfolio';
COMMENT ON TABLE public.social_links IS 'Social media and professional profile links';
COMMENT ON TABLE public.skill_categories IS 'Categories for organizing skills';
