import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ServiceOption {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  price: number;
  price_unit: string;
  capacity: string | null;
  action_label: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

interface Workspace {
  id: string;
  name: string;
  location: string;
}

const iconOptions = ["Building2", "Users", "Clock", "Calendar", "Briefcase", "Home"];
const actionLabels = ["Book Now", "Schedule Visit", "Enquire Now", "Get Quote"];
const priceUnits = ["month", "day", "hour", "seat"];

export const ServiceOptionsManager = () => {
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [editingOption, setEditingOption] = useState<ServiceOption | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<ServiceOption>>({
    name: "",
    description: "",
    price: 0,
    price_unit: "month",
    capacity: "",
    action_label: "Book Now",
    icon: "Building2",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchServiceOptions(selectedWorkspace);
    }
  }, [selectedWorkspace]);

  const fetchWorkspaces = async () => {
    const { data, error } = await supabase
      .from("workspaces")
      .select("id, name, location")
      .order("name");
    
    if (error) {
      toast.error("Failed to fetch workspaces");
      return;
    }
    
    setWorkspaces(data || []);
    setLoading(false);
  };

  const fetchServiceOptions = async (workspaceId: string) => {
    const { data, error } = await supabase
      .from("workspace_service_options")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("display_order");
    
    if (error) {
      toast.error("Failed to fetch service options");
      return;
    }
    
    setServiceOptions(data || []);
  };

  const openNewDialog = () => {
    if (!selectedWorkspace) {
      toast.error("Please select a workspace first");
      return;
    }
    setEditingOption(null);
    setFormData({
      workspace_id: selectedWorkspace,
      name: "",
      description: "",
      price: 0,
      price_unit: "month",
      capacity: "",
      action_label: "Book Now",
      icon: "Building2",
      display_order: serviceOptions.length,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (option: ServiceOption) => {
    setEditingOption(option);
    setFormData(option);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingOption) {
      const { error } = await supabase
        .from("workspace_service_options")
        .update({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          price_unit: formData.price_unit,
          capacity: formData.capacity,
          action_label: formData.action_label,
          icon: formData.icon,
          display_order: formData.display_order,
          is_active: formData.is_active,
        })
        .eq("id", editingOption.id);

      if (error) {
        toast.error("Failed to update service option");
        return;
      }
      toast.success("Service option updated successfully");
    } else {
      const { error } = await supabase
        .from("workspace_service_options")
        .insert({
          workspace_id: selectedWorkspace,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          price_unit: formData.price_unit,
          capacity: formData.capacity,
          action_label: formData.action_label,
          icon: formData.icon,
          display_order: formData.display_order,
          is_active: formData.is_active,
        });

      if (error) {
        toast.error("Failed to create service option");
        return;
      }
      toast.success("Service option added successfully");
    }
    
    setIsDialogOpen(false);
    fetchServiceOptions(selectedWorkspace);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("workspace_service_options")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete service option");
      return;
    }
    
    toast.success("Service option deleted");
    fetchServiceOptions(selectedWorkspace);
  };

  const handleToggleActive = async (option: ServiceOption) => {
    const { error } = await supabase
      .from("workspace_service_options")
      .update({ is_active: !option.is_active })
      .eq("id", option.id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }
    
    fetchServiceOptions(selectedWorkspace);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Service Options Management</CardTitle>
          <CardDescription>Manage service options for each workspace (Private Office, Day Pass, etc.)</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="coral" onClick={openNewDialog} disabled={!selectedWorkspace}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service Option
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingOption ? "Edit Service Option" : "Add New Service Option"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input 
                  value={formData.name || ""} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="e.g., Private Office, Day Pass"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description || ""} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Enter each benefit on a new line"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price *</Label>
                  <Input 
                    type="number"
                    value={formData.price || 0} 
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} 
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price Unit</Label>
                  <Select 
                    value={formData.price_unit} 
                    onValueChange={(v) => setFormData({ ...formData, price_unit: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceUnits.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Capacity (e.g., "1-5 Seater", "13 Seater")</Label>
                <Input 
                  value={formData.capacity || ""} 
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} 
                  placeholder="e.g., 1-5 Seater"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Action Label</Label>
                  <Select 
                    value={formData.action_label} 
                    onValueChange={(v) => setFormData({ ...formData, action_label: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {actionLabels.map(label => (
                        <SelectItem key={label} value={label}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input 
                    type="number"
                    value={formData.display_order || 0} 
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} 
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch 
                  checked={formData.is_active} 
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button variant="coral" onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label>Select Workspace</Label>
          <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
            <SelectTrigger className="w-full max-w-md mt-2">
              <SelectValue placeholder="Choose a workspace to manage service options" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map(ws => (
                <SelectItem key={ws.id} value={ws.id}>
                  {ws.name} - {ws.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedWorkspace && serviceOptions.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No service options added yet. Click "Add Service Option" to create one.
          </p>
        )}

        {serviceOptions.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Action Label</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceOptions.map((option) => (
                <TableRow key={option.id}>
                  <TableCell className="font-medium">{option.name}</TableCell>
                  <TableCell>₹{option.price.toLocaleString()} / {option.price_unit}</TableCell>
                  <TableCell>{option.capacity || "-"}</TableCell>
                  <TableCell>{option.action_label}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={option.is_active}
                      onCheckedChange={() => handleToggleActive(option)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(option)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(option.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
