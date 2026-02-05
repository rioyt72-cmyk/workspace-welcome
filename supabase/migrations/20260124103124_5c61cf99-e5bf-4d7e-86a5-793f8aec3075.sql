-- Create a table for requirement submissions
CREATE TABLE public.requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  workspace_type TEXT,
  seats TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage all requirements
CREATE POLICY "Admins can manage all requirements"
ON public.requirements
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for anyone to submit requirements (insert only)
CREATE POLICY "Anyone can submit requirements"
ON public.requirements
FOR INSERT
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_requirements_updated_at
BEFORE UPDATE ON public.requirements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();