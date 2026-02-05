 import { useState, useEffect } from "react";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Plus, Pencil, Trash2 } from "lucide-react";
 import { toast } from "sonner";
 import { supabase } from "@/integrations/supabase/client";
 
 interface WorkspaceType {
   id: string;
   value: string;
   label: string;
   icon: string | null;
   display_order: number | null;
   is_active: boolean | null;
 }
 
 export const WorkspaceTypesManager = () => {
   const [types, setTypes] = useState<WorkspaceType[]>([]);
   const [editingType, setEditingType] = useState<WorkspaceType | null>(null);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [loading, setLoading] = useState(true);
   const [formData, setFormData] = useState({
     value: "",
     label: "",
     icon: "Building2",
     display_order: 0,
     is_active: true,
   });
 
   useEffect(() => {
     fetchTypes();
   }, []);
 
   const fetchTypes = async () => {
     const { data, error } = await supabase
       .from("workspace_types")
       .select("*")
       .order("display_order");
     
     if (error) {
       toast.error("Failed to fetch workspace types");
       return;
     }
     
     setTypes(data || []);
     setLoading(false);
   };
 
   const openNewDialog = () => {
     setEditingType(null);
     setFormData({
       value: "",
       label: "",
       icon: "Building2",
       display_order: types.length,
       is_active: true,
     });
     setIsDialogOpen(true);
   };
 
   const openEditDialog = (type: WorkspaceType) => {
     setEditingType(type);
     setFormData({
       value: type.value,
       label: type.label,
       icon: type.icon || "Building2",
       display_order: type.display_order || 0,
       is_active: type.is_active ?? true,
     });
     setIsDialogOpen(true);
   };
 
   const handleSave = async () => {
     if (!formData.value || !formData.label) {
       toast.error("Please fill in value and label");
       return;
     }
 
     // Convert label to snake_case for value if not provided
     const valueToUse = formData.value || formData.label.toLowerCase().replace(/\s+/g, "_");
 
     if (editingType) {
       const { error } = await supabase
         .from("workspace_types")
         .update({
           value: valueToUse,
           label: formData.label,
           icon: formData.icon,
           display_order: formData.display_order,
           is_active: formData.is_active,
         })
         .eq("id", editingType.id);
 
       if (error) {
         toast.error("Failed to update workspace type");
         return;
       }
       toast.success("Workspace type updated");
     } else {
       const { error } = await supabase
         .from("workspace_types")
         .insert({
           value: valueToUse,
           label: formData.label,
           icon: formData.icon,
           display_order: formData.display_order,
           is_active: formData.is_active,
         });
 
       if (error) {
         if (error.code === "23505") {
           toast.error("A type with this value already exists");
         } else {
           toast.error("Failed to add workspace type");
         }
         return;
       }
       toast.success("Workspace type added");
     }
     
     setIsDialogOpen(false);
     fetchTypes();
   };
 
   const handleDelete = async (id: string) => {
     const { error } = await supabase
       .from("workspace_types")
       .delete()
       .eq("id", id);
 
     if (error) {
       toast.error("Failed to delete workspace type");
       return;
     }
     
     toast.success("Workspace type deleted");
     fetchTypes();
   };
 
   const handleToggleActive = async (type: WorkspaceType) => {
     const { error } = await supabase
       .from("workspace_types")
       .update({ is_active: !type.is_active })
       .eq("id", type.id);
 
     if (error) {
       toast.error("Failed to update status");
       return;
     }
     
     fetchTypes();
   };
 
   if (loading) {
     return <div>Loading...</div>;
   }
 
   return (
     <Card>
       <CardHeader className="flex flex-row items-center justify-between">
         <div>
           <CardTitle>Workspace Types</CardTitle>
           <CardDescription>Manage workspace categories (Coworking, Meeting Room, etc.)</CardDescription>
         </div>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <DialogTrigger asChild>
             <Button variant="coral" onClick={openNewDialog}>
               <Plus className="w-4 h-4 mr-2" />
               Add Type
             </Button>
           </DialogTrigger>
           <DialogContent className="max-w-md">
             <DialogHeader>
               <DialogTitle>{editingType ? "Edit Workspace Type" : "Add New Workspace Type"}</DialogTitle>
             </DialogHeader>
             <div className="space-y-4 pt-4">
               <div className="space-y-2">
                 <Label>Label (Display Name) *</Label>
                 <Input 
                   value={formData.label} 
                   onChange={(e) => setFormData({ ...formData, label: e.target.value })} 
                   placeholder="e.g., Meeting Room"
                 />
               </div>
               <div className="space-y-2">
                 <Label>Value (System ID) *</Label>
                 <Input 
                   value={formData.value} 
                   onChange={(e) => setFormData({ ...formData, value: e.target.value })} 
                   placeholder="e.g., meeting_room"
                 />
                 <p className="text-xs text-muted-foreground">Use lowercase with underscores (auto-generated from label if empty)</p>
               </div>
               <div className="space-y-2">
                 <Label>Display Order</Label>
                 <Input 
                   type="number"
                   value={formData.display_order} 
                   onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} 
                 />
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
         {types.length === 0 ? (
           <p className="text-muted-foreground text-center py-8">
             No workspace types added yet.
           </p>
         ) : (
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Label</TableHead>
                 <TableHead>Value</TableHead>
                 <TableHead>Order</TableHead>
                 <TableHead>Status</TableHead>
                 <TableHead className="text-right">Actions</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {types.map((type) => (
                 <TableRow key={type.id}>
                   <TableCell className="font-medium">{type.label}</TableCell>
                   <TableCell className="text-muted-foreground">{type.value}</TableCell>
                   <TableCell>{type.display_order}</TableCell>
                   <TableCell>
                     <Switch 
                       checked={type.is_active ?? true}
                       onCheckedChange={() => handleToggleActive(type)}
                     />
                   </TableCell>
                   <TableCell className="text-right">
                     <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" onClick={() => openEditDialog(type)}>
                         <Pencil className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)}>
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