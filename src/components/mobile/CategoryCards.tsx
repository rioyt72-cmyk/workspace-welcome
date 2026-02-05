import { Users, Building2, Globe, Video, GraduationCap, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CategoryCardsProps {
  onSelectType?: (type: string) => void;
}

const categories = [
  {
    icon: Users,
    title: "Coworking Spaces",
    subtitle: "Collaborative environment",
    type: "coworking",
    gradient: "bg-gradient-to-br from-primary to-primary/70",
  },
  {
    icon: Building2,
    title: "Serviced Offices",
    subtitle: "Ready-to-use spaces",
    type: "serviced_office",
    gradient: "bg-gradient-to-br from-primary to-blue-600",
  },
  {
    icon: Globe,
    title: "Virtual Offices",
    subtitle: "Business presence",
    type: "virtual_office",
    gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
  },
  {
    icon: Video,
    title: "Meeting Rooms",
    subtitle: "Collaborate better",
    type: "meeting_room",
    gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
  {
    icon: GraduationCap,
    title: "Training Rooms",
    subtitle: "Corporate events",
    type: "training_room",
    gradient: "bg-gradient-to-br from-orange-500 to-amber-600",
  },
  {
    icon: CalendarDays,
    title: "Day Office",
    subtitle: "Flexible day passes",
    type: "day_office",
    gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
  },
];

export const CategoryCards = ({ onSelectType }: CategoryCardsProps) => {
  const navigate = useNavigate();

  const handleClick = (type: string) => {
    navigate(`/services/${type}`);
    if (onSelectType) onSelectType(type);
  };

  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Browse by Category</h2>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <div
            key={category.type}
            className={`${category.gradient} rounded-2xl p-4 text-white min-h-[140px] flex flex-col justify-between`}
          >
            <category.icon className="w-8 h-8 mb-2" />
            <div>
              <h3 className="font-bold text-base">{category.title}</h3>
              <p className="text-white/80 text-xs mb-3">{category.subtitle}</p>
              <Button
                variant="secondary"
                size="sm"
                className="h-8 text-xs bg-white text-foreground hover:bg-white/90"
                onClick={() => handleClick(category.type)}
              >
                Explore
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
