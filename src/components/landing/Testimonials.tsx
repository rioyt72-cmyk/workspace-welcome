 import { Star } from "lucide-react";
 
 const testimonials = [
   {
     name: "Sarah Chen",
     role: "Startup Founder",
     content: "CoWork transformed how our team collaborates. The energy here is incredible, and we've made invaluable connections with other companies in the space.",
     rating: 5,
   },
   {
     name: "Marcus Johnson",
     role: "Freelance Designer",
     content: "After years of working from home, CoWork gave me the structure and community I was missing. The amenities are top-notch and the price is fair.",
     rating: 5,
   },
   {
     name: "Elena Rodriguez",
     role: "Remote Team Lead",
     content: "Managing a distributed team is so much easier with access to professional meeting rooms. Our video calls look and sound great every time.",
     rating: 5,
   },
 ];
 
 const Testimonials = () => {
   return (
     <section className="py-20 lg:py-32 bg-background">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center max-w-3xl mx-auto mb-16">
           <span className="text-accent font-semibold text-sm uppercase tracking-wider">Testimonials</span>
           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 mb-6">
             Loved by thousands of professionals
           </h2>
           <p className="text-muted-foreground text-lg">
             Don't just take our word for it—hear from our thriving community.
           </p>
         </div>
 
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {testimonials.map((testimonial, index) => (
             <div
               key={testimonial.name}
               className="p-8 rounded-2xl bg-card border border-border shadow-soft animate-fade-in"
               style={{ animationDelay: `${index * 0.1}s` }}
             >
               <div className="flex gap-1 mb-4">
                 {Array.from({ length: testimonial.rating }).map((_, i) => (
                   <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                 ))}
               </div>
               <p className="text-foreground leading-relaxed mb-6">
                 "{testimonial.content}"
               </p>
               <div>
                 <p className="font-semibold">{testimonial.name}</p>
                 <p className="text-sm text-muted-foreground">{testimonial.role}</p>
               </div>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 };
 
 export default Testimonials;