import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Star, Users, Building2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const workspaceTypes = [
  "Coworking Space", "Private Office", "Meeting Room", 
  "Training Room", "Virtual Office", "Day Office"
];

const seatOptions = ["1-5", "6-10", "11-25", "26-50", "51-100", "100+"];

const stats = [
  { icon: MapPin, value: "120+", label: "Cities" },
  { icon: Users, value: "500+", label: "Corporates Served" },
  { icon: Building2, value: "10,000+", label: "Centers" },
];

const services = [
  { name: "Co-working Spaces", description: "Dedicated seats and cabins in vibrant co-working spaces." },
  { name: "Serviced Offices", description: "Ready-to-use or furnished offices tailored for large teams." },
  { name: "Private Offices", description: "Secure and personalized office spaces for individual teams." },
  { name: "Virtual Offices", description: "GST and business registration for new businesses." },
  { name: "Meeting Rooms", description: "Spaces for business meetings, conferences, and training." },
  { name: "Training Rooms", description: "Flexible, tech-enabled spaces for corporate events & trainings." },
];

const ShareRequirement = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    workspaceType: "",
    seats: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch locations from locations table
  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase
        .from("locations")
        .select("city")
        .eq("is_active", true)
        .order("city", { ascending: true });
      
      if (data) {
        const uniqueCities = [...new Set(data.map((l) => l.city))];
        setLocations(uniqueCities);
      }
    };
    fetchLocations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("requirements").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        workspace_type: formData.workspaceType || null,
        seats: formData.seats || null,
        message: formData.message || null,
      });

      if (error) throw error;

      toast({
        title: "Requirement Submitted!",
        description: "Our team will get back to you within 24 hours.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: "",
        workspaceType: "",
        seats: "",
        message: "",
      });
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Dark accent bar like reference */}
      <div className="h-12 bg-foreground mt-16 lg:mt-20" />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-muted/50 to-background py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Describe Your Needs
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  From startups to enterprises, we find the perfect workspace for you.
                </p>

                {/* Contact Info */}
                <div className="space-y-4 mb-8">
                  <p className="text-sm text-muted-foreground">Need any help?</p>
                  <a 
                    href="mailto:sales@ashtech.com" 
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    sales@ashtech.com
                  </a>
                  <a 
                    href="tel:+919876543210" 
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    +91 9876543210
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl p-4 text-center border border-border"
                    >
                      <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 border border-border">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="font-semibold">Trustpilot</span>
                    <span className="text-muted-foreground">4.8/5</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 border border-border">
                    <span className="font-bold text-foreground">Google</span>
                    <span className="text-muted-foreground ml-2">4/5</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl p-6 lg:p-8 border border-border shadow-lg"
              >
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Connect With Our Experts
                </h2>
                <p className="text-sm text-primary mb-6">*Marked fields are mandatory</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>City *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => setFormData({ ...formData, city: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-md z-50">
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Workspace Type</Label>
                      <Select
                        value={formData.workspaceType}
                        onValueChange={(value) => setFormData({ ...formData, workspaceType: value })}
                      >
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

                    <div>
                      <Label>Seats</Label>
                      <Select
                        value={formData.seats}
                        onValueChange={(value) => setFormData({ ...formData, seats: value })}
                      >
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

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Write here..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <motion.a
                  key={service.name}
                  href="#"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 ml-4">
                    <ArrowRight className="w-5 h-5 text-primary-foreground" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <p className="text-center text-muted-foreground mb-8">Trusted by 120+ Clients</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {["PhonePe", "Netcore", "Nagarro", "Avaya", "Amazon", "Hero", "CRISIL"].map((client) => (
                <span key={client} className="text-xl font-bold text-muted-foreground">
                  {client}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ShareRequirement;
