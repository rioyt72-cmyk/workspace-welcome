import { useState, useEffect } from "react";
import { Heart, Star, MapPin, Wifi, Coffee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Workspace {
  id: string;
  name: string;
  location: string;
  image_url: string | null;
  amount_per_month: number;
  facilities: string[];
}

interface FeaturedSpacesProps {
  onViewDetails: (workspace: Workspace) => void;
}

export const FeaturedSpaces = ({ onViewDetails }: FeaturedSpacesProps) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data } = await supabase
        .from("workspaces")
        .select("id, name, location, image_url, amount_per_month, facilities")
        .eq("is_active", true)
        .limit(5);

      if (data) setWorkspaces(data);
    };
    fetchWorkspaces();
  }, []);

  if (workspaces.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-lg font-bold text-foreground">Featured Spaces</h2>
        <button className="text-primary text-sm font-medium">View All</button>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {workspaces.map((workspace, index) => (
          <div
            key={workspace.id}
            onClick={() => onViewDetails(workspace)}
            className="flex-shrink-0 w-72 bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer"
          >
            <div className="relative h-40">
              <img
                src={workspace.image_url || "/placeholder.svg"}
                alt={workspace.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-muted-foreground" />
              </button>
              {index === 0 && (
                <Badge className="absolute bottom-3 left-3 bg-primary text-primary-foreground">
                  Popular
                </Badge>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-foreground">{workspace.name}</h3>
                <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">4.8</span>
            </div>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{workspace.location}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  <span>High-speed WiFi</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coffee className="w-3 h-3" />
                  <span>Free Coffee</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
