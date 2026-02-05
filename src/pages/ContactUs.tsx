import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 9876543210", "+91 9876543211"],
    action: "tel:+919876543210"
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@aztechcoworks.com", "sales@aztechcoworks.com"],
    action: "mailto:info@aztechcoworks.com"
  },
  {
    icon: MapPin,
    title: "Head Office",
    details: ["123 Business Hub, Sector 44", "Gurgaon, Haryana 122003"],
    action: null
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Monday - Friday: 9AM - 7PM", "Saturday: 10AM - 5PM"],
    action: null
  },
];

const ContactUs = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className={`min-h-screen bg-background ${isMobile ? "pb-20" : ""}`}>
      {isMobile ? <MobileHeader /> : <Header />}
      
      <main>
        {/* Hero Section */}
        <section className={cn("bg-gradient-to-br from-primary/10 to-background py-16 lg:py-20", isMobile && "pt-24")}>
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Get In Touch
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-8">Contact Information</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl p-5 border border-border"
                    >
                      <info.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        info.action ? (
                          <a
                            key={i}
                            href={info.action}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {detail}
                          </a>
                        ) : (
                          <p key={i} className="text-sm text-muted-foreground">{detail}</p>
                        )
                      ))}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default ContactUs;
