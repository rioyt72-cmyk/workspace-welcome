import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteData, getIconComponent } from "@/contexts/SiteDataContext";
import { useNavigate } from "react-router-dom";

const serviceTypeMap: Record<string, string> = {
  "Co-working Spaces": "coworking",
  "Coworking Spaces": "coworking",
  "Serviced Offices": "serviced_office",
  "Serviced Office": "serviced_office",
  "Private Offices": "private_office",
  "Private Office": "private_office",
  "Virtual Offices": "virtual_office",
  "Virtual Office": "virtual_office",
  "Meeting Rooms": "meeting_room",
  "Meeting Room": "meeting_room",
  "Training Rooms": "training_room",
  "Training Room": "training_room",
  "Day Office": "day_office",
};

export const ServicesSection = () => {
  const { data } = useSiteData();
  const navigate = useNavigate();

  const handleServiceClick = (serviceTitle: string) => {
    const type = serviceTypeMap[serviceTitle] || "coworking";
    navigate(`/services/${type}`);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Ultimate office space solutions for{" "}
            <span className="text-primary">You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Maximize your team's productivity with an inspiring and premium workspace.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <motion.div
                key={service.id}
                onClick={() => handleServiceClick(service.title)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{service.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
