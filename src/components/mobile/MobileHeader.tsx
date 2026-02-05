import { Menu, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import aztechLogo from "@/assets/aztech-logo.png";

const lightBackgroundPages = ["/calq", "/profile", "/settings", "/enterprise", "/share-requirement", "/directory", "/special-offers"];

const isLightBackgroundRoute = (pathname: string) => {
  if (lightBackgroundPages.includes(pathname)) return true;
  if (pathname.startsWith("/workspace/")) return true;
  if (pathname.startsWith("/services/")) return true;
  return false;
};

export const MobileHeader = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLightBackground = isLightBackgroundRoute(location.pathname);
  const shouldUseDarkStyle = isScrolled || isLightBackground;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Workspaces", path: "/?scroll=workspaces" },
    { label: "Offers", path: "/special-offers" },
    { label: "Enterprise", path: "/enterprise" },
    { label: "Share Requirement", path: "/share-requirement" },
    { label: "My Profile", path: "/profile" },
    { label: "Settings", path: "/settings" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:hidden",
        shouldUseDarkStyle
          ? "bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center flex-shrink-0">
          <button 
            onClick={() => navigate("/")}
            className="focus:outline-none"
          >
            <img 
              src={aztechLogo} 
              alt="Aztech Coworks" 
              className={cn(
                "h-8 w-auto transition-all",
                shouldUseDarkStyle ? "" : "brightness-0 invert"
              )}
            />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-[200px]">
          <div className="relative">
            <Search className={cn(
              "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4",
              shouldUseDarkStyle ? "text-muted-foreground" : "text-white/60"
            )} />
            <Input
              type="text"
              placeholder="Search..."
              className={cn(
                "pl-8 h-9 text-sm rounded-full",
                shouldUseDarkStyle 
                  ? "bg-muted/50 border-border" 
                  : "bg-white/10 border-white/20 text-white placeholder:text-white/60"
              )}
              onClick={() => {
                if (location.pathname === "/") {
                  const workspacesSection = document.getElementById("workspaces");
                  workspacesSection?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/?scroll=workspaces");
                }
              }}
              readOnly
            />
          </div>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "p-2 -mr-2 rounded-lg transition-colors",
                shouldUseDarkStyle
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10"
              )}
            >
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex items-center p-4 border-b border-border bg-primary/5">
              <img 
                src={aztechLogo} 
                alt="Aztech Coworks" 
                className="h-10 w-auto"
              />
            </div>
            <nav className="p-2">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
