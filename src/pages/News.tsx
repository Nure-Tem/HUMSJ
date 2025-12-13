import { useEffect, useState } from "react";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image?: string;
}

// Sample news data (will be replaced by Firebase data)
const sampleNews: NewsItem[] = [
  {
    id: "1",
    title: "Annual Quran Competition 2024",
    excerpt: "Students competed in various categories including recitation, memorization, and Tajweed excellence.",
    content: "Our annual Quran competition brought together over 100 participants from across the university...",
    date: "2024-12-01",
    category: "Events",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Ramadan Food Distribution Program",
    excerpt: "Alhamdulillah, we successfully distributed Iftar packages to 200 families in the local community.",
    content: "During the blessed month of Ramadan, our charity sub-sector organized a comprehensive food distribution...",
    date: "2024-11-15",
    category: "Charity",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "New Islamic Education Series Launched",
    excerpt: "Weekly lectures on Islamic jurisprudence now available every Thursday after Maghrib prayer.",
    content: "We are excited to announce the launch of our new Islamic Education Series focusing on practical Fiqh...",
    date: "2024-11-01",
    category: "Education",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Orphan Sponsorship Milestone",
    excerpt: "We have now successfully sponsored 50 orphans through our dedicated support program.",
    content: "Through the generosity of our donors, we have reached an important milestone in our orphan sponsorship...",
    date: "2024-10-20",
    category: "Achievement",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
  },
  {
    id: "5",
    title: "Community Outreach Day Success",
    excerpt: "Over 100 volunteers participated in our community service event, benefiting local neighborhoods.",
    content: "Our quarterly community outreach day was a tremendous success with record volunteer participation...",
    date: "2024-10-05",
    category: "Community",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
  },
  {
    id: "6",
    title: "New Partnership Announcement",
    excerpt: "HUMSJ External Affairs partners with local Islamic organizations for greater community impact.",
    content: "We are pleased to announce a new strategic partnership that will expand our reach and impact...",
    date: "2024-09-25",
    category: "News",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
  },
];

const categories = ["All", "Events", "Charity", "Education", "Achievement", "Community", "News"];

export default function News() {
  const [news, setNews] = useState<NewsItem[]>(sampleNews);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsRef = collection(db, "news");
        const q = query(newsRef, orderBy("date", "desc"), limit(20));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const newsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as NewsItem[];
          setNews(newsData);
        }
      } catch (error) {
        // Use sample data if Firebase fetch fails
        console.log("Using sample news data");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = selectedCategory === "All" 
    ? news 
    : news.filter((item) => item.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-muted/50 py-20 islamic-pattern lg:py-32">
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl animate-slide-up">
            News & Updates
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground animate-slide-up delay-100">
            Stay updated with our latest activities, events, and achievements.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-border bg-background py-4 sticky top-16 z-40 lg:top-20">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-4 w-20 rounded bg-muted mb-4" />
                    <div className="h-6 w-full rounded bg-muted mb-2" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No news items found in this category.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((item, index) => (
                <Card 
                  key={item.id}
                  className="group overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-card animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&h=400&fit=crop"}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="mb-2 font-heading text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.excerpt}
                    </p>
                    <Button variant="link" className="mt-4 h-auto p-0 text-primary">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="bg-muted/50 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
            Stay Updated
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Follow us on social media to get the latest news and updates about our programs and activities.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Follow on Facebook
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Follow on Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
