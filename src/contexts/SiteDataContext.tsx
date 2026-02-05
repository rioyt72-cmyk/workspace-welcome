import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Building2, Users, Globe, Video, GraduationCap, CalendarDays, Award, Star, Trophy, LucideIcon } from "lucide-react";
import coworkingImg from "@/assets/coworking-space.jpg";
import servicedImg from "@/assets/serviced-office.jpg";
import virtualImg from "@/assets/virtual-office.jpg";
import meetingImg from "@/assets/meeting-room.jpg";
import trainingImg from "@/assets/training-room.jpg";
import dayOfficeImg from "@/assets/day-office.jpg";

// Types
export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface AwardItem {
  id: string;
  icon: string;
  title: string;
  issuer: string;
}

export interface Client {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface PressLogo {
  id: string;
  name: string;
}

export interface SiteData {
  services: Service[];
  faqs: FAQ[];
  awards: AwardItem[];
  clients: Client[];
  pressLogos: PressLogo[];
}

interface SiteDataContextType {
  data: SiteData;
  updateServices: (services: Service[]) => void;
  updateFaqs: (faqs: FAQ[]) => void;
  updateAwards: (awards: AwardItem[]) => void;
  updateClients: (clients: Client[]) => void;
  updatePressLogos: (pressLogos: PressLogo[]) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Users,
  Building2,
  Globe,
  Video,
  GraduationCap,
  CalendarDays,
  Trophy,
  Award,
  Star,
};

export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Building2;
};

const defaultData: SiteData = {
  services: [
    { id: "1", icon: "Users", title: "Coworking Spaces", description: "Choose from co-working spaces ideal for freelancers, startups, and small businesses in a collaborative environment.", image: coworkingImg },
    { id: "2", icon: "Building2", title: "Serviced Offices", description: "A serviced office is a fully equipped office managed by a facility firm, providing ready-to-use spaces with reception and IT services.", image: servicedImg },
    { id: "3", icon: "Globe", title: "Virtual Offices", description: "A virtual office allows an organization to establish a presence and register for GST or company registration nationwide.", image: virtualImg },
    { id: "4", icon: "Video", title: "Meeting Rooms", description: "Book state-of-the-art meeting rooms for client meetings, team discussions, and presentations.", image: meetingImg },
    { id: "5", icon: "GraduationCap", title: "Training Rooms", description: "Flexible, tech-enabled spaces for corporate events, trainings, seminars, and meetings.", image: trainingImg },
    { id: "6", icon: "CalendarDays", title: "Day Office", description: "Flexible day passes and monthly plans for on-demand workspace needs.", image: dayOfficeImg },
  ],
  faqs: [
    { id: "1", question: "Why Ashtech?", answer: "Ashtech is a tech-enabled online platform that connects individuals and businesses with a wide range of flexible workspaces, such as coworking spaces, private offices, meeting rooms, training rooms, and virtual offices." },
    { id: "2", question: "How does Ashtech help us book an office space?", answer: "Ashtech allows users to search, compare, and book various office space options in their preferred locations. Users can explore available amenities, pricing, and other features before booking through the platform." },
    { id: "3", question: "What types of workspace options are available on Ashtech?", answer: "By selecting coworking spaces near me toggle, you will get available workspace options in your location, including Private Office, Coworking Space, Meeting Room, Training Room, Virtual Office, & Flexi Desk." },
    { id: "4", question: "Is there any brokerage to book coworking space from Ashtech?", answer: "No, we at Ashtech never charge anything from the user. We offer brokerage-free coworking spaces in Pan India with added benefits, i.e. real estate experts' advice and support." },
    { id: "5", question: "How can I book a workspace on Ashtech?", answer: "Ashtech allows you to book a workspace in three easy steps! You all need to do: 1) Search Location & Micromarket. 2) Select Workspace. 3) Submit the Form with the required details to book your preferred workspace." },
    { id: "6", question: "Are there any membership plans or subscription options available?", answer: "Some workspaces listed on Ashtech offer membership plans or subscription options, providing additional benefits and discounts for frequent users." },
  ],
  awards: [
    { id: "1", icon: "Trophy", title: "PropTech Brand of The Year", issuer: "By Realty+ (2024, 2023)" },
    { id: "2", icon: "Award", title: "Top 50 Tech Companies Award", issuer: "By InterCon (2019)" },
    { id: "3", icon: "Star", title: "The Emerging Company Award", issuer: "By National Leadership Summit (2019)" },
    { id: "4", icon: "Trophy", title: "Coworking Technology of the Year", issuer: "By Realty+ (2020-21)" },
  ],
  clients: [
    { id: "1", name: "Tata Group", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/200px-Tata_logo.svg.png" },
    { id: "2", name: "Infosys", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png" },
    { id: "3", name: "Wipro", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png" },
    { id: "4", name: "HCL", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/HCL_Technologies_logo.svg/200px-HCL_Technologies_logo.svg.png" },
    { id: "5", name: "Tech Mahindra", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Tech_Mahindra_Logo.svg/200px-Tech_Mahindra_Logo.svg.png" },
    { id: "6", name: "L&T", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Larsen_%26_Toubro_logo.svg/200px-Larsen_%26_Toubro_logo.svg.png" },
  ],
  pressLogos: [
    { id: "1", name: "Economic Times" },
    { id: "2", name: "Business Standard" },
    { id: "3", name: "Mint" },
    { id: "4", name: "Forbes India" },
    { id: "5", name: "Inc42" },
    { id: "6", name: "YourStory" },
  ],
};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

const STORAGE_KEY = "ashtech_site_data";

export const SiteDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SiteData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SiteData;

        // If the user has older cached data, enrich it with any new defaults
        // (e.g. client logo URLs) without overwriting their custom edits.
        const defaultClientsByName = new Map(
          defaultData.clients.map((c) => [c.name.toLowerCase(), c])
        );

        const mergedClients = (parsed.clients || []).map((client) => {
          if (client.logoUrl) return client;
          const match = defaultClientsByName.get(client.name.toLowerCase());
          return match?.logoUrl ? { ...client, logoUrl: match.logoUrl } : client;
        });

        return {
          ...defaultData,
          ...parsed,
          clients: mergedClients.length ? mergedClients : defaultData.clients,
        };
      } catch {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateServices = (services: Service[]) => setData(prev => ({ ...prev, services }));
  const updateFaqs = (faqs: FAQ[]) => setData(prev => ({ ...prev, faqs }));
  const updateAwards = (awards: AwardItem[]) => setData(prev => ({ ...prev, awards }));
  const updateClients = (clients: Client[]) => setData(prev => ({ ...prev, clients }));
  const updatePressLogos = (pressLogos: PressLogo[]) => setData(prev => ({ ...prev, pressLogos }));

  return (
    <SiteDataContext.Provider value={{ data, updateServices, updateFaqs, updateAwards, updateClients, updatePressLogos }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSiteData must be used within a SiteDataProvider");
  }
  return context;
};
