import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HeartOff, Loader2, MapPin } from "lucide-react";

interface SavedWorkspaceRow {
  id: string;
  created_at: string;
  workspace: {
    id: string;
    name: string;
    location: string;
    image_url: string | null;
  } | null;
}

export const SavedWorkspacesContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<SavedWorkspaceRow[]>([]);

  const fetchSaved = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_workspaces")
        .select(
          `
          id,
          created_at,
          workspace:workspaces(id, name, location, image_url)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems((data || []) as any);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to load saved workspaces",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleUnsave = async (workspaceId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("saved_workspaces")
        .delete()
        .eq("user_id", user.id)
        .eq("workspace_id", workspaceId);
      if (error) throw error;
      setItems((prev) => prev.filter((r) => r.workspace?.id !== workspaceId));
    } catch {
      toast({
        title: "Error",
        description: "Could not remove saved workspace",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <HeartOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg mb-2">No saved workspaces</h3>
        <p className="text-muted-foreground mb-4">Tap the heart on any workspace to save it here.</p>
        <Button onClick={() => navigate("/")}>Browse Workspaces</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((row) => {
        const ws = row.workspace;
        if (!ws) return null;
        return (
          <div key={row.id} className="flex gap-4 p-4 border rounded-lg">
            <button
              type="button"
              className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0"
              onClick={() => navigate(`/workspace/${ws.id}`)}
            >
              {ws.image_url ? (
                <img
                  src={ws.image_url}
                  alt={ws.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </button>

            <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  className="font-semibold truncate text-left hover:underline block"
                  onClick={() => navigate(`/workspace/${ws.id}`)}
                >
                  {ws.name}
                </button>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {ws.location}
                </p>
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                onClick={() => handleUnsave(ws.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const SavedWorkspacesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Workspaces</CardTitle>
        <CardDescription>Your favorite workspaces for quick access.</CardDescription>
      </CardHeader>
      <CardContent>
        <SavedWorkspacesContent />
      </CardContent>
    </Card>
  );
};
