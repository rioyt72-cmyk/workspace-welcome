import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

export const ServicesCarousel = () => {
  const { data } = useSiteData();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleServiceClick = (serviceTitle: string) => {
    const type = serviceTypeMap[serviceTitle] || "coworking";
    navigate(`/services/${type}`);
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            The Ultimate office space solutions for{" "}
            <span className="text-primary">You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Maximize your team's productivity with an inspiring and premium workspace.
          </p>
        </motion.div>

        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors -ml-4"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}

          {/* Carousel Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {data.services.map((service, index) => {
              const IconComponent = getIconComponent(service.icon);
              return (
                <motion.div
                  key={service.id}
                  onClick={() => handleServiceClick(service.title)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex-shrink-0 w-[280px] bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/50"
                >
                  <div className="relative h-44 overflow-hidden">
                    {service.image && (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-foreground mb-2 underline underline-offset-2 decoration-foreground/50">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors -mr-4"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
