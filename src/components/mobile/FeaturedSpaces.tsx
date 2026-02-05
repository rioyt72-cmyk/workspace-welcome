import { useState, useEffect } from "react";
import { MapPin, Users, IndianRupee, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useRemainingSeats } from "@/hooks/use-remaining-seats";

interface Workspace {
  id: string;
  name: string;
  location: string;
  image_url: string | null;
  amount_per_month: number;
  facilities: string[];
  capacity: number | null;
}

interface FeaturedSpacesProps {
  onViewDetails: (workspace: Workspace) => void;
  onLoginRequired?: () => void;
}

export const FeaturedSpaces = ({ onViewDetails }: FeaturedSpacesProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  
  const workspaceIds = workspaces.map(w => w.id);
  const { getRemaining } = useRemainingSeats(workspaceIds);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data } = await supabase
        .from("workspaces")
        .select("id, name, location, image_url, amount_per_month, facilities, capacity")
        .eq("is_active", true)
        .limit(5);

      if (data) setWorkspaces(data);
    };
    fetchWorkspaces();
  }, []);

  const handleViewAll = () => {
    if (location.pathname === "/") {
      const el = document.getElementById("workspaces");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    navigate("/?scroll=workspaces");
  };

  const handleViewDetails = (workspace: Workspace) => {
    navigate(`/workspace/${workspace.id}`);
  };

  if (workspaces.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-bold text-foreground">Featured Spaces</h2>
        <button 
          onClick={handleViewAll}
          className="text-primary text-sm font-medium"
        >
          View All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {workspaces.map((workspace) => {
          const displayedFacilities = workspace.facilities?.slice(0, 4) || [];
          return (
            <div
              key={workspace.id}
              onClick={() => onViewDetails(workspace)}
              className="flex-shrink-0 w-80 bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer border border-border/50"
            >
              <div className="p-5 space-y-4">
                {/* Title */}
                <h3 className="text-lg font-bold text-foreground text-center">{workspace.name}</h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm">{workspace.location}</span>
                </div>

                {/* Available Seats */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    Available Seats: <span className="font-semibold text-primary">
                      {getRemaining(workspace.id) ?? workspace.capacity} / {workspace.capacity || 0}
                    </span>
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    {workspace.amount_per_month.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>

                {/* Facilities */}
                {displayedFacilities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Facilities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {displayedFacilities.map((facility, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="truncate">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <Button 
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-sm font-semibold"
                  onClick={() => handleViewDetails(workspace)}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
