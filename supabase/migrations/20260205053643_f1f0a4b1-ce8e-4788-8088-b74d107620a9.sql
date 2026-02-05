-- Create a table for workspace types so they can be managed dynamically
CREATE TABLE public.workspace_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value text NOT NULL UNIQUE,
  label text NOT NULL,
  icon text DEFAULT 'Building2',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workspace_types ENABLE ROW LEVEL SECURITY;

-- Anyone can view active workspace types
CREATE POLICY "Anyone can view active workspace types"
  ON public.workspace_types FOR SELECT
  USING (is_active = true);

-- Admins can manage all workspace types
CREATE POLICY "Admins can manage all workspace types"
  ON public.workspace_types FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_workspace_types_updated_at
  BEFORE UPDATE ON public.workspace_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the default workspace types
INSERT INTO public.workspace_types (value, label, icon, display_order) VALUES
  ('coworking', 'Coworking Space', 'Users', 1),
  ('serviced_office', 'Serviced Office', 'Building2', 2),
  ('private_office', 'Private Office', 'Briefcase', 3),
  ('meeting_room', 'Meeting Room', 'Video', 4),
  ('training_room', 'Training Room', 'GraduationCap', 5),
  ('virtual_office', 'Virtual Office', 'Globe', 6),
  ('day_office', 'Day Office', 'CalendarDays', 7);