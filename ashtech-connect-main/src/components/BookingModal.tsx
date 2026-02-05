import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Calendar } from "lucide-react";
import { format, addMonths, differenceInDays, differenceInMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Workspace {
  id: string;
  name: string;
  amount_per_month: number;
  workspace_type: string;
}

interface BookingModalProps {
  workspace: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onLoginRequired: () => void;
}

type BookingDuration = "daily" | "monthly";

const DAILY_TYPES = ["meeting_room", "day_office"];

export const BookingModal = ({ workspace, open, onOpenChange, onSuccess, onLoginRequired }: BookingModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [durationType, setDurationType] = useState<BookingDuration>("daily");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isDailyType = useMemo(() => {
    if (!workspace) return false;
    return DAILY_TYPES.includes(workspace.workspace_type);
  }, [workspace]);

  const durationOptions = useMemo(() => {
    if (isDailyType) {
      return [
        { value: "daily", label: "Daily" },
        { value: "monthly", label: "Monthly" },
      ];
    }
    return [
      { value: "monthly", label: "Monthly" },
    ];
  }, [isDailyType]);

  // Reset form when modal opens or workspace changes
  useMemo(() => {
    if (open && workspace) {
      const isDaily = DAILY_TYPES.includes(workspace.workspace_type);
      setDurationType(isDaily ? "daily" : "monthly");
      setStartDate(undefined);
      setEndDate(undefined);
      setNotes("");
    }
  }, [workspace, open]);

  const calculateTotal = () => {
    if (!workspace || !startDate) return 0;
    
    const dailyRate = workspace.amount_per_month / 30;
    const monthlyRate = workspace.amount_per_month;

    if (!endDate) {
      // Auto-calculate based on duration type
      if (durationType === "daily") {
        return Math.round(dailyRate);
      }
      return monthlyRate;
    }

    // Calculate based on actual date range
    if (durationType === "daily") {
      const days = Math.max(1, differenceInDays(endDate, startDate) + 1);
      return Math.round(dailyRate * days);
    } else {
      const months = Math.max(1, differenceInMonths(endDate, startDate) + 1);
      return monthlyRate * months;
    }
  };

  const getCalculatedEndDate = (): Date => {
    if (!startDate) return new Date();
    if (endDate) return endDate;
    
    if (durationType === "daily") {
      return startDate; // Same day
    }
    return addMonths(startDate, 1);
  };

  const getDurationLabel = () => {
    if (!startDate) return "";
    
    if (!endDate) {
      if (durationType === "daily") {
        return "1 day";
      }
      return "1 month";
    }

    if (durationType === "daily") {
      const days = Math.max(1, differenceInDays(endDate, startDate) + 1);
      return `${days} day${days > 1 ? "s" : ""}`;
    } else {
      const months = Math.max(1, differenceInMonths(endDate, startDate) + 1);
      return `${months} month${months > 1 ? "s" : ""}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onOpenChange(false);
      onLoginRequired();
      return;
    }

    if (!startDate) {
      toast({ title: "Error", description: "Please select a start date", variant: "destructive" });
      return;
    }

    if (!workspace) return;

    setIsLoading(true);

    const finalEndDate = getCalculatedEndDate();

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      workspace_id: workspace.id,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(finalEndDate, "yyyy-MM-dd"),
      total_amount: calculateTotal(),
      notes: notes || null,
    });

    setIsLoading(false);

    if (error) {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking Submitted", description: "Your booking request has been submitted successfully!" });
      onOpenChange(false);
      setStartDate(undefined);
      setEndDate(undefined);
      setNotes("");
      onSuccess();
    }
  };

  if (!workspace) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Workspace</DialogTitle>
          <DialogDescription>{workspace.name}</DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Please login to book this workspace</p>
            <Button onClick={() => { onOpenChange(false); onLoginRequired(); }}>
              Login to Continue
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Booking Duration Type</Label>
              <Select value={durationType} onValueChange={(v) => setDurationType(v as BookingDuration)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-md z-50">
                  {durationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Auto-calculated"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {startDate && (
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <p>
                  <span className="font-medium">Duration:</span> {getDurationLabel()}
                </p>
                <p>
                  <span className="font-medium">Period:</span> {format(startDate, "MMM d, yyyy")} - {format(getCalculatedEndDate(), "MMM d, yyyy")}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements..."
                rows={3}
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <div className="flex items-center text-xl font-bold text-primary">
                  <IndianRupee className="w-5 h-5" />
                  {calculateTotal().toLocaleString()}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {durationType === "daily" && `₹${Math.round(workspace.amount_per_month / 30).toLocaleString()}/day`}
                {durationType === "monthly" && `₹${workspace.amount_per_month.toLocaleString()}/month`}
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !startDate}>
              {isLoading ? "Submitting..." : "Confirm Booking"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
