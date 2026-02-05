import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Client-side helper for saving/unsaving workspaces for the current user.
 * Keeps a local Set of saved workspace IDs.
 */
export const useSavedWorkspaces = () => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_workspaces")
        .select("workspace_id")
        .eq("user_id", user.id);

      if (error) throw error;

      setSavedIds(new Set((data || []).map((r) => r.workspace_id)));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isSaved = useCallback(
    (workspaceId: string) => savedIds.has(workspaceId),
    [savedIds]
  );

  const toggleSaved = useCallback(
    async (workspaceId: string) => {
      if (!user) return { ok: false as const, reason: "no_user" as const };

      const next = !savedIds.has(workspaceId);

      // optimistic UI
      setSavedIds((prev) => {
        const copy = new Set(prev);
        if (next) copy.add(workspaceId);
        else copy.delete(workspaceId);
        return copy;
      });

      try {
        if (next) {
          const { error } = await supabase
            .from("saved_workspaces")
            .upsert(
              { user_id: user.id, workspace_id: workspaceId },
              { onConflict: "user_id,workspace_id" }
            );
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("saved_workspaces")
            .delete()
            .eq("user_id", user.id)
            .eq("workspace_id", workspaceId);
          if (error) throw error;
        }
        return { ok: true as const, saved: next };
      } catch (e) {
        // rollback
        setSavedIds((prev) => {
          const copy = new Set(prev);
          if (next) copy.delete(workspaceId);
          else copy.add(workspaceId);
          return copy;
        });
        return { ok: false as const, reason: "error" as const };
      }
    },
    [savedIds, user]
  );

  return useMemo(
    () => ({ savedIds, isSaved, toggleSaved, refresh, loading, user }),
    [savedIds, isSaved, toggleSaved, refresh, loading, user]
  );
};
