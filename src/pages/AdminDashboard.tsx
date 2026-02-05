import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Briefcase, HelpCircle, Award, Users, Building2, CalendarCheck, FileText, MapPin, Settings, MessageSquare, Image, Tag, Layers } from "lucide-react";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { FAQsManager } from "@/components/admin/FAQsManager";
import { AwardsManager } from "@/components/admin/AwardsManager";
import { ClientsManager } from "@/components/admin/ClientsManager";
import { WorkspacesManager } from "@/components/admin/WorkspacesManager";
import { BookingsManager } from "@/components/admin/BookingsManager";
import { RequirementsManager } from "@/components/admin/RequirementsManager";
import { EnquiriesManager } from "@/components/admin/EnquiriesManager";
import { LocationsManager } from "@/components/admin/LocationsManager";
import { ServiceOptionsManager } from "@/components/admin/ServiceOptionsManager";
import { SiteContentManager } from "@/components/admin/SiteContentManager";
import { SpecialOffersManager } from "@/components/admin/SpecialOffersManager";
import { WorkspaceTypesManager } from "@/components/admin/WorkspaceTypesManager";

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Ashtech Admin</h1>
              <p className="text-sm text-muted-foreground">Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              View Site
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="workspaces" className="space-y-6">
          <TabsList className="flex flex-wrap w-full gap-1">
            <TabsTrigger value="workspaces" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Workspaces</span>
            </TabsTrigger>
            <TabsTrigger value="workspace-types" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Workspace Types</span>
            </TabsTrigger>
            <TabsTrigger value="service-options" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Service Options</span>
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Locations</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="requirements" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Requirements</span>
            </TabsTrigger>
            <TabsTrigger value="enquiries" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Enquiries</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="awards" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Awards</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Clients</span>
            </TabsTrigger>
            <TabsTrigger value="site-content" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Site Content</span>
            </TabsTrigger>
            <TabsTrigger value="special-offers" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Special Offers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workspaces">
            <WorkspacesManager />
          </TabsContent>

          <TabsContent value="workspace-types">
            <WorkspaceTypesManager />
          </TabsContent>

          <TabsContent value="service-options">
            <ServiceOptionsManager />
          </TabsContent>

          <TabsContent value="locations">
            <LocationsManager />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsManager />
          </TabsContent>

          <TabsContent value="requirements">
            <RequirementsManager />
          </TabsContent>

          <TabsContent value="enquiries">
            <EnquiriesManager />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="faqs">
            <FAQsManager />
          </TabsContent>

          <TabsContent value="awards">
            <AwardsManager />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsManager />
          </TabsContent>

          <TabsContent value="site-content">
            <SiteContentManager />
          </TabsContent>

          <TabsContent value="special-offers">
            <SpecialOffersManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
