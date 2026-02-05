-- Create special_offers table for admin-managed promotional offers
CREATE TABLE public.special_offers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    badge_text TEXT NOT NULL DEFAULT 'OFFER',
    discount_value TEXT,
    expiry_date DATE,
    gradient_from TEXT NOT NULL DEFAULT '#f97316',
    gradient_to TEXT NOT NULL DEFAULT '#ef4444',
    icon TEXT NOT NULL DEFAULT 'Tag',
    cta_label TEXT NOT NULL DEFAULT 'Claim Now',
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active offers
CREATE POLICY "Anyone can view active special offers"
ON public.special_offers
FOR SELECT
USING (is_active = true);

-- Allow all operations for admin panel (permissive for session-based admin)
CREATE POLICY "Allow all operations on special_offers"
ON public.special_offers
FOR ALL
USING (true)
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_special_offers_updated_at
BEFORE UPDATE ON public.special_offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();