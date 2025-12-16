import { useEffect, useState } from "react";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import news4 from "@/assets/news-4.jpg";
import news5 from "@/assets/news-5.jpg";
import news6 from "@/assets/news-6.jpg";
import news7 from "@/assets/news-7.jpg";
import news8 from "@/assets/news-8.jpg";
import news9 from "@/assets/news-9.jpg";

interface NewsItem {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  date?: string;
  timestamp?: any;
  category: string;
  type?: string;
  image?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  eventDate?: string;
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
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Orphan Sponsorship Milestone",
    excerpt: "We have now successfully sponsored 50 orphans through our dedicated support program.",
    content: "Through the generosity of our donors, we have reached an important milestone in our orphan sponsorship...",
    date: "2024-10-20",
    category: "Achievement",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Community Outreach Day Success",
    excerpt: "Over 100 volunteers participated in our community service event, benefiting local neighborhoods.",
    content: "Our quarterly community outreach day was a tremendous success with record volunteer participation...",
    date: "2024-10-05",
    category: "Community",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "New Partnership Announcement",
    excerpt: "HUMSJ External Affairs partners with local Islamic organizations for greater community impact.",
    content: "We are pleased to announce a new strategic partnership that will expand our reach and impact...",
    date: "2024-09-25",
    category: "News",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
  },
  {
    id: "7",
    title: "Quran Education Program for Children",
    excerpt: "Our weekly Quran teaching sessions continue to benefit children in the local community with Islamic education.",
    content: "Our Quran education program brings together children from the community for weekly learning sessions...",
    date: "2024-12-10",
    category: "Education",
    image: news1,
  },
  {
    id: "8",
    title: "Food Aid Distribution Campaign",
    excerpt: "Alhamdulillah, we distributed food packages including oil and essential supplies to families in need.",
    content: "Our charity team successfully organized a food distribution campaign reaching dozens of families...",
    date: "2024-12-05",
    category: "Charity",
    image: news2,
  },
  {
    id: "9",
    title: "Clothing Distribution for Needy Families",
    excerpt: "New clothes were collected and prepared for distribution to underprivileged families and children.",
    content: "Through generous donations, we gathered clothing items to support families in need...",
    date: "2024-11-28",
    category: "Charity",
    image: news3,
  },
  {
    id: "10",
    title: "HUMSJ Charity Team Community Visit",
    excerpt: "Our dedicated volunteers visited rural communities to assess needs and provide direct support.",
    content: "The HUMSJ External Affairs team conducted a community outreach visit to understand local needs...",
    date: "2024-11-20",
    category: "Community",
    image: news4,
  },
  {
    id: "11",
    title: "Sadaqah Distribution Event",
    excerpt: "Elder community members received support through our ongoing Sadaqah distribution program.",
    content: "Our Sadaqah program continues to support elderly and vulnerable members of the community...",
    date: "2024-11-18",
    category: "Charity",
    image: news5,
  },
  {
    id: "12",
    title: "Eid Clothing Gift Program for Children",
    excerpt: "Children received new clothes as part of our Eid gift program, bringing joy to many families.",
    content: "The Eid gift program successfully distributed clothing to children in the community...",
    date: "2024-11-12",
    category: "Events",
    image: news6,
  },
  {
    id: "13",
    title: "NESR Charity Partnership Meeting",
    excerpt: "HUMSJ External Affairs team met with NESR Charity partners to coordinate community support efforts.",
    content: "Strategic partnership discussions were held to expand our charitable reach and impact...",
    date: "2024-11-08",
    category: "News",
    image: news7,
  },
  {
    id: "14",
    title: "Community Support Initiative",
    excerpt: "Our volunteers continue to reach out and support families in need across the local community.",
    content: "The HUMSJ External Affairs team organized another successful community support initiative...",
    date: "2024-11-03",
    category: "Community",
    image: news8,
  },
  {
    id: "15",
    title: "Charity Distribution Program",
    excerpt: "Essential items and supplies were distributed to underprivileged families as part of our ongoing charity work.",
    content: "Our charity sub-sector successfully completed another distribution program...",
    date: "2024-10-28",
    category: "Charity",
    image: news9,
  },
];

const categories = ["All", "Events", "Charity", "Education", "Achievement", "Community", "News", "General", "Workshop", "Lecture", "Charity Event", "Community Gathering", "Religious Event", "Announcement"];

export default function News() {
  const [news, setNews] = useState<NewsItem[]>(sampleNews);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch posts from Firebase
        const postsRef = collection(db, "posts");
        const q = query(
          postsRef, 
          orderBy("timestamp", "desc"), 
          limit(50)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const postsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              content: data.content,
              excerpt: data.content?.substring(0, 150) + "...",
              category: data.category,
              type: data.type,
              image: data.imageUrl,
              imageUrl: data.imageUrl,
              videoUrl: data.videoUrl,
              audioUrl: data.audioUrl,
              date: data.timestamp ? data.timestamp.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              timestamp: data.timestamp,
              eventDate: data.eventDate,
            };
          }) as NewsItem[];
          
          console.log("Firebase posts loaded:", postsData.length);
          console.log("Posts data:", postsData);
          
          // Combine Firebase posts with sample news
          const combinedNews = [...postsData, ...sampleNews];
          setNews(combinedNews);
        } else {
          console.log("No Firebase posts found, using sample data only");
          // Use sample data if no Firebase posts
          setNews(sampleNews);
        }
      } catch (error) {
        console.error("Error fetching posts, using sample data:", error);
        setNews(sampleNews);
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
          <h1 className="mb-6 font-heading text-4xl font-bold heading-blue md:text-5xl lg:text-6xl animate-slide-up">
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
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        className="h-full w-full object-cover"
                        controls
                        poster={item.imageUrl || item.image}
                      />
                    ) : (
                      <img
                        src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&h=400&fit=crop"}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
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
                      {item.excerpt || (item.content?.substring(0, 150) + "...")}
                    </p>
                    {item.audioUrl && (
                      <div className="mt-3">
                        <audio controls className="w-full">
                          <source src={item.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
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
          <h2 className="mb-4 font-heading text-2xl font-bold heading-blue md:text-3xl">
            Stay Updated
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground">
            Follow us on social media to get the latest news and updates about our programs and activities.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <a href="https://www.facebook.com/HaramayaUniversityMuslimStudentsJemaa" target="_blank" rel="noopener noreferrer">
                Follow on Facebook
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Follow on Instagram
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://t.me/humsjofficialchannel" target="_blank" rel="noopener noreferrer">
                Join Telegram
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
