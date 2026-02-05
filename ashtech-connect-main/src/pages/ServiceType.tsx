import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin,
  Building2, 
  DollarSign, 
  Shield, 
  Clock, 
  Award, 
  Cpu, 
  Users,
  Hourglass,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { BookingModal } from "@/components/BookingModal";
import { WorkspaceDetailsModal } from "@/components/WorkspaceDetailsModal";

// Import images
import coworkingImage from "@/assets/coworking-space.jpg";
import meetingRoomImage from "@/assets/meeting-room.jpg";
import servicedOfficeImage from "@/assets/serviced-office.jpg";
import virtualOfficeImage from "@/assets/virtual-office.jpg";
import trainingRoomImage from "@/assets/training-room.jpg";
import dayOfficeImage from "@/assets/day-office.jpg";
import teamCollabImage from "@/assets/team-collaboration.jpg";

interface ServiceTypeConfig {
  title: string;
  slug: string;
  heroImage: string;
  description: string;
  benefits: { icon: React.ElementType; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

const serviceConfigs: Record<string, ServiceTypeConfig> = {
  coworking: {
    title: "Coworking Space",
    slug: "coworking",
    heroImage: coworkingImage,
    description: "One of the significant advantages of a flexible workspace is a coworking space that fosters collaboration and networking.",
    benefits: [
      { icon: Building2, title: "Largest Supply Portfolio", description: "There are various premium offices that you can choose from, all according to your budget." },
      { icon: DollarSign, title: "Zero Brokerage", description: "We charge zero brokerage fees while assisting you find the best office space." },
      { icon: Award, title: "Best Price", description: "Our expert negotiators will provide you workspace at 15% less on the listing price." },
      { icon: Hourglass, title: "Unmatched Expertise", description: "We ensure the best workspaces suited to your need and requirements." },
      { icon: Shield, title: "Verified Spaces", description: "All spaces are verified and badged to centres practicing proper standards." },
      { icon: Cpu, title: "Tech Enabled Platform", description: "The platform is fully tech-enabled that offers seamless process of booking." },
    ],
    faqs: [
      { question: "What is a coworking space?", answer: "A coworking space is a shared workspace where individuals from different companies work alongside each other. It provides flexible desk options, meeting rooms, and amenities in a collaborative environment." },
      { question: "How much is a coworking space?", answer: "Coworking space prices vary based on location, amenities, and membership type. Prices typically range from ₹5,000 to ₹25,000 per month for a dedicated desk." },
      { question: "What are the benefits of a coworking space?", answer: "Benefits include flexibility, networking opportunities, cost savings compared to traditional offices, access to premium amenities, and a professional work environment." },
      { question: "Why book a coworking space with Aztech?", answer: "Aztech offers zero brokerage, verified spaces, best price guarantee, and access to 150+ locations across India with 24/7 support." },
    ],
  },
  serviced_office: {
    title: "Serviced Office",
    slug: "serviced_office",
    heroImage: servicedOfficeImage,
    description: "Fully furnished and managed office spaces that are ready to move in with all amenities included.",
    benefits: [
      { icon: Building2, title: "Largest Supply Portfolio", description: "Choose from various premium serviced offices according to your budget." },
      { icon: DollarSign, title: "Zero Brokerage", description: "We charge zero brokerage fees while assisting you find the best serviced office." },
      { icon: Award, title: "Best Price", description: "Get workspaces at 15% less on the listing price with our expert negotiators." },
      { icon: Hourglass, title: "Unmatched Expertise", description: "We ensure the best serviced offices suited to your requirements." },
      { icon: Shield, title: "Verified Spaces", description: "All serviced offices are verified and maintain proper standards." },
      { icon: Cpu, title: "Tech Enabled Platform", description: "Seamless booking process through our tech-enabled platform." },
    ],
    faqs: [
      { question: "What is a serviced office?", answer: "A serviced office is a fully equipped workspace that comes with furniture, IT infrastructure, reception services, and administrative support, ready for immediate occupancy." },
      { question: "How much is a serviced office?", answer: "Serviced office prices vary based on size and location, typically ranging from ₹15,000 to ₹50,000 per seat per month." },
      { question: "What are the benefits of a serviced office?", answer: "Benefits include move-in ready setup, flexible terms, professional reception, meeting rooms, and all-inclusive pricing covering utilities and maintenance." },
      { question: "Why book a serviced office with Aztech?", answer: "Aztech offers zero brokerage, verified spaces, best price guarantee, and extensive options across major Indian cities." },
    ],
  },
  private_office: {
    title: "Private Office",
    slug: "private_office",
    heroImage: servicedOfficeImage,
    description: "Secure and personalized office spaces designed for individual teams requiring privacy and focus.",
    benefits: [
      { icon: Building2, title: "Largest Supply Portfolio", description: "Various premium private offices available according to your budget." },
      { icon: DollarSign, title: "Zero Brokerage", description: "Zero brokerage fees when finding your perfect private office." },
      { icon: Award, title: "Best Price", description: "Our negotiators ensure 15% less on listing prices." },
      { icon: Hourglass, title: "Unmatched Expertise", description: "Best private offices matched to your requirements." },
      { icon: Shield, title: "Verified Spaces", description: "All private offices are verified for quality standards." },
      { icon: Cpu, title: "Tech Enabled Platform", description: "Seamless booking through our tech platform." },
    ],
    faqs: [
      { question: "What is a private office?", answer: "A private office is a dedicated, enclosed workspace exclusively for your team, offering privacy, security, and the ability to customize the space." },
      { question: "How much is a private office?", answer: "Private office prices vary based on size and location, typically ranging from ₹20,000 to ₹75,000 per month." },
      { question: "What are the benefits of a private office?", answer: "Benefits include complete privacy, dedicated space, ability to brand your office, enhanced security, and focused work environment." },
      { question: "Why book a private office with Aztech?", answer: "Aztech provides verified spaces, zero brokerage, best price guarantee, and options across 150+ locations." },
    ],
  },
  meeting_room: {
    title: "Meeting Room",
    slug: "meeting_room",
    heroImage: meetingRoomImage,
    description: "One of the significant advantages of a coworking space is a meeting room for professional gatherings and presentations.",
    benefits: [
      { icon: Building2, title: "Largest Supply Portfolio", description: "There are various premium offices that you can choose from, all according to your budget." },
      { icon: DollarSign, title: "Zero Brokerage", description: "We charge zero brokerage fees while assisting you find the best office space." },
      { icon: Award, title: "Best Price", description: "Our expert negotiators will provide you workspace at 15% less on the listing price." },
      { icon: Hourglass, title: "Unmatched Expertise", description: "We ensure the best workspaces suited to your need and requirements." },
      { icon: Shield, title: "Verified Spaces", description: "All spaces are verified and badged to centres practicing proper sanitization." },
      { icon: Cpu, title: "Tech Enabled Platform", description: "The platform is fully tech-enabled that offers seamless process of booking." },
    ],
    faqs: [
      { question: "What is a meeting room?", answer: "A meeting room is a professional space designed for business meetings, presentations, interviews, and team discussions. It typically includes AV equipment, whiteboards, and comfortable seating." },
      { question: "How much is a meeting room?", answer: "Meeting room prices vary based on capacity and amenities, typically ranging from ₹500 to ₹3,000 per hour." },
      { question: "What are the benefits of a meeting room?", answer: "Benefits include professional environment, modern AV equipment, flexible booking options, and no long-term commitment." },
      { question: "Why book a meeting room with Aztech?", answer: "Aztech offers instant booking, verified spaces, competitive pricing, and meeting rooms across 150+ locations in India." },
    ],
  },
  training_room: {
    title: "Training Room",
    slug: "training_room",
    heroImage: trainingRoomImage,
    description: "Flexible, tech-enabled spaces perfect for corporate training sessions, workshops, and educational events.",
    benefits: [
      { icon: Building2, title: "Largest Supply Portfolio", description: "Various premium training rooms available according to your budget." },
      { icon: DollarSign, title: "Zero Brokerage", description: "Zero brokerage fees for finding the best training room." },
      { icon: Award, title: "Best Price", description: "Get training rooms at 15% less on the listing price." },
      { icon: Hourglass, title: "Unmatched Expertise", description: "Best training rooms suited to your requirements." },
      { icon: Shield, title: "Verified Spaces", description: "All training rooms are verified for quality standards." },
      { icon: Cpu, title: "Tech Enabled Platform", description: "Seamless booking through our tech platform." },
    ],
    faqs: [
      { question: "What is a training room?", answer: "A training room is a specialized space designed for corporate training, workshops, seminars, and educational sessions with appropriate seating arrangements and AV equipment." },
      { question: "How much is a training room?", answer: "Training room prices vary based on capacity, typically ranging from ₹5,000 to ₹25,000 per day." },
      { question: "What are the benefits of a training room?", answer: "Benefits include professional setup, AV equipment, flexible layouts, catering options, and dedicated support staff." },
      { question: "Why book a training room with Aztech?", answer: "Aztech offers verified spaces, competitive pricing, flexible booking, and training rooms across major cities." },
    ],
  },
  virtual_office: {
    title: "Virtual Office",
    slug: "virtual_office",
    heroImage: virtualOfficeImage,
    description: "Professional business address and services for GST registration and business registration without physical space.",
    benefits: [
      { icon: Building2, title: "Prime Business Address", description: "Get a prestigious business address in prime locations." },
      { icon: DollarSign, title: "Cost Effective", description: "Save on overhead costs while maintaining a professional presence." },
      { icon: Award, title: "GST Registration", description: "Use our address for GST and business registration purposes." },
      { icon: Hourglass, title: "Mail Handling", description: "Professional mail handling and forwarding services." },
      { icon: Shield, title: "Verified Addresses", description: "All virtual office addresses are verified and compliant." },
      { icon: Cpu, title: "Easy Setup", description: "Quick and hassle-free setup process." },
    ],
    faqs: [
      { question: "What is a virtual office?", answer: "A virtual office provides a business address, mail handling, and optional services like call answering without requiring physical office space." },
      { question: "How much is a virtual office?", answer: "Virtual office prices typically range from ₹3,000 to ₹10,000 per month depending on location and services." },
      { question: "What are the benefits of a virtual office?", answer: "Benefits include professional business address, GST registration capability, mail handling, cost savings, and flexibility." },
      { question: "Why book a virtual office with Aztech?", answer: "Aztech offers verified addresses, quick setup, GST-compliant addresses, and options across major Indian cities." },
    ],
  },
  day_office: {
    title: "Day Office",
    slug: "day_office",
    heroImage: dayOfficeImage,
    description: "Book a private office for a day with all amenities included - perfect for focused work or important meetings.",
    benefits: [
      { icon: Building2, title: "Flexible Booking", description: "Book a private office just for the day you need it." },
      { icon: DollarSign, title: "Cost Effective", description: "Pay only for the time you use - no long-term commitment." },
      { icon: Award, title: "All Amenities", description: "Access to high-speed WiFi, meeting rooms, and pantry services." },
      { icon: Hourglass, title: "Instant Access", description: "Walk in and start working immediately." },
      { icon: Shield, title: "Professional Space", description: "Impress clients with a professional meeting environment." },
      { icon: Cpu, title: "Easy Booking", description: "Book online in minutes through our platform." },
    ],
    faqs: [
      { question: "What is a day office?", answer: "A day office is a private office space that you can rent for a single day, providing a quiet, professional environment for focused work." },
      { question: "How much is a day office?", answer: "Day office prices typically range from ₹1,500 to ₹5,000 per day depending on location and amenities." },
      { question: "What are the benefits of a day office?", answer: "Benefits include privacy, no long-term commitment, professional environment, and access to business amenities." },
      { question: "Why book a day office with Aztech?", answer: "Aztech offers verified spaces, competitive pricing, instant booking, and day offices across 150+ locations." },
    ],
  },
};

// City images mapping for display
const cityImages: Record<string, string> = {
  "Bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=200&h=150&fit=crop",
  "Mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=200&h=150&fit=crop",
  "Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200&h=150&fit=crop",
  "New Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=200&h=150&fit=crop",
  "Noida": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=200&h=150&fit=crop",
  "Gurgaon": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=200&h=150&fit=crop",
  "Chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200&h=150&fit=crop",
  "Pune": "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=200&h=150&fit=crop",
  "Hyderabad": "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=200&h=150&fit=crop",
  "Ahmedabad": "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=200&h=150&fit=crop",
  "Coimbatore": "https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=200&h=150&fit=crop",
  "Mysore": "https://images.unsplash.com/photo-1600100397608-98fd8446cc18?w=200&h=150&fit=crop",
};

interface CityWithCount {
  name: string;
  count: number;
  image: string;
}

export default function ServiceType() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [cities, setCities] = useState<CityWithCount[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const workspacesSectionRef = useRef<HTMLDivElement>(null);

  const config = type ? serviceConfigs[type] : null;

  // Scroll to top when navigating to this page or changing type
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  useEffect(() => {
    if (!config) {
      navigate("/");
      return;
    }

    const fetchWorkspaces = async () => {
      const { data } = await supabase
        .from("workspaces")
        .select("*")
        .eq("workspace_type", type)
        .eq("is_active", true)
        .limit(10);
      
      if (data) {
        setWorkspaces(data);
        
        // Count workspaces per city
        const cityCounts: Record<string, number> = {};
        data.forEach((ws) => {
          // Extract city from location (format: "City, State")
          const city = ws.location.split(",")[0].trim();
          cityCounts[city] = (cityCounts[city] || 0) + 1;
        });
        
        // Convert to array with images
        const citiesWithCounts = Object.entries(cityCounts).map(([name, count]) => ({
          name,
          count,
          image: cityImages[name] || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=150&fit=crop",
        }));
        
        setCities(citiesWithCounts);
      }
    };

    fetchWorkspaces();
  }, [type, config, navigate]);

  if (!config) {
    return null;
  }

  const handleBookNow = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setIsBookingModalOpen(true);
  };

  const handleViewDetails = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setIsDetailsModalOpen(true);
  };

  // Filter workspaces based on search query
  const filteredWorkspaces = workspaces.filter((ws) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      ws.location?.toLowerCase().includes(query) ||
      ws.name?.toLowerCase().includes(query) ||
      ws.address?.toLowerCase().includes(query)
    );
  });

  const visibleWorkspaces = filteredWorkspaces.slice(carouselIndex, carouselIndex + 4);
  const canScrollLeft = carouselIndex > 0;
  const canScrollRight = carouselIndex + 4 < filteredWorkspaces.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={config.heroImage}
            alt={config.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/60" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 h-full flex flex-col justify-center items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8"
          >
            Find Your Perfect <span className="text-primary">{config.title}</span>
          </motion.h1>
          
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl bg-card rounded-full shadow-xl p-2 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City, State, Neighbourhood"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCarouselIndex(0); // Reset carousel when searching
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    workspacesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="border-0 bg-transparent focus-visible:ring-0 text-base"
              />
            </div>
            <Button
              className="rounded-full px-6"
              onClick={() => {
                setCarouselIndex(0);
                workspacesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Search
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Suitable Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Suitable {config.title.toLowerCase()} for you
            </h2>
            <p className="text-muted-foreground">{config.description}</p>
            <button className="text-primary font-semibold mt-2 hover:underline">
              View More
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preferred Cities Section */}
      {cities.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              Preferred Cities for {config.title}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cities.map((city, index) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/?city=${city.name}&type=${type}`)}
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-20 h-14 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{city.count} Office Space{city.count !== 1 ? 's' : ''}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Book Near You Section */}
      <div ref={workspacesSectionRef}>
        {filteredWorkspaces.length > 0 ? (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {searchQuery.trim() ? (
                      <>Showing results for "<span className="text-primary">{searchQuery}</span>"</>
                    ) : (
                      <>Book {config.title.toLowerCase()} near you</>
                    )}
                  </h2>
                  <p className="text-muted-foreground">
                    {searchQuery.trim() 
                      ? `${filteredWorkspaces.length} ${config.title.toLowerCase()}${filteredWorkspaces.length !== 1 ? 's' : ''} found`
                      : "Aztech is India's largest tech-enabled platform to book office spaces, including private and managed workspaces."
                    }
                  </p>
                  {searchQuery.trim() && (
                    <button 
                      className="text-primary font-semibold mt-2 hover:underline"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </button>
                  )}
                </div>
                
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleWorkspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace.id}
                    workspace={workspace}
                    onBook={() => handleBookNow(workspace)}
                    onViewDetails={() => handleViewDetails(workspace)}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : searchQuery.trim() ? (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                No results found for "<span className="text-primary">{searchQuery}</span>"
              </h2>
              <p className="text-muted-foreground mb-4">
                Try searching with a different city or location
              </p>
              <Button onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          </section>
        ) : null}
      </div>

      {/* Aztech Flexi Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Introducing <span className="italic">Aztech Flexi</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Aztech presents the need of the hour initiative - Aztech Flexi, which offers day booking as well as flexible month on month rolling at affordable prices.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  "Flexible Day Booking",
                  "No Lock-in",
                  "No Security Deposit",
                  "Premium Venues"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary rounded-full" />
                    <span className="font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              
              <button className="text-primary font-semibold hover:underline">
                Explore Aztech Flexi
              </button>
            </div>
            
            <div className="relative">
              <img
                src={teamCollabImage}
                alt="Aztech Flexi"
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hybrid Workspaces Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Hybrid Workspaces
              </h2>
              <p className="text-muted-foreground mb-6">
                A hybrid workplace model balances Office and Remote Working (WFH/WFA) depending on the team and work structure. As the future is uncertain, organizations must understand the evolving work trends for better sustainability.
              </p>
              <p className="text-muted-foreground mb-8">
                The goal of a hybrid workplace is to balance the team's needs and enables organizations to make a smooth transition while maintaining productivity and increasing engagement levels.
              </p>
              <Button 
                variant="coral" 
                size="lg" 
                className="rounded-full"
                onClick={() => workspacesSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Let's Go
              </Button>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-sm">
                    <Users className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-center">Team Collaboration</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-sm">
                    <Clock className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-center">Flexible Hours</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-sm">
                    <MapPin className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-center">Multiple Locations</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-sm">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                    <span className="text-sm font-medium text-center">Work-Life Balance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Accordion type="single" collapsible className="w-full">
            {config.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
                <AccordionTrigger className="text-left text-lg font-medium py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <BookingModal
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        workspace={selectedWorkspace}
        onSuccess={() => setIsBookingModalOpen(false)}
        onLoginRequired={() => setIsAuthModalOpen(true)}
      />
      <WorkspaceDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        workspace={selectedWorkspace}
        onBook={(ws) => {
          setIsDetailsModalOpen(false);
          setSelectedWorkspace(ws);
          setIsBookingModalOpen(true);
        }}
      />
    </div>
  );
}
