import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Tag, Gift, Percent, Zap } from "lucide-react";

interface SpecialOffer {
  id: string;
  title: string;
  description: string | null;
  badge_text: string;
  discount_value: string | null;
  expiry_date: string | null;
  gradient_from: string;
  gradient_to: string;
  icon: string;
  cta_label: string;
  is_active: boolean;
  display_order: number;
  coupon_code: string | null;
}

const iconOptions = [
  { value: "Tag", label: "Tag", icon: Tag },
  { value: "Gift", label: "Gift", icon: Gift },
  { value: "Percent", label: "Percent", icon: Percent },
  { value: "Zap", label: "Zap", icon: Zap },
];

const gradientPresets = [
  { name: "Orange to Red", from: "#f97316", to: "#ef4444" },
  { name: "Green to Teal", from: "#10b981", to: "#14b8a6" },
  { name: "Blue to Purple", from: "#3b82f6", to: "#8b5cf6" },
  { name: "Pink to Rose", from: "#ec4899", to: "#f43f5e" },
  { name: "Yellow to Orange", from: "#eab308", to: "#f97316" },
];

const emptyForm: Omit<SpecialOffer, "id"> = {
  title: "",
  description: "",
  badge_text: "LIMITED TIME",
  discount_value: "",
  expiry_date: "",
  gradient_from: "#f97316",
  gradient_to: "#ef4444",
  icon: "Tag",
  cta_label: "Claim Now",
  is_active: true,
  display_order: 0,
  coupon_code: "",
};

export const SpecialOffersManager = () => {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from("special_offers")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setOffers(data || []);
    } catch (e) {
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenDialog = (offer?: SpecialOffer) => {
    if (offer) {
      setEditingOffer(offer);
      setForm({
        title: offer.title,
        description: offer.description || "",
        badge_text: offer.badge_text,
        discount_value: offer.discount_value || "",
        expiry_date: offer.expiry_date || "",
        gradient_from: offer.gradient_from,
        gradient_to: offer.gradient_to,
        icon: offer.icon,
        cta_label: offer.cta_label,
        is_active: offer.is_active,
        display_order: offer.display_order,
        coupon_code: offer.coupon_code || "",
      });
    } else {
      setEditingOffer(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        description: form.description || null,
        discount_value: form.discount_value || null,
        expiry_date: form.expiry_date || null,
        coupon_code: form.coupon_code || null,
      };

      if (editingOffer) {
        const { error } = await supabase
          .from("special_offers")
          .update(payload)
          .eq("id", editingOffer.id);
        if (error) throw error;
        toast.success("Offer updated");
      } else {
        const { error } = await supabase.from("special_offers").insert(payload);
        if (error) throw error;
        toast.success("Offer created");
      }

      setDialogOpen(false);
      fetchOffers();
    } catch (e) {
      toast.error("Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const { error } = await supabase.from("special_offers").delete().eq("id", id);
      if (error) throw error;
      toast.success("Offer deleted");
      fetchOffers();
    } catch (e) {
      toast.error("Failed to delete offer");
    }
  };

  const handleToggleActive = async (offer: SpecialOffer) => {
    try {
      const { error } = await supabase
        .from("special_offers")
        .update({ is_active: !offer.is_active })
        .eq("id", offer.id);
      if (error) throw error;
      fetchOffers();
    } catch (e) {
      toast.error("Failed to update offer");
    }
  };

  const applyGradientPreset = (preset: typeof gradientPresets[0]) => {
    setForm((prev) => ({
      ...prev,
      gradient_from: preset.from,
      gradient_to: preset.to,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Special Offers</CardTitle>
          <CardDescription>Manage promotional offers displayed on the website</CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOffer ? "Edit Offer" : "Create Offer"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="50% Off First Booking"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">Badge Text</Label>
                  <Input
                    id="badge"
                    value={form.badge_text}
                    onChange={(e) => setForm((p) => ({ ...p, badge_text: e.target.value }))}
                    placeholder="LIMITED TIME"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="New users only. Valid for hot desks and meeting rooms."
                  rows={3}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Value</Label>
                  <Input
                    id="discount"
                    value={form.discount_value || ""}
                    onChange={(e) => setForm((p) => ({ ...p, discount_value: e.target.value }))}
                    placeholder="50% or ₹500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <Input
                    id="coupon"
                    value={form.coupon_code || ""}
                    onChange={(e) => setForm((p) => ({ ...p, coupon_code: e.target.value.toUpperCase() }))}
                    placeholder="SAVE50"
                    className="font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={form.expiry_date || ""}
                  onChange={(e) => setForm((p) => ({ ...p, expiry_date: e.target.value }))}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={form.icon}
                    onValueChange={(v) => setForm((p) => ({ ...p, icon: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon className="w-4 h-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta">Button Label</Label>
                  <Input
                    id="cta"
                    value={form.cta_label}
                    onChange={(e) => setForm((p) => ({ ...p, cta_label: e.target.value }))}
                    placeholder="Claim Now"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gradient Colors</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className="h-8 w-16 rounded-md border-2 border-transparent hover:border-primary transition-colors"
                      style={{
                        background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                      }}
                      onClick={() => applyGradientPreset(preset)}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="gradient_from" className="whitespace-nowrap">From:</Label>
                    <Input
                      id="gradient_from"
                      type="color"
                      value={form.gradient_from}
                      onChange={(e) => setForm((p) => ({ ...p, gradient_from: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={form.gradient_from}
                      onChange={(e) => setForm((p) => ({ ...p, gradient_from: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="gradient_to" className="whitespace-nowrap">To:</Label>
                    <Input
                      id="gradient_to"
                      type="color"
                      value={form.gradient_to}
                      onChange={(e) => setForm((p) => ({ ...p, gradient_to: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={form.gradient_to}
                      onChange={(e) => setForm((p) => ({ ...p, gradient_to: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div
                  className="rounded-xl p-5 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${form.gradient_from}, ${form.gradient_to})`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const IconComp = iconOptions.find((i) => i.value === form.icon)?.icon || Tag;
                      return <IconComp className="w-5 h-5" />;
                    })()}
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                      {form.badge_text || "OFFER"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{form.title || "Offer Title"}</h3>
                  {form.description && (
                    <p className="text-white/80 text-sm mt-1">{form.description}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="active"
                    checked={form.is_active}
                    onCheckedChange={(c) => setForm((p) => ({ ...p, is_active: c }))}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingOffer ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {offers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No offers yet. Create your first promotional offer.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Offer</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{
                          background: `linear-gradient(135deg, ${offer.gradient_from}, ${offer.gradient_to})`,
                        }}
                      >
                        {(() => {
                          const IconComp = iconOptions.find((i) => i.value === offer.icon)?.icon || Tag;
                          return <IconComp className="w-5 h-5" />;
                        })()}
                      </div>
                      <div>
                        <p className="font-medium">{offer.title}</p>
                        {offer.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {offer.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{offer.badge_text}</Badge>
                  </TableCell>
                  <TableCell>
                    {offer.expiry_date || <span className="text-muted-foreground">No expiry</span>}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={offer.is_active}
                      onCheckedChange={() => handleToggleActive(offer)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(offer)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(offer.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
