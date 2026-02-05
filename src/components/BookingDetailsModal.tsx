import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { MapPin, IndianRupee, Building2 } from "lucide-react";
import { format, eachDayOfInterval, parseISO } from "date-fns";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  workspace: {
    name: string;
    location: string;
    image_url: string | null;
  };
}

interface BookingDetailsModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingDetailsModal = ({ booking, open, onOpenChange }: BookingDetailsModalProps) => {
  if (!booking) return null;

  const startDate = parseISO(booking.start_date);
  const endDate = parseISO(booking.end_date);

  // Get all dates in the booking range
  const bookedDates = eachDayOfInterval({ start: startDate, end: endDate });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-primary/10 text-primary border-primary/30";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workspace Image */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-muted">
            {booking.workspace.image_url ? (
              <img
                src={booking.workspace.image_url}
                alt={booking.workspace.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 to-primary/5">
                <Building2 className="w-16 h-16 text-primary/40" />
                <span className="text-sm text-muted-foreground">No image available</span>
              </div>
            )}
            <Badge className={`absolute top-3 right-3 ${getStatusColor(booking.status)}`}>
              {booking.status}
            </Badge>
          </div>

          {/* Workspace Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{booking.workspace.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {booking.workspace.location}
            </p>
          </div>

          {/* Calendar View */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Booking Dates</h4>
            <div className="border rounded-xl p-3 bg-muted/30">
              <Calendar
                mode="multiple"
                selected={bookedDates}
                className="pointer-events-none mx-auto"
                modifiers={{
                  booked: bookedDates,
                }}
                modifiersStyles={{
                  booked: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    borderRadius: "0.375rem",
                  },
                }}
                disabled
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">
                {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount Paid</span>
              <div className="flex items-center text-xl font-bold text-primary">
                <IndianRupee className="w-5 h-5" />
                {booking.total_amount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
