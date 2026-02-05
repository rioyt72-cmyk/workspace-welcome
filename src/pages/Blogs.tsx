import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "The Rise of Flexible Workspaces in India",
    excerpt: "Discover how flexible workspaces are reshaping the way India works and why more businesses are embracing this modern approach.",
    author: "Aztech Team",
    date: "Jan 28, 2026",
    readTime: "5 min read",
    category: "Industry Trends",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format"
  },
  {
    id: 2,
    title: "How to Choose the Perfect Coworking Space",
    excerpt: "A comprehensive guide to finding a coworking space that matches your business needs, culture, and budget.",
    author: "Workspace Expert",
    date: "Jan 25, 2026",
    readTime: "7 min read",
    category: "Tips & Guides",
    image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format"
  },
  {
    id: 3,
    title: "Benefits of Virtual Offices for Startups",
    excerpt: "Learn how virtual offices can help startups establish a professional presence without the overhead of traditional office space.",
    author: "Business Insights",
    date: "Jan 22, 2026",
    readTime: "4 min read",
    category: "Startups",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format"
  },
  {
    id: 4,
    title: "Designing the Perfect Meeting Room",
    excerpt: "Tips and best practices for creating meeting spaces that foster collaboration and productivity.",
    author: "Design Team",
    date: "Jan 18, 2026",
    readTime: "6 min read",
    category: "Design",
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format"
  },
  {
    id: 5,
    title: "The Future of Hybrid Work in 2026",
    excerpt: "Exploring the trends and technologies that will shape the future of hybrid work environments.",
    author: "Aztech Team",
    date: "Jan 15, 2026",
    readTime: "8 min read",
    category: "Industry Trends",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format"
  },
  {
    id: 6,
    title: "Cost Savings with Serviced Offices",
    excerpt: "A detailed analysis of how serviced offices can reduce operational costs for growing businesses.",
    author: "Finance Team",
    date: "Jan 10, 2026",
    readTime: "5 min read",
    category: "Business",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&auto=format"
  },
];

const Blogs = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen bg-background ${isMobile ? "pb-20" : ""}`}>
      {isMobile ? <MobileHeader /> : <Header />}
      
      <main className={isMobile ? "pt-16" : ""}>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-background py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Our Blog
              </h1>
              <p className="text-lg text-muted-foreground">
                Insights, tips, and trends from the world of flexible workspaces
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                      {post.category}
                    </span>
                    <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {post.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Blogs;
