import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LogOut, Users, Trash2, Eye, Calendar, Phone, Mail, Baby, Heart, Gift, MessageSquare, FileText, Plus, BookOpen, Megaphone, HandHeart, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  type: string;
  timestamp?: any;
  [key: string]: any;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [helpRequests, setHelpRequests] = useState<Submission[]>([]);
  const [childrenRegistrations, setChildrenRegistrations] = useState<Submission[]>([]);
  const [monthlyCharity, setMonthlyCharity] = useState<Submission[]>([]);
  const [charityDistribution, setCharityDistribution] = useState<Submission[]>([]);
  const [contactMessages, setContactMessages] = useState<Submission[]>([]);
  const [posts, setPosts] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Submission | null>(null);

  useEffect(() => {
    checkAuth();
    fetchSubmissions();
  }, []);

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/admin/login");
    }
  };

  const fetchSubmissions = async () => {
    try {
      // Fetch help registrations
      const helpSnapshot = await getDocs(collection(db, "helpRegistrations"));
      const helpData = helpSnapshot.docs.map(doc => ({
        id: doc.id,
        type: "help",
        ...doc.data()
      }));

      // Fetch children registrations
      const childrenSnapshot = await getDocs(collection(db, "childrenRegistrations"));
      const childrenData = childrenSnapshot.docs.map(doc => ({
        id: doc.id,
        type: "children",
        ...doc.data()
      }));

      // Fetch monthly charity registrations
      const monthlySnapshot = await getDocs(collection(db, "monthlyCharityRegistrations"));
      const monthlyData = monthlySnapshot.docs.map(doc => ({
        id: doc.id,
        type: "monthly",
        ...doc.data()
      }));

      // Fetch charity distribution
      const distributionSnapshot = await getDocs(collection(db, "charityDistributions"));
      const distributionData = distributionSnapshot.docs.map(doc => ({
        id: doc.id,
        type: "distribution",
        ...doc.data()
      }));

      // Fetch contact messages
      const contactSnapshot = await getDocs(collection(db, "contacts"));
      const contactData = contactSnapshot.docs.map(doc => ({
        id: doc.id,
        type: "contact",
        ...doc.data()
      }));

      // Fetch posts (news and events)
      const postsSnapshot = await getDocs(collection(db, "posts"));
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: "post",
        ...doc.data()
      }));

      console.log("Help registrations:", helpData.length);
      console.log("Children registrations:", childrenData.length);
      console.log("Monthly charity:", monthlyData.length);
      console.log("Charity distributions:", distributionData.length);
      console.log("Contact messages:", contactData.length);
      console.log("Posts:", postsData.length);

      setHelpRequests(helpData);
      setChildrenRegistrations(childrenData);
      setMonthlyCharity(monthlyData);
      setCharityDistribution(distributionData);
      setContactMessages(contactData);
      setPosts(postsData);
    } catch (error: any) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({
        title: "Deleted",
        description: "Submission deleted successfully",
      });
      fetchSubmissions();
      setSelectedItem(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const SubmissionCard = ({ item, collectionName }: { item: Submission; collectionName: string }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{item.fullName || item.name || item.childName || "N/A"}</h3>
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
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedItem(item)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(item.id, collectionName)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PostCard = ({ item }: { item: Submission }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {item.videoUrl ? (
              <video 
                src={item.videoUrl} 
                className="w-full h-32 object-cover rounded-lg mb-3"
                controls
                poster={item.imageUrl}
              />
            ) : item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            ) : null}
            {item.audioUrl && (
              <div className="mb-3">
                <audio controls className="w-full">
                  <source src={item.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.type === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {item.type === 'news' ? 'News' : 'Event'}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {item.category}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.content}</p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(item.timestamp)}</span>
              </div>
              {item.eventDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Event: {new Date(item.eventDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedItem(item)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(item.id, "posts")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DetailModal = ({ item, onClose }: { item: Submission; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="heading-blue">Submission Details</CardTitle>
        </CardHeader>
        <CardContent>
          {item.documentUrl && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Uploaded Document:</p>
              <img 
                src={item.documentUrl} 
                alt="Uploaded document" 
                className="max-w-full h-auto rounded-lg border shadow-sm"
              />
              <a 
                href={item.documentUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              >
                Open in new tab
              </a>
            </div>
          )}
          {item.imageUrl && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Featured Image:</p>
              <img 
                src={item.imageUrl} 
                alt="Featured image" 
                className="max-w-full h-auto rounded-lg border shadow-sm"
              />
            </div>
          )}
          {item.videoUrl && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Video:</p>
              <video 
                src={item.videoUrl} 
                className="max-w-full h-auto rounded-lg border shadow-sm"
                controls
                poster={item.imageUrl}
              />
            </div>
          )}
          {item.audioUrl && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Audio:</p>
              <audio controls className="w-full">
                <source src={item.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          <div className="space-y-3">
            {Object.entries(item).map(([key, value]) => {
              if (key === "id" || key === "type" || key === "documentUrl") return null;
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
          <Button onClick={onClose} className="mt-4 w-full">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold heading-blue">HUMSJ Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate("/admin/qirat")}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Qirat
            </Button>
            <Button 
              onClick={() => navigate("/admin/dawa")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Dawa
            </Button>
            <Button 
              onClick={() => navigate("/admin/charity")}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <HandHeart className="h-4 w-4 mr-2" />
              Charity
            </Button>
            <Button 
              onClick={() => navigate("/admin/external-affairs")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Users className="h-4 w-4 mr-2" />
              EA Leaders
            </Button>
            <Button 
              onClick={() => navigate("/admin/create-post")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            <Button 
              onClick={() => navigate("/admin/media-library")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Media Library
            </Button>
            <Button 
              onClick={() => navigate("/admin/settings")}
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Help Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{helpRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Children</CardTitle>
              <Baby className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{childrenRegistrations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Charity</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyCharity.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distributions</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{charityDistribution.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactMessages.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="help">Help</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="help" className="mt-6">
            {helpRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No help registrations yet</p>
            ) : (
              helpRequests.map(item => (
                <SubmissionCard key={item.id} item={item} collectionName="helpRegistrations" />
              ))
            )}
          </TabsContent>
          <TabsContent value="children" className="mt-6">
            {childrenRegistrations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No children registrations yet</p>
            ) : (
              childrenRegistrations.map(item => (
                <SubmissionCard key={item.id} item={item} collectionName="childrenRegistrations" />
              ))
            )}
          </TabsContent>
          <TabsContent value="monthly" className="mt-6">
            {monthlyCharity.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No monthly charity registrations yet</p>
            ) : (
              monthlyCharity.map(item => (
                <SubmissionCard key={item.id} item={item} collectionName="monthlyCharityRegistrations" />
              ))
            )}
          </TabsContent>
          <TabsContent value="distribution" className="mt-6">
            {charityDistribution.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No charity distributions yet</p>
            ) : (
              charityDistribution.map(item => (
                <SubmissionCard key={item.id} item={item} collectionName="charityDistributions" />
              ))
            )}
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            {contactMessages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No contact messages yet</p>
            ) : (
              contactMessages.map(item => (
                <SubmissionCard key={item.id} item={item} collectionName="contacts" />
              ))
            )}
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            {posts.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No posts yet</p>
            ) : (
              posts.map(item => (
                <PostCard key={item.id} item={item} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
