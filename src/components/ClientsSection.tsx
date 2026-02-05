import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useSiteData } from "@/contexts/SiteDataContext";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

// Default client logos
const defaultClients = [
  { id: "1", name: "Bank Of Baroda", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Bank_of_Baroda_logo.svg/200px-Bank_of_Baroda_logo.svg.png" },
  { id: "2", name: "Coleman", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/200px-Tata_logo.svg.png" },
  { id: "3", name: "Car Dekho", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/New_Airtel_logo.svg/200px-New_Airtel_logo.svg.png" },
  { id: "4", name: "College Dekho", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png" },
  { id: "5", name: "Crisil", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/200px-HDFC_Bank_Logo.svg.png" },
  { id: "6", name: "Infosys", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png" },
  { id: "7", name: "Wipro", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png" },
  { id: "8", name: "TCS", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png" },
];

// Wave pattern heights for staggered curved effect
const getCardStyle = (index: number) => {
  const pattern = [
    { height: 140, marginTop: 60 },
    { height: 160, marginTop: 40 },
    { height: 190, marginTop: 10 },
    { height: 160, marginTop: 40 },
    { height: 140, marginTop: 60 },
  ];
  return pattern[index % 5];
};

export const ClientsSection = () => {
  const { data } = useSiteData();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Merge database clients with defaults
  const clients = useMemo(() => {
    const dbClients = data.clients || [];
    if (dbClients.length === 0) return defaultClients;
    return dbClients.map((client, idx) => ({
      ...client,
      logoUrl: client.logoUrl || defaultClients[idx % defaultClients.length]?.logoUrl
    }));
  }, [data.clients]);

  // Triple the clients for seamless infinite loop
  const infiniteClients = useMemo(() => [...clients, ...clients, ...clients], [clients]);

  // Continuous scroll animation
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = 145; // Card width with no gap
    const totalWidth = clients.length * cardWidth;
    let position = 0;

    const animate = () => {
      position -= 1; // Smooth pixel movement
      if (Math.abs(position) >= totalWidth) {
        position = 0; // Reset seamlessly
      }
      if (container) {
        container.style.transform = `translateX(${position}px)`;
      }
    };

    const interval = setInterval(animate, 20); // Smooth 50fps animation

    return () => clearInterval(interval);
  }, [clients.length]);

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            You Are In Great Company
          </h2>
          <p className="text-muted-foreground text-lg">
            From startups to enterprises, we have assisted organizations across for them to find their ideal workspace.
          </p>
        </motion.div>

        {/* Continuous Curved Cards Carousel */}
        <div className="relative overflow-hidden mb-12">
          <div className="flex justify-center">
            <div 
              ref={scrollRef}
              className="flex items-end"
              style={{ willChange: 'transform' }}
            >
              {infiniteClients.map((client, idx) => {
                const style = getCardStyle(idx);
                return (
                  <div
                    key={`${client.id}-${idx}`}
                    className="flex-shrink-0"
                    style={{ 
                      marginTop: style.marginTop,
                      marginLeft: idx === 0 ? 0 : -1, // Overlap cards slightly
                    }}
                  >
                    <Card 
                      className="w-36 flex flex-col items-center justify-between py-5 px-3 bg-card border border-border/40 shadow-sm"
                      style={{ 
                        height: style.height,
                        borderRadius: '16px',
                      }}
                    >
                      <div className="flex-1 flex items-center justify-center">
                        {client.logoUrl ? (
                          <img 
                            src={client.logoUrl} 
                            alt={client.name} 
                            className="max-w-[70px] max-h-[45px] object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="text-xl font-bold text-primary">
                            {client.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground text-center mt-auto leading-tight">
                        {client.name}
                      </p>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Card className="px-10 py-5 flex items-center gap-5 border border-border rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-foreground">Trustpilot</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              ))}
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-muted-foreground font-medium">4.8/5</span>
          </Card>
          
          <Card className="px-10 py-5 flex items-center gap-5 border border-border rounded-xl">
            <span className="text-2xl font-medium tracking-tight">
              <span className="text-[hsl(217,89%,61%)]">G</span>
              <span className="text-[hsl(4,90%,58%)]">o</span>
              <span className="text-[hsl(43,96%,56%)]">o</span>
              <span className="text-[hsl(217,89%,61%)]">g</span>
              <span className="text-[hsl(142,76%,36%)]">l</span>
              <span className="text-[hsl(4,90%,58%)]">e</span>
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              ))}
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-muted-foreground font-medium">4/5</span>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};