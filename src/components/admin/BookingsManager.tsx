import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
  workspace: {
    name: string;
    location: string;
  } | null;
  profile: {
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
  completed: "outline",
};

export const BookingsManager = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-bookings", {
        method: "GET",
      });

      if (error) {
        console.error("Error fetching bookings:", error);
        toast({ title: "Error", description: "Failed to fetch bookings", variant: "destructive" });
      } else if (data) {
        setBookings(data as Booking[]);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Error", description: "Failed to fetch bookings", variant: "destructive" });
    }
    setLoading(false);
  };

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke("admin-bookings", {
        body: { bookingId, status },
      });

      if (error) {
        toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Booking status updated" });
        fetchBookings();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>View and manage all workspace bookings</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No bookings yet</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.profile?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{booking.profile?.email}</p>
                        {booking.profile?.phone && (
                          <p className="text-sm text-muted-foreground">{booking.profile.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.workspace?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{booking.workspace?.location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(booking.start_date), "MMM d, yyyy")}</p>
                        <p className="text-muted-foreground">to {format(new Date(booking.end_date), "MMM d, yyyy")}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-medium">
                        <IndianRupee className="w-3 h-3" />
                        {booking.total_amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={booking.status} onValueChange={(v) => updateStatus(booking.id, v)}>
                        <SelectTrigger className="w-[130px]">
                          <Badge variant={statusColors[booking.status] || "secondary"} className="capitalize">
                            {booking.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(booking.created_at), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
