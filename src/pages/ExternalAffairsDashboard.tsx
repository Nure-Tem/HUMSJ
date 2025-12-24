import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, query, orderBy, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { LogOut, Eye, Calendar, Trash2, Plus, Users, Phone, Award, Edit, Settings, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Leader {
  id: string;
  name: string;
  phone: string;
  position: string;
  startYear: number;
  endYear: number;
  gender: "male" | "female";
  timestamp?: any;
}

const positions = [
  "External Affairs Amir",
  "General Amir",
  "Qirat Sector Amir",
  "Charity Sector Amir",
  "Dawa Sector Amir",
  "Deputy Amir",
  "Secretary",
  "Treasurer",
  "Other"
];

const years = Array.from({ length: 19 }, (_, i) => 2000 + i); // 2000-2018

const ExternalAffairsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [selectedItem, setSelectedItem] = useState<Leader | null>(null);
  const [filterGender, setFilterGender] = useState<"all" | "male" | "female">("all");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    position: "",
    startYear: 2017,
    endYear: 2018,
    gender: "male" as "male" | "female"
  });

  useEffect(() => {
    checkAuth();
    fetchLeaders();
  }, []);

  const checkAuth = () => {
    if (!auth.currentUser) navigate("/admin/login");
  };

  const fetchLeaders = async () => {
    try {
      const leadersSnapshot = await getDocs(
        query(collection(db, "externalAffairsLeaders"), orderBy("endYear", "desc"))
      );
      const leadersData = leadersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Leader[];
      setLeaders(leadersData);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to load leaders", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.position) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      if (editingLeader) {
        await updateDoc(doc(db, "externalAffairsLeaders", editingLeader.id), {
          ...formData,
          updatedAt: Timestamp.now()
        });
        toast({ title: "Success", description: "Leader updated successfully" });
      } else {
        await addDoc(collection(db, "externalAffairsLeaders"), {
          ...formData,
          timestamp: Timestamp.now()
        });
        toast({ title: "Success", description: "Leader added successfully" });
      }
      
      resetForm();
      fetchLeaders();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save leader", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;
    
    try {
      await deleteDoc(doc(db, "externalAffairsLeaders", id));
      toast({ title: "Deleted", description: "Leader removed successfully" });
      fetchLeaders();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete leader", variant: "destructive" });
    }
  };

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setFormData({
      name: leader.name,
      phone: leader.phone,
      position: leader.position,
      startYear: leader.startYear,
      endYear: leader.endYear,
      gender: leader.gender
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      position: "",
      startYear: 2017,
      endYear: 2018,
      gender: "male"
    });
    setEditingLeader(null);
    setShowAddModal(false);
  };

  const filteredLeaders = leaders.filter(leader => 
    filterGender === "all" || leader.gender === filterGender
  );

  const maleLeaders = leaders.filter(l => l.gender === "male");
  const femaleLeaders = leaders.filter(l => l.gender === "female");

  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes("external affairs amir") || pos.includes("general amir")) return "bg-amber-100 text-amber-800";
    if (pos.includes("qirat")) return "bg-emerald-100 text-emerald-800";
    if (pos.includes("charity")) return "bg-blue-100 text-blue-800";
    if (pos.includes("dawa")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const LeaderCard = ({ leader }: { leader: Leader }) => (
    <Card className={`mb-4 hover:shadow-lg transition-shadow border-l-4 ${
      leader.gender === "female" ? "border-l-pink-500" : "border-l-blue-500"
    }`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{leader.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                leader.gender === "female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"
              }`}>
                {leader.gender}
              </span>
            </div>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(leader.position)}`}>
              {leader.position}
            </span>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{leader.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{leader.startYear} - {leader.endYear}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedItem(leader)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleEdit(leader)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(leader.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">External Affairs Leaders Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowAddModal(true)} 
              className="bg-white text-amber-700 hover:bg-amber-50"
            >
              <Plus className="h-4 w-4 mr-2" />Add Leader
            </Button>
            <Button 
              onClick={() => navigate("/external-affairs-leaders")} 
              variant="outline" 
              className="border-white text-white hover:bg-amber-500"
            >
              <Eye className="h-4 w-4 mr-2" />View Public Page
            </Button>
            <Button 
              onClick={() => navigate("/admin/settings")} 
              variant="outline" 
              className="border-white text-white hover:bg-amber-500"
            >
              <Settings className="h-4 w-4 mr-2" />Settings
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="border-white text-white hover:bg-amber-500"
            >
              <LogOut className="h-4 w-4 mr-2" />Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leaders</CardTitle>
              <Users className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">{leaders.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Male Leaders</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{maleLeaders.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Female Leaders</CardTitle>
              <Users className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-700">{femaleLeaders.length}</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Years Covered</CardTitle>
              <Calendar className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">2000-2018</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" onClick={() => setFilterGender("all")}>All Leaders</TabsTrigger>
            <TabsTrigger value="male" onClick={() => setFilterGender("male")}>Male</TabsTrigger>
            <TabsTrigger value="female" onClick={() => setFilterGender("female")}>Female</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-amber-700">All External Affairs Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredLeaders.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No leaders added yet</p>
                    <Button onClick={() => setShowAddModal(true)} className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="h-4 w-4 mr-2" />Add First Leader
                    </Button>
                  </div>
                ) : (
                  filteredLeaders.map(leader => <LeaderCard key={leader.id} leader={leader} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="male" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-700">Male Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                {maleLeaders.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No male leaders added yet</p>
                  </div>
                ) : (
                  maleLeaders.map(leader => <LeaderCard key={leader.id} leader={leader} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="female" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-pink-700">Female Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                {femaleLeaders.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No female leaders added yet</p>
                  </div>
                ) : (
                  femaleLeaders.map(leader => <LeaderCard key={leader.id} leader={leader} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-amber-700">
                {editingLeader ? "Edit Leader" : "Add New Leader"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Ustaz Mehadi Jemal"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +251938979492"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: "male" | "female") => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startYear">Start Year *</Label>
                    <Select
                      value={formData.startYear.toString()}
                      onValueChange={(value) => setFormData({ ...formData, startYear: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Start year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="endYear">End Year *</Label>
                    <Select
                      value={formData.endYear.toString()}
                      onValueChange={(value) => setFormData({ ...formData, endYear: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="End year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700">
                    {editingLeader ? "Update" : "Add"} Leader
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-amber-700">Leader Details</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center ${
                  selectedItem.gender === "female" ? "bg-pink-100" : "bg-blue-100"
                }`}>
                  <Award className={`h-10 w-10 ${
                    selectedItem.gender === "female" ? "text-pink-600" : "text-blue-600"
                  }`} />
                </div>
                <h2 className="text-xl font-bold mt-4">{selectedItem.name}</h2>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getPositionColor(selectedItem.position)}`}>
                  {selectedItem.position}
                </span>
              </div>
              
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <a href={`tel:${selectedItem.phone}`} className="text-amber-600 hover:underline">
                    {selectedItem.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Gender:</span>
                  <span className="capitalize">{selectedItem.gender}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Service Period:</span>
                  <span>{selectedItem.startYear} - {selectedItem.endYear}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedItem(null)} 
                  className="flex-1"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => { setSelectedItem(null); handleEdit(selectedItem); }} 
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                >
                  <Edit className="h-4 w-4 mr-2" />Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExternalAffairsDashboard;
