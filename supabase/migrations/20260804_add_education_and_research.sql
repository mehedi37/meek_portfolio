-- Add Education table and extend blog_posts for Research entries
-- Run this in your Supabase SQL editor

-- =====================================================
-- TABLE: education
-- =====================================================
CREATE TABLE IF NOT EXISTS public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text,
  location text,
  start_date date NOT NULL,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  gpa text,
  institution_logo text,
  institution_url text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_education_sort ON public.education(sort_order);

DROP TRIGGER IF EXISTS education_updated_at ON public.education;
CREATE TRIGGER education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read education" ON public.education;
CREATE POLICY "Public can read education" ON public.education
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can manage education" ON public.education;
CREATE POLICY "Admin can manage education" ON public.education
  FOR ALL USING (auth.role() = 'authenticated');

COMMENT ON TABLE public.education IS 'Educational background entries for the portfolio';

-- =====================================================
-- UPDATE: blog_posts table (repurposed as Research entries)
-- =====================================================
-- Optional venue/status line for a research entry, e.g.
-- "Under Submission -- IEEE ICDM 2026 (Applied Track)". Left NULL for
-- ordinary posts; the underlying table/columns keep their original names.
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS venue text;
