 import { Button } from "@/components/ui/button";
 import { ArrowRight, MapPin, Users, Wifi } from "lucide-react";
 import heroImage from "@/assets/hero-cowork.jpg";
 
 const Hero = () => {
   return (
     <section className="relative min-h-screen flex items-center pt-20">
       {/* Background Image with Overlay */}
       <div className="absolute inset-0 z-0">
         <img
           src={heroImage}
           alt="Modern co-working space"
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 gradient-hero" />
       </div>
 
       {/* Content */}
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="max-w-3xl">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6 animate-fade-in">
             <MapPin className="w-4 h-4 text-accent" />
             <span className="text-sm text-primary-foreground/90">Now open in 12 locations</span>
           </div>
           
           <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
             Your workspace,{" "}
             <span className="text-accent">reimagined</span>
           </h1>
           
           <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
             Flexible workspaces designed for productivity, connection, and growth. 
             Join a community of innovators and make every workday extraordinary.
           </p>
 
           <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
             <Button variant="hero" size="xl">
               Get Started Free
               <ArrowRight className="w-5 h-5" />
             </Button>
             <Button variant="heroOutline" size="xl">
               Book a Tour
             </Button>
           </div>
 
           {/* Stats */}
           <div className="flex flex-wrap gap-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                 <Users className="w-5 h-5 text-accent" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-primary-foreground">5,000+</p>
                 <p className="text-sm text-primary-foreground/70">Active Members</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                 <MapPin className="w-5 h-5 text-accent" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-primary-foreground">12</p>
                 <p className="text-sm text-primary-foreground/70">Prime Locations</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                 <Wifi className="w-5 h-5 text-accent" />
               </div>
               <div>
                 <p className="text-2xl font-bold text-primary-foreground">24/7</p>
                 <p className="text-sm text-primary-foreground/70">Access Available</p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 export default Hero;