import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LogOut, Users, FileText, Trash2, Eye, Calendar, Phone, Mail, Baby, Heart, Gift } from "lucide-react";
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

      console.log("Help registrations:", helpData.length);
      console.log("Children registrations:", childrenData.length);
      console.log("Monthly charity:", monthlyData.length);
      console.log("Charity distributions:", distributionData.length);

      setHelpRequests(helpData);
      setChildrenRegistrations(childrenData);
      setMonthlyCharity(monthlyData);
      setCharityDistribution(distributionData);
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

  const DetailModal = ({ item, onClose }: { item: Submission; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="heading-blue">Submission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(item).map(([key, value]) => {
              if (key === "id" || key === "type") return null;
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
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        </div>

        <Tabs defaultValue="help" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="help">Help Requests</TabsTrigger>
            <TabsTrigger value="children">Children</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Charity</TabsTrigger>
            <TabsTrigger value="distribution">Distributions</TabsTrigger>
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
        </Tabs>
      </div>

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default AdminDashboard;
