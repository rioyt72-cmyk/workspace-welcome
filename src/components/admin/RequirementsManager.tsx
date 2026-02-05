import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Eye, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Same options as ShareRequirement page
const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Ahmedabad", "Gurugram", "Noida"
];

const workspaceTypes = [
  "Coworking Space", "Private Office", "Meeting Room", 
  "Training Room", "Virtual Office", "Day Office"
];

const seatOptions = ["1-5", "6-10", "11-25", "26-50", "51-100", "100+"];

interface Requirement {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  workspace_type: string | null;
  seats: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  complete: "outline",
};

export const RequirementsManager = () => {
  const { toast } = useToast();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    workspace_type: "",
    seats: "",
    message: "",
    status: "pending",
  });

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-requirements", {
        method: "POST",
        body: {},
      });

      if (error) {
        console.error("Error fetching requirements:", error);
        toast({ title: "Error", description: "Failed to fetch requirements", variant: "destructive" });
      } else if (data) {
        setRequirements(data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const handleView = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsViewOpen(true);
  };

  const handleEdit = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setEditForm({
      name: requirement.name,
      email: requirement.email,
      phone: requirement.phone,
      city: requirement.city,
      workspace_type: requirement.workspace_type || "",
      seats: requirement.seats || "",
      message: requirement.message || "",
      status: requirement.status,
    });
    setIsEditOpen(true);
  };

  const handleDelete = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRequirement) return;

    try {
      const { error } = await supabase.functions.invoke("admin-requirements", {
        method: "POST",
        body: { action: "delete", requirementId: selectedRequirement.id },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to delete requirement", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Requirement deleted successfully" });
        fetchRequirements();
      }
    } catch (err) {
      console.error("Error:", err);
      toast({ title: "Error", description: "Failed to delete requirement", variant: "destructive" });
    }
    setIsDeleteOpen(false);
    setSelectedRequirement(null);
  };

  const saveEdit = async () => {
    if (!selectedRequirement) return;

    try {
      const { error } = await supabase.functions.invoke("admin-requirements", {
        method: "POST",
        body: {
          action: "update",
          requirementId: selectedRequirement.id,
          data: {
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            city: editForm.city,
            workspace_type: editForm.workspace_type || null,
            seats: editForm.seats || null,
            message: editForm.message || null,
            status: editForm.status,
          },
        },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to update requirement", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Requirement updated successfully" });
        fetchRequirements();
      }
    } catch (err) {
      console.error("Error:", err);
      toast({ title: "Error", description: "Failed to update requirement", variant: "destructive" });
    }
    setIsEditOpen(false);
    setSelectedRequirement(null);
  };

  const updateStatus = async (requirementId: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke("admin-requirements", {
        method: "POST",
        body: { requirementId, status },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Status updated" });
        fetchRequirements();
      }
    } catch (err) {
      console.error("Error:", err);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Share Requirements
          </CardTitle>
          <CardDescription>View and manage all workspace requirement submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : requirements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No requirements submitted yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Workspace Type</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements.map((requirement) => (
                    <TableRow key={requirement.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{requirement.name}</p>
                          <p className="text-sm text-muted-foreground">{requirement.email}</p>
                          <p className="text-sm text-muted-foreground">{requirement.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {requirement.city}
                        </div>
                      </TableCell>
                      <TableCell>{requirement.workspace_type || "-"}</TableCell>
                      <TableCell>{requirement.seats || "-"}</TableCell>
                      <TableCell>
                        <Select 
                          value={requirement.status} 
                          onValueChange={(v) => updateStatus(requirement.id, v)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <Badge variant={statusColors[requirement.status] || "secondary"} className="capitalize">
                              {requirement.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(requirement.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(requirement)}
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(requirement)}
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(requirement)}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Requirement Details</DialogTitle>
            <DialogDescription>Full details of the submitted requirement</DialogDescription>
          </DialogHeader>
          {selectedRequirement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Name</Label>
                  <p className="font-medium">{selectedRequirement.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <Badge variant={statusColors[selectedRequirement.status]} className="capitalize mt-1">
                    {selectedRequirement.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p>{selectedRequirement.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <p>{selectedRequirement.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">City</Label>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedRequirement.city}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Workspace Type</Label>
                  <p>{selectedRequirement.workspace_type || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Seats Required</Label>
                  <p>{selectedRequirement.seats || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Submitted On</Label>
                  <p>{format(new Date(selectedRequirement.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>
              {selectedRequirement.message && (
                <div>
                  <Label className="text-muted-foreground text-xs">Message</Label>
                  <p className="mt-1 p-3 bg-muted rounded-md text-sm">{selectedRequirement.message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Requirement</DialogTitle>
            <DialogDescription>Update the requirement details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City / Location</Label>
                <Select value={editForm.city} onValueChange={(v) => setEditForm({ ...editForm, city: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-workspace-type">Workspace Type</Label>
                <Select value={editForm.workspace_type} onValueChange={(v) => setEditForm({ ...editForm, workspace_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    {workspaceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-seats">Seats</Label>
                <Select value={editForm.seats} onValueChange={(v) => setEditForm({ ...editForm, seats: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select No." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border shadow-md z-50">
                    {seatOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-message">Message</Label>
              <Textarea
                id="edit-message"
                value={editForm.message}
                onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Requirement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this requirement from {selectedRequirement?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
