import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LogOut, Eye, Calendar, Trash2, Phone, Mail, Users, Heart, Gift, HandHeart, Settings, Plus, MessageSquare, CheckCircle, DollarSign, XCircle, Clock } from "lucide-react";
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

interface Donation {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  amount: number;
  paymentMethod: string;
  project?: string;
  transactionRef: string;
  receiptUrl?: string;
  status: "pending" | "verified" | "rejected";
  notes?: string;
  timestamp?: any;
  verifiedAt?: any;
  verifiedBy?: string;
}

interface MonthlyCharity {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  idNumber?: string;
  department: string;
  year: string;
  amount: number;
  paymentMethod: string;
  startMonth: string;
  transactionRef: string;
  receiptUrl?: string;
  status: "pending" | "verified" | "rejected";
  notes?: string;
  timestamp?: any;
  verifiedAt?: any;
  verifiedBy?: string;
}

const CharityDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [helpRequests, setHelpRequests] = useState<Submission[]>([]);
  const [monthlyCharity, setMonthlyCharity] = useState<MonthlyCharity[]>([]);
  const [charityDistribution, setCharityDistribution] = useState<Submission[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Submission | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedMonthly, setSelectedMonthly] = useState<MonthlyCharity | null>(null);
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
      const monthlyData = monthlySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MonthlyCharity[];

      const distributionSnapshot = await getDocs(collection(db, "charityDistributions"));
      const distributionData = distributionSnapshot.docs.map(doc => ({ id: doc.id, type: "distribution", ...doc.data() }));

      const donationsSnapshot = await getDocs(collection(db, "donations"));
      const donationsData = donationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Donation[];

      setHelpRequests(helpData);
      setMonthlyCharity(monthlyData);
      setCharityDistribution(distributionData);
      setDonations(donationsData);
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

  const handleVerifyDonation = async (donationId: string, newStatus: "verified" | "rejected") => {
    try {
      await updateDoc(doc(db, "donations", donationId), {
        status: newStatus,
        verifiedAt: new Date(),
        verifiedBy: auth.currentUser?.email || "Admin",
      });
      toast({ 
        title: newStatus === "verified" ? "Donation Verified" : "Donation Rejected", 
        description: `Donation has been ${newStatus}` 
      });
      fetchCharityData();
      setSelectedDonation(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update donation status", variant: "destructive" });
    }
  };

  const getPaymentMethodName = (id: string) => {
    const methods: Record<string, string> = {
      "cbe": "CBE Bank",
      "cbe-birr": "CBE Birr",
      "telebirr": "Telebirr",
      "mpesa": "M-Pesa",
    };
    return methods[id] || id;
  };

  const getProjectName = (id: string) => {
    const projects: Record<string, string> = {
      "orphan": "Orphan Sponsorship",
      "quran": "Quran Education Fund",
      "eid": "Eid Gift Program",
      "emergency": "Emergency Relief",
      "general": "General Donation",
    };
    return projects[id] || id || "General";
  };

  const pendingDonations = donations.filter(d => d.status === "pending");
  const verifiedDonations = donations.filter(d => d.status === "verified");
  const totalVerifiedAmount = verifiedDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const pendingMonthly = monthlyCharity.filter(m => m.status === "pending");
  const verifiedMonthly = monthlyCharity.filter(m => m.status === "verified");
  const totalMonthlyAmount = verifiedMonthly.reduce((sum, m) => sum + (m.amount || 0), 0);

  const handleVerifyMonthly = async (id: string, newStatus: "verified" | "rejected") => {
    try {
      await updateDoc(doc(db, "monthlyCharityRegistrations", id), {
        status: newStatus,
        verifiedAt: new Date(),
        verifiedBy: auth.currentUser?.email || "Admin",
      });
      toast({ 
        title: newStatus === "verified" ? "Monthly Charity Verified" : "Monthly Charity Rejected", 
        description: `Subscription has been ${newStatus}` 
      });
      fetchCharityData();
      setSelectedMonthly(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
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

  const DonationCard = ({ donation }: { donation: Donation }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{donation.fullName}</h3>
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                donation.status === "verified" ? "bg-green-100 text-green-700" :
                donation.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {donation.status === "verified" ? <CheckCircle className="h-3 w-3" /> :
                 donation.status === "rejected" ? <XCircle className="h-3 w-3" /> :
                 <Clock className="h-3 w-3" />}
                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-amber-600">{donation.amount} ETB</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" /><span>{donation.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /><span>{formatDate(donation.timestamp)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Via: {getPaymentMethodName(donation.paymentMethod)} | Ref: {donation.transactionRef}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedDonation(donation)}>
              <Eye className="h-4 w-4" />
            </Button>
            {donation.status === "pending" && (
              <>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVerifyDonation(donation.id, "verified")}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleVerifyDonation(donation.id, "rejected")}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const MonthlyCharityCard = ({ item }: { item: MonthlyCharity }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{item.fullName}</h3>
              <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                item.status === "verified" ? "bg-green-100 text-green-700" :
                item.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {item.status === "verified" ? <CheckCircle className="h-3 w-3" /> :
                 item.status === "rejected" ? <XCircle className="h-3 w-3" /> :
                 <Clock className="h-3 w-3" />}
                {(item.status || "pending").charAt(0).toUpperCase() + (item.status || "pending").slice(1)}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-amber-600">{item.amount} ETB/month</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" /><span>{item.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /><span>Start: {item.startMonth}</span>
              </div>
              <p className="text-xs text-gray-500">
                {item.department} | {item.year} | Via: {getPaymentMethodName(item.paymentMethod)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedMonthly(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            {(item.status === "pending" || !item.status) && (
              <>
                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVerifyMonthly(item.id, "verified")}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleVerifyMonthly(item.id, "rejected")}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
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

  const DonationDetailModal = ({ donation, onClose }: { donation: Donation; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-amber-700">Donation Details</CardTitle>
        </CardHeader>
        <CardContent>
          {donation.receiptUrl && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Payment Receipt:</p>
              <img src={donation.receiptUrl} alt="Receipt" className="max-w-full h-auto rounded-lg border" />
            </div>
          )}
          
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-3xl font-bold text-amber-700">{donation.amount} ETB</p>
            </div>
            
            <div className="border-b pb-2">
              <span className="font-semibold">Full Name: </span>
              <span className="text-gray-700">{donation.fullName}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">Phone: </span>
              <span className="text-gray-700">{donation.phone}</span>
            </div>
            {donation.email && (
              <div className="border-b pb-2">
                <span className="font-semibold">Email: </span>
                <span className="text-gray-700">{donation.email}</span>
              </div>
            )}
            <div className="border-b pb-2">
              <span className="font-semibold">Payment Method: </span>
              <span className="text-gray-700">{getPaymentMethodName(donation.paymentMethod)}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">Transaction Ref: </span>
              <span className="text-gray-700 font-mono">{donation.transactionRef}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">Project: </span>
              <span className="text-gray-700">{getProjectName(donation.project || "")}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">Status: </span>
              <span className={`px-2 py-1 rounded text-sm ${
                donation.status === "verified" ? "bg-green-100 text-green-700" :
                donation.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>{donation.status}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">Submitted: </span>
              <span className="text-gray-700">{formatDate(donation.timestamp)}</span>
            </div>
            {donation.notes && (
              <div className="border-b pb-2">
                <span className="font-semibold">Notes: </span>
                <span className="text-gray-700">{donation.notes}</span>
              </div>
            )}
            {donation.verifiedBy && (
              <div className="border-b pb-2">
                <span className="font-semibold">Verified By: </span>
                <span className="text-gray-700">{donation.verifiedBy} on {formatDate(donation.verifiedAt)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            {donation.status === "pending" && (
              <>
                <Button onClick={() => handleVerifyDonation(donation.id, "verified")} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" /> Verify
                </Button>
                <Button onClick={() => handleVerifyDonation(donation.id, "rejected")} variant="destructive" className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
              </>
            )}
            <Button onClick={onClose} variant="outline" className="flex-1">Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MonthlyCharityDetailModal = ({ item, onClose }: { item: MonthlyCharity; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-amber-700">Monthly Charity Details</CardTitle>
        </CardHeader>
        <CardContent>
          {item.receiptUrl && (
            <div className="mb-4">
              <p className="font-semibold mb-2">Payment Receipt:</p>
              <img src={item.receiptUrl} alt="Receipt" className="max-w-full h-auto rounded-lg border" />
            </div>
          )}
          
          <div className="space-y-3">
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Monthly Amount</p>
              <p className="text-3xl font-bold text-amber-700">{item.amount} ETB</p>
            </div>
            
            <div className="border-b pb-2"><span className="font-semibold">Full Name: </span><span className="text-gray-700">{item.fullName}</span></div>
            <div className="border-b pb-2"><span className="font-semibold">Phone: </span><span className="text-gray-700">{item.phone}</span></div>
            {item.email && <div className="border-b pb-2"><span className="font-semibold">Email: </span><span className="text-gray-700">{item.email}</span></div>}
            {item.idNumber && <div className="border-b pb-2"><span className="font-semibold">Student ID: </span><span className="text-gray-700">{item.idNumber}</span></div>}
            <div className="border-b pb-2"><span className="font-semibold">Department: </span><span className="text-gray-700">{item.department}</span></div>
            <div className="border-b pb-2"><span className="font-semibold">Year: </span><span className="text-gray-700">{item.year}</span></div>
            <div className="border-b pb-2"><span className="font-semibold">Start Month: </span><span className="text-gray-700">{item.startMonth}</span></div>
            <div className="border-b pb-2"><span className="font-semibold">Payment Method: </span><span className="text-gray-700">{getPaymentMethodName(item.paymentMethod)}</span></div>
            <div className="border-b pb-2"><span className="font-semibold">Transaction Ref: </span><span className="text-gray-700 font-mono">{item.transactionRef}</span></div>
            <div className="border-b pb-2">
              <span className="font-semibold">Status: </span>
              <span className={`px-2 py-1 rounded text-sm ${
                item.status === "verified" ? "bg-green-100 text-green-700" :
                item.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>{item.status || "pending"}</span>
            </div>
            <div className="border-b pb-2"><span className="font-semibold">Submitted: </span><span className="text-gray-700">{formatDate(item.timestamp)}</span></div>
            {item.notes && <div className="border-b pb-2"><span className="font-semibold">Notes: </span><span className="text-gray-700">{item.notes}</span></div>}
            {item.verifiedBy && <div className="border-b pb-2"><span className="font-semibold">Verified By: </span><span className="text-gray-700">{item.verifiedBy} on {formatDate(item.verifiedAt)}</span></div>}
          </div>

          <div className="flex gap-3 mt-4">
            {(item.status === "pending" || !item.status) && (
              <>
                <Button onClick={() => handleVerifyMonthly(item.id, "verified")} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" /> Verify
                </Button>
                <Button onClick={() => handleVerifyMonthly(item.id, "rejected")} variant="destructive" className="flex-1">
                  <XCircle className="h-4 w-4 mr-2" /> Reject
                </Button>
              </>
            )}
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Donations</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-700">{pendingDonations.length}</div></CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-700">{totalVerifiedAmount.toLocaleString()} ETB</div></CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Help Requests</CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-700">{helpRequests.length}</div></CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Monthly</CardTitle>
              <Heart className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-700">{pendingMonthly.length}</div></CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Distributions</CardTitle>
              <Gift className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-700">{charityDistribution.length}</div></CardContent>
          </Card>
        </div>

        <Tabs defaultValue="donations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="donations">Donations {pendingDonations.length > 0 && `(${pendingDonations.length})`}</TabsTrigger>
            <TabsTrigger value="help">Help Requests</TabsTrigger>
            <TabsTrigger value="monthly">Monthly {pendingMonthly.length > 0 && `(${pendingMonthly.length})`}</TabsTrigger>
            <TabsTrigger value="distribution">Distributions</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="text-amber-700">Donation Submissions</CardTitle></CardHeader>
              <CardContent>
                {donations.length === 0 ? (
                  <div className="text-center py-12"><DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No donations yet</p></div>
                ) : (
                  <>
                    {pendingDonations.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                          <Clock className="h-5 w-5" /> Pending Verification ({pendingDonations.length})
                        </h3>
                        {pendingDonations.map(donation => <DonationCard key={donation.id} donation={donation} />)}
                      </div>
                    )}
                    {verifiedDonations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" /> Verified Donations ({verifiedDonations.length})
                        </h3>
                        {verifiedDonations.map(donation => <DonationCard key={donation.id} donation={donation} />)}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
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
              <CardHeader><CardTitle className="text-amber-700">Monthly Charity Subscriptions</CardTitle></CardHeader>
              <CardContent>
                {monthlyCharity.length === 0 ? (
                  <div className="text-center py-12"><Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No monthly subscriptions yet</p></div>
                ) : (
                  <>
                    {pendingMonthly.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                          <Clock className="h-5 w-5" /> Pending Verification ({pendingMonthly.length})
                        </h3>
                        {pendingMonthly.map(item => <MonthlyCharityCard key={item.id} item={item} />)}
                      </div>
                    )}
                    {verifiedMonthly.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" /> Verified Subscriptions ({verifiedMonthly.length}) - {totalMonthlyAmount.toLocaleString()} ETB/month
                        </h3>
                        {verifiedMonthly.map(item => <MonthlyCharityCard key={item.id} item={item} />)}
                      </div>
                    )}
                  </>
                )}
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
      
      {selectedDonation && <DonationDetailModal donation={selectedDonation} onClose={() => setSelectedDonation(null)} />}
      
      {selectedMonthly && <MonthlyCharityDetailModal item={selectedMonthly} onClose={() => setSelectedMonthly(null)} />}
      
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
