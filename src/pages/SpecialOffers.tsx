import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Gift, Percent, Zap, Clock, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { differenceInDays, isPast } from "date-fns";

interface SpecialOffer {
  id: string;
  title: string;
  description: string | null;
  badge_text: string;
  discount_value: string | null;
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

const SpecialOffers = () => {
  const isMobile = useIsMobile();
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
          .order("display_order", { ascending: true });

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

  const getExpiryText = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const date = new Date(expiryDate);
    if (isPast(date)) return "Expired";
    const days = differenceInDays(date, new Date());
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    return `Expires in ${days} days`;
  };

  const renderOfferCard = (offer: SpecialOffer) => {
    const IconComponent = iconMap[offer.icon] || Tag;
    const expiryText = getExpiryText(offer.expiry_date);
    const isExpired = expiryText === "Expired";
    const isCopied = copiedCode === offer.coupon_code;

    return (
      <div
        key={offer.id}
        className={`rounded-2xl p-6 text-white relative overflow-hidden ${isExpired ? "opacity-60" : ""}`}
        style={{
          background: `linear-gradient(135deg, ${offer.gradient_from}, ${offer.gradient_to})`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <IconComponent className="w-5 h-5" />
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
            {offer.badge_text}
          </span>
        </div>

        <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
        
        {offer.description && (
          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            {offer.description}
          </p>
        )}

        {/* Coupon Code Section */}
        {offer.coupon_code && !isExpired && (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/70 mb-1">Use code</p>
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
            <div className="flex items-center gap-1 text-sm text-white/80">
              <Clock className="w-4 h-4" />
              {expiryText}
            </div>
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
  };

  const content = (
    <div className={isMobile ? "px-4 py-6 pb-24" : "container mx-auto px-4 py-12"}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Special Offers</h1>
        <p className="text-muted-foreground">
          Exclusive deals and discounts on workspace bookings
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-16">
          <Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No offers available</h3>
          <p className="text-muted-foreground mb-6">
            Check back soon for exclusive deals!
          </p>
          <Button onClick={() => navigate("/")}>Browse Workspaces</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map(renderOfferCard)}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        {content}
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {content}
      </main>
      <Footer />
    </div>
  );
};

export default SpecialOffers;
