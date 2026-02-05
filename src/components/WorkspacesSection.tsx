import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceCard } from "./WorkspaceCard";
import { WorkspaceDetailsModal } from "./WorkspaceDetailsModal";
import { BookingModal } from "./BookingModal";
import { useSavedWorkspaces } from "@/hooks/use-saved-workspaces";

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

interface WorkspacesSectionProps {
  onLoginRequired: () => void;
  filters?: { city: string; query: string; serviceType: string };
}

export const WorkspacesSection = ({ onLoginRequired, filters }: WorkspacesSectionProps) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { isSaved, toggleSaved } = useSavedWorkspaces();

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

  const filteredWorkspaces = workspaces.filter((ws) => {
    const matchesCity = !filters?.city || ws.location.toLowerCase().includes(filters.city.toLowerCase());
    const matchesQuery = !filters?.query || 
      ws.name.toLowerCase().includes(filters.query.toLowerCase()) ||
      ws.location.toLowerCase().includes(filters.query.toLowerCase()) ||
      ws.address?.toLowerCase().includes(filters.query.toLowerCase());
    const matchesType = !filters?.serviceType || ws.workspace_type === filters.serviceType;
    return matchesCity && matchesQuery && matchesType;
  });

  const handleViewDetails = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setDetailsOpen(true);
  };

  const handleBook = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setDetailsOpen(false);
    setBookingOpen(true);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {filters?.city || filters?.query ? (
              <>Workspaces in <span className="text-primary">{filters.city || filters.query}</span></>
            ) : (
              <>Find Your Perfect <span className="text-primary">Workspace</span></>
            )}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse and book from our curated selection of premium workspaces
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredWorkspaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {filters?.city || filters?.query 
                ? "No workspaces found matching your search" 
                : "No workspaces available yet"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <WorkspaceCard
                  workspace={workspace}
                  onViewDetails={handleViewDetails}
                  onBook={handleBook}
                  isSaved={isSaved(workspace.id)}
                  onToggleSaved={toggleSaved}
                />
              </motion.div>
            ))}
          </div>
        )}
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
