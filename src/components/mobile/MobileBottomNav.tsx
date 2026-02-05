import { Home, Search, Calendar, Heart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const navItems = [
  { icon: Home, label: "Home", path: "/", requiresAuth: false, action: "navigate" },
  { icon: Search, label: "Search", path: "/", requiresAuth: false, action: "search" },
  { icon: Calendar, label: "Bookings", path: "/profile?tab=bookings", requiresAuth: true, action: "navigate" },
  { icon: Heart, label: "Saved", path: "/profile?tab=saved", requiresAuth: true, action: "navigate" },
  { icon: User, label: "Profile", path: "/profile", requiresAuth: false, action: "navigate" },
];

interface MobileBottomNavProps {
  onLoginRequired?: () => void;
}

export const MobileBottomNav = ({ onLoginRequired }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (item: typeof navItems[0]) => {
    if (item.action === "search") return false; // Search is never "active" visually
    
    const path = item.path;
    if (path === "/") return location.pathname === "/" && !location.search;

    const [base, query] = path.split("?");
    if (!location.pathname.startsWith(base)) return false;

    // Handle /profile tab highlighting
    if (base === "/profile" && query) {
      const targetTab = new URLSearchParams(query).get("tab");
      const currentTab = new URLSearchParams(location.search).get("tab") || "profile";
      return Boolean(targetTab) && currentTab === targetTab;
    }

    if (base === "/profile" && !query) {
      const currentTab = new URLSearchParams(location.search).get("tab") || "profile";
      return currentTab === "profile";
    }

    return true;
  };

  const scrollToWorkspaces = () => {
    const workspacesSection = document.getElementById("workspaces");
    if (workspacesSection) {
      workspacesSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // If not on home page, navigate first then scroll
      navigate("/?scroll=workspaces");
    }
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.requiresAuth && !user) {
      toast.error("Please login to access this feature");
      if (onLoginRequired) {
        onLoginRequired();
      }
      return;
    }

    if (item.action === "search") {
      if (location.pathname === "/") {
        scrollToWorkspaces();
      } else {
        navigate("/?scroll=workspaces");
      }
      return;
    }

    navigate(item.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.label}
              onClick={() => handleNavClick(item)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("w-6 h-6", active && "fill-primary/20")} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
