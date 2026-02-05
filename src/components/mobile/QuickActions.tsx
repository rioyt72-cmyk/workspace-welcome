import { Users, Building2, Globe, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  onSelectType?: (type: string) => void;
}

const actions = [
  { icon: Users, label: "Coworking", type: "coworking", color: "bg-primary/10 text-primary" },
  { icon: Building2, label: "Serviced", type: "serviced_office", color: "bg-primary/10 text-primary" },
  { icon: Globe, label: "Virtual", type: "virtual_office", color: "bg-primary/10 text-primary" },
  { icon: Video, label: "Meeting", type: "meeting_room", color: "bg-green-100 text-green-600" },
];

export const QuickActions = ({ onSelectType }: QuickActionsProps) => {
  const navigate = useNavigate();

  const handleClick = (type: string) => {
    navigate(`/services/${type}`);
    if (onSelectType) onSelectType(type);
  };

  return (
    <section className="px-4 py-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="flex justify-between">
        {actions.map((action) => (
          <button
            key={action.type}
            onClick={() => handleClick(action.type)}
            className="flex flex-col items-center gap-2"
          >
            <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
