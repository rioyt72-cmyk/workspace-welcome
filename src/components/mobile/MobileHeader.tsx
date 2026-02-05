import { Menu, Search, X, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import aztechLogo from "@/assets/aztech-logo.png";

const lightBackgroundPages = ["/calq", "/profile", "/settings", "/enterprise", "/share-requirement", "/directory", "/special-offers", "/about-us", "/contact-us", "/blogs", "/terms-and-policy"];

const isLightBackgroundRoute = (pathname: string) => {
  if (lightBackgroundPages.includes(pathname)) return true;
  if (pathname.startsWith("/workspace/")) return true;
  if (pathname.startsWith("/services/")) return true;
  return false;
};

export const MobileHeader = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isLightBackground = isLightBackgroundRoute(location.pathname);
  const shouldUseDarkStyle = isScrolled || isLightBackground;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);
      
      // Show search bar when scrolling up and past hero section (after 100px)
      if (isHomePage && currentScrollY > 100) {
        if (currentScrollY < lastScrollY) {
          // Scrolling up
          setShowSearchBar(true);
        } else {
          // Scrolling down
          setShowSearchBar(false);
          setIsSearchExpanded(false);
        }
      } else if (currentScrollY <= 100) {
        setShowSearchBar(false);
        setIsSearchExpanded(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isHomePage]);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setSearchQuery("");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      handleCloseSearch();
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Workspaces", path: "/?scroll=workspaces" },
    { label: "Offers", path: "/special-offers" },
    { label: "About Us", path: "/about-us" },
    { label: "Contact Us", path: "/contact-us" },
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
      <div className="flex items-center justify-between px-4 py-3">
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

        <div className="flex items-center gap-2">
          {/* Search Icon - Only on home page in hero section */}
          {isHomePage && !isScrolled && (
            <button
              onClick={() => {
                setShowSearchBar(true);
                setIsSearchExpanded(true);
              }}
              className={cn(
                "p-2 rounded-lg transition-colors",
                shouldUseDarkStyle
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10"
              )}
            >
              <Search className="w-5 h-5" />
            </button>
          )}

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
      </div>

      {/* Animated Search Bar - Appears when scrolling up */}
      <AnimatePresence>
        {(showSearchBar || isSearchExpanded) && isHomePage && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-card/95 backdrop-blur-md border-t border-border"
          >
            <div className="px-4 py-3">
              <AnimatePresence mode="wait">
                {isSearchExpanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search location or workspace..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-9 pr-4 h-10 bg-background border-border"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCloseSearch}
                      className="p-2.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleSearchClick}
                    className="w-full flex items-center gap-3 px-4 py-2.5 bg-muted/50 border border-border rounded-full text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Search workspace or location...</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
