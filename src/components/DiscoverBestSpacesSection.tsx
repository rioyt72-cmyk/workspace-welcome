import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import discoverBestSpacesImg from "@/assets/discover-best-spaces.png";

export function DiscoverBestSpacesSection() {
  const [imageUrl, setImageUrl] = useState<string>(discoverBestSpacesImg);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data } = await supabase
          .from("site_content")
          .select("discover_section_image")
          .eq("id", "main")
          .single();

        if (data?.discover_section_image) {
          setImageUrl(data.discover_section_image);
        }
      } catch (error) {
        console.error("Error fetching discover image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <header className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Discover the best spaces
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore curated coworking spaces, private offices, meeting rooms, and flexible solutions
              across top cities.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#workspaces">Explore workspaces</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/enterprise">Enterprise solutions</a>
              </Button>
            </div>
          </header>

          <div className="lg:col-span-7">
            <div className="rounded-2xl overflow-hidden border bg-card shadow-card">
              <img
                src={imageUrl}
                alt="Discover the best spaces section preview"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}