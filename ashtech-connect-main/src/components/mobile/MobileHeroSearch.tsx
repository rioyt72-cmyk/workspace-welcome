import { useState } from "react";
import { Search, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import heroImage from "@/assets/hero-coworking.jpg";

interface MobileHeroSearchProps {
  onSearch: (filters: { city: string; query: string; serviceType: string }) => void;
}

export const MobileHeroSearch = ({ onSearch }: MobileHeroSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSearch = () => {
    onSearch({
      city: "",
      query: searchQuery,
      serviceType: "",
    });
  };

  return (
    <section className="relative">
      {/* Hero Background with Overlay */}
      <div className="relative h-[280px]">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Employees working in coworking space"
            className="w-full h-full object-cover"
          />
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-muted/40 border-0 rounded-full text-sm placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary/30"
            />
          </div>

          {/* Date and Time Row */}
          <div className="flex gap-3 mb-4">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <button className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 text-left hover:bg-muted/60 transition-colors">
                  <Calendar className="w-4 h-4 text-muted-foreground/70" />
                  <div className="flex-1">
                    <p className="text-[11px] text-muted-foreground/70 font-medium">Date</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedDate ? format(selectedDate, "dd-MM-yyyy") : "dd-mm-yyyy"}
                    </p>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>

            <button className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/40 text-left hover:bg-muted/60 transition-colors">
              <Clock className="w-4 h-4 text-muted-foreground/70" />
              <div className="flex-1">
                <p className="text-[11px] text-muted-foreground/70 font-medium">Time</p>
                <p className="text-sm font-medium text-foreground">--:-- --</p>
              </div>
            </button>
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
