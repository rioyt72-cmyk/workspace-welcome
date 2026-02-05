import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Default slides using existing assets
import coworkingImg from "@/assets/coworking-space.jpg";
import meetingImg from "@/assets/meeting-room.jpg";
import servicedImg from "@/assets/serviced-office.jpg";
import trainingImg from "@/assets/training-room.jpg";

interface Slide {
  image_url: string;
  caption: string;
}

const defaultSlides: Slide[] = [
  { image_url: coworkingImg, caption: "Coworking Space" },
  { image_url: meetingImg, caption: "Meeting Room" },
  { image_url: servicedImg, caption: "Serviced Office" },
  { image_url: trainingImg, caption: "Training Room" },
];

export function DiscoverSpacesSlideshow() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const fetchSlides = async () => {
    try {
      const { data } = await supabase
        .from("site_content")
        .select("discover_slides")
        .eq("id", "main")
        .single();

      if (data?.discover_slides && Array.isArray(data.discover_slides) && data.discover_slides.length > 0) {
        setSlides(data.discover_slides as unknown as Slide[]);
      }
      // If no slides in DB, keep using defaultSlides
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  if (loading) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Discover the <span className="text-primary">best</span> of spaces.
          </h2>
        </motion.div>

        <div className="relative">
          {/* Slideshow Container */}
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={slides[currentIndex].image_url}
                  alt={slides[currentIndex].caption}
                  className="w-full h-full object-cover"
                />
                {/* Caption Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white text-xl font-medium">
                    {slides[currentIndex].caption}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground rounded-full"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-foreground rounded-full"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {slides.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
