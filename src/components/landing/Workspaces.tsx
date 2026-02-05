 import { Button } from "@/components/ui/button";
 import { Check } from "lucide-react";
 
 const workspaces = [
   {
     name: "Hot Desk",
     description: "Perfect for freelancers and remote workers who need flexibility.",
     price: "$199",
     period: "/month",
     features: [
       "Access to open workspace",
       "High-speed WiFi",
       "Free coffee & tea",
       "5 meeting room hours/month",
       "Community events access",
     ],
     popular: false,
   },
   {
     name: "Dedicated Desk",
     description: "Your own permanent space with added privacy and perks.",
     price: "$399",
     period: "/month",
     features: [
       "Personal dedicated desk",
       "Lockable storage",
       "24/7 building access",
       "15 meeting room hours/month",
       "Mail handling service",
       "Printing credits included",
     ],
     popular: true,
   },
   {
     name: "Private Office",
     description: "A fully-equipped private space for teams of 2-10 people.",
     price: "$899",
     period: "/month",
     features: [
       "Lockable private office",
       "Customizable setup",
       "Unlimited meeting rooms",
       "Dedicated phone line",
       "Priority support",
       "Guest passes included",
     ],
     popular: false,
   },
 ];
 
 const Workspaces = () => {
   return (
     <section id="pricing" className="py-20 lg:py-32 bg-secondary/30">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center max-w-3xl mx-auto mb-16">
           <span className="text-accent font-semibold text-sm uppercase tracking-wider">Pricing</span>
           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-6">
             Find your perfect workspace
           </h2>
           <p className="text-muted-foreground text-lg">
             Flexible plans that grow with you. No hidden fees, no long-term contracts.
           </p>
         </div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
           {workspaces.map((workspace, index) => (
             <div
               key={workspace.name}
               className={`relative p-8 rounded-2xl bg-card border animate-fade-in ${
                 workspace.popular
                   ? "border-accent shadow-accent"
                   : "border-border shadow-soft"
               }`}
               style={{ animationDelay: `${index * 0.1}s` }}
             >
               {workspace.popular && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                   Most Popular
                 </div>
               )}
               
               <h3 className="text-2xl font-bold mb-2">{workspace.name}</h3>
               <p className="text-muted-foreground mb-6">{workspace.description}</p>
               
               <div className="mb-6">
                 <span className="text-4xl font-bold">{workspace.price}</span>
                 <span className="text-muted-foreground">{workspace.period}</span>
               </div>
 
               <ul className="space-y-3 mb-8">
                 {workspace.features.map((feature) => (
                   <li key={feature} className="flex items-start gap-3">
                     <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                     <span className="text-muted-foreground">{feature}</span>
                   </li>
                 ))}
               </ul>
 
               <Button
                 variant={workspace.popular ? "accent" : "outline"}
                 className="w-full"
                 size="lg"
               >
                 Get Started
               </Button>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 };
 
 export default Workspaces;