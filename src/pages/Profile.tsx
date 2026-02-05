import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Save, Loader2, Calendar, Heart, MapPin, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { AuthModal } from "@/components/AuthModal";
import { SavedWorkspacesContent } from "@/components/profile/SavedWorkspacesTab";
import { format } from "date-fns";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  workspace: {
    name: string;
    location: string;
    image_url: string | null;
  };
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const activeTab = searchParams.get("tab") || "profile";

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (user && activeTab === "bookings") {
      fetchBookings();
    }
  }, [user, activeTab]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, email, phone")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setProfile({
        name: data?.name || user.user_metadata?.name || "",
        email: data?.email || user.email || "",
        phone: data?.phone || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        phone: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!user) return;
    
    setBookingsLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          start_date,
          end_date,
          status,
          total_amount,
          workspace:workspaces(name, location, image_url)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const formattedBookings = (data || []).map((booking: any) => ({
        ...booking,
        workspace: booking.workspace || { name: "Unknown", location: "Unknown", image_url: null }
      }));
      
      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id",
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-muted/30 ${isMobile ? "pb-20" : ""}`}>
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">My Account</h1>
              <p className="text-sm text-muted-foreground">{profile.email || user.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Hide tabs on mobile when viewing bookings or saved */}
          {!(isMobile && (activeTab === "bookings" || activeTab === "saved")) && (
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                {!isMobile && <span>Bookings</span>}
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                {!isMobile && <span>Saved</span>}
              </TabsTrigger>
            </TabsList>
          )}

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is separate from your login email.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <Button onClick={handleSave} disabled={isSaving} className="w-full">
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View and manage your workspace bookings.</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't made any bookings yet. Start exploring workspaces!
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Browse Workspaces
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          {booking.workspace.image_url ? (
                            <img
                              src={booking.workspace.image_url}
                              alt={booking.workspace.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold truncate">{booking.workspace.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {booking.workspace.location}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {format(new Date(booking.start_date), "MMM d")} - {format(new Date(booking.end_date), "MMM d, yyyy")}
                            </span>
                          </div>
                          <p className="text-sm font-medium mt-2">
                            ₹{booking.total_amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Workspaces</CardTitle>
                <CardDescription>Your favorite workspaces for quick access.</CardDescription>
              </CardHeader>
              <CardContent>
                <SavedWorkspacesContent />
              <div className="hidden">
                  <h3 className="font-semibold text-lg mb-2">No saved workspaces</h3>
                  <p className="text-muted-foreground mb-4">
                    Start saving workspaces you like to access them quickly later.
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Browse Workspaces
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {isMobile && <MobileBottomNav onLoginRequired={() => setAuthModalOpen(true)} />}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Profile;
