import { useState } from "react";
import { motion } from "framer-motion";
import { Info, Building2, Users, MapPin, Calculator, IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// City data with micromarkets
const cityData: Record<string, { micromarkets: string[]; conventionalRent: { min: number; max: number }; coworkingRent: { min: number; max: number } }> = {
  Gurgaon: { micromarkets: ["Cyber City", "Golf Course Road", "Udyog Vihar", "Sohna Road", "MG Road"], conventionalRent: { min: 80, max: 180 }, coworkingRent: { min: 12000, max: 25000 } },
  Delhi: { micromarkets: ["Connaught Place", "Nehru Place", "Saket", "Okhla", "Aerocity"], conventionalRent: { min: 100, max: 200 }, coworkingRent: { min: 10000, max: 22000 } },
  Noida: { micromarkets: ["Sector 62", "Sector 16", "Sector 125", "Sector 18", "Expressway"], conventionalRent: { min: 50, max: 120 }, coworkingRent: { min: 8000, max: 18000 } },
  Chennai: { micromarkets: ["OMR", "T Nagar", "Guindy", "Anna Nagar", "Nungambakkam"], conventionalRent: { min: 45, max: 100 }, coworkingRent: { min: 7000, max: 15000 } },
  Hyderabad: { micromarkets: ["HITEC City", "Gachibowli", "Madhapur", "Banjara Hills", "Jubilee Hills"], conventionalRent: { min: 55, max: 130 }, coworkingRent: { min: 8000, max: 18000 } },
  Mumbai: { micromarkets: ["BKC", "Lower Parel", "Andheri", "Powai", "Nariman Point"], conventionalRent: { min: 120, max: 300 }, coworkingRent: { min: 15000, max: 35000 } },
  Bangalore: { micromarkets: ["Whitefield", "Koramangala", "Indiranagar", "Electronic City", "MG Road"], conventionalRent: { min: 70, max: 150 }, coworkingRent: { min: 10000, max: 22000 } },
  Ahmedabad: { micromarkets: ["SG Highway", "Prahlad Nagar", "Ashram Road", "CG Road", "Satellite"], conventionalRent: { min: 35, max: 80 }, coworkingRent: { min: 6000, max: 12000 } },
  "Navi Mumbai": { micromarkets: ["Vashi", "Belapur", "Airoli", "Nerul", "Kharghar"], conventionalRent: { min: 60, max: 120 }, coworkingRent: { min: 8000, max: 16000 } },
  Pune: { micromarkets: ["Hinjewadi", "Kharadi", "Magarpatta", "Baner", "Viman Nagar"], conventionalRent: { min: 50, max: 110 }, coworkingRent: { min: 7000, max: 15000 } },
  Kolkata: { micromarkets: ["Salt Lake", "Park Street", "Rajarhat", "Esplanade", "Camac Street"], conventionalRent: { min: 40, max: 90 }, coworkingRent: { min: 6000, max: 14000 } },
  Chandigarh: { micromarkets: ["IT Park", "Sector 17", "Sector 34", "Industrial Area", "Elante"], conventionalRent: { min: 35, max: 75 }, coworkingRent: { min: 5000, max: 12000 } },
};

// Workstation layouts
const workstationLayouts = [
  { id: "linear", name: "Linear Layout", area: 50, image: "📐" },
  { id: "lshape", name: "L-Shape Layout", area: 100, image: "🔲" },
  { id: "cubicle", name: "Cubicle Layout", area: 150, image: "🗄️" },
];

// Manager cabin sizes
const managerCabins = [
  { id: "small", area: 100, image: "🏢" },
  { id: "medium", area: 180, image: "🏬" },
  { id: "large", area: 250, image: "🏛️" },
];

// Meeting rooms
const meetingRooms = [
  { id: "small", name: "4-6 seater", area: 120, image: "👥" },
  { id: "medium", name: "8-10 seater", area: 180, image: "👨‍👩‍👧‍👦" },
  { id: "large", name: "12-15 seater", area: 240, image: "🏟️" },
];

// Training rooms
const trainingRooms = [
  { id: "training", name: "15-20 seater", area: 250, image: "🎓" },
];

// Reception sizes
const receptionSizes = [
  { id: "small", area: 150, image: "🚪" },
  { id: "large", area: 300, image: "🏨" },
];

export default function Calq() {
  // Section 1: Office Type
  const [officeType, setOfficeType] = useState<"conventional" | "coworking">("conventional");

  // Section 2: Basic Information
  const [city, setCity] = useState<string>("");
  const [micromarket, setMicromarket] = useState<string>("");
  const [headcount, setHeadcount] = useState<number>(50);

  // Section 3: Cost Data
  const [conventionalRent, setConventionalRent] = useState<number>(0);
  const [conventionalOpex, setConventionalOpex] = useState<number>(0);
  const [conventionalCapex, setConventionalCapex] = useState<number>(0);
  const [conventionalMisc, setConventionalMisc] = useState<number>(0);
  const [coworkingRent, setCoworkingRent] = useState<number>(0);

  // Section 4: Workstation
  const [workstationLayout, setWorkstationLayout] = useState<string>("linear");
  const [managerCabin, setManagerCabin] = useState<string>("small");

  // Section 5: Private Spaces
  const [meetingRoom4, setMeetingRoom4] = useState<number>(0);
  const [meetingRoom8, setMeetingRoom8] = useState<number>(0);
  const [meetingRoom12, setMeetingRoom12] = useState<number>(0);
  const [trainingRoom, setTrainingRoom] = useState<number>(0);

  // Section 6: Collaborative Space
  const [receptionSize, setReceptionSize] = useState<string>("small");
  const [pantrySize, setPantrySize] = useState<number>(100);
  const [breakRoomSize, setBreakRoomSize] = useState<number>(100);
  const [reproSize, setReproSize] = useState<number>(50);

  // Section 7: Additional
  const [leaseTerm, setLeaseTerm] = useState<number>(3);
  const [growthExpectation, setGrowthExpectation] = useState<number>(5);

  // Show more text
  const [showMore, setShowMore] = useState(false);

  // Get selected city data
  const selectedCityData = city ? cityData[city] : null;

  // Calculate area
  const selectedWorkstation = workstationLayouts.find(w => w.id === workstationLayout);
  const selectedManagerCabin = managerCabins.find(m => m.id === managerCabin);
  const selectedReception = receptionSizes.find(r => r.id === receptionSize);

  const workstationArea = headcount * (selectedWorkstation?.area || 50);
  const managerCount = Math.ceil(headcount / 25);
  const managerArea = managerCount * (selectedManagerCabin?.area || 100);
  const meetingArea = (meetingRoom4 * 120) + (meetingRoom8 * 180) + (meetingRoom12 * 240);
  const trainingArea = trainingRoom * 250;
  const collaborativeArea = (selectedReception?.area || 150) + pantrySize + breakRoomSize + reproSize;

  const totalArea = workstationArea + managerArea + meetingArea + trainingArea + collaborativeArea;

  // Calculate costs
  const conventionalMonthlyCost = totalArea * (conventionalRent + conventionalOpex + conventionalMisc);
  const conventionalCapexTotal = totalArea * conventionalCapex;
  const coworkingMonthlyCost = headcount * coworkingRent;

  const monthlySaving = conventionalMonthlyCost - coworkingMonthlyCost;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lac`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 text-muted-foreground cursor-help inline ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-8 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              CalQ - An Office Space Calculator
            </h1>
            <div className="text-muted-foreground">
              <p className={showMore ? "" : "line-clamp-3"}>
                Optimizing your workspace is a good way of saving the operating costs of your business, improving productivity, and hence increasing employee satisfaction. Crunch in the number with CalQ, a free Workplace Planning Tool by Ashtech to evaluate the perfect workspace solution for your business. The savings can be reinvested towards enhancing the quality of the space that you lease.
              </p>
              {!showMore && (
                <button
                  onClick={() => setShowMore(true)}
                  className="text-primary font-medium mt-2 flex items-center gap-1"
                >
                  more <ChevronDown className="w-4 h-4" />
                </button>
              )}
              {showMore && (
                <>
                  <p className="mt-4">
                    While traditional offices require more space, open office plans can easily shrink that requirement by half. That is why it is important to first evaluate the best layout that suits your requirement. It is sensible to start out with leasing a slightly bigger space than you need and later amend your office design to maximize space without spending much, rather than breaking your lease when you plan to grow.
                  </p>
                  <p className="mt-4">
                    An advanced calculator to help you evaluate the area required for your office space. Ashtech has designed this calculator to help businesses decide between conventional spaces and new-age coworking spaces. The calculator understands your requirement and provides cost-saving analysis considering your business growth and market inflation.
                  </p>
                  <button
                    onClick={() => setShowMore(false)}
                    className="text-primary font-medium mt-2 flex items-center gap-1"
                  >
                    less <ChevronUp className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <p className="text-muted-foreground mt-4">
              Try Ashtech's free office space calculator to compare traditional vs coworking space to assess your office space requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Sections */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8 space-y-6">
          {/* Section 1: Office Type */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4">1. My current office type is</h2>
              <RadioGroup
                value={officeType}
                onValueChange={(v) => setOfficeType(v as "conventional" | "coworking")}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="conventional" id="conventional" />
                  <Label htmlFor="conventional">Conventional Workspace</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coworking" id="coworking" />
                  <Label htmlFor="coworking">Coworking Workspace</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Section 2: Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                2. Basic Information
                <InfoTooltip content="Enter your location and team size to get accurate estimates based on local market rates." />
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> In City
                  </Label>
                  <Select value={city} onValueChange={(v) => { setCity(v); setMicromarket(""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(cityData).map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Area</Label>
                  <Select value={micromarket} onValueChange={setMicromarket} disabled={!city}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Micromarket" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCityData?.micromarkets.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> Total team strength/Headcount
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={headcount}
                    onChange={(e) => setHeadcount(parseInt(e.target.value) || 1)}
                    placeholder="Enter Headcount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Input/Review Data */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-6">3. Please Input/Review the Data</h2>

              {/* Conventional Elements */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  Conventional Elements (per Sqft/Month)
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Rent *
                      <InfoTooltip content="Monthly rent per square foot for conventional office space" />
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={conventionalRent}
                      onChange={(e) => setConventionalRent(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Opex
                      <InfoTooltip content="Operating expenses including utilities, maintenance, security" />
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={conventionalOpex}
                      onChange={(e) => setConventionalOpex(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Capex
                      <InfoTooltip content="Capital expenditure for fit-out, furniture, and setup" />
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={conventionalCapex}
                      onChange={(e) => setConventionalCapex(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Miscellaneous
                      <InfoTooltip content="Other costs like parking, insurance, etc." />
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={conventionalMisc}
                      onChange={(e) => setConventionalMisc(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                {selectedCityData && (
                  <p className="text-sm text-muted-foreground mt-2">
                    The minimum & maximum per sqft rent in the selected micromarket is INR "{selectedCityData.conventionalRent.min}" & INR "{selectedCityData.conventionalRent.max}"
                  </p>
                )}
              </div>

              {/* Coworking Price */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Coworking price (per Seat/Month)
                </h3>
                <div className="max-w-xs">
                  <div className="space-y-2">
                    <Label>Rent *</Label>
                    <Input
                      type="number"
                      min={0}
                      value={coworkingRent}
                      onChange={(e) => setCoworkingRent(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                {selectedCityData && (
                  <p className="text-sm text-muted-foreground mt-2">
                    The minimum & maximum per seat rent in the selected micromarket is INR "{selectedCityData.coworkingRent.min.toLocaleString()}" & INR "{selectedCityData.coworkingRent.max.toLocaleString()}"
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Workstation */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-6">4. Select Types of Workstation</h2>

              {/* Sitting Density */}
              <div className="mb-8">
                <Label className="block mb-4">Select Sitting Density</Label>
                <div className="grid sm:grid-cols-3 gap-4">
                  {workstationLayouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => setWorkstationLayout(layout.id)}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        workstationLayout === layout.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-4xl mb-2">{layout.image}</div>
                      <p className="font-medium">{layout.name}</p>
                      <p className="text-sm text-muted-foreground">Area: {layout.area} sqft</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manager Cabins */}
              <div>
                <Label className="block mb-4">Select Manager Cabins</Label>
                <div className="grid sm:grid-cols-3 gap-4">
                  {managerCabins.map((cabin) => (
                    <button
                      key={cabin.id}
                      onClick={() => setManagerCabin(cabin.id)}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        managerCabin === cabin.id
                          ? "border-primary bg-primary/5 ring-2 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-4xl mb-2">{cabin.image}</div>
                      <p className="text-sm text-muted-foreground">Area: {cabin.area} sqft</p>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  *As per the standard, we have kept the Manager:Employee ratio as 1:25
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Private Spaces */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-6">5. Select Private Spaces</h2>

              {/* Meeting Rooms */}
              <div className="mb-8">
                <Label className="block mb-4">Meeting Rooms</Label>
                <div className="grid sm:grid-cols-3 gap-4">
                  {meetingRooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 border rounded-lg text-center"
                    >
                      <div className="text-4xl mb-2">{room.image}</div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">Area: {room.area} sqft</p>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Quantity"
                        className="text-center"
                        value={room.id === "small" ? meetingRoom4 : room.id === "medium" ? meetingRoom8 : meetingRoom12}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          if (room.id === "small") setMeetingRoom4(val);
                          else if (room.id === "medium") setMeetingRoom8(val);
                          else setMeetingRoom12(val);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Training Rooms */}
              <div>
                <Label className="block mb-4">Training Rooms</Label>
                <div className="max-w-xs">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-4xl mb-2">🎓</div>
                    <p className="font-medium">15-20 seater</p>
                    <p className="text-sm text-muted-foreground mb-2">Area: 250 sqft</p>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Quantity"
                      className="text-center"
                      value={trainingRoom}
                      onChange={(e) => setTrainingRoom(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  *Ashtech recommends a 4-6 seater meeting room on every 25 Employees, 8-10 seater meeting room on every 50 Employees and 12-15 seater meeting room on every 75 Employees
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Collaborative Space */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-6">6. Collaborative Space (in sqft)</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Reception */}
                <div>
                  <Label className="block mb-4">Select the size of the reception</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {receptionSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setReceptionSize(size.id)}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          receptionSize === size.id
                            ? "border-primary bg-primary/5 ring-2 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="text-3xl mb-2">{size.image}</div>
                        <p className="text-sm">{size.area} sqft</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other spaces */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Size of Pantry
                      <InfoTooltip content="Kitchen/pantry area for employees" />
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={pantrySize}
                      onChange={(e) => setPantrySize(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Size of Break Room
                      <InfoTooltip content="Relaxation and informal meeting area" />
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={breakRoomSize}
                      onChange={(e) => setBreakRoomSize(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      Size of Reprographic area
                      <InfoTooltip content="Printing, copying, and document management area" />
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={reproSize}
                      onChange={(e) => setReproSize(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Additional */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-6">7. Additional</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Lease Term */}
                <div>
                  <Label className="block mb-4">Lease Term (in years)</Label>
                  <div className="flex gap-4">
                    {[3, 5, 7].map((year) => (
                      <button
                        key={year}
                        onClick={() => setLeaseTerm(year)}
                        className={`px-6 py-3 border rounded-lg font-medium transition-all ${
                          leaseTerm === year
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Growth Expectation */}
                <div>
                  <Label className="block mb-4">Growth expectation (in percentage % per year)</Label>
                  <div className="flex gap-4">
                    {[5, 20, 35].map((percent) => (
                      <button
                        key={percent}
                        onClick={() => setGrowthExpectation(percent)}
                        className={`px-6 py-3 border rounded-lg font-medium transition-all ${
                          growthExpectation === percent
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {percent}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button size="lg" className="px-8">
                  Connect with Experts
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
                  Re-calculate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cost Evaluation Results */}
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                Cost Evaluation
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Area Required (in SqFt)</p>
                  <p className="text-2xl font-bold">{totalArea.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Coworking costing equivalent (Per Month in INR)</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(coworkingMonthlyCost)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Conventional cost evaluation (Per Month in INR)</p>
                  <p className="text-2xl font-bold">{formatCurrency(conventionalMonthlyCost)}</p>
                </div>
                <div className={`p-4 rounded-lg ${monthlySaving > 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Saving in Coworking (in INR)</p>
                  <p className={`text-2xl font-bold ${monthlySaving > 0 ? "text-green-600" : "text-red-600"}`}>
                    INR {monthlySaving.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-bold mb-4">Utilization and Calculation needs and parameters</h2>
              <p className="text-muted-foreground">
                Workspace utilization goes beyond designing and desking strategies to ensuring the best way of leveraging your workplace for success. Since the workplace is dynamic and trends impact individual spaces of work, the utilization is affected in various ways. Therefore, calculating or quantifying office space involves many factors - Space occupancy, Workstation occupancy, Density, Point-in-time occupancy, Peak usage, Desk-to-employee ratio.
              </p>
              <p className="text-muted-foreground mt-4">
                Two important components of making the most of your workspace from a functional standpoint are: examine space utilization metrics, and track key performance indicators.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
