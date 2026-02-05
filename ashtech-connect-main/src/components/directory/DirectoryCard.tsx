import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DirectoryCardProps {
  company: {
    id: string;
    name: string;
    location: string;
    description: string;
    image: string;
    rating: number;
    capacity: string;
    tags: string[];
    featured?: boolean;
  };
  index: number;
}

export const DirectoryCard = ({ company, index }: DirectoryCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Card className="group overflow-hidden bg-card border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-card-hover">
        {/* Image Container with Parallax */}
        <div className="relative h-52 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src={company.image}
              alt={company.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Featured Badge */}
          {company.featured && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="absolute top-4 left-4"
            >
              <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                Featured
              </Badge>
            </motion.div>
          )}
          
          {/* Rating */}
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-sm font-semibold text-foreground">{company.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {company.tags.slice(0, 3).map((tag, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className="text-xs font-medium bg-secondary/80 text-secondary-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {company.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{company.location}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {company.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">{company.capacity}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary hover:bg-primary/10 group/btn"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
