import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IndianRupee, Calendar, Tag, X, Loader2 } from "lucide-react";
import { format, differenceInDays, differenceInMonths, addDays, addMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ServiceOption {
  id: string;
  name: string;
  description: string | null;
  price: number;
  price_unit: string;
}

interface AppliedCoupon {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  discountAmount: number;
}

interface ServiceBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceOption: ServiceOption | null;
  workspaceName: string;
  onProceedToPayment: (serviceOption: ServiceOption, startDate: Date, endDate: Date, totalAmount: number, couponCode?: string) => void;
  onLoginRequired: () => void;
  isPaymentLoading?: boolean;
}

export const ServiceBookingModal = ({
  open,
  onOpenChange,
  serviceOption,
  workspaceName,
  onProceedToPayment,
  onLoginRequired,
  isPaymentLoading = false,
}: ServiceBookingModalProps) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Reset form when modal opens or service changes - default start date to today
  useEffect(() => {
    if (open && serviceOption) {
      setStartDate(new Date());
      setEndDate(undefined);
      setCouponCode("");
      setAppliedCoupon(null);
    }
  }, [open, serviceOption]);

  const isDaily = useMemo(() => {
    if (!serviceOption) return false;
    return serviceOption.price_unit === "day" || serviceOption.price_unit === "hour";
  }, [serviceOption]);

  const subtotal = useMemo(() => {
    if (!serviceOption || !startDate) return serviceOption?.price || 0;

    const basePrice = serviceOption.price;

    if (!endDate) {
      // Default: 1 day or 1 month
      return basePrice;
    }

    if (isDaily) {
      const days = Math.max(1, differenceInDays(endDate, startDate) + 1);
      return basePrice * days;
    } else {
      const months = Math.max(1, differenceInMonths(endDate, startDate) + 1);
      return basePrice * months;
    }
  }, [serviceOption, startDate, endDate, isDaily]);

  // Calculate discount amount when coupon is applied
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === "percentage") {
      return Math.round((subtotal * appliedCoupon.discount_value) / 100);
    }
    return Math.min(appliedCoupon.discount_value, subtotal);
  }, [appliedCoupon, subtotal]);

  const finalTotal = subtotal - discountAmount;

  const getCalculatedEndDate = (): Date => {
    if (!startDate) return new Date();
    if (endDate) return endDate;

    // Default end date based on pricing unit
    if (isDaily) {
      return startDate; // Same day
    }
    return addMonths(startDate, 1);
  };

  const getDurationLabel = () => {
    if (!startDate) return "";

    if (!endDate) {
      return isDaily ? "1 day" : "1 month";
    }

    if (isDaily) {
      const days = Math.max(1, differenceInDays(endDate, startDate) + 1);
      return `${days} day${days > 1 ? "s" : ""}`;
    } else {
      const months = Math.max(1, differenceInMonths(endDate, startDate) + 1);
      return `${months} month${months > 1 ? "s" : ""}`;
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);

    try {
      // Check coupon in database using raw query since table might not exist in types
      const { data: coupon, error } = await supabase
        .from("coupons" as any)
        .select("*")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !coupon) {
        toast.error("Invalid or expired coupon code");
        setIsApplyingCoupon(false);
        return;
      }

      const couponData = coupon as unknown as {
        code: string;
        discount_type: "percentage" | "fixed";
        discount_value: number;
        expires_at?: string;
        min_order_amount?: number;
      };

      // Check expiry date
      if (couponData.expires_at && new Date(couponData.expires_at) < new Date()) {
        toast.error("This coupon has expired");
        setIsApplyingCoupon(false);
        return;
      }

      // Check minimum order amount
      if (couponData.min_order_amount && subtotal < couponData.min_order_amount) {
        toast.error(`Minimum order amount is ₹${couponData.min_order_amount.toLocaleString()}`);
        setIsApplyingCoupon(false);
        return;
      }

      // Apply coupon
      setAppliedCoupon({
        code: couponData.code,
        discount_type: couponData.discount_type,
        discount_value: couponData.discount_value,
        discountAmount: couponData.discount_type === "percentage" 
          ? Math.round((subtotal * couponData.discount_value) / 100)
          : Math.min(couponData.discount_value, subtotal),
      });

      toast.success(`Coupon "${couponData.code}" applied successfully!`);
    } catch (err) {
      toast.error("Failed to apply coupon. Please try again.");
    }

    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleProceedToPayment = () => {
    if (!user) {
      onOpenChange(false);
      onLoginRequired();
      return;
    }

    if (!serviceOption || !startDate) return;

    const finalEndDate = getCalculatedEndDate();
    onProceedToPayment(serviceOption, startDate, finalEndDate, finalTotal, appliedCoupon?.code);
  };

  if (!serviceOption) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book {serviceOption.name}</DialogTitle>
          <DialogDescription>{workspaceName}</DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Please login to book this service</p>
            <Button onClick={() => { onOpenChange(false); onLoginRequired(); }}>
              Login to Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date <span className="text-muted-foreground text-xs">(Optional)</span></Label>
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

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Apply Coupon
              </Label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-primary">{appliedCoupon.code}</p>
                    <p className="text-xs text-primary/80">
                      {appliedCoupon.discount_type === "percentage" 
                        ? `${appliedCoupon.discount_value}% off` 
                        : `₹${appliedCoupon.discount_value} off`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCoupon}
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
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                  >
                    {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                  </Button>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <div className="flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {subtotal.toLocaleString()}
                </div>
              </div>
              
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-primary">
                  <span>Discount ({appliedCoupon.code})</span>
                  <div className="flex items-center">
                    - <IndianRupee className="w-4 h-4" />
                    {discountAmount.toLocaleString()}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount</span>
                  <div className="flex items-center text-xl font-bold text-primary">
                    <IndianRupee className="w-5 h-5" />
                    {finalTotal.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                ₹{serviceOption.price.toLocaleString()}/{serviceOption.price_unit}
                {startDate && endDate && ` × ${getDurationLabel()}`}
              </p>
            </div>

            <Button 
              onClick={handleProceedToPayment} 
              className="w-full" 
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? "Processing..." : "Proceed to Checkout"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
