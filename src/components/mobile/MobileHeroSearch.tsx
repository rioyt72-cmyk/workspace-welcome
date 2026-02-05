import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-coworking.jpg";

interface MobileHeroSearchProps {
  onSearch: (filters: {
    city: string;
    query: string;
    serviceType: string;
  }) => void;
}

export const MobileHeroSearch = ({
  onSearch
}: MobileHeroSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const { data } = await supabase
        .from("locations")
        .select("city")
        .eq("is_active", true)
        .order("city");
      if (data) {
        const uniqueCities = [...new Set(data.map(loc => loc.city))];
        setCities(uniqueCities);
      }
    };
    fetchCities();
  }, []);

  // Live search as user types
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch({
      city: selectedCity,
      query: value,
      serviceType: ""
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    onSearch({
      city: city,
      query: searchQuery,
      serviceType: ""
    });
  };

  const handleSearch = () => {
    onSearch({
      city: selectedCity,
      query: searchQuery,
      serviceType: ""
    });
    
    // Scroll to workspaces section on mobile
    const workspacesSection = document.getElementById("workspaces");
    if (workspacesSection) {
      setTimeout(() => {
        workspacesSection.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <section className="relative">
      {/* Hero Background with Overlay */}
      <div className="relative h-[280px]">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Employees working in coworking space" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/80 to-primary/75" />
        </div>

        <div className="relative z-10 pt-20 px-4">
          <h1 className="text-[26px] leading-tight font-bold text-white mb-2">
            Find Your Perfect<br />Workspace
          </h1>
          <p className="text-white/90 text-sm">
            Book desks, meeting rooms & private offices
          </p>
        </div>
      </div>

      {/* Search Card - Overlapping */}
      <div className="relative z-20 px-4 -mt-24">
        <div className="bg-card rounded-3xl p-5 shadow-xl border border-border/30">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
            <Input
              type="text"
              placeholder="Search location, workspace..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="pl-12 h-12 bg-muted/40 border-0 rounded-full text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </div>

          {/* Location Selector */}
          <div className="mb-4">
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger className="w-full h-12 px-4 rounded-xl bg-muted/40 border-0 focus:ring-1 focus:ring-primary/30">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground/70" />
                  <div className="flex-1 text-left">
                    <p className="text-[11px] text-muted-foreground/70 font-medium">Location</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedCity || "Select City"}
                    </p>
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-border shadow-xl rounded-xl">
                {cities.map(city => (
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

          {/* Search Button */}
          <Button
            variant="coral"
            className="w-full h-12 rounded-full font-semibold text-[15px]"
            onClick={handleSearch}
          >
            Search Workspaces
          </Button>
        </div>
      </div>
    </section>
  );
};