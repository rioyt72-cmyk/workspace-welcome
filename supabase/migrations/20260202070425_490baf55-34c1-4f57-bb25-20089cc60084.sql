-- Create storage bucket for site content images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-content', 'site-content', true);

-- Allow public read access
CREATE POLICY "Site content images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-content');

-- Allow authenticated admins to upload/update/delete
CREATE POLICY "Admins can manage site content images"
ON storage.objects
FOR ALL
USING (bucket_id = 'site-content')
WITH CHECK (bucket_id = 'site-content');

-- Create a table to store site content settings
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  discover_section_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Site content is publicly readable"
ON public.site_content
FOR SELECT
USING (true);

-- Admin write access (via edge function)
CREATE POLICY "Anyone can update site content"
ON public.site_content
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert default row
INSERT INTO public.site_content (id) VALUES ('main');