import { useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DirectoryHeader } from "@/components/directory/DirectoryHeader";
import { DirectoryGrid } from "@/components/directory/DirectoryGrid";

// Sample company data
const sampleCompanies = [
  {
    id: "1",
    name: "WeWork Galaxy",
    location: "Residency Road, Bangalore",
    description: "Premium coworking space with modern amenities, high-speed internet, and flexible seating options for startups and enterprises.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    rating: 4.8,
    capacity: "50-500 seats",
    tags: ["Coworking", "Premium", "24/7 Access"],
    featured: true,
  },
  {
    id: "2",
    name: "Regus Business Centre",
    location: "Koramangala, Bangalore",
    description: "Professional serviced offices with private cabins, meeting rooms, and business support services in prime location.",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=400&fit=crop",
    rating: 4.6,
    capacity: "10-100 seats",
    tags: ["Serviced Office", "Meeting Rooms", "Business Centre"],
  },
  {
    id: "3",
    name: "91springboard Hub",
    location: "HSR Layout, Bangalore",
    description: "Vibrant coworking community with event spaces, networking opportunities, and startup-friendly environment.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
    rating: 4.5,
    capacity: "20-200 seats",
    tags: ["Coworking", "Startup Hub", "Events"],
    featured: true,
  },
  {
    id: "4",
    name: "Awfis Space Solutions",
    location: "Indiranagar, Bangalore",
    description: "Modern workspace with flexible plans, dedicated desks, and enterprise-grade infrastructure for growing teams.",
    image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=600&h=400&fit=crop",
    rating: 4.4,
    capacity: "5-150 seats",
    tags: ["Flexible", "Hot Desk", "Enterprise"],
  },
  {
    id: "5",
    name: "CoWrks Innovation Hub",
    location: "Whitefield, Bangalore",
    description: "State-of-the-art technology hub with innovation labs, maker spaces, and collaborative work environments.",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&h=400&fit=crop",
    rating: 4.7,
    capacity: "100-1000 seats",
    tags: ["Tech Hub", "Innovation", "Large Scale"],
    featured: true,
  },
  {
    id: "6",
    name: "Innov8 Coworking",
    location: "MG Road, Bangalore",
    description: "Creatively designed spaces that inspire productivity with unique interiors and collaborative areas.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
    rating: 4.3,
    capacity: "30-250 seats",
    tags: ["Creative", "Design", "Collaborative"],
  },
  {
    id: "7",
    name: "Smartworks Business Hub",
    location: "Electronic City, Bangalore",
    description: "Enterprise-grade managed offices with comprehensive IT support and scalable workspace solutions.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
    rating: 4.5,
    capacity: "50-500 seats",
    tags: ["Managed Office", "IT Support", "Scalable"],
  },
  {
    id: "8",
    name: "Hustlehub Tech Park",
    location: "Marathahalli, Bangalore",
    description: "Tech-focused workspace with high-speed connectivity, server rooms, and developer-friendly amenities.",
    image: "https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600&h=400&fit=crop",
    rating: 4.2,
    capacity: "10-100 seats",
    tags: ["Tech", "Developer", "High-Speed"],
  },
  {
    id: "9",
    name: "The Hive Coworking",
    location: "JP Nagar, Bangalore",
    description: "Community-driven workspace fostering connections between freelancers, startups, and small businesses.",
    image: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=600&h=400&fit=crop",
    rating: 4.4,
    capacity: "15-80 seats",
    tags: ["Community", "Freelancer", "Small Business"],
  },
  {
    id: "10",
    name: "Workafella Premium",
    location: "Richmond Road, Bangalore",
    description: "Luxury workspace experience with premium furnishings, concierge services, and exclusive member perks.",
    image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&h=400&fit=crop",
    rating: 4.9,
    capacity: "20-150 seats",
    tags: ["Luxury", "Premium", "Exclusive"],
    featured: true,
  },
  {
    id: "11",
    name: "Incuspaze Hub",
    location: "BTM Layout, Bangalore",
    description: "Affordable coworking option with all essential amenities perfect for early-stage startups and solopreneurs.",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop",
    rating: 4.1,
    capacity: "10-50 seats",
    tags: ["Affordable", "Startup", "Essential"],
  },
  {
    id: "12",
    name: "Indiqube Edge",
    location: "Bellandur, Bangalore",
    description: "Modern office spaces with cutting-edge technology, wellness rooms, and sustainable design elements.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop",
    rating: 4.6,
    capacity: "25-300 seats",
    tags: ["Modern", "Wellness", "Sustainable"],
  },
];

export default function CompanyDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollY } = useScroll();
  
  // Parallax effect for background
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!searchQuery.trim()) return sampleCompanies;
    const query = searchQuery.toLowerCase();
    return sampleCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query) ||
        company.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Subtle Background Pattern */}
      <motion.div
        style={{ y: backgroundY }}
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Header Section */}
      <div className="pt-20">
        <DirectoryHeader
          title="Premium Workspace Directory"
          subtitle="Discover the best coworking spaces, serviced offices, and business centers across India's major cities."
          totalCount={filteredCompanies.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Company Grid */}
      <DirectoryGrid companies={filteredCompanies} />

      {/* Load More Section */}
      {filteredCompanies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 lg:px-8 pb-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            Load More Companies
          </motion.button>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
