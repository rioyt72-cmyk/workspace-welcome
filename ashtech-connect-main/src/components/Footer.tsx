import { Phone, Mail, Linkedin, Instagram, Facebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aztechLogo from "@/assets/aztech-logo.png";

const quickLinks = [
  { name: "About Us", href: "#" },
  { name: "Contact Us", href: "#contact" },
  { name: "Share Requirement", href: "#" },
  { name: "Add Workspace", href: "#" },
  { name: "Blogs", href: "#" },
  { name: "Terms and Policy", href: "#" },
];

const workspaceTypes = [
  { name: "Co-working Spaces", type: "coworking" },
  { name: "Serviced Office Space", type: "serviced_office" },
  { name: "Private Offices", type: "private_office" },
  { name: "Virtual Offices", type: "virtual_office" },
  { name: "Meeting Rooms", type: "meeting_room" },
  { name: "Training Rooms", type: "training_room" },
];

const topCities = [
  "Gurgaon", "Delhi", "Noida", "Mumbai", "Bangalore", "Chennai", "Hyderabad"
];

export const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="bg-foreground text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img 
                src={aztechLogo} 
                alt="Aztech Coworks" 
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Aztech Coworks is India's largest and fastest-growing flexible workspace marketplace.
              It enables and provides corporates and occupiers with ready-to-move-in and 
              flexible workspaces at a Pan India level.
            </p>
            <div className="space-y-2">
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +91 9876543210
              </a>
              <a href="mailto:info@ashtech.com" className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                info@ashtech.com
              </a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Workspace Types */}
          <div>
            <h4 className="font-semibold mb-6">Workspace Types</h4>
            <ul className="space-y-3">
              {workspaceTypes.map((wsType) => (
                <li key={wsType.name}>
                  <button 
                    onClick={() => navigate(`/services/${wsType.type}`)}
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors text-left"
                  >
                    {wsType.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="font-semibold mb-6">Top Cities</h4>
            <ul className="space-y-3">
              {topCities.map((city) => (
                <li key={city}>
                  <a 
                    href="#" 
                    className="text-sm text-primary-foreground/70 hover:text-primary transition-colors"
                  >
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <p className="text-center text-sm text-primary-foreground/50">
            © 2025 Ashtech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
