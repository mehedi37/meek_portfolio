-- Migration: Add project dates for timeline and happy_clients stat
-- Created: 2026-01-28

-- Add start_date and end_date to projects for timeline display
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Set default start_date for existing projects to their created_at date
UPDATE public.projects
SET start_date = created_at::date
WHERE start_date IS NULL;

-- Make start_date NOT NULL after setting defaults
ALTER TABLE public.projects
ALTER COLUMN start_date SET NOT NULL;

-- Add happy_clients to site_profile table
ALTER TABLE public.site_profile
ADD COLUMN IF NOT EXISTS happy_clients INTEGER DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN public.projects.start_date IS 'Project start date for timeline display';
COMMENT ON COLUMN public.projects.end_date IS 'Project end date (null for ongoing projects)';
COMMENT ON COLUMN public.site_profile.happy_clients IS 'Number of happy clients for stats display';
