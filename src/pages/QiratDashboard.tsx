import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LogOut, Eye, Calendar, Trash2, Plus, FileText, BookOpen, Music, Baby, Phone, Mail, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  type: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  timestamp?: any;
}

interface ChildRegistration {
  id: string;
  childName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  timestamp?: any;
  [key: string]: any;
}

const QiratDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [childrenRegistrations, setChildrenRegistrations] = useState<ChildRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchQiratContent();
  }, []);

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/admin/login");
    }
  };

  const fetchQiratContent = async () => {
    try {
      // Fetch posts related to Qirat (Quran recitation)
      const postsSnapshot = await getDocs(collection(db, "posts"));
      const postsData = postsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Post))
        .filter(post => 
          post.category?.toLowerCase().includes('qirat') || 
          post.category?.toLowerCase().includes('quran') ||
          post.category?.toLowerCase().includes('recitation')
        );

      // Fetch children registrations
      const childrenSnapshot = await getDocs(collection(db, "childrenRegistrations"));
      const childrenData = childrenSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChildRegistration));

      setPosts(postsData);
      setChildrenRegistrations(childrenData);
    } catch (error: any) {
      console.error("Error fetching Qirat content:", error);
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({ title: "Logged Out", description: "You have been successfully logged out" });
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      toast({ title: "Deleted", description: "Post deleted successfully" });
      fetchQiratContent();
      setSelectedItem(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
    }
  };

  const handleDeleteChild = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    try {
      await deleteDoc(doc(db, "childrenRegistrations", id));
      toast({ title: "Deleted", description: "Registration deleted successfully" });
      fetchQiratContent();
      setSelectedItem(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const PostCard = ({ item }: { item: Post }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {item.audioUrl && (
              <div className="mb-3 p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Audio Recitation</span>
                </div>
                <audio controls className="w-full">
                  <source src={item.audioUrl} type="audio/mpeg" />
                </audio>
              </div>
            )}
            {item.videoUrl && (
              <video src={item.videoUrl} className="w-full h-32 object-cover rounded-lg mb-3" controls />
            )}
            {item.imageUrl && !item.videoUrl && (
              <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {item.category}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.content}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(item.timestamp)}</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => setSelectedItem({ ...item, itemType: 'post' })}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDeletePost(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ChildCard = ({ item }: { item: ChildRegistration }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{item.childName || item.fullName || "N/A"}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {item.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{item.phone}</span>
                </div>
              )}
              {item.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{item.email}</span>
                </div>
              )}
              {item.timestamp && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(item.timestamp)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedItem({ ...item, itemType: 'child' })}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDeleteChild(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );


  const DetailModal = ({ item, onClose }: { item: any; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-emerald-700">
            {item.itemType === 'post' ? 'Qirat Content Details' : 'Child Registration Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {item.itemType === 'post' ? (
            <>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-full h-auto rounded-lg mb-4" />
              )}
              {item.videoUrl && (
                <video src={item.videoUrl} className="w-full rounded-lg mb-4" controls />
              )}
              {item.audioUrl && (
                <div className="mb-4 p-4 bg-emerald-50 rounded-lg">
                  <p className="font-semibold mb-2 text-emerald-700">Audio Recitation:</p>
                  <audio controls className="w-full">
                    <source src={item.audioUrl} type="audio/mpeg" />
                  </audio>
                </div>
              )}
              <div className="space-y-3">
                <div className="border-b pb-2">
                  <span className="font-semibold">Title: </span>
                  <span className="text-gray-700">{item.title}</span>
                </div>
                <div className="border-b pb-2">
                  <span className="font-semibold">Category: </span>
                  <span className="text-gray-700">{item.category}</span>
                </div>
                <div className="border-b pb-2">
                  <span className="font-semibold">Content: </span>
                  <p className="text-gray-700 mt-1">{item.content}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {item.documentUrl && (
                <div className="mb-4">
                  <p className="font-semibold mb-2">Uploaded Document:</p>
                  <img src={item.documentUrl} alt="Document" className="max-w-full h-auto rounded-lg border" />
                </div>
              )}
              {Object.entries(item).map(([key, value]) => {
                if (key === "id" || key === "itemType" || key === "documentUrl") return null;
                return (
                  <div key={key} className="border-b pb-2">
                    <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}: </span>
                    <span className="text-gray-700">
                      {key === "timestamp" ? formatDate(value) : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <Button onClick={onClose} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Qirat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Qirat Department Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate("/admin/qirat/create")}
              className="bg-white text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recitation
            </Button>
            <Button 
              onClick={() => navigate("/admin/media-library")}
              variant="outline"
              className="border-white text-white hover:bg-emerald-500"
            >
              <FileText className="h-4 w-4 mr-2" />
              Media Library
            </Button>
            <Button 
              onClick={() => navigate("/admin/qirat/settings")}
              variant="outline"
              className="border-white text-white hover:bg-emerald-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-white text-white hover:bg-emerald-500">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recitations</CardTitle>
              <Music className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{posts.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audio Files</CardTitle>
              <Music className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">
                {posts.filter(p => p.audioUrl).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Video Content</CardTitle>
              <FileText className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">
                {posts.filter(p => p.videoUrl).length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Children Registered</CardTitle>
              <Baby className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{childrenRegistrations.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recitations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recitations">Qirat Content</TabsTrigger>
            <TabsTrigger value="children">Children Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="recitations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">Qirat Content</CardTitle>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No Qirat content yet</p>
                    <Button 
                      onClick={() => navigate("/admin/qirat/create")}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Recitation
                    </Button>
                  </div>
                ) : (
                  posts.map(item => <PostCard key={item.id} item={item} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="children" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-700">Children Registrations (Quran Learning)</CardTitle>
              </CardHeader>
              <CardContent>
                {childrenRegistrations.length === 0 ? (
                  <div className="text-center py-12">
                    <Baby className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No children registrations yet</p>
                  </div>
                ) : (
                  childrenRegistrations.map(item => <ChildCard key={item.id} item={item} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};

export default QiratDashboard;
