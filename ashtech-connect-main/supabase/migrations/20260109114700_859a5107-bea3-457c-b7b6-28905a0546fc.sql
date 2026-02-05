-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Anyone can view active workspaces" ON public.workspaces;

-- Create a permissive SELECT policy for public access to active workspaces
CREATE POLICY "Anyone can view active workspaces" 
ON public.workspaces 
FOR SELECT 
TO anon, authenticated
USING (is_active = true);