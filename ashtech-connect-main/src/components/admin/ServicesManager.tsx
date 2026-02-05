import { useState } from "react";
import { useSiteData, Service } from "@/contexts/SiteDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const iconOptions = ["Users", "Building2", "Globe", "Video", "GraduationCap", "CalendarDays"];

export const ServicesManager = () => {
  const { data, updateServices } = useSiteData();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({});

  const openNewDialog = () => {
    setEditingService(null);
    setFormData({ icon: "Building2", title: "", description: "", image: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingService) {
      const updated = data.services.map(s => 
        s.id === editingService.id ? { ...s, ...formData } : s
      );
      updateServices(updated);
      toast.success("Service updated successfully");
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        icon: formData.icon || "Building2",
        title: formData.title || "",
        description: formData.description || "",
        image: formData.image || "",
      };
      updateServices([...data.services, newService]);
      toast.success("Service added successfully");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    updateServices(data.services.filter(s => s.id !== id));
    toast.success("Service deleted");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Services Management</CardTitle>
          <CardDescription>Manage your workspace service offerings</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="coral" onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(icon => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input 
                  value={formData.title || ""} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="Service title"
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea 
                  value={formData.description || ""} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Service description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input 
                  value={formData.image || ""} 
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                  placeholder="https://example.com/image.jpg"
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.icon}</TableCell>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate">{service.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
