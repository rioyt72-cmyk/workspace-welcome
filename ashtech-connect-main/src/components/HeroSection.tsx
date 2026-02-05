import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Building2, ArrowRight, Users, Clock, Shield, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-coworking.jpg";

const serviceTypes = [
  { label: "Coworking Spaces", value: "coworking" },
  { label: "Serviced Offices", value: "serviced_office" },
  { label: "Virtual Offices", value: "virtual_office" },
  { label: "Meeting Rooms", value: "meeting_room" },
  { label: "Training Rooms", value: "training_room" },
  { label: "Day Office", value: "day_office" },
];

interface HeroSectionProps {
  onSearch: (filters: { city: string; query: string; serviceType: string }) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [cities, setCities] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      const { data } = await supabase
        .from("locations")
        .select("city")
        .eq("is_active", true)
        .order("city");
      
      if (data) {
        const uniqueCities = [...new Set(data.map((loc) => loc.city))];
        setCities(uniqueCities);
      }
    };
    fetchCities();
  }, []);

  const handleSearch = () => {
    onSearch({
      city: selectedCity,
      query: searchQuery,
      serviceType: serviceTypes[activeService].value,
    });
  };

  const handleServiceTabClick = (index: number) => {
    setActiveService(index);
    // Navigate to the service page
    navigate(`/services/${serviceTypes[index].value}`);
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    onSearch({
      city: city,
      query: "",
      serviceType: serviceTypes[activeService].value,
    });
  };

  const displayedCities = showAllCities ? cities : cities.slice(0, 10);

  return (
    <section className="relative min-h-[90vh] overflow-hidden pt-16 md:pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Modern coworking space"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col justify-center min-h-[calc(90vh-5rem)] py-12">
          {/* Trusted Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-medium backdrop-blur-sm">
              <Shield className="w-4 h-4" />
              Trusted by 5,000+ professionals
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-2xl mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Your Perfect{" "}
              <span className="text-primary">Workspace</span>{" "}
              Awaits
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-xl mb-10"
          >
            Discover inspiring coworking spaces designed for productivity. Book by the hour, day, or month.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-card rounded-2xl shadow-2xl max-w-5xl border border-border/50 overflow-hidden"
          >
            {/* Service Type Tabs */}
            <div className="flex overflow-x-auto border-b border-border/50 bg-muted/30">
              {serviceTypes.map((service, index) => (
                <button
                  key={service.value}
                  onClick={() => handleServiceTabClick(index)}
                  className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${
                    activeService === index
                      ? "text-primary border-primary bg-card"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {service.label}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                {/* City Select */}
                <div className="md:w-44">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full h-12 border-border bg-muted/50 hover:bg-muted rounded-xl px-4 focus:ring-0 focus:ring-offset-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Select City" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border shadow-xl rounded-xl">
                      {cities.map((city) => (
                        <SelectItem 
                          key={city} 
                          value={city}
                          className="py-2.5 px-4 cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg mx-1"
                        >
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search location or workspace"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full h-12 pl-11 border-border bg-muted/50 hover:bg-muted rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary"
                  />
                </div>

                {/* Search Button */}
                <Button 
                  variant="coral" 
                  size="lg" 
                  className="md:w-auto px-8 h-12 rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all"
                  onClick={handleSearch}
                >
                  Show Workspaces
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Popular Cities */}
            <div className="px-4 pb-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Popular cities</p>
              <div className="flex flex-wrap gap-2">
                {displayedCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCityClick(city)}
                    className={`px-4 py-2 text-sm rounded-full border transition-all ${
                      selectedCity === city
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {city}
                  </button>
                ))}
                {cities.length > 10 && !showAllCities && (
                  <button
                    onClick={() => setShowAllCities(true)}
                    className="px-4 py-2 text-sm rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    View more
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-8 mt-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">150+</p>
                <p className="text-sm text-white/70">Locations</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">5K+</p>
                <p className="text-sm text-white/70">Members</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-sm text-white/70">Access</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
