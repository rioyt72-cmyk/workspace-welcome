import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Heart, ChevronLeft, ChevronRight, Clock, Train, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspaceRemainingSeats } from "@/hooks/use-remaining-seats";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address?: string | null;
  landmark?: string | null;
  facilities: string[];
  amount_per_month: number;
  capacity: number;
  image_url: string | null;
  workspace_type: string;
  gallery_images?: string[] | null;
  timings?: { weekdays: string; saturday: string; sunday: string } | null;
  nearby?: { metro?: { name: string; distance: string }[] } | null;
}

interface WorkspaceCardProps {
  workspace: Workspace;
  onViewDetails: (workspace: Workspace) => void;
  onBook: (workspace: Workspace) => void;
  isSaved?: boolean;
  onToggleSaved?: (workspaceId: string) => Promise<{ ok: boolean; saved?: boolean; reason?: string }> | void;
}

const DAILY_TYPES = ["meeting_room", "day_office"];

export const WorkspaceCard = ({ workspace, onViewDetails, onBook, isSaved, onToggleSaved }: WorkspaceCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(Boolean(isSaved));
  const [isExpanded, setIsExpanded] = useState(false);
  const { remainingSeats } = useWorkspaceRemainingSeats(workspace.id, workspace.capacity);

  // If parent controls saved state, keep in sync.
  useEffect(() => {
    if (typeof isSaved === "boolean") setIsFavorited(isSaved);
  }, [isSaved]);

  const favorited = typeof isSaved === "boolean" ? isSaved : isFavorited;

  const allImages = [
    workspace.image_url,
    ...(workspace.gallery_images || [])
  ].filter(Boolean) as string[];

  const handleViewDetails = () => {
    navigate(`/workspace/${workspace.id}`);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save workspaces");
      return;
    }

    try {
      if (onToggleSaved) {
        const result = await onToggleSaved(workspace.id);
        if (result && (result as any).ok === false) throw new Error("toggle_failed");
      } else {
        // Uncontrolled fallback
        setIsFavorited((prev) => !prev);
      }
    } catch (err) {
      toast.error("Could not update saved list. Please try again.");
    }
  };

  // Parse timings
  const getTimingDisplay = () => {
    if (workspace.timings) {
      return {
        main: `Monday to Sunday: ${workspace.timings.weekdays || 'Open'}`,
        sub: workspace.timings.saturday === 'Closed' && workspace.timings.sunday === 'Closed' 
          ? 'Closed on Saturday & Sunday' 
          : null
      };
    }
    return {
      main: 'Monday to Friday: 9 AM - 6 PM',
      sub: 'Closed on Saturday & Sunday'
    };
  };

  // Parse nearby metro
  const getMetroInfo = () => {
    const nearby = workspace.nearby as { metro?: { name: string; distance: string }[] } | null;
    if (nearby?.metro && nearby.metro.length > 0) {
      const firstMetro = nearby.metro[0];
      const additionalCount = nearby.metro.length - 1;
      return {
        distance: `Metro station Access just ${firstMetro.distance} away`,
        name: firstMetro.name + (additionalCount > 0 ? ` & ${additionalCount} more` : '')
      };
    }
    return null;
  };

  const timing = getTimingDisplay();
  const metro = getMetroInfo();

  // Truncate description
  const maxLength = 80;
  const description = workspace.description || '';
  const shouldTruncate = description.length > maxLength;
  const displayDescription = shouldTruncate && !isExpanded 
    ? description.substring(0, maxLength) + '...' 
    : description;

  const priceDisplay = DAILY_TYPES.includes(workspace.workspace_type)
    ? { amount: Math.round(workspace.amount_per_month / 30), unit: '/desk/day' }
    : { amount: workspace.amount_per_month, unit: '/desk/month' };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Image Carousel */}
      <div className="relative h-56 overflow-hidden cursor-pointer" onClick={handleViewDetails}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={allImages[currentImageIndex] || "/placeholder.svg"}
            alt={workspace.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-foreground/60 hover:bg-foreground/80 text-background rounded-full p-1.5 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-foreground/60 hover:bg-foreground/80 text-background rounded-full p-1.5 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Dots Indicator */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  idx === currentImageIndex ? 'bg-background' : 'bg-background/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title Row with Heart */}
        <div className="flex items-start justify-between mb-1">
          <h3 
            className="text-lg font-bold text-foreground cursor-pointer hover:text-primary transition-colors underline underline-offset-2 decoration-foreground"
            onClick={handleViewDetails}
          >
            {workspace.name}
          </h3>
          <button
            onClick={toggleFavorite}
            className="p-1 transition-colors"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                favorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-muted-foreground hover:text-red-500'
              }`} 
            />
          </button>
        </div>

        {/* Landmark/Location */}
        <p className="text-sm text-muted-foreground mb-3">
          {workspace.landmark || workspace.location}
        </p>

        {/* Description with Read More */}
        {description && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayDescription}
              {shouldTruncate && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-primary font-medium ml-1 hover:underline"
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-muted/50 rounded-xl p-4 mb-4 space-y-3">
          {/* Available Seats */}
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Available Seats</p>
              <p className="text-sm font-semibold text-primary">
                {remainingSeats} / {workspace.capacity} seats
              </p>
            </div>
          </div>

          {/* Timing Info */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{timing.main}</p>
              {timing.sub && (
                <p className="text-sm font-semibold text-foreground">{timing.sub}</p>
              )}
            </div>
          </div>

          {/* Metro Info */}
          {metro && (
            <div className="flex items-start gap-3">
              <Train className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">{metro.distance}</p>
                <p className="text-sm font-semibold text-foreground">{metro.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Starting From</p>
            <p className="text-lg font-bold text-foreground">
              ₹{priceDisplay.amount.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">{priceDisplay.unit}</span>
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-full border-foreground text-foreground hover:bg-foreground hover:text-background px-6"
            onClick={handleViewDetails}
          >
            Get Quote
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
