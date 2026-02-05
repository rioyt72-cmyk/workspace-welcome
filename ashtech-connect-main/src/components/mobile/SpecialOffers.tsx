import { Tag, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SpecialOffers = () => {
  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Special Offers</h2>
        <button className="text-primary text-sm font-medium">See All</button>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5" />
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
              LIMITED TIME
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1">50% Off First Booking</h3>
          <p className="text-white/80 text-sm mb-3">
            New users only. Valid for hot desks and meeting rooms.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm">Expires in 5 days</span>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-orange-600 hover:bg-white/90"
            >
              Claim Now
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5" />
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
              WEEKEND DEAL
            </span>
          </div>
          <h3 className="text-xl font-bold">Weekend Pass ₹999</h3>
        </div>
      </div>
    </section>
  );
};
