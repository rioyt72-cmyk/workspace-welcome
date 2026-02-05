import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Loader2, Plus, Trash2, GripVertical } from "lucide-react";

interface Slide {
  image_url: string;
  caption: string;
}

export function SiteContentManager() {
  const [discoverImage, setDiscoverImage] = useState<string | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCaption, setNewCaption] = useState("");

  useEffect(() => {
    fetchSiteContent();
  }, []);

  const fetchSiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("discover_section_image, discover_slides")
        .eq("id", "main")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data?.discover_section_image) {
        setDiscoverImage(data.discover_section_image);
      }
      if (data?.discover_slides && Array.isArray(data.discover_slides)) {
        setSlides(data.discover_slides as unknown as Slide[]);
      }
    } catch (error) {
      console.error("Error fetching site content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `discover-section.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("site-content")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-content")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("site_content")
        .upsert({
          id: "main",
          discover_section_image: imageUrl,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      setDiscoverImage(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingSlide(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `slide-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("site-content")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-content")
        .getPublicUrl(fileName);

      const newSlide: Slide = {
        image_url: urlData.publicUrl,
        caption: newCaption || "Workspace",
      };

      const updatedSlides = [...slides, newSlide];

      const { error: updateError } = await supabase
        .from("site_content")
        .update({
          discover_slides: JSON.parse(JSON.stringify(updatedSlides)),
          updated_at: new Date().toISOString(),
        })
        .eq("id", "main");

      if (updateError) throw updateError;

      setSlides(updatedSlides);
      setNewCaption("");
      toast.success("Slide added successfully!");
    } catch (error) {
      console.error("Error uploading slide:", error);
      toast.error("Failed to add slide");
    } finally {
      setUploadingSlide(false);
    }
  };

  const handleDeleteSlide = async (index: number) => {
    try {
      const updatedSlides = slides.filter((_, i) => i !== index);

      const { error } = await supabase
        .from("site_content")
        .update({
          discover_slides: JSON.parse(JSON.stringify(updatedSlides)),
          updated_at: new Date().toISOString(),
        })
        .eq("id", "main");

      if (error) throw error;

      setSlides(updatedSlides);
      toast.success("Slide removed!");
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast.error("Failed to delete slide");
    }
  };

  const handleCaptionChange = async (index: number, caption: string) => {
    const updatedSlides = slides.map((slide, i) =>
      i === index ? { ...slide, caption } : slide
    );
    setSlides(updatedSlides);

    try {
      const { error } = await supabase
        .from("site_content")
        .update({
          discover_slides: JSON.parse(JSON.stringify(updatedSlides)),
          updated_at: new Date().toISOString(),
        })
        .eq("id", "main");

      if (error) throw error;
    } catch (error) {
      console.error("Error updating caption:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Homepage Discover Section Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Homepage: Discover Section Image
          </CardTitle>
          <CardDescription>
            Image displayed on the homepage "Discover the best spaces" section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="border rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
                {discoverImage ? (
                  <img
                    src={discoverImage}
                    alt="Discover section preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No image uploaded</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <Label htmlFor="discover-image" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                  ) : (
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  )}
                  <p className="mt-2 text-sm font-medium">
                    {uploading ? "Uploading..." : "Upload New Image"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <Input
                  id="discover-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Slideshow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Enterprise Page: Discover Spaces Slideshow
          </CardTitle>
          <CardDescription>
            Manage the slideshow images for the "Discover the best of spaces" section on Enterprise page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Slides */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Current Slides ({slides.length})</Label>
            
            {slides.length === 0 ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No slides added yet. Add your first slide below.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30"
                  >
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                    <div className="w-32 h-20 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={slide.image_url}
                        alt={slide.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={slide.caption}
                        onChange={(e) => handleCaptionChange(index, e.target.value)}
                        placeholder="Caption"
                        className="max-w-xs"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSlide(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Slide */}
          <div className="border-t pt-6">
            <Label className="text-base font-semibold mb-4 block">Add New Slide</Label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-1">
                <Input
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Enter caption (e.g., Coworking Space)"
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Caption will appear at the bottom of the slide
                </p>
              </div>
              <Label htmlFor="slide-upload" className="cursor-pointer">
                <div className="border-2 border-dashed rounded-lg px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors flex items-center gap-2">
                  {uploadingSlide ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {uploadingSlide ? "Uploading..." : "Upload & Add Slide"}
                  </span>
                </div>
                <Input
                  id="slide-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSlideUpload}
                  disabled={uploadingSlide}
                />
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}