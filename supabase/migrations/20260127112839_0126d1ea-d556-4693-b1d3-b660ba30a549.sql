-- Add nearby column to workspaces table for storing nearby places data
ALTER TABLE public.workspaces 
ADD COLUMN IF NOT EXISTS nearby jsonb DEFAULT '{"metro": [], "bus_station": [], "train_station": [], "parking": [], "atm": [], "hospital": [], "petrol_pump": []}'::jsonb;