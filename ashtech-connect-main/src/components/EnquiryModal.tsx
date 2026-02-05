import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, Mail, ArrowRight } from "lucide-react";

interface EnquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName?: string;
  workspaceType?: string;
  city?: string;
}

const workspaceTypes = [
  { value: "coworking", label: "Coworking Space" },
  { value: "serviced_office", label: "Serviced Office" },
  { value: "private_office", label: "Private Office" },
  { value: "meeting_room", label: "Meeting Room" },
  { value: "training_room", label: "Training Room" },
  { value: "virtual_office", label: "Virtual Office" },
  { value: "day_office", label: "Day Office" },
];

const seatOptions = ["1-5", "6-10", "11-20", "21-50", "51-100", "100+"];
const employeeOptions = ["1-10", "11-50", "51-100", "101-500", "500+"];

export const EnquiryModal = ({ 
  open, 
  onOpenChange, 
  workspaceName,
  workspaceType,
  city 
}: EnquiryModalProps) => {
  const [locations, setLocations] = useState<{ id: string; city: string; state: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    number_of_employees: "",
    city: "",
    workspace_type: "",
    seats: "",
    message: "",
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        city: city || prev.city,
        workspace_type: workspaceType || prev.workspace_type,
        message: workspaceName ? `Enquiry for: ${workspaceName}` : prev.message,
      }));
    }
  }, [open, city, workspaceType, workspaceName]);

  const fetchLocations = async () => {
    const { data } = await supabase
      .from("locations")
      .select("id, city, state")
      .eq("is_active", true);
    if (data) setLocations(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Insert into the separate enquiries table
    const { error } = await supabase.from("enquiries").insert({
      full_name: formData.full_name,
      company: formData.company || null,
      email: formData.email,
      phone: formData.phone,
      number_of_employees: formData.number_of_employees || null,
      city: formData.city || null,
      workspace_type: formData.workspace_type || null,
      seats: formData.seats || null,
      message: formData.message || null,
      workspace_name: workspaceName || null,
    });

    setIsSubmitting(false);

    if (error) {
      console.error("Enquiry submission error:", error);
      toast.error("Failed to submit enquiry. Please try again.");
    } else {
      toast.success("Enquiry submitted successfully! Our team will contact you soon.");
      setFormData({
        full_name: "",
        company: "",
        email: "",
        phone: "",
        number_of_employees: "",
        city: "",
        workspace_type: "",
        seats: "",
        message: "",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Gradient Top Bar */}
        <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
        
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Side - Contact Info */}
          <div className="p-8 bg-background">
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-3xl font-bold">
                Contact <span className="text-primary">Us</span>
              </DialogTitle>
              <p className="text-muted-foreground mt-2">
                Drop us a line, our team will contact you to discuss your enterprise workspace requirements.
              </p>
            </DialogHeader>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-muted-foreground">+91 9876543210</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-muted-foreground">enterprise@ashtech.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 bg-card border-l">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Full Name + Company */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    placeholder="Your name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Company name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2: Email + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Row 3: Number of Employees + City */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number_of_employees">Number of Employees</Label>
                  <Select
                    value={formData.number_of_employees}
                    onValueChange={(v) => setFormData({ ...formData, number_of_employees: v })}
                  >
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
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(v) => setFormData({ ...formData, city: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
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
              </div>

              {/* Row 4: Workspace Type + Seats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workspace_type">Workspace Type</Label>
                  <Select
                    value={formData.workspace_type}
                    onValueChange={(v) => setFormData({ ...formData, workspace_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
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
                <div className="space-y-2">
                  <Label htmlFor="seats">Seats Required</Label>
                  <Select
                    value={formData.seats}
                    onValueChange={(v) => setFormData({ ...formData, seats: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select No." />
                    </SelectTrigger>
                    <SelectContent>
                      {seatOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your requirements here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
