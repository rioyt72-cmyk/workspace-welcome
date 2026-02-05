-- Create separate enquiries table for workspace enquiries
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  number_of_employees TEXT,
  city TEXT,
  workspace_type TEXT,
  seats TEXT,
  message TEXT,
  workspace_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit enquiries
CREATE POLICY "Anyone can submit enquiries"
ON public.enquiries
FOR INSERT
WITH CHECK (true);

-- Admins can manage all enquiries
CREATE POLICY "Admins can manage all enquiries"
ON public.enquiries
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();