-- Add discover_slides column to site_content for multiple slideshow images
ALTER TABLE public.site_content 
ADD COLUMN IF NOT EXISTS discover_slides jsonb DEFAULT '[]'::jsonb;