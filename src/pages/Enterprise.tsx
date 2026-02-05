import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Building2, 
  Users, 
  MapPin, 
  TrendingDown, 
  Shield, 
  Clock, 
  Briefcase,
  Calculator,
  CheckCircle,
  Phone,
  Mail,
  ArrowRight
} from "lucide-react";
import heroEnterpriseImg from "@/assets/hero-coworking.jpg";
import trustpilotLogo from "@/assets/trustpilot-logo.svg";
import googleLogo from "@/assets/google-logo.svg";
import { DiscoverSpacesSlideshow } from "@/components/DiscoverSpacesSlideshow";

const enterpriseSolutions = [
  { title: "Managed Offices", description: "Fully customized offices managed end-to-end" },
  { title: "Multi-Office Portfolio", description: "Satellite offices across multiple locations" },
  { title: "BCP Solutions", description: "Business Continuity Planning workspace solutions" },
  { title: "Flexible Coworking", description: "Scalable coworking spaces for teams" },
  { title: "HyperFlex", description: "On-demand day passes and meeting rooms" },
];

const whyItMatters = [
  { icon: TrendingDown, title: "Cost Rationalisation", description: "Save up to 40% on real estate costs" },
  { icon: Shield, title: "Risk Mitigation", description: "Reduce long-term lease commitments" },
  { icon: Building2, title: "Flexible Workspace", description: "Scale up or down as needed" },
  { icon: Users, title: "Talent Retention", description: "Offer workspace flexibility to employees" },
  { icon: Clock, title: "Commute Efficiency", description: "Reduce employee commute times" },
];

const stats = [
  { value: "500+", label: "Seat Closures Monthly" },
  { value: "200+", label: "Satisfied Companies" },
  { value: "50+", label: "Cities Covered" },
  { value: "3500+", label: "Partner Centers" },
  { value: "25+", label: "Years Team Experience" },
];

const Enterprise = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    number_of_employees: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const full_name = formData.full_name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!full_name || !email || !phone) {
      toast.error("Please fill Full Name, Email and Phone.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("enquiries").insert({
      full_name,
      company: formData.company.trim() || null,
      email,
      phone,
      number_of_employees: formData.number_of_employees.trim() || null,
      message: formData.message.trim() || null,
      // keep workspace-specific fields empty for enterprise page
      city: null,
      workspace_type: null,
      seats: null,
      workspace_name: null,
    });

    setIsSubmitting(false);

    if (error) {
      console.error("Enterprise enquiry submission error:", error);
      toast.error("Failed to submit enquiry. Please try again.");
      return;
    }

    toast.success("Enquiry submitted successfully! Our team will contact you soon.");
    setFormData({
      full_name: "",
      company: "",
      email: "",
      phone: "",
      number_of_employees: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroEnterpriseImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Explore the <span className="text-primary">Hybrid Workspaces</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                An office portfolio which your team would love
              </p>
              <Button size="lg" className="text-lg px-8">
                Let's Talk
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <Card className="bg-card/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-10 h-10 text-primary" />
                    <h3 className="text-xl font-bold">Enterprise Solutions</h3>
                  </div>
                  <ul className="space-y-3">
                    {enterpriseSolutions.map((solution, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {solution.title}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Customer Satisfaction is our priority</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-card rounded-xl shadow-card px-6 py-4 flex items-center gap-3">
              <img src={googleLogo} alt="Google" className="h-8 w-auto" />
              <div>
                <p className="font-semibold text-foreground">Google</p>
                <p className="text-sm text-muted-foreground">4.5/5 Rating</p>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-card px-6 py-4 flex items-center gap-3">
              <img src={trustpilotLogo} alt="Trustpilot" className="h-6 w-auto" />
              <div>
                <p className="font-semibold text-foreground">Trustpilot</p>
                <p className="text-sm text-muted-foreground">4.8/5 Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hybrid Workspaces */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">Hybrid</span> Workspaces
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              A hybrid workplace model balances Office and Remote Working (WFH/WFA) depending on the team and work structure. The goal is to balance the team's needs while maintaining productivity and increasing engagement levels.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">How it used to be</h3>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Building2 className="w-8 h-8 text-muted-foreground/50" />
                  <div>
                    <p className="font-medium">Centralized Office</p>
                    <p className="text-sm">One Office Strategy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">How it is innovated</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">Decentralized Office</p>
                      <p className="text-sm">Multi-Office Portfolio</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Users className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">Flexible Offices</p>
                      <p className="text-sm">Coworking & BCP</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">On-demand Office</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Briefcase className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">HyperFlex</p>
                      <p className="text-sm">Day Pass for Enterprise</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-medium">Meeting Rooms</p>
                      <p className="text-sm">On the go</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why it is Important */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why it is <span className="text-primary">Important</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyItMatters.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workspace Strategy Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Workspace <span className="text-primary">Strategy Tools</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              We have designed free workspace analyzing tools to help enterprises evaluate their workspace requirements. Our tools help you structure the optimal workspaces.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="overflow-hidden group hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">CalQ: The CRE Calculator</h3>
                <p className="text-muted-foreground mb-6">
                  The most advanced Commercial Real Estate calculator to compare traditional office costs with flexible workspace solutions.
                </p>
                <p className="text-2xl font-bold text-primary mb-4">
                  Enterprises save up to 40%
                </p>
                <Link to="/calq">
                  <Button className="w-full">
                    Calculate Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Team Behaviour Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  An ultimate questionnaire to understand your team's preferences and optimize workspace allocation accordingly.
                </p>
                <p className="text-lg font-medium text-muted-foreground mb-4">
                  Coming Soon
                </p>
                <Button variant="outline" className="w-full" disabled>
                  Start Survey
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Ashtech Stats */}
      <section className="py-16 gradient-hero text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Ashtech?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              One platform to discover, evaluate, book, manage and pay for all your workspace needs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Spaces Slideshow */}
      <DiscoverSpacesSlideshow />

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Contact <span className="text-primary">Us</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Drop us a line, our team will contact you to discuss your enterprise workspace requirements.
              </p>
              
              <div className="space-y-4">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input
                          placeholder="Your name"
                          value={formData.full_name}
                          onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company</label>
                        <Input
                          placeholder="Company name"
                          value={formData.company}
                          onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email *</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Phone *</label>
                        <Input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Number of Employees</label>
                      <Input
                        placeholder="e.g., 50"
                        value={formData.number_of_employees}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, number_of_employees: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea
                        placeholder="Tell us about your workspace requirements..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      />
                    </div>
                    <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                      {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Enterprise;
