 import { MapPin, Mail, Phone } from "lucide-react";
 
 const Footer = () => {
   return (
     <footer id="contact" className="py-16 bg-foreground text-background">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
           {/* Brand */}
           <div>
             <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                 <span className="text-accent-foreground font-bold text-lg">C</span>
               </div>
               <span className="font-display font-bold text-xl">CoWork</span>
             </div>
             <p className="text-background/70 leading-relaxed">
               Inspiring workspaces for the modern professional. Connect, create, and grow with us.
             </p>
           </div>
 
           {/* Quick Links */}
           <div>
             <h4 className="font-semibold mb-4">Quick Links</h4>
             <ul className="space-y-3">
               <li><a href="#spaces" className="text-background/70 hover:text-background transition-colors">Our Spaces</a></li>
               <li><a href="#features" className="text-background/70 hover:text-background transition-colors">Amenities</a></li>
               <li><a href="#pricing" className="text-background/70 hover:text-background transition-colors">Pricing</a></li>
               <li><a href="#" className="text-background/70 hover:text-background transition-colors">Careers</a></li>
             </ul>
           </div>
 
           {/* Resources */}
           <div>
             <h4 className="font-semibold mb-4">Resources</h4>
             <ul className="space-y-3">
               <li><a href="#" className="text-background/70 hover:text-background transition-colors">Blog</a></li>
               <li><a href="#" className="text-background/70 hover:text-background transition-colors">Community</a></li>
               <li><a href="#" className="text-background/70 hover:text-background transition-colors">Events</a></li>
               <li><a href="#" className="text-background/70 hover:text-background transition-colors">FAQ</a></li>
             </ul>
           </div>
 
           {/* Contact */}
           <div>
             <h4 className="font-semibold mb-4">Contact Us</h4>
             <ul className="space-y-3">
               <li className="flex items-center gap-3">
                 <MapPin className="w-5 h-5 text-accent" />
                 <span className="text-background/70">123 Innovation Drive, Tech City</span>
               </li>
               <li className="flex items-center gap-3">
                 <Mail className="w-5 h-5 text-accent" />
                 <a href="mailto:hello@cowork.com" className="text-background/70 hover:text-background transition-colors">hello@cowork.com</a>
               </li>
               <li className="flex items-center gap-3">
                 <Phone className="w-5 h-5 text-accent" />
                 <a href="tel:+1234567890" className="text-background/70 hover:text-background transition-colors">+1 (234) 567-890</a>
               </li>
             </ul>
           </div>
         </div>
 
         <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-background/50 text-sm">
             © 2024 CoWork. All rights reserved.
           </p>
           <div className="flex gap-6">
             <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">Privacy Policy</a>
             <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">Terms of Service</a>
           </div>
         </div>
       </div>
     </footer>
   );
 };
 
 export default Footer;