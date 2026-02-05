import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building, RefreshCw, Users2, Laptop, MapPin, GitBranch, ArrowRight } from "lucide-react";

const features = [
  { icon: Building, title: "Managed Offices" },
  { icon: RefreshCw, title: "Business Continuity" },
  { icon: Users2, title: "Enterprise Coworking" },
  { icon: Laptop, title: "Hybrid Solutions" },
  { icon: MapPin, title: "Multi City Offices" },
  { icon: GitBranch, title: "Hub and Spoke" },
];

export const EnterpriseSection = () => {
  return (
    <section id="enterprise" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-br from-foreground to-foreground/90 rounded-3xl p-8 lg:p-12 text-primary-foreground">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground/90 px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Ashtech Enterprise Solutions
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">
                Core Features
              </h2>
              
              <p className="text-primary-foreground/80 text-lg">
                Single contact solution for all your office requirements
              </p>

              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="coral" 
                  size="lg" 
                  className="gap-2"
                >
                  Explore Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  See how it works?
                </Button>
              </div>
            </motion.div>

            {/* Right - Features Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-primary-foreground/20 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-sm font-medium text-primary-foreground/90">{feature.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
