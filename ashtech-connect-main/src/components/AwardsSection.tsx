import { motion } from "framer-motion";
import { useSiteData, getIconComponent } from "@/contexts/SiteDataContext";

export const AwardsSection = () => {
  const { data } = useSiteData();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Featured In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">
            We got featured
          </h3>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {data.pressLogos.map((logo) => (
              <div
                key={logo.id}
                className="px-6 py-3 bg-muted rounded-lg text-muted-foreground font-semibold"
              >
                {logo.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Awards & <span className="text-primary">Recognition</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.awards.map((award, index) => {
            const IconComponent = getIconComponent(award.icon);
            return (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                  <IconComponent className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{award.title}</h3>
                <p className="text-sm text-muted-foreground">{award.issuer}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
