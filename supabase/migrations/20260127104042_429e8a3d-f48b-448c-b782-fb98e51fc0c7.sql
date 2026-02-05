-- Create workspace_service_options table to store customizable service options per workspace
CREATE TABLE public.workspace_service_options (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    price_unit TEXT NOT NULL DEFAULT 'month', -- 'month', 'day', 'hour'
    capacity TEXT, -- e.g., '1-5 Seater', '13 Seater'
    action_label TEXT NOT NULL DEFAULT 'Book Now', -- 'Book Now', 'Schedule Visit', 'Enquire Now'
    icon TEXT DEFAULT 'Building2',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workspace_service_options ENABLE ROW LEVEL SECURITY;

-- Anyone can view active service options
CREATE POLICY "Anyone can view active service options"
ON public.workspace_service_options
FOR SELECT
USING (is_active = true);

-- Allow all operations (for admin panel)
CREATE POLICY "Allow all operations on workspace_service_options"
ON public.workspace_service_options
FOR ALL
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_workspace_service_options_updated_at
BEFORE UPDATE ON public.workspace_service_options
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add new columns to workspaces table for enhanced detail page
ALTER TABLE public.workspaces 
ADD COLUMN IF NOT EXISTS landmark TEXT,
ADD COLUMN IF NOT EXISTS timings JSONB DEFAULT '{"weekdays": "24 Hours", "saturday": "24 Hours", "sunday": "24 Hours"}'::jsonb,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);