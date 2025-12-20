import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LogOut, Eye, Calendar, Trash2, Phone, Mail, Users, Heart, Gift, HandHeart } from "lucide-react";
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

const CharityDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [helpRequests, setHelpRequests] = useState<Submission[]>([]);
  const [monthlyCharity, setMonthlyCharity] = useState<Submission[]>([]);
  const [charityDistribution, setCharityDistribution] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Submission | null>(null);

  useEffect(() => {
    checkAuth();
    fetchCharityData();
  }, []);

  const checkAuth = () => {
    if (!auth.currentUser) {
      navigate("/admin/charity/login");
    }
  };

  const fetchCharityData = async () => {
    try {
      // Fetch help registrations
      const helpSnapshot = await getDocs(collection(db, "helpRegistrations"));
      const helpData = helpSnapshot.docs.map(doc => ({
        id: doc.id,
        type: "help",
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

      setHelpRequests(helpData);
      setMonthlyCharity(monthlyData);
      setCharityDistribution(distributionData);
    } catch (error: any) {
      console.error("Error fetching charity data:", error);
      toast({
        title: "Error",
        description: "Failed to load charity data",
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
      navigate("/admin/charity/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast({ title: "Deleted", description: "Submission deleted successfully" });
      fetchCharityData();
      setSelectedItem(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete submission", variant: "destructive" });
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
            <h3 className="font-semibold text-lg mb-2">
              {item.fullName || item.name || "N/A"}
            </h3>
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
            <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => handleDelete(item.id, getCollectionName(item.type))}
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
          <CardTitle className="text-amber-700">Charity Submission Details</CardTitle>
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
                className="text-amber-600 hover:underline text-sm mt-2 inline-block"
              >
                Open in new tab
              </a>
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
          <Button onClick={onClose} className="mt-4 w-full bg-amber-600 hover:bg-amber-700">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Charity dashboard...</p>
        </div>
      </div>
    );
  }

  const totalSubmissions = helpRequests.length + monthlyCharity.length + charityDistribution.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HandHeart className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">Charity Department Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleLogout} variant="outline" className="border-white text-white hover:bg-amber-500">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
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
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">{helpRequests.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Donors</CardTitle>
              <Heart className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">{monthlyCharity.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distributions</CardTitle>
              <Gift className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">{charityDistribution.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <HandHeart className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">{totalSubmissions}</div>
            </CardContent>
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
              <CardHeader>
                <CardTitle className="text-amber-700">Help Registration Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {helpRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No help requests yet</p>
                  </div>
                ) : (
                  helpRequests.map(item => <SubmissionCard key={item.id} item={item} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-700">Monthly Charity Donors</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyCharity.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No monthly donors yet</p>
                  </div>
                ) : (
                  monthlyCharity.map(item => <SubmissionCard key={item.id} item={item} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-700">Charity Distributions</CardTitle>
              </CardHeader>
              <CardContent>
                {charityDistribution.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No distributions yet</p>
                  </div>
                ) : (
                  charityDistribution.map(item => <SubmissionCard key={item.id} item={item} />)
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

export default CharityDashboard;
