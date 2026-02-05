import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DirectoryHeaderProps {
  title: string;
  subtitle: string;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const DirectoryHeader = ({
  title,
  subtitle,
  totalCount,
  searchQuery,
  onSearchChange,
}: DirectoryHeaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -20]);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, y }}
      className="sticky top-16 z-20 bg-background/95 backdrop-blur-md border-b border-border/50 py-8"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">
              Directory
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {title}
            </h1>
            <p className="text-muted-foreground max-w-xl">
              {subtitle}
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 w-64 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-4 pt-4 border-t border-border/30"
        >
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{totalCount}</span> companies
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
