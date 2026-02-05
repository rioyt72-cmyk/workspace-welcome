import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteDataProvider } from "@/contexts/SiteDataContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calq from "./pages/Calq";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Enterprise from "./pages/Enterprise";
import ShareRequirement from "./pages/ShareRequirement";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Blogs from "./pages/Blogs";
import TermsAndPolicy from "./pages/TermsAndPolicy";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ServiceType from "./pages/ServiceType";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import CompanyDirectory from "./pages/CompanyDirectory";
import SpecialOffers from "./pages/SpecialOffers";
import { MobileGlobalNav } from "@/components/mobile/MobileGlobalNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SiteDataProvider>
        <AdminAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calq" element={<Calq />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/enterprise" element={<Enterprise />} />
                <Route path="/share-requirement" element={<ShareRequirement />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/terms-and-policy" element={<TermsAndPolicy />} />
                <Route path="/services/:type" element={<ServiceType />} />
                <Route path="/workspace/:id" element={<WorkspaceDetail />} />
                <Route path="/directory" element={<CompanyDirectory />} />
                <Route path="/special-offers" element={<SpecialOffers />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileGlobalNav />
            </BrowserRouter>
          </TooltipProvider>
        </AdminAuthProvider>
      </SiteDataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
