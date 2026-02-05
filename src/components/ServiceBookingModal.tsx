import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IndianRupee, Calendar } from "lucide-react";
import { format, differenceInDays, differenceInMonths, addDays, addMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface ServiceOption {
  id: string;
  name: string;
  description: string | null;
  price: number;
  price_unit: string;
}

interface ServiceBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceOption: ServiceOption | null;
  workspaceName: string;
  onProceedToPayment: (serviceOption: ServiceOption, startDate: Date, endDate: Date, totalAmount: number) => void;
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

  // Reset form when modal opens or service changes - default start date to today
  useEffect(() => {
    if (open && serviceOption) {
      setStartDate(new Date());
      setEndDate(undefined);
    }
  }, [open, serviceOption]);

  const isDaily = useMemo(() => {
    if (!serviceOption) return false;
    return serviceOption.price_unit === "day" || serviceOption.price_unit === "hour";
  }, [serviceOption]);

  const calculateTotal = useMemo(() => {
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

  const handleProceedToPayment = () => {
    if (!user) {
      onOpenChange(false);
      onLoginRequired();
      return;
    }

    if (!serviceOption || !startDate) return;

    const finalEndDate = getCalculatedEndDate();
    onProceedToPayment(serviceOption, startDate, finalEndDate, calculateTotal);
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

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <div className="flex items-center text-xl font-bold text-primary">
                  <IndianRupee className="w-5 h-5" />
                  {calculateTotal.toLocaleString()}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
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
