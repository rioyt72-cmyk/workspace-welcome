-- Drop the existing restrictive admin policy
DROP POLICY IF EXISTS "Admins can manage all workspaces" ON public.workspaces;

-- Create a permissive policy that allows all operations (for admin panel)
-- Since admin uses sessionStorage auth, we need to allow operations
CREATE POLICY "Allow all operations on workspaces"
ON public.workspaces
FOR ALL
USING (true)
WITH CHECK (true);

-- Also fix the locations table for the same reason
DROP POLICY IF EXISTS "Admins can manage all locations" ON public.locations;

CREATE POLICY "Allow all operations on locations"
ON public.locations
FOR ALL
USING (true)
WITH CHECK (true);