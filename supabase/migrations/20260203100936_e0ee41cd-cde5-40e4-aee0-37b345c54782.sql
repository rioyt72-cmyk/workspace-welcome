-- Fix saved_workspaces relationships + prevent duplicates
DO $$
BEGIN
  -- Ensure required columns exist (safe guards)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='saved_workspaces' AND column_name='workspace_id'
  ) THEN
    ALTER TABLE public.saved_workspaces ADD COLUMN workspace_id uuid;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='saved_workspaces' AND column_name='user_id'
  ) THEN
    ALTER TABLE public.saved_workspaces ADD COLUMN user_id uuid;
  END IF;
END $$;

-- Add FK so we can join saved_workspaces -> workspaces in queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'saved_workspaces_workspace_id_fkey'
  ) THEN
    ALTER TABLE public.saved_workspaces
      ADD CONSTRAINT saved_workspaces_workspace_id_fkey
      FOREIGN KEY (workspace_id)
      REFERENCES public.workspaces(id)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Prevent duplicate saves per user/workspace (required for upsert onConflict)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'saved_workspaces_user_workspace_unique'
  ) THEN
    ALTER TABLE public.saved_workspaces
      ADD CONSTRAINT saved_workspaces_user_workspace_unique
      UNIQUE (user_id, workspace_id);
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_saved_workspaces_user_id ON public.saved_workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_workspaces_workspace_id ON public.saved_workspaces(workspace_id);