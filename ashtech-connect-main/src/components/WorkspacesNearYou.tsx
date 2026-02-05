import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceDetailsModal } from "./WorkspaceDetailsModal";
import { BookingModal } from "./BookingModal";
import { useNavigate } from "react-router-dom";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address: string | null;
  facilities: string[];
  amount_per_month: number;
  capacity: number;
  image_url: string | null;
  workspace_type: string;
}

const workspaceTypes = [
  { id: "coworking", label: "Coworking Space" },
  { id: "serviced_office", label: "Serviced Office" },
  { id: "private_office", label: "Private Office" },
  { id: "virtual_office", label: "Virtual Office" },
  { id: "meeting_room", label: "Meeting Room" },
  { id: "training_room", label: "Training Room" },
  { id: "day_office", label: "Day Office" },
];

interface WorkspacesNearYouProps {
  onLoginRequired: () => void;
}

export const WorkspacesNearYou = ({ onLoginRequired }: WorkspacesNearYouProps) => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("coworking");
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setWorkspaces(data);
    }
    setLoading(false);
  };

  const filteredWorkspaces = workspaces.filter(
    (ws) => ws.workspace_type === selectedType
  );

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

  const handleCardClick = (workspace: Workspace) => {
    navigate(`/workspace/${workspace.id}`);
  };

  const handleBook = (workspace: Workspace) => {
    navigate(`/workspace/${workspace.id}`);
  };

  const handleTypeClick = (typeId: string) => {
    setSelectedType(typeId);
    // Reset scroll position when changing type
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    setTimeout(checkScrollButtons, 100);
  };

  const formatPrice = (amount: number, type: string) => {
    const isDailyType = type === "meeting_room" || type === "day_office" || type === "training_room";
    const displayAmount = isDailyType ? Math.round(amount / 30) : amount;
    const period = isDailyType ? "day" : "month";
    return { amount: displayAmount, period };
  };

  const getTypeLabel = (type: string) => {
    const found = workspaceTypes.find((t) => t.id === type);
    return found?.label || type;
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Workspace near you
          </h2>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {workspaceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeClick(type.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                selectedType === type.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted"
              }`}
            >
              {type.label}
              <Info className="w-4 h-4 opacity-70" />
            </button>
          ))}
        </div>

        {/* Workspace Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && filteredWorkspaces.length > 0 && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}

          {loading ? (
            <div className="flex gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] bg-muted rounded-xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : filteredWorkspaces.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground text-lg">
                No {getTypeLabel(selectedType)} spaces available yet
              </p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredWorkspaces.map((workspace, index) => {
                const { amount, period } = formatPrice(
                  workspace.amount_per_month,
                  workspace.workspace_type
                );
                return (
                  <motion.div
                    key={workspace.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCardClick(workspace)}
                    className="group flex-shrink-0 w-[280px] bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/50"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {workspace.image_url ? (
                        <img
                          src={workspace.image_url}
                          alt={workspace.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-foreground mb-1 truncate">
                        {workspace.name}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{workspace.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Starting from{" "}
                        <span className="text-primary font-bold text-base">
                          ₹{amount.toLocaleString()}
                        </span>
                        <span className="text-primary">/ {period}</span>
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Right Arrow */}
          {canScrollRight && filteredWorkspaces.length > 4 && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card rounded-full shadow-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>
      </div>

      <WorkspaceDetailsModal
        workspace={selectedWorkspace}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onBook={handleBook}
      />

      <BookingModal
        workspace={selectedWorkspace}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        onSuccess={fetchWorkspaces}
        onLoginRequired={onLoginRequired}
      />
    </section>
  );
};
