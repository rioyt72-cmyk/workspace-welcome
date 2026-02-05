import { useState, useEffect } from "react";
import { Building2, Star, ArrowRight, Navigation, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Workspace {
  id: string;
  name: string;
  location: string;
  amount_per_month: number;
  latitude?: number | null;
  longitude?: number | null;
}

interface WorkspaceWithDistance extends Workspace {
  distance: number;
}

interface NearbyLocationsProps {
  onViewDetails: (workspace: Workspace) => void;
}

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Convert km to miles
const kmToMiles = (km: number): number => km * 0.621371;

export const NearbyLocations = ({ onViewDetails }: NearbyLocationsProps) => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState<WorkspaceWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [usingGPS, setUsingGPS] = useState(false);

  // Fetch workspaces without GPS
  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data } = await supabase
        .from("workspaces")
        .select("id, name, location, amount_per_month, latitude, longitude")
        .eq("is_active", true)
        .limit(3);

      if (data) {
        // Add placeholder distances when not using GPS
        const workspacesWithDistance = data.map((ws, index) => ({
          ...ws,
          distance: [0.5, 0.8, 1.2][index] || 1.0,
        }));
        setWorkspaces(workspacesWithDistance);
      }
    };
    fetchWorkspaces();
  }, []);

  const handleUseGPS = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported", {
        description: "Your browser doesn't support GPS location",
      });
      return;
    }

    setLoading(true);
    toast.info("Getting your location...", {
      description: "Please allow location access",
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // Fetch all active workspaces with coordinates
        const { data, error } = await supabase
          .from("workspaces")
          .select("id, name, location, amount_per_month, latitude, longitude")
          .eq("is_active", true)
          .not("latitude", "is", null)
          .not("longitude", "is", null);

        if (error || !data) {
          toast.error("Error fetching workspaces");
          setLoading(false);
          return;
        }

        // Calculate distances and sort by proximity
        const workspacesWithDistance: WorkspaceWithDistance[] = data
          .map((ws) => ({
            ...ws,
            distance: calculateDistance(
              userLat,
              userLon,
              ws.latitude!,
              ws.longitude!
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5); // Get top 5 nearest

        if (workspacesWithDistance.length === 0) {
          toast.info("No nearby workspaces found", {
            description: "Try searching by city instead",
          });
        } else {
          toast.success("Found nearby workspaces!", {
            description: `${workspacesWithDistance.length} workspace(s) near you`,
          });
        }

        setWorkspaces(workspacesWithDistance);
        setUsingGPS(true);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location access denied", {
              description: "Please enable location permissions",
            });
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location unavailable", {
              description: "Unable to determine your location",
            });
            break;
          case error.TIMEOUT:
            toast.error("Location timeout", {
              description: "Getting location took too long",
            });
            break;
          default:
            toast.error("Location error", {
              description: "An unknown error occurred",
            });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  };

  const handleArrowClick = (e: React.MouseEvent, workspace: Workspace) => {
    e.stopPropagation();
    navigate(`/workspace/${workspace.id}`);
  };

  if (workspaces.length === 0 && !loading) return null;

  const ratings = [4.7, 4.9, 4.6, 4.8, 4.5];

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">
          {usingGPS ? "Workspaces Near You" : "Nearby Locations"}
        </h2>
        <button
          onClick={handleUseGPS}
          disabled={loading}
          className="flex items-center gap-1 text-primary text-sm font-medium disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {loading ? "Locating..." : "Use GPS"}
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
              <h3 className="font-bold text-foreground truncate">
                {workspace.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {usingGPS
                  ? `${kmToMiles(workspace.distance).toFixed(1)} miles away`
                  : `${workspace.distance.toFixed(1)} miles away`}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{ratings[index] || 4.5}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  ₹{Math.round(workspace.amount_per_month / 30)}/day
                </span>
              </div>
            </div>

            <button
              onClick={(e) => handleArrowClick(e, workspace)}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0"
            >
              <ArrowRight className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
