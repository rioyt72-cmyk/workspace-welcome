import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Building2, Users, Target, Award, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Building2, value: "10,000+", label: "Workspace Centers" },
  { icon: Users, value: "500+", label: "Corporates Served" },
  { icon: MapPin, value: "120+", label: "Cities Covered" },
  { icon: Clock, value: "24/7", label: "Support Available" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To democratize access to premium workspaces, making flexible office solutions available to businesses of all sizes across India."
  },
  {
    icon: Award,
    title: "Our Vision",
    description: "To become India's most trusted workspace marketplace, connecting millions of professionals with their ideal work environment."
  },
  {
    icon: Users,
    title: "Our Values",
    description: "We believe in transparency, innovation, and putting our customers first. Every decision we make is guided by what's best for our community."
  },
];

const AboutUs = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen bg-background ${isMobile ? "pb-20" : ""}`}>
      {isMobile ? <MobileHeader /> : <Header />}
      
      <main>
        {/* Hero Section */}
        <section className={cn("bg-gradient-to-br from-primary/10 to-background py-16 lg:py-24", isMobile && "pt-24")}>
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                About Aztech Coworks
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Aztech Coworks is India's largest and fastest-growing flexible workspace marketplace. 
                We enable corporates and occupiers with ready-to-move-in and flexible workspaces at a Pan India level.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 text-center border border-border"
                >
                  <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                  <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Story</h2>
                <div className="prose prose-lg max-w-none text-muted-foreground">
                  <p className="mb-4">
                    Founded with a vision to transform how India works, Aztech Coworks started as a small team 
                    passionate about creating better workspaces for everyone. Today, we've grown into the 
                    country's most comprehensive workspace marketplace.
                  </p>
                  <p className="mb-4">
                    We understand that every business is unique, which is why we offer a diverse range of 
                    workspace solutions – from vibrant coworking spaces to private offices, meeting rooms, 
                    and virtual office services.
                  </p>
                  <p>
                    Our platform connects businesses with verified workspace providers, ensuring quality, 
                    transparency, and the best deals. We're not just about finding a desk – we're about 
                    finding the right environment where your business can thrive.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">What Drives Us</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <value.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default AboutUs;
