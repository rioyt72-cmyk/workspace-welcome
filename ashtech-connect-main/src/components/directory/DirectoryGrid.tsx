import { motion } from "framer-motion";
import { DirectoryCard } from "./DirectoryCard";

interface Company {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  capacity: string;
  tags: string[];
  featured?: boolean;
}

interface DirectoryGridProps {
  companies: Company[];
}

export const DirectoryGrid = ({ companies }: DirectoryGridProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 lg:px-8 py-12"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {companies.map((company, index) => (
          <DirectoryCard key={company.id} company={company} index={index} />
        ))}
      </div>
      
      {/* Empty State */}
      {companies.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <p className="text-muted-foreground text-lg">
            No companies found matching your criteria.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
