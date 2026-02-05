import { useState } from "react";
import { useSiteData, Client, PressLogo } from "@/contexts/SiteDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const ClientsManager = () => {
  const { data, updateClients, updatePressLogos } = useSiteData();
  
  // Clients state
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [clientFormData, setClientFormData] = useState<Partial<Client>>({});
  
  // Press logos state
  const [editingPress, setEditingPress] = useState<PressLogo | null>(null);
  const [isPressDialogOpen, setIsPressDialogOpen] = useState(false);
  const [pressFormData, setPressFormData] = useState<Partial<PressLogo>>({});

  // Clients handlers
  const openNewClientDialog = () => {
    setEditingClient(null);
    setClientFormData({ name: "" });
    setIsClientDialogOpen(true);
  };

  const openEditClientDialog = (client: Client) => {
    setEditingClient(client);
    setClientFormData(client);
    setIsClientDialogOpen(true);
  };

  const handleSaveClient = () => {
    if (!clientFormData.name) {
      toast.error("Please enter a client name");
      return;
    }

    if (editingClient) {
      const updated = data.clients.map(c => 
        c.id === editingClient.id ? { ...c, ...clientFormData } : c
      );
      updateClients(updated);
      toast.success("Client updated successfully");
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        name: clientFormData.name || "",
        logoUrl: clientFormData.logoUrl || "",
      };
      updateClients([...data.clients, newClient]);
      toast.success("Client added successfully");
    }
    setIsClientDialogOpen(false);
  };

  const handleDeleteClient = (id: string) => {
    updateClients(data.clients.filter(c => c.id !== id));
    toast.success("Client deleted");
  };

  // Press logos handlers
  const openNewPressDialog = () => {
    setEditingPress(null);
    setPressFormData({ name: "" });
    setIsPressDialogOpen(true);
  };

  const openEditPressDialog = (press: PressLogo) => {
    setEditingPress(press);
    setPressFormData(press);
    setIsPressDialogOpen(true);
  };

  const handleSavePress = () => {
    if (!pressFormData.name) {
      toast.error("Please enter a press name");
      return;
    }

    if (editingPress) {
      const updated = data.pressLogos.map(p => 
        p.id === editingPress.id ? { ...p, ...pressFormData } : p
      );
      updatePressLogos(updated);
      toast.success("Press logo updated successfully");
    } else {
      const newPress: PressLogo = {
        id: Date.now().toString(),
        name: pressFormData.name || "",
      };
      updatePressLogos([...data.pressLogos, newPress]);
      toast.success("Press logo added successfully");
    }
    setIsPressDialogOpen(false);
  };

  const handleDeletePress = (id: string) => {
    updatePressLogos(data.pressLogos.filter(p => p.id !== id));
    toast.success("Press logo deleted");
  };

  return (
    <div className="space-y-6">
      {/* Clients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Clients Management</CardTitle>
            <CardDescription>Manage client logos and names</CardDescription>
          </div>
          <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="coral" onClick={openNewClientDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Client Name *</Label>
                  <Input 
                    value={clientFormData.name || ""} 
                    onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })} 
                    placeholder="e.g., Tata Group"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input 
                    value={clientFormData.logoUrl || ""} 
                    onChange={(e) => setClientFormData({ ...clientFormData, logoUrl: e.target.value })} 
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsClientDialogOpen(false)}>Cancel</Button>
                  <Button variant="coral" onClick={handleSaveClient}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    {client.logoUrl ? (
                      <img src={client.logoUrl} alt={client.name} className="w-16 h-10 object-contain" />
                    ) : (
                      <span className="text-muted-foreground text-sm">No logo</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditClientDialog(client)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
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

      {/* Press Logos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Press & Media</CardTitle>
            <CardDescription>Manage featured press logos</CardDescription>
          </div>
          <Dialog open={isPressDialogOpen} onOpenChange={setIsPressDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="coral" onClick={openNewPressDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Press
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPress ? "Edit Press Logo" : "Add New Press Logo"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Press Name *</Label>
                  <Input 
                    value={pressFormData.name || ""} 
                    onChange={(e) => setPressFormData({ ...pressFormData, name: e.target.value })} 
                    placeholder="e.g., Forbes India"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsPressDialogOpen(false)}>Cancel</Button>
                  <Button variant="coral" onClick={handleSavePress}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Press Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pressLogos.map((press) => (
                <TableRow key={press.id}>
                  <TableCell className="font-medium">{press.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditPressDialog(press)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePress(press.id)}>
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
    </div>
  );
};
