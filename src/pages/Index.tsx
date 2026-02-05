import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { WorkspacesNearYou } from "@/components/WorkspacesNearYou";
import { WorkspacesSection } from "@/components/WorkspacesSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { ClientsSection } from "@/components/ClientsSection";
import { EnterpriseSection } from "@/components/EnterpriseSection";
import { AwardsSection } from "@/components/AwardsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { WorkspaceDetailsModal } from "@/components/WorkspaceDetailsModal";
import { BookingModal } from "@/components/BookingModal";


// Mobile components
import { MobileHeader } from "@/components/mobile/MobileHeader";
// Mobile bottom nav is rendered globally in App
import { MobileHeroSearch } from "@/components/mobile/MobileHeroSearch";
import { QuickActions } from "@/components/mobile/QuickActions";
import { CategoryCards } from "@/components/mobile/CategoryCards";
import { FeaturedSpaces } from "@/components/mobile/FeaturedSpaces";
import { NearbyLocations } from "@/components/mobile/NearbyLocations";
import { SpecialOffers } from "@/components/mobile/SpecialOffers";

import { MobileFAQ } from "@/components/mobile/MobileFAQ";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address: string | null;
  facilities: string[];
  amount_per_month: number;
  capacity: number;
  image_url: string | null;
  workspace_type: string;
}

const Index = () => {
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({ city: "", query: "", serviceType: "" });
  const workspacesSectionRef = useRef<HTMLDivElement>(null);

  // Mobile-specific state
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Read URL parameters on mount and apply filters
  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    const serviceType = searchParams.get("type") || "";
    const city = searchParams.get("city") || "";
    const scroll = searchParams.get("scroll") || "";
    
    if (searchQuery || serviceType || city) {
      setSearchFilters({
        city: city,
        query: searchQuery,
        serviceType: serviceType,
      });
      
      // Clear URL params after applying
      setSearchParams({});
      
      // Scroll to workspaces section
      setTimeout(() => {
        workspacesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    if (scroll === "workspaces") {
      setTimeout(() => {
        workspacesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleSearch = (filters: { city: string; query: string; serviceType: string }) => {
    setSearchFilters(filters);
    workspacesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectType = (type: string) => {
    setSearchFilters({ city: "", query: "", serviceType: type });
    workspacesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewDetails = (workspace: any) => {
    const fullWorkspace: Workspace = {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description ?? null,
      location: workspace.location,
      address: workspace.address ?? null,
      facilities: workspace.facilities ?? [],
      amount_per_month: workspace.amount_per_month,
      capacity: workspace.capacity ?? 0,
      image_url: workspace.image_url ?? null,
      workspace_type: workspace.workspace_type ?? "coworking",
    };
    setSelectedWorkspace(fullWorkspace);
    setDetailsOpen(true);
  };

  const handleBook = (workspace: any) => {
    const fullWorkspace: Workspace = {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description ?? null,
      location: workspace.location,
      address: workspace.address ?? null,
      facilities: workspace.facilities ?? [],
      amount_per_month: workspace.amount_per_month,
      capacity: workspace.capacity ?? 0,
      image_url: workspace.image_url ?? null,
      workspace_type: workspace.workspace_type ?? "coworking",
    };
    setSelectedWorkspace(fullWorkspace);
    setDetailsOpen(false);
    setBookingOpen(true);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader />
        <main>
          <MobileHeroSearch onSearch={handleSearch} />
          <QuickActions onSelectType={handleSelectType} />
          <FeaturedSpaces onViewDetails={handleViewDetails} />
          <CategoryCards onSelectType={handleSelectType} />
          <NearbyLocations onViewDetails={handleViewDetails} />
          <SpecialOffers />
          
           <div ref={workspacesSectionRef} id="workspaces">
            <WorkspacesSection 
              onLoginRequired={() => setAuthModalOpen(true)} 
              filters={searchFilters}
            />
          </div>
          <MobileFAQ />
        </main>
        {/* Mobile bottom nav is rendered globally in App */}

        <WorkspaceDetailsModal
          workspace={selectedWorkspace}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          onBook={handleBook}
        />

        <BookingModal
          workspace={selectedWorkspace}
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          onSuccess={() => {}}
          onLoginRequired={() => setAuthModalOpen(true)}
        />

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection onSearch={handleSearch} />
        <ServicesCarousel />
        <div ref={workspacesSectionRef} id="workspaces">
          <WorkspacesNearYou onLoginRequired={() => setAuthModalOpen(true)} />
        </div>
        <WhyChooseUs />
        <ClientsSection />
        <EnterpriseSection />
        <AwardsSection />
        <FAQSection />
      </main>
      <Footer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Index;
