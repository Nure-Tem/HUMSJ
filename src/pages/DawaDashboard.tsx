import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LogOut, Eye, Calendar, Trash2, Plus, FileText, MessageSquare, Users, Mail, Phone, Megaphone, Settings } from "lucide-react";
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
  videoUrl?: string;
  timestamp?: any;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp?: any;
}

const DawaDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchDawaContent();
  }, []);

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/admin/login");
    }
  };

  const fetchDawaContent = async () => {
    try {
      // Fetch posts related to Dawa (outreach, education)
      const postsSnapshot = await getDocs(collection(db, "posts"));
      const postsData = postsSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Post))
        .filter(post => 
          post.category?.toLowerCase().includes('dawa') || 
          post.category?.toLowerCase().includes('education') ||
          post.category?.toLowerCase().includes('lecture') ||
          post.category?.toLowerCase().includes('seminar')
        );

      // Fetch contact messages
      const contactSnapshot = await getDocs(collection(db, "contacts"));
      const contactData = contactSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ContactMessage));

      setPosts(postsData);
      setContactMessages(contactData);
    } catch (error: any) {
      console.error("Error fetching Dawa content:", error);
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
      fetchDawaContent();
      setSelectedItem(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteDoc(doc(db, "contacts", id));
      toast({ title: "Deleted", description: "Message deleted successfully" });
      fetchDawaContent();
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
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-3" />
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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

  const MessageCard = ({ item }: { item: ContactMessage }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{item.email}</span>
              </div>
              {item.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{item.phone}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{item.message}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(item.timestamp)}</span>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline" onClick={() => setSelectedItem({ ...item, itemType: 'message' })}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDeleteMessage(item.id)}>
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
          <CardTitle className="text-blue-700">
            {item.itemType === 'post' ? 'Dawa Content Details' : 'Message Details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {item.itemType === 'post' ? (
            <>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.title} className="w-full h-auto rounded-lg mb-4" />
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
              <div className="border-b pb-2">
                <span className="font-semibold">Name: </span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <div className="border-b pb-2">
                <span className="font-semibold">Email: </span>
                <span className="text-gray-700">{item.email}</span>
              </div>
              {item.phone && (
                <div className="border-b pb-2">
                  <span className="font-semibold">Phone: </span>
                  <span className="text-gray-700">{item.phone}</span>
                </div>
              )}
              <div className="border-b pb-2">
                <span className="font-semibold">Message: </span>
                <p className="text-gray-700 mt-1">{item.message}</p>
              </div>
            </div>
          )}
          <div className="border-b pb-2 mt-3">
            <span className="font-semibold">Received: </span>
            <span className="text-gray-700">{formatDate(item.timestamp)}</span>
          </div>
          <Button onClick={onClose} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Dawa dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Dawa Department Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate("/admin/create-post")}
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            <Button 
              onClick={() => navigate("/admin/media-library")}
              variant="outline"
              className="border-white text-white hover:bg-blue-500"
            >
              <FileText className="h-4 w-4 mr-2" />
              Media Library
            </Button>
            <Button 
              onClick={() => navigate("/admin/dawa/settings")}
              variant="outline"
              className="border-white text-white hover:bg-blue-500"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-white text-white hover:bg-blue-500">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dawa Posts</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{posts.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{contactMessages.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Outreach</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{posts.length + contactMessages.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Dawa Content</TabsTrigger>
            <TabsTrigger value="messages">Contact Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Dawa & Education Content</CardTitle>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-12">
                    <Megaphone className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No Dawa content yet</p>
                    <Button 
                      onClick={() => navigate("/admin/create-post")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  </div>
                ) : (
                  posts.map(item => <PostCard key={item.id} item={item} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                {contactMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No contact messages yet</p>
                  </div>
                ) : (
                  contactMessages.map(item => <MessageCard key={item.id} item={item} />)
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

export default DawaDashboard;
