import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface WorkspaceType {
  value: string;
  label: string;
}

const nearbyCategories = [
  { key: "metro", label: "Metro" },
  { key: "bus_station", label: "Bus Station" },
  { key: "train_station", label: "Train Station" },
  { key: "parking", label: "Parking" },
  { key: "atm", label: "ATM" },
  { key: "hospital", label: "Hospital" },
  { key: "petrol_pump", label: "Petrol Pump" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace | null;
  locations: Location[];
  onSuccess: () => void;
}

export const WorkspaceFormDialog = ({ open, onOpenChange, workspace, locations, onSuccess }: Props) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  
  // Fetch workspace types from database
  const { data: workspaceTypes = [] } = useQuery({
    queryKey: ["workspace-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_types")
        .select("value, label")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as WorkspaceType[];
    },
  });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    address: "",
    facilities: "",
    amount_per_month: "",
    capacity: "1",
    image_url: "",
    workspace_type: "coworking",
    latitude: "",
    longitude: "",
    landmark: "",
  });

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryImage, setNewGalleryImage] = useState("");

  const [timings, setTimings] = useState({
    weekdays: "9:00 am - 8:00 pm",
    saturday: "9:00 am - 8:00 pm",
    sunday: "Closed",
  });

  const [nearby, setNearby] = useState<{
    [key: string]: { name: string; distance: string }[];
  }>({
    metro: [],
    bus_station: [],
    train_station: [],
    parking: [],
    atm: [],
    hospital: [],
    petrol_pump: [],
  });

  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name,
        description: workspace.description || "",
        location: workspace.location,
        address: workspace.address || "",
        facilities: workspace.facilities.join(", "),
        amount_per_month: workspace.amount_per_month.toString(),
        capacity: workspace.capacity.toString(),
        image_url: workspace.image_url || "",
        workspace_type: workspace.workspace_type,
        latitude: workspace.latitude?.toString() || "",
        longitude: workspace.longitude?.toString() || "",
        landmark: (workspace as any).landmark || "",
      });

      setGalleryImages((workspace as any).gallery_images || []);

      if (workspace.timings) {
        setTimings(workspace.timings);
      }

      if (workspace.nearby) {
        setNearby(workspace.nearby);
      }
    } else {
      resetForm();
    }
  }, [workspace, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      address: "",
      facilities: "",
      amount_per_month: "",
      capacity: "1",
      image_url: "",
      workspace_type: "coworking",
      latitude: "",
      longitude: "",
      landmark: "",
    });
    setGalleryImages([]);
    setNewGalleryImage("");
    setTimings({
      weekdays: "9:00 am - 8:00 pm",
      saturday: "9:00 am - 8:00 pm",
      sunday: "Closed",
    });
    setNearby({
      metro: [],
      bus_station: [],
      train_station: [],
      parking: [],
      atm: [],
      hospital: [],
      petrol_pump: [],
    });
    setActiveTab("basic");
  };

  const handleAddGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setGalleryImages([...galleryImages, newGalleryImage.trim()]);
      setNewGalleryImage("");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleAddNearbyItem = (category: string) => {
    setNearby((prev) => ({
      ...prev,
      [category]: [...prev[category], { name: "", distance: "" }],
    }));
  };

  const handleRemoveNearbyItem = (category: string, index: number) => {
    setNearby((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleNearbyChange = (category: string, index: number, field: "name" | "distance", value: string) => {
    setNearby((prev) => ({
      ...prev,
      [category]: prev[category].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const workspaceData = {
      name: formData.name,
      description: formData.description || null,
      location: formData.location,
      address: formData.address || null,
      facilities: formData.facilities.split(",").map((f) => f.trim()).filter(Boolean),
      amount_per_month: parseFloat(formData.amount_per_month),
      capacity: parseInt(formData.capacity),
      image_url: formData.image_url || null,
      workspace_type: formData.workspace_type,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      landmark: formData.landmark || null,
      gallery_images: galleryImages,
      timings,
      nearby,
    };

    let error;
    if (workspace) {
      ({ error } = await supabase
        .from("workspaces")
        .update(workspaceData)
        .eq("id", workspace.id));
    } else {
      ({ error } = await supabase.from("workspaces").insert(workspaceData));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Workspace ${workspace ? "updated" : "added"} successfully` });
      onOpenChange(false);
      resetForm();
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { onOpenChange(isOpen); if (!isOpen) resetForm(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{workspace ? "Edit" : "Add"} Workspace</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="timings">Timings</TabsTrigger>
              <TabsTrigger value="nearby">What's Nearby</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspace_type">Type *</Label>
                  <Select
                    value={formData.workspace_type}
                    onValueChange={(v) => setFormData({ ...formData, workspace_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workspaceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount per Month (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount_per_month}
                    onChange={(e) => setFormData({ ...formData, amount_per_month: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Available Seats *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Number of seats available for booking</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilities">Facilities (comma-separated)</Label>
                <Input
                  id="facilities"
                  value={formData.facilities}
                  onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                  placeholder="WiFi, AC, Parking, Coffee"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Main Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={newGalleryImage}
                    onChange={(e) => setNewGalleryImage(e.target.value)}
                    placeholder="Enter image URL and click Add"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleAddGalleryImage}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-20 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveGalleryImage(idx)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Add multiple photos to display in the gallery slider.
                </p>
              </div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">City/Location *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(v) => setFormData({ ...formData, location: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={`${loc.city}, ${loc.state}`}>
                          {loc.city}, {loc.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark (e.g., Near Balaji Towers)</Label>
                <Input
                  id="landmark"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="Near Balaji Towers"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="e.g., 12.9716"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="e.g., 77.5946"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter latitude and longitude to show the workspace location on a map.
              </p>
            </TabsContent>

            {/* Timings Tab */}
            <TabsContent value="timings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Operating Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weekdays">Monday - Friday</Label>
                    <Input
                      id="weekdays"
                      value={timings.weekdays}
                      onChange={(e) => setTimings({ ...timings, weekdays: e.target.value })}
                      placeholder="9:00 am - 8:00 pm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saturday">Saturday</Label>
                    <Input
                      id="saturday"
                      value={timings.saturday}
                      onChange={(e) => setTimings({ ...timings, saturday: e.target.value })}
                      placeholder="9:00 am - 8:00 pm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sunday">Sunday</Label>
                    <Input
                      id="sunday"
                      value={timings.sunday}
                      onChange={(e) => setTimings({ ...timings, sunday: e.target.value })}
                      placeholder="Closed"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* What's Nearby Tab */}
            <TabsContent value="nearby" className="space-y-4 mt-4">
              {nearbyCategories.map((category) => (
                <Card key={category.key}>
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{category.label}</CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddNearbyItem(category.key)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {nearby[category.key]?.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No {category.label.toLowerCase()} added yet.</p>
                    ) : (
                      nearby[category.key]?.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="Name (e.g., MG Road Metro)"
                            value={item.name}
                            onChange={(e) => handleNearbyChange(category.key, index, "name", e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Distance (e.g., 1.5 Kms)"
                            value={item.distance}
                            onChange={(e) => handleNearbyChange(category.key, index, "distance", e.target.value)}
                            className="w-32"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveNearbyItem(category.key, index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {workspace ? "Update" : "Add"} Workspace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
