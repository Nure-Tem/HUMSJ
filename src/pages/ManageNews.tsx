import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { 
  ArrowLeft, Edit, Trash2, Plus, Save, X, Upload, Image as ImageIcon,
  Calendar, Tag, FileText, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MediaSelector } from "@/components/MediaSelector";

// Import existing news images
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
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  isDefault?: boolean;
}

// Default news items (existing sample news)
const defaultNewsItems: NewsItem[] = [
  {
    id: "default-1",
    title: "Annual Quran Competition 2024",
    excerpt: "Students competed in various categories including recitation, memorization, and Tajweed excellence.",
    content: "Our annual Quran competition brought together over 100 participants from across the university. The competition featured multiple categories including Quran recitation, memorization (Hifz), and Tajweed excellence. Students from different faculties showcased their Islamic knowledge and recitation skills. The event was judged by renowned Islamic scholars and Quran reciters. Winners received certificates and prizes to encourage continued Islamic learning.",
    date: "2024-12-01",
    category: "Events",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=600&h=400&fit=crop",
    isDefault: true
  },
  {
    id: "default-2",
    title: "Orphan Sponsorship Milestone",
    excerpt: "We have now successfully sponsored 50 orphans through our dedicated support program.",
    content: "Through the generosity of our donors and the dedication of our External Affairs team, we have reached an important milestone in our orphan sponsorship program. We have successfully sponsored 50 orphans, providing them with educational support, healthcare, and basic necessities. This achievement reflects our commitment to supporting the most vulnerable members of our community and fulfilling our Islamic duty of caring for orphans.",
    date: "2024-10-20",
    category: "Achievement",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
    isDefault: true
  },
  {
    id: "default-3",
    title: "Community Outreach Day Success",
    excerpt: "Over 100 volunteers participated in our community service event, benefiting local neighborhoods.",
    content: "Our quarterly community outreach day was a tremendous success with record volunteer participation. Over 100 HUMSJ members joined hands to serve the local community through various activities including neighborhood cleanup, elderly care visits, and distribution of essential supplies to needy families. The event strengthened our bonds with the local community and demonstrated the Islamic values of service and compassion.",
    date: "2024-10-05",
    category: "Community",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop",
    isDefault: true
  },
  {
    id: "default-4",
    title: "New Partnership Announcement",
    excerpt: "HUMSJ External Affairs partners with local Islamic organizations for greater community impact.",
    content: "We are pleased to announce a new strategic partnership with several local Islamic organizations that will expand our reach and impact in the community. This collaboration will enable us to coordinate our efforts more effectively, share resources, and avoid duplication of services. Together, we aim to create a stronger network of support for Muslims in our region and enhance our collective ability to serve the community.",
    date: "2024-09-25",
    category: "News",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
    isDefault: true
  },
  {
    id: "default-5",
    title: "Quran Education Program for Children",
    excerpt: "Our weekly Quran teaching sessions continue to benefit children in the local community with Islamic education.",
    content: "Our Quran education program brings together children from the community for weekly learning sessions. Qualified teachers provide instruction in Quran recitation, basic Islamic principles, and Arabic language fundamentals. The program has been running successfully for over a year and has helped dozens of children develop a strong foundation in Islamic knowledge.",
    date: "2024-12-10",
    category: "Education",
    image: news1,
    isDefault: true
  },
  {
    id: "default-6",
    title: "Food Aid Distribution Campaign",
    excerpt: "Alhamdulillah, we distributed food packages including oil and essential supplies to families in need.",
    content: "Our charity team successfully organized a food distribution campaign reaching dozens of families in need. The packages included cooking oil, rice, flour, and other essential food items. This initiative was made possible through generous donations from community members and reflects our ongoing commitment to fighting hunger and supporting vulnerable families in our area.",
    date: "2024-12-05",
    category: "Charity",
    image: news2,
    isDefault: true
  },
  {
    id: "default-7",
    title: "Clothing Distribution for Needy Families",
    excerpt: "New clothes were collected and prepared for distribution to underprivileged families and children.",
    content: "Through generous donations from community members, we gathered clothing items to support families in need. The clothing drive collected hundreds of items including children's clothes, winter wear, and everyday garments. Our volunteers sorted and packaged the items for distribution to identified families, ensuring that everyone in our community has access to proper clothing.",
    date: "2024-11-28",
    category: "Charity",
    image: news3,
    isDefault: true
  },
  {
    id: "default-8",
    title: "HUMSJ Charity Team Community Visit",
    excerpt: "Our dedicated volunteers visited rural communities to assess needs and provide direct support.",
    content: "The HUMSJ External Affairs team conducted a community outreach visit to understand local needs and provide direct assistance. Our volunteers traveled to rural areas to assess the situation of families and identify ways we can help. This hands-on approach ensures that our charity efforts are targeted and effective in addressing real community needs.",
    date: "2024-11-20",
    category: "Community",
    image: news4,
    isDefault: true
  },
  {
    id: "default-9",
    title: "Sadaqah Distribution Event",
    excerpt: "Elder community members received support through our ongoing Sadaqah distribution program.",
    content: "Our Sadaqah program continues to support elderly and vulnerable members of the community. This month's distribution event provided financial assistance and essential supplies to senior citizens who have limited income sources. The program embodies the Islamic principle of caring for our elders and ensuring they live with dignity and support.",
    date: "2024-11-18",
    category: "Charity",
    image: news5,
    isDefault: true
  },
  {
    id: "default-10",
    title: "Eid Clothing Gift Program for Children",
    excerpt: "Children received new clothes as part of our Eid gift program, bringing joy to many families.",
    content: "The Eid gift program successfully distributed new clothing to children in the community, bringing joy and celebration to many families. This annual initiative ensures that all children can participate in Eid celebrations with new clothes, regardless of their family's financial situation. The program reflects our commitment to making Islamic celebrations inclusive and joyful for everyone.",
    date: "2024-11-12",
    category: "Events",
    image: news6,
    isDefault: true
  },
  {
    id: "default-11",
    title: "NESR Charity Partnership Meeting",
    excerpt: "HUMSJ External Affairs team met with NESR Charity partners to coordinate community support efforts.",
    content: "Strategic partnership discussions were held with NESR Charity to expand our charitable reach and impact. The meeting focused on coordinating our efforts to avoid duplication and maximize the benefit to the community. Both organizations committed to sharing resources and information to better serve families in need throughout the region.",
    date: "2024-11-08",
    category: "News",
    image: news7,
    isDefault: true
  },
  {
    id: "default-12",
    title: "Community Support Initiative",
    excerpt: "Our volunteers continue to reach out and support families in need across the local community.",
    content: "The HUMSJ External Affairs team organized another successful community support initiative, reaching out to families across the local area. Volunteers provided various forms of assistance including food packages, educational support for children, and help with daily tasks for elderly community members. This ongoing program demonstrates our commitment to being an active and supportive presence in the community.",
    date: "2024-11-03",
    category: "Community",
    image: news8,
    isDefault: true
  },
  {
    id: "default-13",
    title: "Charity Distribution Program",
    excerpt: "Essential items and supplies were distributed to underprivileged families as part of our ongoing charity work.",
    content: "Our charity sub-sector successfully completed another distribution program, providing essential items and supplies to underprivileged families in the community. The distribution included household items, school supplies for children, and basic necessities. This regular program ensures that vulnerable families receive consistent support and demonstrates our ongoing commitment to social welfare.",
    date: "2024-10-28",
    category: "Charity",
    image: news9,
    isDefault: true
  }
];

const categories = ["Events", "Charity", "Education", "Achievement", "Community", "News", "General", "Workshop", "Lecture", "Charity Event", "Community Gathering", "Religious Event", "Announcement"];

const ManageNews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadNewsItems();
  }, []);

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/admin/login");
    }
  };

  const loadNewsItems = async () => {
    try {
      // Load custom news items from Firebase
      const customNewsSnapshot = await getDocs(collection(db, "customNews"));
      const customNews = customNewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isDefault: false
      })) as NewsItem[];

      // Load default news items from Firebase (if they exist)
      const defaultNewsSnapshot = await getDocs(collection(db, "defaultNews"));
      let defaultNews: NewsItem[] = [];
      
      if (defaultNewsSnapshot.empty) {
        // If no default news in Firebase, use the hardcoded ones
        defaultNews = defaultNewsItems;
      } else {
        defaultNews = defaultNewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isDefault: true
        })) as NewsItem[];
      }

      // Combine and sort by date
      const allNews = [...customNews, ...defaultNews].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setNewsItems(allNews);
    } catch (error) {
      console.error("Error loading news items:", error);
      toast({
        title: "Error",
        description: "Failed to load news items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeDefaultNews = async () => {
    try {
      setIsSaving(true);
      
      // Save default news items to Firebase
      for (const item of defaultNewsItems) {
        await addDoc(collection(db, "defaultNews"), {
          ...item,
          timestamp: serverTimestamp(),
        });
      }

      toast({
        title: "Success",
        description: "Default news items initialized in database",
      });

      loadNewsItems();
    } catch (error) {
      console.error("Error initializing default news:", error);
      toast({
        title: "Error",
        description: "Failed to initialize default news items",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem({ ...item });
    setImagePreview(item.image);
    setSelectedImage(null);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      setIsSaving(true);

      let imageUrl = editingItem.image;

      // Upload new image if selected
      if (selectedImage) {
        toast({
          title: "Uploading image...",
          description: "Please wait while we upload your image",
        });
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      const updatedItem = {
        ...editingItem,
        image: imageUrl,
        timestamp: serverTimestamp(),
      };

      const collection_name = editingItem.isDefault ? "defaultNews" : "customNews";

      if (editingItem.id.startsWith("default-") && !editingItem.isDefault) {
        // Converting default to custom
        await addDoc(collection(db, "customNews"), updatedItem);
      } else {
        // Update existing item
        await updateDoc(doc(db, collection_name, editingItem.id), updatedItem);
      }

      toast({
        title: "Success",
        description: "News item updated successfully",
      });

      setEditingItem(null);
      setSelectedImage(null);
      setImagePreview(null);
      loadNewsItems();
    } catch (error) {
      console.error("Error saving news item:", error);
      toast({
        title: "Error",
        description: "Failed to save news item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: NewsItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      const collection_name = item.isDefault ? "defaultNews" : "customNews";
      await deleteDoc(doc(db, collection_name, item.id));

      toast({
        title: "Success",
        description: "News item deleted successfully",
      });

      loadNewsItems();
    } catch (error) {
      console.error("Error deleting news item:", error);
      toast({
        title: "Error",
        description: "Failed to delete news item",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaSelect = (file: any) => {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        image: file.url
      });
      setImagePreview(file.url);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading news items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold heading-blue">Manage News & Events</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/admin/create-post")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
            <Button
              onClick={initializeDefaultNews}
              variant="outline"
              disabled={isSaving}
            >
              Initialize Default News
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {editingItem ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="heading-blue">
                Edit News Item: {editingItem.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        title: e.target.value
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={editingItem.category} 
                      onValueChange={(value) => setEditingItem({
                        ...editingItem,
                        category: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={editingItem.date}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        date: e.target.value
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={editingItem.excerpt}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        excerpt: e.target.value
                      })}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Current Image</Label>
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Update Image</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New
                      </Button>
                      <MediaSelector
                        onSelect={handleMediaSelect}
                        fileType="image"
                        trigger={
                          <Button type="button" variant="outline" className="flex-1">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            From Library
                          </Button>
                        }
                      />
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    content: e.target.value
                  })}
                  rows={6}
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingItem(null);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video overflow-hidden rounded-lg mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.isDefault 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.isDefault ? 'Default' : 'Custom'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.excerpt}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageNews;