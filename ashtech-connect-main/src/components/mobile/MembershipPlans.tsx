import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Basic",
    subtitle: "Perfect for occasional users",
    price: "₹2,999",
    period: "/month",
    features: ["5 days per month", "Access to hot desks", "Free coffee & tea", "WiFi & printing"],
    popular: false,
    gradient: false,
  },
  {
    name: "Pro",
    subtitle: "Best for regular users",
    price: "₹7,499",
    period: "/month",
    features: [
      "Unlimited access",
      "Private office options",
      "5 meeting room hours",
      "Priority booking",
      "All amenities included",
    ],
    popular: true,
    gradient: true,
  },
  {
    name: "Enterprise",
    subtitle: "For teams & companies",
    price: "Custom",
    period: "pricing",
    features: ["Dedicated offices", "Team management", "Custom branding", "Dedicated support"],
    popular: false,
    gradient: false,
  },
];

export const MembershipPlans = () => {
  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Membership Plans</h2>

      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-5 ${
              plan.gradient
                ? "bg-gradient-to-br from-primary to-primary/80 text-white"
                : "bg-card shadow-card"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold text-xl ${!plan.gradient && "text-foreground"}`}>
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <Badge className="bg-amber-400 text-amber-900 hover:bg-amber-400">
                      POPULAR
                    </Badge>
                  )}
                </div>
                <p className={`text-sm ${plan.gradient ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.subtitle}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${!plan.gradient && "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.gradient ? "text-white/80" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 ${plan.gradient ? "text-green-300" : "text-green-500"}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.gradient ? "secondary" : "outline"}
              className={`w-full ${plan.gradient ? "bg-white text-primary hover:bg-white/90" : ""}`}
            >
              Select Plan
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};
