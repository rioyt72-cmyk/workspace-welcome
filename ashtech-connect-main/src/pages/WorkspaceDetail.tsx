import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Users, 
  IndianRupee, 
  Check, 
  Phone,
  ChevronLeft, 
  ChevronRight,
  Clock,
  Building2,
  Wifi,
  Coffee,
  Snowflake,
  Shield,
  Bus,
  Car,
  Hospital,
  Fuel,
  CreditCard,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { BookingModal } from "@/components/BookingModal";
import { EnquiryModal } from "@/components/EnquiryModal";
import { SharePopover } from "@/components/SharePopover";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "sonner";

interface NearbyItem {
  name: string;
  distance: string;
}

interface NearbyData {
  metro: NearbyItem[];
  bus_station: NearbyItem[];
  train_station: NearbyItem[];
  parking: NearbyItem[];
  atm: NearbyItem[];
  hospital: NearbyItem[];
  petrol_pump: NearbyItem[];
}

interface WorkspaceData {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address: string | null;
  facilities: string[] | null;
  amount_per_month: number;
  capacity: number | null;
  image_url: string | null;
  workspace_type: string;
  landmark: string | null;
  timings: { weekdays: string; saturday: string; sunday: string } | null;
  gallery_images: string[] | null;
  about: string | null;
  amenities: { category: string; items: string[] }[] | null;
  latitude: number | null;
  longitude: number | null;
  nearby: NearbyData | null;
}

interface ServiceOption {
  id: string;
  name: string;
  description: string | null;
  price: number;
  price_unit: string;
  capacity: string | null;
  action_label: string;
  icon: string;
}

interface SimilarWorkspace {
  id: string;
  name: string;
  image_url: string | null;
  location: string;
  amount_per_month: number;
}

const amenityIcons: Record<string, React.ElementType> = {
  "Wifi": Wifi,
  "Air Conditioning": Snowflake,
  "24x7": Clock,
  "Tea & Coffee": Coffee,
  "Security": Shield,
  "Parking": Car,
};

export default function WorkspaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [similarWorkspaces, setSimilarWorkspaces] = useState<SimilarWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedServiceOption, setSelectedServiceOption] = useState<ServiceOption | null>(null);
  const [nearbyTab, setNearbyTab] = useState("metro");
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryServiceName, setEnquiryServiceName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchWorkspaceDetails();
    }
  }, [id]);

  const fetchWorkspaceDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    
    // Fetch workspace details
    const { data: wsData, error: wsError } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (wsError || !wsData) {
      toast.error("Workspace not found");
      navigate("/");
      return;
    }

    // Parse JSON fields
    const parsedWorkspace: WorkspaceData = {
      ...wsData,
      timings: wsData.timings ? (typeof wsData.timings === 'string' ? JSON.parse(wsData.timings) : wsData.timings) : null,
      amenities: wsData.amenities ? (typeof wsData.amenities === 'string' ? JSON.parse(wsData.amenities) : wsData.amenities) : null,
      nearby: wsData.nearby ? (typeof wsData.nearby === 'string' ? JSON.parse(wsData.nearby) : wsData.nearby) : null,
    };
    
    setWorkspace(parsedWorkspace);

    // Fetch service options for this workspace
    const { data: optionsData } = await supabase
      .from("workspace_service_options")
      .select("*")
      .eq("workspace_id", id)
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (optionsData) {
      setServiceOptions(optionsData);
    }

    // Fetch similar workspaces
    const city = wsData.location.split(",")[0].trim();
    const { data: similarData } = await supabase
      .from("workspaces")
      .select("id, name, image_url, location, amount_per_month")
      .neq("id", id)
      .ilike("location", `%${city}%`)
      .eq("is_active", true)
      .limit(6);

    if (similarData) {
      setSimilarWorkspaces(similarData);
    }

    setLoading(false);
  };

  const handleBookService = (option: ServiceOption) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedServiceOption(option);
    setIsBookingModalOpen(true);
  };

  const handleEnquiry = (serviceName?: string) => {
    setEnquiryServiceName(serviceName || workspace?.name || "");
    setIsEnquiryModalOpen(true);
  };

  // Share is now handled by SharePopover component

  const allImages = workspace ? [
    workspace.image_url,
    ...(workspace.gallery_images || [])
  ].filter(Boolean) as string[] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!workspace) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-20 pb-4">
        <div className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">→</span>
          <span className="text-foreground">{workspace.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Title Row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              {workspace.name}
            </h1>
            {workspace.landmark && (
              <p className="text-muted-foreground">{workspace.landmark}</p>
            )}
          </div>
          <SharePopover title={workspace.name} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-muted">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={allImages[currentImageIndex] || "/placeholder.svg"}
                    alt={workspace.name}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
                
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            {workspace.amenities && workspace.amenities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="space-y-4">
                  {workspace.amenities.map((category, idx) => (
                    <div key={idx}>
                      <h4 className="text-sm text-muted-foreground mb-2">{category.category}:</h4>
                      <div className="flex flex-wrap gap-4">
                        {category.items.map((item, itemIdx) => {
                          const IconComponent = amenityIcons[item] || Check;
                          return (
                            <div key={itemIdx} className="flex items-center gap-2 text-sm">
                              <IconComponent className="w-4 h-4 text-primary" />
                              <span>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Facilities fallback */}
            {(!workspace.amenities || workspace.amenities.length === 0) && workspace.facilities && workspace.facilities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-4">
                  {workspace.facilities.map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Service Options Sections */}
            {serviceOptions.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Coworking Space and Office Solutions</h2>
                <div className="space-y-6">
                  {serviceOptions.map((option) => (
                    <Card key={option.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
                          <Button 
                            variant="outline" 
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            onClick={() => handleEnquiry(option.name)}
                          >
                            Enquire Now
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Description</p>
                            {option.description && (
                              <div className="space-y-1">
                                {option.description.split('\n').map((line, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{line}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Listings</p>
                            <div className="flex items-center gap-1">
                              {option.capacity && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span className="text-sm">{option.capacity}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-2">
                              <IndianRupee className="w-4 h-4" />
                              <span className="font-semibold">{option.price.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">/ {option.price_unit}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>))}
                </div>
              </section>
            )}

            {/* Timings */}
            {workspace.timings && (
              <section>
                <h2 className="text-xl font-bold mb-4">Timings</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Monday - Friday</p>
                          <p className="text-sm text-muted-foreground">{workspace.timings.weekdays}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Saturday</p>
                          <p className="text-sm text-muted-foreground">{workspace.timings.saturday}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Sunday</p>
                          <p className="text-sm text-muted-foreground">{workspace.timings.sunday}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Location Map */}
            {workspace.latitude && workspace.longitude && (
              <section>
                <h2 className="text-xl font-bold mb-4">Location</h2>
                <div className="rounded-xl overflow-hidden border">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${workspace.latitude},${workspace.longitude}&zoom=14`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </section>
            )}

            {/* What's Nearby */}
            <section>
              <h2 className="text-xl font-bold mb-4">What's Nearby</h2>
              <Tabs value={nearbyTab} onValueChange={setNearbyTab}>
                <TabsList className="flex-wrap">
                  <TabsTrigger value="metro">Metro</TabsTrigger>
                  <TabsTrigger value="bus_station">Bus Station</TabsTrigger>
                  <TabsTrigger value="train_station">Train Station</TabsTrigger>
                  <TabsTrigger value="parking">Parking</TabsTrigger>
                  <TabsTrigger value="atm">ATM</TabsTrigger>
                  <TabsTrigger value="hospital">Hospital</TabsTrigger>
                  <TabsTrigger value="petrol_pump">Petrol Pump</TabsTrigger>
                </TabsList>
                {(["metro", "bus_station", "train_station", "parking", "atm", "hospital", "petrol_pump"] as const).map((key) => (
                  <TabsContent key={key} value={key} className="mt-4">
                    {workspace.nearby && workspace.nearby[key] && workspace.nearby[key].length > 0 ? (
                      <div className="space-y-3">
                        {workspace.nearby[key].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="text-primary">★</span>
                              <span>{item.name}</span>
                            </div>
                            <span className="text-muted-foreground">{item.distance}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No nearby {key.replace('_', ' ')} information available.</p>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </section>

            {/* About */}
            {workspace.about && (
              <section>
                <h2 className="text-xl font-bold mb-4">About {workspace.name}</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {workspace.about.split('\n').map((para, idx) => (
                    <p key={idx} className="mb-4">{para}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Similar Workspaces */}
            {similarWorkspaces.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">
                  Similar coworking spaces near {workspace.location.split(",")[0]}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {similarWorkspaces.map((ws) => (
                    <Link 
                      key={ws.id} 
                      to={`/workspace/${ws.id}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={ws.image_url || "/placeholder.svg"}
                            alt={ws.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {ws.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">{ws.location}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2 text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Service Options Sidebar */}
              {serviceOptions.length > 0 ? (
                <Card>
                  <CardContent className="p-4 space-y-4">
                    {serviceOptions.map((option) => (
                      <div 
                        key={option.id} 
                        className="flex items-center justify-between py-3 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="w-8 h-8 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{option.name}</p>
                            <p className="text-xs text-muted-foreground">
                              From ₹ {option.price.toLocaleString()} / {option.price_unit}
                              {option.capacity && ` / ${option.capacity}`}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-primary text-sm p-0 h-auto"
                          onClick={() => handleBookService(option)}
                        >
                          {option.action_label}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{workspace.workspace_type.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          From ₹ {workspace.amount_per_month.toLocaleString()} / month
                        </p>
                      </div>
                      <Button 
                        onClick={() => {
                          if (!user) {
                            setIsAuthModalOpen(true);
                          } else {
                            setIsBookingModalOpen(true);
                          }
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enquiry Card */}
              <Card>
                <CardContent className="p-4">
                  <p className="font-medium mb-1">Want to know more?</p>
                  <p className="text-sm text-muted-foreground mb-3">Leave your enquiry with us.</p>
                  <Button 
                    variant="link" 
                    className="text-primary p-0 h-auto"
                    onClick={() => handleEnquiry()}
                  >
                    Enquire Now
                  </Button>
                </CardContent>
              </Card>

              {/* Callback Button */}
              <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Want a Call Back?
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {workspace && (
        <BookingModal
          open={isBookingModalOpen}
          onOpenChange={setIsBookingModalOpen}
          workspace={{
            id: workspace.id,
            name: workspace.name,
            amount_per_month: workspace.amount_per_month,
            workspace_type: workspace.workspace_type,
          }}
          onSuccess={() => {}}
          onLoginRequired={() => setIsAuthModalOpen(true)}
        />
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {workspace && (
        <EnquiryModal
          open={isEnquiryModalOpen}
          onOpenChange={setIsEnquiryModalOpen}
          workspaceName={enquiryServiceName || workspace.name}
          workspaceType={workspace.workspace_type}
          city={workspace.location}
        />
      )}
    </div>
  );
}
