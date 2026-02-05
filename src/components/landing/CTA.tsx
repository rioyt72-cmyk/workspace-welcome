 import { Button } from "@/components/ui/button";
 import { ArrowRight } from "lucide-react";
 
 const CTA = () => {
   return (
     <section className="py-20 lg:py-32 bg-primary">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
         <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6 max-w-3xl mx-auto">
           Ready to transform the way you work?
         </h2>
         <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
           Join thousands of professionals who have already discovered their perfect workspace.
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Button variant="hero" size="xl">
             Start Your Free Trial
             <ArrowRight className="w-5 h-5" />
           </Button>
           <Button variant="heroOutline" size="xl">
             Schedule a Tour
           </Button>
         </div>
       </div>
     </section>
   );
 };
 
 export default CTA;