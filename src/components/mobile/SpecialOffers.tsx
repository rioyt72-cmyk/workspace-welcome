import { useEffect, useState } from "react";
import { Tag, Gift, Percent, Zap, Clock, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, isPast } from "date-fns";

interface SpecialOffer {
  id: string;
  title: string;
  description: string | null;
  badge_text: string;
  expiry_date: string | null;
  gradient_from: string;
  gradient_to: string;
  icon: string;
  cta_label: string;
  coupon_code: string | null;
}

const iconMap: Record<string, React.ElementType> = {
  Tag,
  Gift,
  Percent,
  Zap,
};

export const SpecialOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Coupon code copied!", {
        description: `Use code "${code}" at checkout.`,
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (e) {
      toast.error("Failed to copy code");
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from("special_offers")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .limit(2);

        if (error) throw error;
        setOffers(data || []);
      } catch (e) {
        console.error("Error fetching offers:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleClaimOffer = (offer: SpecialOffer) => {
    toast.success(`Offer "${offer.title}" applied!`, {
      description: "Browse workspaces to use this offer.",
    });
    navigate("/?scroll=workspaces");
  };

  const handleSeeAll = () => {
    navigate("/special-offers");
  };

  const getExpiryText = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const date = new Date(expiryDate);
    if (isPast(date)) return "Expired";
    const days = differenceInDays(date, new Date());
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    return `Expires in ${days} days`;
  };

  if (loading) {
    return (
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Special Offers</h2>
        <button 
          onClick={handleSeeAll}
          className="text-primary text-sm font-medium"
        >
          See All
        </button>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => {
          const IconComponent = iconMap[offer.icon] || Tag;
          const expiryText = getExpiryText(offer.expiry_date);
          const isExpired = expiryText === "Expired";
          const isCopied = copiedCode === offer.coupon_code;

          return (
            <div
              key={offer.id}
              className={`rounded-2xl p-5 text-white ${isExpired ? "opacity-60" : ""}`}
              style={{
                background: `linear-gradient(135deg, ${offer.gradient_from}, ${offer.gradient_to})`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className="w-5 h-5" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                  {offer.badge_text}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">{offer.title}</h3>
              {offer.description && (
                <p className="text-white/80 text-sm mb-3">{offer.description}</p>
              )}
              
              {/* Coupon Code Section */}
              {offer.coupon_code && !isExpired && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/70">Use code</p>
                      <p className="font-mono font-bold text-lg tracking-wider">{offer.coupon_code}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleCopyCode(offer.coupon_code!)}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                {expiryText && (
                  <span className="text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {expiryText}
                  </span>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-gray-800 hover:bg-white/90 ml-auto"
                  onClick={() => handleClaimOffer(offer)}
                  disabled={isExpired}
                >
                  {isExpired ? "Expired" : offer.cta_label}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
