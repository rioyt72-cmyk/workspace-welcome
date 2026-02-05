 import { Coffee, Users, Wifi, Calendar, Shield, Zap } from "lucide-react";
 
 const features = [
   {
     icon: Wifi,
     title: "Lightning-Fast Internet",
     description: "Enterprise-grade connectivity with dedicated bandwidth for seamless video calls and large file transfers.",
   },
   {
     icon: Coffee,
     title: "Premium Amenities",
     description: "Artisan coffee, healthy snacks, and fully-stocked kitchens to fuel your productivity all day.",
   },
   {
     icon: Users,
     title: "Vibrant Community",
     description: "Connect with like-minded professionals through networking events, workshops, and social gatherings.",
   },
   {
     icon: Calendar,
     title: "Flexible Booking",
     description: "Book by the hour, day, or month. Scale up or down as your needs change with no long-term commitments.",
   },
   {
     icon: Shield,
     title: "Secure & Private",
     description: "24/7 security, private meeting rooms, and soundproofed phone booths for confidential conversations.",
   },
   {
     icon: Zap,
     title: "Productivity Tools",
     description: "High-resolution displays, ergonomic furniture, and professional printers—everything you need to excel.",
   },
 ];
 
 const Features = () => {
   return (
     <section id="features" className="py-20 lg:py-32 bg-background">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center max-w-3xl mx-auto mb-16">
           <span className="text-accent font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-6">
             Everything you need to do your best work
           </h2>
           <p className="text-muted-foreground text-lg">
             We've thought of every detail so you can focus on what matters most—your work.
           </p>
         </div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {features.map((feature, index) => (
             <div
               key={feature.title}
               className="group p-8 rounded-2xl bg-card border border-border hover:shadow-elevated transition-all duration-300 animate-fade-in"
               style={{ animationDelay: `${index * 0.1}s` }}
             >
               <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                 <feature.icon className="w-7 h-7 text-primary" />
               </div>
               <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
               <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 };
 
 export default Features;