import { useState } from "react";
import { useSiteData, AwardItem } from "@/contexts/SiteDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const iconOptions = ["Trophy", "Award", "Star"];

export const AwardsManager = () => {
  const { data, updateAwards } = useSiteData();
  const [editingAward, setEditingAward] = useState<AwardItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<AwardItem>>({});

  const openNewDialog = () => {
    setEditingAward(null);
    setFormData({ icon: "Trophy", title: "", issuer: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (award: AwardItem) => {
    setEditingAward(award);
    setFormData(award);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.issuer) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingAward) {
      const updated = data.awards.map(a => 
        a.id === editingAward.id ? { ...a, ...formData } : a
      );
      updateAwards(updated);
      toast.success("Award updated successfully");
    } else {
      const newAward: AwardItem = {
        id: Date.now().toString(),
        icon: formData.icon || "Trophy",
        title: formData.title || "",
        issuer: formData.issuer || "",
      };
      updateAwards([...data.awards, newAward]);
      toast.success("Award added successfully");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    updateAwards(data.awards.filter(a => a.id !== id));
    toast.success("Award deleted");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Awards Management</CardTitle>
          <CardDescription>Manage awards and recognition</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="coral" onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Award
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAward ? "Edit Award" : "Add New Award"}</DialogTitle>
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
                <Label>Award Title *</Label>
                <Input 
                  value={formData.title || ""} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="Award title"
                />
              </div>
              <div className="space-y-2">
                <Label>Issuer *</Label>
                <Input 
                  value={formData.issuer || ""} 
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })} 
                  placeholder="e.g., By Realty+ (2024)"
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
              <TableHead className="hidden md:table-cell">Issuer</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.awards.map((award) => (
              <TableRow key={award.id}>
                <TableCell>{award.icon}</TableCell>
                <TableCell className="font-medium">{award.title}</TableCell>
                <TableCell className="hidden md:table-cell">{award.issuer}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(award)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(award.id)}>
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
