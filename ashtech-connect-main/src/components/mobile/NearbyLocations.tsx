import { useState, useEffect } from "react";
import { Building2, Star, ArrowRight, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Workspace {
  id: string;
  name: string;
  location: string;
  amount_per_month: number;
}

interface NearbyLocationsProps {
  onViewDetails: (workspace: Workspace) => void;
}

export const NearbyLocations = ({ onViewDetails }: NearbyLocationsProps) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data } = await supabase
        .from("workspaces")
        .select("id, name, location, amount_per_month")
        .eq("is_active", true)
        .limit(3);

      if (data) setWorkspaces(data);
    };
    fetchWorkspaces();
  }, []);

  if (workspaces.length === 0) return null;

  const distances = ["0.3 miles away", "0.5 miles away", "0.8 miles away"];
  const ratings = [4.7, 4.9, 4.6];

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Nearby Locations</h2>
        <button className="flex items-center gap-1 text-primary text-sm font-medium">
          <Navigation className="w-4 h-4" />
          Use GPS
        </button>
      </div>

      <div className="space-y-3">
        {workspaces.map((workspace, index) => (
          <div
            key={workspace.id}
            onClick={() => onViewDetails(workspace)}
            className="flex items-center gap-4 p-4 bg-card rounded-2xl shadow-card cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground truncate">{workspace.name}</h3>
              <p className="text-sm text-muted-foreground">{distances[index]}</p>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{ratings[index]}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  ₹{Math.round(workspace.amount_per_month / 30)}/day
                </span>
              </div>
            </div>

            <button className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <ArrowRight className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
