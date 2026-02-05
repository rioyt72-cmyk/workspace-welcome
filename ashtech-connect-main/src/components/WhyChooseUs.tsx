import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, BadgePercent, Gift } from "lucide-react";
import teamImage from "@/assets/team-collaboration.jpg";

const benefits = [
  {
    icon: Search,
    title: "Wide selection of workspaces",
    description: "Ashtech does the heavy lifting and aggregates all the available options. Based on your requirements, it gives you the best fit so you do not have to worry about searching manually.",
  },
  {
    icon: Sparkles,
    title: "Customized solutions",
    description: "One shoe does not fit all and at Ashtech, whatever your requirement be, we can customize based on that and provide you with your perfect match.",
  },
  {
    icon: BadgePercent,
    title: "Best rates and deal terms",
    description: "Ashtech does the negotiation on your behalf and gives you the best possible rates and deal terms. Whether you are a startup or an enterprise, we got you covered.",
  },
  {
    icon: Gift,
    title: "Zero brokerage",
    description: "The best part about Ashtech, it won't cost you a dime. Our services are completely free for workspace seekers.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl" />
            <img
              src={teamImage}
              alt="Team collaboration"
              className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why choose{" "}
                <span className="text-primary">Ashtech?</span>
              </h2>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="coral" size="lg">
              Explore Now
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
