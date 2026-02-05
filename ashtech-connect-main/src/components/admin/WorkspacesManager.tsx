import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkspaceFormDialog } from "./WorkspaceFormDialog";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address: string | null;
  facilities: string[];
  amount_per_month: number;
  capacity: number;
  image_url: string | null;
  workspace_type: string;
  is_active: boolean;
  timings: { weekdays: string; saturday: string; sunday: string } | null;
  nearby: {
    metro: { name: string; distance: string }[];
    bus_station: { name: string; distance: string }[];
    train_station: { name: string; distance: string }[];
    parking: { name: string; distance: string }[];
    atm: { name: string; distance: string }[];
    hospital: { name: string; distance: string }[];
    petrol_pump: { name: string; distance: string }[];
  } | null;
  latitude: number | null;
  longitude: number | null;
}

interface Location {
  id: string;
  state: string;
  city: string;
}

export const WorkspacesManager = () => {
  const { toast } = useToast();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    fetchWorkspaces();
    fetchLocations();
  }, []);

  const fetchWorkspaces = async () => {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Parse JSON fields for each workspace
      const parsedWorkspaces = data.map((ws) => ({
        ...ws,
        facilities: ws.facilities || [],
        timings: ws.timings ? (typeof ws.timings === 'string' ? JSON.parse(ws.timings) : ws.timings) : null,
        nearby: ws.nearby ? (typeof ws.nearby === 'string' ? JSON.parse(ws.nearby) : ws.nearby) : null,
      }));
      setWorkspaces(parsedWorkspaces);
    }
    setLoading(false);
  };

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from("locations")
      .select("id, state, city")
      .eq("is_active", true)
      .order("state", { ascending: true });

    if (!error && data) {
      setLocations(data);
    }
  };

  const handleEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workspace?")) return;

    const { error } = await supabase.from("workspaces").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Workspace deleted successfully" });
      fetchWorkspaces();
    }
  };

  const toggleActive = async (workspace: Workspace) => {
    const { error } = await supabase
      .from("workspaces")
      .update({ is_active: !workspace.is_active })
      .eq("id", workspace.id);

    if (!error) {
      fetchWorkspaces();
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingWorkspace(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Workspaces</CardTitle>
            <CardDescription>Manage workspace listings with location, timings, and nearby places</CardDescription>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Workspace
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : workspaces.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No workspaces yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((workspace) => (
                  <TableRow key={workspace.id}>
                    <TableCell className="font-medium">{workspace.name}</TableCell>
                    <TableCell>{workspace.location}</TableCell>
                    <TableCell className="capitalize">{workspace.workspace_type.replace('_', ' ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {workspace.amount_per_month.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={workspace.is_active ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleActive(workspace)}
                      >
                        {workspace.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(workspace)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(workspace.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <WorkspaceFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        workspace={editingWorkspace}
        locations={locations}
        onSuccess={fetchWorkspaces}
      />
    </>
  );
};
