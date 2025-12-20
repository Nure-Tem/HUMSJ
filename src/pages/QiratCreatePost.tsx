import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ArrowLeft, Upload, BookOpen, Music, FileText, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const QiratCreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    surahName: "",
    reciterName: "",
  });

  const categories = [
    "Quran Recitation",
    "Tajweed Lesson",
    "Hifz Program",
    "Qirat Competition",
    "Children Quran Class",
    "Weekly Recitation",
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

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Max 20MB for audio", variant: "destructive" });
        return;
      }
      setSelectedAudio(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        toast({ title: "File Too Large", description: "Max 50MB for video", variant: "destructive" });
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
      let imageUrl = null, audioUrl = null, videoUrl = null;

      if (selectedImage) {
        toast({ title: "Uploading image..." });
        imageUrl = await uploadToCloudinary(selectedImage);
      }
      if (selectedAudio) {
        toast({ title: "Uploading audio..." });
        audioUrl = await uploadToCloudinary(selectedAudio);
      }
      if (selectedVideo) {
        toast({ title: "Uploading video..." });
        videoUrl = await uploadToCloudinary(selectedVideo);
      }

      await addDoc(collection(db, "posts"), {
        ...formData,
        imageUrl,
        audioUrl,
        videoUrl,
        department: "qirat",
        type: "qirat",
        author: auth.currentUser?.email || "Qirat Admin",
        status: "published",
        timestamp: serverTimestamp(),
      });

      toast({ title: "Success!", description: "Qirat content published successfully" });
      navigate("/admin/qirat");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 shadow">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/qirat")} className="bg-white text-emerald-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <BookOpen className="h-6 w-6 text-white" />
          <h1 className="text-2xl font-bold text-white">Create Qirat Content</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-emerald-700">New Qirat Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Surah Al-Mulk Recitation" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Surah Name</Label>
                  <Input name="surahName" value={formData.surahName} onChange={handleInputChange} placeholder="e.g., Al-Mulk" />
                </div>
                <div className="space-y-2">
                  <Label>Reciter Name</Label>
                  <Input name="reciterName" value={formData.reciterName} onChange={handleInputChange} placeholder="e.g., Sheikh Ahmad" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Describe the recitation or lesson..." rows={5} required />
              </div>

              {/* Audio Upload - Primary for Qirat */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Music className="h-4 w-4 text-emerald-600" /> Audio Recitation</Label>
                <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 bg-emerald-50">
                  {selectedAudio ? (
                    <div className="text-center">
                      <div className="bg-emerald-100 rounded-lg p-4 mb-3">
                        <Music className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                        <p className="font-medium text-emerald-900">{selectedAudio.name}</p>
                        <p className="text-xs text-emerald-700">{(selectedAudio.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={() => setSelectedAudio(null)}>Remove</Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center block">
                      <Upload className="mx-auto h-10 w-10 text-emerald-400 mb-2" />
                      <span className="text-sm font-medium text-emerald-700">Upload Audio (MP3, WAV - Max 20MB)</span>
                      <input type="file" accept="audio/*" onChange={handleAudioChange} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Cover Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {imagePreview ? (
                    <div className="text-center">
                      <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg mb-3" />
                      <Button type="button" variant="outline" size="sm" onClick={() => { setSelectedImage(null); setImagePreview(null); }}>Remove</Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer text-center block">
                      <ImageIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Upload Image (Max 5MB)</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                    </label>
                  )}
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Video (Optional)</Label>
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
                <Button type="button" variant="outline" onClick={() => navigate("/admin/qirat")}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
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

export default QiratCreatePost;
