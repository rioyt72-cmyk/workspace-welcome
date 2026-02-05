import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RemainingSeatsData {
  [workspaceId: string]: number;
}

export const useRemainingSeats = (workspaceIds: string[]) => {
  const [remainingSeats, setRemainingSeats] = useState<RemainingSeatsData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (workspaceIds.length === 0) {
      setLoading(false);
      return;
    }

    const fetchRemainingSeats = async () => {
      // Get workspace capacities
      const { data: workspaces } = await supabase
        .from("workspaces")
        .select("id, capacity")
        .in("id", workspaceIds);

      if (!workspaces) {
        setLoading(false);
        return;
      }

      // Get active bookings (confirmed or pending, with end_date >= today)
      const today = new Date().toISOString().split('T')[0];
      const { data: bookings } = await supabase
        .from("bookings")
        .select("workspace_id, seats_booked")
        .in("workspace_id", workspaceIds)
        .in("status", ["pending", "confirmed"])
        .gte("end_date", today);

      // Calculate remaining seats
      const seatsData: RemainingSeatsData = {};
      
      workspaces.forEach((ws) => {
        const totalCapacity = ws.capacity || 0;
        const bookedSeats = bookings
          ?.filter((b) => b.workspace_id === ws.id)
          .reduce((sum, b) => sum + (b.seats_booked || 1), 0) || 0;
        
        seatsData[ws.id] = Math.max(0, totalCapacity - bookedSeats);
      });

      setRemainingSeats(seatsData);
      setLoading(false);
    };

    fetchRemainingSeats();
  }, [workspaceIds.join(",")]);

  const getRemaining = (workspaceId: string): number | undefined => {
    return remainingSeats[workspaceId];
  };

  return { remainingSeats, getRemaining, loading };
};

// Hook for single workspace
export const useWorkspaceRemainingSeats = (workspaceId: string | undefined, totalCapacity: number) => {
  const [remainingSeats, setRemainingSeats] = useState<number>(totalCapacity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }

    const fetchRemainingSeats = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data: bookings } = await supabase
        .from("bookings")
        .select("seats_booked")
        .eq("workspace_id", workspaceId)
        .in("status", ["pending", "confirmed"])
        .gte("end_date", today);

      const bookedSeats = bookings?.reduce((sum, b) => sum + (b.seats_booked || 1), 0) || 0;
      setRemainingSeats(Math.max(0, totalCapacity - bookedSeats));
      setLoading(false);
    };

    fetchRemainingSeats();
  }, [workspaceId, totalCapacity]);

  return { remainingSeats, loading };
};
