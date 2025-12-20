import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ArrowLeft, Upload, Megaphone, Calendar, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const DawaCreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    type: "news",
    eventDate: "",
    location: "",
    speaker: "",
  });

  const categories = [
    "Islamic Lecture",
    "Seminar",
    "Workshop",
    "Dawa Campaign",
    "Educational Program",
    "Youth Program",
    "Community Outreach",
    "Announcement",
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

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Max 50MB", variant: "destructive" });
        return;
      }
      setSelectedVideo(file);
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
      let imageUrl = null, videoUrl = null;

      if (selectedImage) {
        toast({ title: "Uploading image..." });
        imageUrl = await uploadToCloudinary(selectedImage);
      }
      if (selectedVideo) {
        toast({ title: "Uploading video..." });
        videoUrl = await uploadToCloudinary(selectedVideo);
      }

      await addDoc(collection(db, "posts"), {
        ...formData,
        imageUrl,
        videoUrl,
        department: "dawa",
        author: auth.currentUser?.email || "Dawa Admin",
        status: "published",
        timestamp: serverTimestamp(),
      });

      toast({ title: "Success!", description: "Dawa content published successfully" });
      navigate("/admin/dawa");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/dawa")} className="bg-white text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Megaphone className="h-6 w-6 text-white" />
          <h1 className="text-2xl font-bold text-white">Create Dawa Content</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-blue-700">New Dawa Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Post Type *</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News/Article</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
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
                <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Weekly Islamic Lecture" required />
              </div>

              {formData.type === "event" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Event Date</Label>
                    <Input name="eventDate" type="datetime-local" value={formData.eventDate} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Main Mosque Hall" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Speaker/Presenter</Label>
                <Input name="speaker" value={formData.speaker} onChange={handleInputChange} placeholder="e.g., Sheikh Muhammad" />
              </div>

              <div className="space-y-2">
                <Label>Content *</Label>
                <Textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Write the details of your post..." rows={6} required />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-blue-600" /> Featured Image</Label>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                  {imagePreview ? (
                    <div className="text-center">
                      <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg mb-3" />
                      <Button type="button" variant="outline" size="sm" onClick={() => { setSelectedImage(null); setImagePreview(null); }}>Remove</Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center block">
                      <ImageIcon className="mx-auto h-10 w-10 text-blue-400 mb-2" />
                      <span className="text-sm font-medium text-blue-700">Upload Image (Max 5MB)</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <Label>Video (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {selectedVideo ? (
                    <div className="text-center">
                      <p className="font-medium">{selectedVideo.name}</p>
                      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setSelectedVideo(null)}>Remove</Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center block">
                      <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Upload Video (Max 50MB)</span>
                      <input type="file" accept="video/*" onChange={handleVideoChange} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate("/admin/dawa")}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
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

export default DawaCreatePost;
