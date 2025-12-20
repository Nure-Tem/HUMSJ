import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LogOut, Eye, Calendar, Trash2, Phone, Mail, Users, Heart, Gift, HandHeart, Settings, Plus, MessageSquare, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ReplyModal from "@/components/ReplyModal";

interface Submission {
  id: string;
  type: string;
  timestamp?: any;
  replies?: any[];
  status?: string;
  [key: string]: any;
}

const CharityDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [helpRequests, setHelpRequests] = useState<Submission[]>([]);
  const [monthlyCharity, setMonthlyCharity] = useState<Submission[]>([]);
  const [charityDistribution, setCharityDistribution] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Submission | null>(null);
  const [replyItem, setReplyItem] = useState<Submission | null>(null);

  useEffect(() => {
    checkAuth();
    fetchCharityData();
  }, []);

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/admin/login");
    }
  };

  const fetchCharityData = async () => {
    try {
      const helpSnapshot = await getDocs(collection(db, "helpRegistrations"));
      const helpData = helpSnapshot.docs.map(doc => ({ id: doc.id, type: "help", ...doc.data() }));

      const monthlySnapshot = await getDocs(collection(db, "monthlyCharityRegistrations"));
      const monthlyData = monthlySnapshot.docs.map(doc => ({ id: doc.id, type: "monthly", ...doc.data() }));

      const distributionSnapshot = await getDocs(collection(db, "charityDistributions"));
      const distributionData = distributionSnapshot.docs.map(doc => ({ id: doc.id, type: "distribution", ...doc.data() }));

      setHelpRequests(helpData);
      setMonthlyCharity(monthlyData);
      setCharityDistribution(distributionData);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin/login");
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({ title: "Deleted", description: "Submission deleted successfully" });
      fetchCharityData();
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

  const getCollectionName = (type: string) => {
    switch (type) {
      case "help": return "helpRegistrations";
      case "monthly": return "monthlyCharityRegistrations";
      case "distribution": return "charityDistributions";
      default: return "";
    }
  };

  const SubmissionCard = ({ item }: { item: Submission }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{item.fullName || item.name || "N/A"}</h3>
              {item.status === "replied" && (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3" /> Replied
                </span>
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              {item.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /><span>{item.phone}</span>
                </div>
              )}
              {item.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /><span>{item.email}</span>
                </div>
              )}
              {item.timestamp && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /><span>{formatDate(item.timestamp)}</span>
                </div>
              )}
              {item.replies && item.replies.length > 0 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <MessageSquare className="h-4 w-4" />
                  <span>{item.replies.length} reply(ies)</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={() => setReplyItem(item)}>
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id, getCollectionName(item.type))}>
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
          <CardTitle className="text-amber-700">Submission Details</CardTitle>
        </CardHeader>
        <CardContent>
          {item.documentUrl && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Uploaded Document:</p>
              <img src={item.documentUrl} alt="Document" className="max-w-full h-auto rounded-lg border" />
            </div>
          )}
          <div className="space-y-3">
            {Object.entries(item).map(([key, value]) => {
              if (["id", "type", "documentUrl", "replies", "lastReplyAt"].includes(key)) return null;
              return (
                <div key={key} className="border-b pb-2">
                  <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}: </span>
                  <span className="text-gray-700">{key === "timestamp" ? formatDate(value) : String(value)}</span>
                </div>
              );
            })}
          </div>
          
          {/* Show Replies */}
          {item.replies && item.replies.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="font-semibold text-amber-700 mb-3">Admin Replies:</p>
              {item.replies.map((reply: any, idx: number) => (
                <div key={idx} className="mb-3 p-3 bg-white rounded border">
                  <p className="text-gray-800">{reply.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(reply.repliedAt)} by {reply.repliedBy}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button onClick={() => { onClose(); setReplyItem(item); }} className="flex-1 bg-amber-600 hover:bg-amber-700">
              <MessageSquare className="h-4 w-4 mr-2" /> Reply
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HandHeart className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Charity Department Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/admin/charity/create")} className="bg-white text-amber-700 hover:bg-amber-50">
              <Plus className="h-4 w-4 mr-2" /> Create Post
            </Button>
            <Button onClick={() => navigate("/admin/charity/settings")} variant="outline" className="border-white text-white hover:bg-amber-500">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
            <Button onClick={handleLogout} variant="outline" className="border-white text-white hover:bg-amber-500">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Help Requests</CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-700">{helpRequests.length}</div></CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Donors</CardTitle>
              <Heart className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-700">{monthlyCharity.length}</div></CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distributions</CardTitle>
              <Gift className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-700">{charityDistribution.length}</div></CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <HandHeart className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-700">{helpRequests.length + monthlyCharity.length + charityDistribution.length}</div></CardContent>
          </Card>
        </div>

        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="help">Help Requests</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Donors</TabsTrigger>
            <TabsTrigger value="distribution">Distributions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="help" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="text-amber-700">Help Registration Requests</CardTitle></CardHeader>
              <CardContent>
                {helpRequests.length === 0 ? (
                  <div className="text-center py-12"><Users className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No help requests yet</p></div>
                ) : helpRequests.map(item => <SubmissionCard key={item.id} item={item} />)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="text-amber-700">Monthly Charity Donors</CardTitle></CardHeader>
              <CardContent>
                {monthlyCharity.length === 0 ? (
                  <div className="text-center py-12"><Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No monthly donors yet</p></div>
                ) : monthlyCharity.map(item => <SubmissionCard key={item.id} item={item} />)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="text-amber-700">Charity Distributions</CardTitle></CardHeader>
              <CardContent>
                {charityDistribution.length === 0 ? (
                  <div className="text-center py-12"><Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No distributions yet</p></div>
                ) : charityDistribution.map(item => <SubmissionCard key={item.id} item={item} />)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      
      {replyItem && (
        <ReplyModal
          isOpen={!!replyItem}
          onClose={() => setReplyItem(null)}
          submissionId={replyItem.id}
          collectionName={getCollectionName(replyItem.type)}
          recipientName={replyItem.fullName || replyItem.name || "User"}
          recipientEmail={replyItem.email}
          recipientPhone={replyItem.phone}
          existingReplies={replyItem.replies || []}
          themeColor="amber"
          onReplySuccess={fetchCharityData}
        />
      )}
    </div>
  );
};

export default CharityDashboard;
