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
import { Pencil, Trash2, Eye, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const workspaceTypes = [
  "Coworking Space", "Private Office", "Meeting Room", 
  "Training Room", "Virtual Office", "Day Office", "Serviced Office"
];

const seatOptions = ["1-5", "6-10", "11-20", "21-50", "51-100", "100+"];
const employeeOptions = ["1-10", "11-50", "51-100", "101-500", "500+"];

// All 5 statuses as requested
const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "process", label: "Process" },
  { value: "confirmed", label: "Confirmed" },
  { value: "complete", label: "Complete" },
  { value: "cancelled", label: "Cancelled" },
];

interface Enquiry {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
  phone: string;
  number_of_employees: string | null;
  city: string | null;
  workspace_type: string | null;
  seats: string | null;
  message: string | null;
  workspace_name: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  process: "default",
  confirmed: "default",
  complete: "outline",
  cancelled: "destructive",
};

export const EnquiriesManager = () => {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    number_of_employees: "",
    city: "",
    workspace_type: "",
    seats: "",
    message: "",
    status: "pending",
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-enquiries", {
        method: "POST",
        body: {},
      });

      if (error) {
        console.error("Error fetching enquiries:", error);
        toast({ title: "Error", description: "Failed to fetch enquiries", variant: "destructive" });
      } else if (data) {
        setEnquiries(data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const handleView = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsViewOpen(true);
  };

  const handleEdit = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setEditForm({
      full_name: enquiry.full_name,
      company: enquiry.company || "",
      email: enquiry.email,
      phone: enquiry.phone,
      number_of_employees: enquiry.number_of_employees || "",
      city: enquiry.city || "",
      workspace_type: enquiry.workspace_type || "",
      seats: enquiry.seats || "",
      message: enquiry.message || "",
      status: enquiry.status,
    });
    setIsEditOpen(true);
  };

  const handleDelete = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEnquiry) return;

    try {
      const { error } = await supabase.functions.invoke("admin-enquiries", {
        method: "POST",
        body: { action: "delete", enquiryId: selectedEnquiry.id },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to delete enquiry", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Enquiry deleted successfully" });
        fetchEnquiries();
      }
    } catch (err) {
      console.error("Error:", err);
      toast({ title: "Error", description: "Failed to delete enquiry", variant: "destructive" });
    }
    setIsDeleteOpen(false);
    setSelectedEnquiry(null);
  };

  const saveEdit = async () => {
    if (!selectedEnquiry) return;

    try {
      const { error } = await supabase.functions.invoke("admin-enquiries", {
        method: "POST",
        body: {
          action: "update",
          enquiryId: selectedEnquiry.id,
          data: {
            full_name: editForm.full_name,
            company: editForm.company || null,
            email: editForm.email,
            phone: editForm.phone,
            number_of_employees: editForm.number_of_employees || null,
            city: editForm.city || null,
            workspace_type: editForm.workspace_type || null,
            seats: editForm.seats || null,
            message: editForm.message || null,
            status: editForm.status,
          },
        },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to update enquiry", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Enquiry updated successfully" });
        fetchEnquiries();
      }
    } catch (err) {
      console.error("Error:", err);
      toast({ title: "Error", description: "Failed to update enquiry", variant: "destructive" });
    }
    setIsEditOpen(false);
    setSelectedEnquiry(null);
  };

  const updateStatus = async (enquiryId: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke("admin-enquiries", {
        method: "POST",
        body: { enquiryId, status },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Status updated" });
        fetchEnquiries();
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
            <MessageSquare className="w-5 h-5" />
            Workspace Enquiries
          </CardTitle>
          <CardDescription>View and manage all workspace enquiry submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No enquiries submitted yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.map((enquiry) => (
                    <TableRow key={enquiry.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{enquiry.full_name}</p>
                          <p className="text-sm text-muted-foreground">{enquiry.email}</p>
                          <p className="text-sm text-muted-foreground">{enquiry.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{enquiry.company || "-"}</TableCell>
                      <TableCell>
                        <div>
                          {enquiry.workspace_name && (
                            <p className="font-medium text-primary text-sm">{enquiry.workspace_name}</p>
                          )}
                          <p className="text-sm">{enquiry.workspace_type || "-"}</p>
                          {enquiry.city && <p className="text-xs text-muted-foreground">{enquiry.city}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{enquiry.number_of_employees || enquiry.seats || "-"}</TableCell>
                      <TableCell>
                        <Select 
                          value={enquiry.status} 
                          onValueChange={(v) => updateStatus(enquiry.id, v)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <Badge variant={statusColors[enquiry.status] || "secondary"} className="capitalize">
                              {enquiry.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(enquiry.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(enquiry)}
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(enquiry)}
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(enquiry)}
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
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>Full details of the submitted enquiry</DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Full Name</Label>
                  <p className="font-medium">{selectedEnquiry.full_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <Badge variant={statusColors[selectedEnquiry.status]} className="capitalize mt-1">
                    {selectedEnquiry.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Company</Label>
                  <p>{selectedEnquiry.company || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p>{selectedEnquiry.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <p>{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Number of Employees</Label>
                  <p>{selectedEnquiry.number_of_employees || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">City</Label>
                  <p>{selectedEnquiry.city || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Workspace Type</Label>
                  <p>{selectedEnquiry.workspace_type || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Seats Required</Label>
                  <p>{selectedEnquiry.seats || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Submitted On</Label>
                  <p>{format(new Date(selectedEnquiry.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>
              {selectedEnquiry.workspace_name && (
                <div>
                  <Label className="text-muted-foreground text-xs">Workspace Enquired</Label>
                  <p className="mt-1 p-2 bg-primary/10 rounded-md text-sm font-medium text-primary">
                    {selectedEnquiry.workspace_name}
                  </p>
                </div>
              )}
              {selectedEnquiry.message && (
                <div>
                  <Label className="text-muted-foreground text-xs">Message</Label>
                  <p className="mt-1 p-3 bg-muted rounded-md text-sm">{selectedEnquiry.message}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Enquiry</DialogTitle>
            <DialogDescription>Update the enquiry details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-full_name">Full Name</Label>
                <Input
                  id="edit-full_name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={editForm.company}
                  onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                />
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
                <Label htmlFor="edit-employees">Number of Employees</Label>
                <Select value={editForm.number_of_employees} onValueChange={(v) => setEditForm({ ...editForm, number_of_employees: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-workspace-type">Workspace Type</Label>
                <Select value={editForm.workspace_type} onValueChange={(v) => setEditForm({ ...editForm, workspace_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectContent>
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
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Enquiry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this enquiry from {selectedEnquiry?.full_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
