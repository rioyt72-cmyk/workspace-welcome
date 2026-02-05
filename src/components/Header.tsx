import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, ChevronDown, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { UserMenu } from "@/components/UserMenu";
import aztechLogo from "@/assets/aztech-logo.png";

const services = [
  { name: "Co-working Spaces", description: "Dedicated seats and cabins in vibrant co-working spaces.", type: "coworking" },
  { name: "Serviced Offices", description: "Ready-to-use or furnished offices tailored for large teams.", type: "serviced_office" },
  { name: "Private Offices", description: "Secure and personalized office spaces for individual teams.", type: "private_office" },
  { name: "Virtual Offices", description: "GST and business registration for new businesses.", type: "virtual_office" },
  { name: "Meeting Rooms", description: "Spaces for business meetings, conferences, and training.", type: "meeting_room" },
  { name: "Training Rooms", description: "Flexible, tech-enabled spaces for corporate events & trainings.", type: "training_room" },
];

// Pages that have light backgrounds (no dark hero image)
const lightBackgroundPages = ["/calq", "/profile", "/settings", "/enterprise", "/share-requirement", "/directory", "/special-offers"];

// Check if current path matches dynamic routes with light backgrounds
const isLightBackgroundRoute = (pathname: string) => {
  if (lightBackgroundPages.includes(pathname)) return true;
  if (pathname.startsWith("/workspace/")) return true;
  if (pathname.startsWith("/services/")) return true;
  return false;
};

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLightBackground = isLightBackgroundRoute(location.pathname);
  const shouldUseDarkText = isScrolled || isLightBackground;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${shouldUseDarkText ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src={aztechLogo} 
              alt="Aztech Coworks" 
              className={`h-10 w-auto transition-all ${shouldUseDarkText ? "" : "brightness-0 invert"}`}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className={`flex items-center gap-1.5 font-medium transition-colors ${shouldUseDarkText ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
                Our Services
                <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                  >
                    <div className="bg-card rounded-2xl shadow-card-hover border border-border p-4 min-w-[500px] grid grid-cols-2 gap-2">
                      {services.map((service) => (
                        <div
                          key={service.name}
                          onClick={() => {
                            navigate(`/services/${service.type}`);
                            setIsServicesOpen(false);
                          }}
                          className="group flex items-center justify-between p-4 rounded-xl hover:bg-accent transition-colors cursor-pointer"
                        >
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {service.name}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {service.description}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <a href="/enterprise" className={`font-medium transition-colors ${shouldUseDarkText ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
              Enterprise Solutions
            </a>
            <a href="/share-requirement" className={`font-medium transition-colors ${shouldUseDarkText ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
              Share Requirement
            </a>
            <a href="/special-offers" className={`font-medium transition-colors ${shouldUseDarkText ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
              Offers
            </a>
            <a href="/calq" className={`font-medium transition-colors ${shouldUseDarkText ? "text-foreground hover:text-primary" : "text-white/90 hover:text-white"}`}>
              Calq
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Button variant="phone" size="default" className="gap-2">
              <Phone className="w-4 h-4" />
              <span>+91 9876543210</span>
            </Button>
            {!isLoading && (
              user ? (
                <UserMenu isScrolled={shouldUseDarkText} />
              ) : (
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`w-10 h-10 rounded-full p-0 ${
                    shouldUseDarkText 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                  variant="ghost"
                >
                  <User className="w-5 h-5" />
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 transition-colors ${shouldUseDarkText ? "text-foreground" : "text-white"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card rounded-2xl mt-2 border border-border"
            >
              <nav className="py-4 space-y-2">
                {services.map((service) => (
                  <div
                    key={service.name}
                    onClick={() => {
                      navigate(`/services/${service.type}`);
                      setIsMenuOpen(false);
                    }}
                    className="block px-4 py-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                ))}
                <div className="pt-4 px-4 space-y-3">
                  <Button variant="phone" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+91 9876543210</span>
                  </Button>
                  {!isLoading && !user && (
                    <Button 
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full gap-2"
                    >
                      <User className="w-4 h-4" />
                      Login / Sign Up
                    </Button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
