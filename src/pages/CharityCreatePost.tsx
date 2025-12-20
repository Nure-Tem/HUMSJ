import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ArrowLeft, Upload, HandHeart, Calendar, DollarSign, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CharityCreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    type: "news",
    targetAmount: "",
    collectedAmount: "",
    beneficiaries: "",
    eventDate: "",
  });

  const categories = [
    "Zakat Distribution",
    "Sadaqah Campaign",
    "Orphan Support",
    "Food Distribution",
    "Medical Aid",
    "Education Support",
    "Emergency Relief",
    "Ramadan Program",
    "Eid Program",
    "Monthly Charity Report",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Max 5MB", variant: "destructive" });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      if (selectedImage) {
        toast({ title: "Uploading image..." });
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      await addDoc(collection(db, "posts"), {
        ...formData,
        imageUrl,
        department: "charity",
        author: auth.currentUser?.email || "Charity Admin",
        status: "published",
        timestamp: serverTimestamp(),
      });

      toast({ title: "Success!", description: "Charity post published successfully" });
      navigate("/admin/charity");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 shadow">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/charity")} className="bg-white text-amber-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <HandHeart className="h-6 w-6 text-white" />
          <h1 className="text-2xl font-bold text-white">Create Charity Post</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-amber-700">New Charity Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Post Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News/Update</SelectItem>
                      <SelectItem value="campaign">Campaign</SelectItem>
                      <SelectItem value="report">Distribution Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Ramadan Food Distribution 2024" required />
              </div>

              {(formData.type === "campaign" || formData.type === "report") && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Target Amount (ETB)</Label>
                    <Input name="targetAmount" type="number" value={formData.targetAmount} onChange={handleInputChange} placeholder="e.g., 50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Collected Amount (ETB)</Label>
                    <Input name="collectedAmount" type="number" value={formData.collectedAmount} onChange={handleInputChange} placeholder="e.g., 35000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Beneficiaries</Label>
                    <Input name="beneficiaries" value={formData.beneficiaries} onChange={handleInputChange} placeholder="e.g., 100 families" />
                  </div>
                </div>
              )}

              {formData.type === "campaign" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Campaign End Date</Label>
                  <Input name="eventDate" type="date" value={formData.eventDate} onChange={handleInputChange} />
                </div>
              )}

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Describe the charity activity, impact, or campaign details..." rows={6} required />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-amber-600" /> Featured Image</Label>
                <div className="border-2 border-dashed border-amber-300 rounded-lg p-6 bg-amber-50">
                  {imagePreview ? (
                    <div className="text-center">
                      <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg mb-3" />
                      <Button type="button" variant="outline" size="sm" onClick={() => { setSelectedImage(null); setImagePreview(null); }}>Remove</Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center block">
                      <ImageIcon className="mx-auto h-10 w-10 text-amber-400 mb-2" />
                      <span className="text-sm font-medium text-amber-700">Upload Image (Max 5MB)</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/admin/charity")}>Cancel</Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                  {isSubmitting ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CharityCreatePost;
