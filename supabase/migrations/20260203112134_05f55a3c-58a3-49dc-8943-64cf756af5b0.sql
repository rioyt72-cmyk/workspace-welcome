-- Add coupon_code column to special_offers table
ALTER TABLE public.special_offers
ADD COLUMN coupon_code text DEFAULT NULL;