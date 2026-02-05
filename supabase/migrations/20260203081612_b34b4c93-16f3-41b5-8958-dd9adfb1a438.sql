-- Create table to store user saved/favorited workspaces
CREATE TABLE IF NOT EXISTS public.saved_workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, workspace_id)
);

-- Indexes for common access patterns
CREATE INDEX IF NOT EXISTS idx_saved_workspaces_user_id ON public.saved_workspaces (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_workspaces_workspace_id ON public.saved_workspaces (workspace_id);

-- Enable RLS
ALTER TABLE public.saved_workspaces ENABLE ROW LEVEL SECURITY;

-- Policies: users can manage their own saved items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='saved_workspaces' AND policyname='Users can view their saved workspaces'
  ) THEN
    CREATE POLICY "Users can view their saved workspaces"
    ON public.saved_workspaces
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='saved_workspaces' AND policyname='Users can save a workspace'
  ) THEN
    CREATE POLICY "Users can save a workspace"
    ON public.saved_workspaces
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='saved_workspaces' AND policyname='Users can unsave their saved workspaces'
  ) THEN
    CREATE POLICY "Users can unsave their saved workspaces"
    ON public.saved_workspaces
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;