import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Calendar, Tag, Check, X, Users, Plus, Minus } from "lucide-react";
import { format, addMonths, differenceInDays, differenceInMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useWorkspaceRemainingSeats } from "@/hooks/use-remaining-seats";

interface Workspace {
  id: string;
  name: string;
  amount_per_month: number;
  workspace_type: string;
  capacity?: number;
}

interface BookingModalProps {
  workspace: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onLoginRequired: () => void;
}

interface AppliedCoupon {
  code: string;
  discountValue: string;
  title: string;
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState(1);

  const { remainingSeats } = useWorkspaceRemainingSeats(workspace?.id, workspace?.capacity || 0);

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
      setCouponCode("");
      setAppliedCoupon(null);
      setSeatsToBook(1);
    }
  }, [workspace, open]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({ title: "Error", description: "Please enter a coupon code", variant: "destructive" });
      return;
    }

    setIsApplyingCoupon(true);
    
    const { data, error } = await supabase
      .from("special_offers")
      .select("coupon_code, discount_value, title, expiry_date, is_active")
      .eq("coupon_code", couponCode.trim().toUpperCase())
      .eq("is_active", true)
      .single();

    setIsApplyingCoupon(false);

    if (error || !data) {
      toast({ title: "Invalid Coupon", description: "This coupon code is not valid", variant: "destructive" });
      return;
    }

    // Check expiry
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      toast({ title: "Expired Coupon", description: "This coupon has expired", variant: "destructive" });
      return;
    }

    setAppliedCoupon({
      code: data.coupon_code!,
      discountValue: data.discount_value || "0",
      title: data.title
    });
    
    toast({ title: "Coupon Applied!", description: `${data.title} - ${data.discount_value} off` });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const calculateDiscount = (amount: number): number => {
    if (!appliedCoupon) return 0;
    
    const discountStr = appliedCoupon.discountValue;
    if (discountStr.includes("%")) {
      const percent = parseFloat(discountStr.replace("%", ""));
      return Math.round(amount * (percent / 100));
    } else {
      // Flat discount
      return parseFloat(discountStr.replace(/[^0-9.]/g, "")) || 0;
    }
  };

  const calculateTotal = () => {
    if (!workspace || !startDate) return 0;
    
    const dailyRate = workspace.amount_per_month / 30;
    const monthlyRate = workspace.amount_per_month;

    let baseAmount = 0;

    if (!endDate) {
      // Auto-calculate based on duration type
      if (durationType === "daily") {
        baseAmount = Math.round(dailyRate);
      } else {
        baseAmount = monthlyRate;
      }
    } else {
      // Calculate based on actual date range
      if (durationType === "daily") {
        const days = Math.max(1, differenceInDays(endDate, startDate) + 1);
        baseAmount = Math.round(dailyRate * days);
      } else {
        const months = Math.max(1, differenceInMonths(endDate, startDate) + 1);
        baseAmount = monthlyRate * months;
      }
    }

    // Multiply by number of seats
    return baseAmount * seatsToBook;
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

    if (seatsToBook > remainingSeats) {
      toast({ title: "Error", description: `Only ${remainingSeats} seats available`, variant: "destructive" });
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
      seats_booked: seatsToBook,
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
      setCouponCode("");
      setAppliedCoupon(null);
      onSuccess();
    }
  };

  if (!workspace) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-5 sm:p-6">
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
            {/* Seats Selector */}
            <div className="space-y-2">
              <Label>Number of Seats</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={() => setSeatsToBook(Math.max(1, seatsToBook - 1))}
                    disabled={seatsToBook <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="w-16 text-center font-semibold text-lg">
                    {seatsToBook}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => setSeatsToBook(Math.min(remainingSeats, seatsToBook + 1))}
                    disabled={seatsToBook >= remainingSeats}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-primary" />
                  <span><span className="font-semibold text-primary">{remainingSeats}</span> seats available</span>
                </div>
              </div>
              {seatsToBook > remainingSeats && (
                <p className="text-sm text-destructive">Not enough seats available</p>
              )}
            </div>

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
                rows={2}
              />
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <Label>Apply Coupon</Label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-primary">{appliedCoupon.code}</p>
                      <p className="text-xs text-muted-foreground">{appliedCoupon.discountValue} off</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeCoupon}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="shrink-0"
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <div className="flex items-center text-muted-foreground">
                  <IndianRupee className="w-4 h-4" />
                  {calculateTotal().toLocaleString()}
                </div>
              </div>
              
              {appliedCoupon && (
                <div className="flex items-center justify-between text-primary">
                  <span>Discount ({appliedCoupon.discountValue})</span>
                  <div className="flex items-center">
                    - <IndianRupee className="w-4 h-4" />
                    {calculateDiscount(calculateTotal()).toLocaleString()}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="font-medium">Total Amount</span>
                <div className="flex items-center text-xl font-bold text-primary">
                  <IndianRupee className="w-5 h-5" />
                  {(calculateTotal() - calculateDiscount(calculateTotal())).toLocaleString()}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
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
