-- Add video_url field to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add video_url field to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add comment explaining video support
COMMENT ON COLUMN projects.video_url IS 'Optional video URL (YouTube, Vimeo, or direct video file)';
COMMENT ON COLUMN blog_posts.video_url IS 'Optional video URL (YouTube, Vimeo, or direct video file)';
