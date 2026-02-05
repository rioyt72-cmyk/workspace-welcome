import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TermsAndPolicy = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen bg-background ${isMobile ? "pb-20" : ""}`}>
      {isMobile ? <MobileHeader /> : <Header />}
      
      <main className={isMobile ? "pt-16" : ""}>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-background py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Terms & Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: February 1, 2026
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <Tabs defaultValue="terms" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="terms">Terms of Service</TabsTrigger>
                <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              </TabsList>

              <TabsContent value="terms">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-gray max-w-none"
                >
                  <div className="bg-card rounded-xl p-6 lg:p-8 border border-border space-y-6">
                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
                      <p className="text-muted-foreground">
                        By accessing and using Aztech Coworks platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">2. Use of Service</h2>
                      <p className="text-muted-foreground mb-3">
                        You agree to use our service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform.
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>You must be at least 18 years old to use our services</li>
                        <li>You are responsible for maintaining the confidentiality of your account</li>
                        <li>You agree to provide accurate and complete information</li>
                        <li>You may not use the service for any illegal or unauthorized purpose</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">3. Booking and Payments</h2>
                      <p className="text-muted-foreground mb-3">
                        All bookings are subject to availability and confirmation. Payment terms and cancellation policies may vary based on the workspace provider.
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Prices are subject to change without notice</li>
                        <li>Refund policies are determined by individual workspace providers</li>
                        <li>We use secure payment gateways for all transactions</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">4. Limitation of Liability</h2>
                      <p className="text-muted-foreground">
                        Aztech Coworks shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">5. Changes to Terms</h2>
                      <p className="text-muted-foreground">
                        We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date on this page.
                      </p>
                    </section>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="privacy">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-gray max-w-none"
                >
                  <div className="bg-card rounded-xl p-6 lg:p-8 border border-border space-y-6">
                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
                      <p className="text-muted-foreground mb-3">
                        We collect information you provide directly to us, including:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Name, email address, and phone number</li>
                        <li>Payment and billing information</li>
                        <li>Booking preferences and history</li>
                        <li>Communication preferences</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
                      <p className="text-muted-foreground mb-3">
                        We use the information we collect to:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Process bookings and payments</li>
                        <li>Send booking confirmations and updates</li>
                        <li>Respond to your inquiries and support requests</li>
                        <li>Improve our services and user experience</li>
                        <li>Send promotional communications (with your consent)</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">3. Information Sharing</h2>
                      <p className="text-muted-foreground">
                        We do not sell or rent your personal information to third parties. We may share your information with workspace providers to fulfill your bookings and with service providers who assist us in operating our platform.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">4. Data Security</h2>
                      <p className="text-muted-foreground">
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                      </p>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">5. Your Rights</h2>
                      <p className="text-muted-foreground mb-3">
                        You have the right to:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Access your personal information</li>
                        <li>Correct inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Opt-out of marketing communications</li>
                      </ul>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-foreground mb-3">6. Contact Us</h2>
                      <p className="text-muted-foreground">
                        If you have any questions about this Privacy Policy, please contact us at privacy@aztechcoworks.com or call us at +91 9876543210.
                      </p>
                    </section>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default TermsAndPolicy;
