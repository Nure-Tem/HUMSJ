import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ArrowLeft, Upload, Calendar, Tag, FileText, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  content: z.string().min(20, "Content must be at least 20 characters"),
  type: z.enum(["news", "event"]),
  category: z.string().min(1, "Please select a category"),
  eventDate: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
    type: "news",
    category: "",
    eventDate: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 50MB for video)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a video smaller than 50MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a video file",
          variant: "destructive",
        });
        return;
      }

      setSelectedVideo(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 20MB for audio)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an audio file smaller than 20MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an audio file",
          variant: "destructive",
        });
        return;
      }

      setSelectedAudio(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      postSchema.parse(formData);

      // Upload media files to Cloudinary if present
      let imageUrl = null;
      let videoUrl = null;
      let audioUrl = null;

      if (selectedImage) {
        try {
          toast({
            title: "Uploading image...",
            description: "Please wait while we upload your image",
          });
          imageUrl = await uploadToCloudinary(selectedImage);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast({
            title: "Image Upload Failed",
            description: "Post will be created without image",
            variant: "destructive",
          });
        }
      }

      if (selectedVideo) {
        try {
          toast({
            title: "Uploading video...",
            description: "Please wait while we upload your video",
          });
          videoUrl = await uploadToCloudinary(selectedVideo);
        } catch (uploadError) {
          console.error("Video upload failed:", uploadError);
          toast({
            title: "Video Upload Failed",
            description: "Post will be created without video",
            variant: "destructive",
          });
        }
      }

      if (selectedAudio) {
        try {
          toast({
            title: "Uploading audio...",
            description: "Please wait while we upload your audio",
          });
          audioUrl = await uploadToCloudinary(selectedAudio);
        } catch (uploadError) {
          console.error("Audio upload failed:", uploadError);
          toast({
            title: "Audio Upload Failed",
            description: "Post will be created without audio",
            variant: "destructive",
          });
        }
      }

      // Prepare post data
      const postData = {
        ...formData,
        imageUrl,
        videoUrl,
        audioUrl,
        imageName: selectedImage?.name || null,
        videoName: selectedVideo?.name || null,
        audioName: selectedAudio?.name || null,
        author: "HUMSJ Admin",
        status: "published",
        timestamp: serverTimestamp(),
        views: 0,
        likes: 0,
      };

      // Save to Firebase
      await addDoc(collection(db, "posts"), postData);

      toast({
        title: "Post Created Successfully!",
        description: `${formData.type === 'news' ? 'News' : 'Event'} has been published.`,
      });

      // Navigate back to dashboard
      navigate("/admin/dashboard");

    } catch (error: any) {
      console.error("Post creation error:", error);
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Creation Failed",
          description: error.message || "Failed to create post. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = {
    news: ["General", "Education", "Charity", "Community", "Announcement"],
    event: ["Workshop", "Lecture", "Charity Event", "Community Gathering", "Religious Event"]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold heading-blue">Create New Post</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="heading-blue">Post Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Post Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Post Type *
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        News Article
                      </div>
                    </SelectItem>
                    <SelectItem value="event">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Event
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[formData.type as keyof typeof categories].map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Date (only for events) */}
              {formData.type === "event" && (
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-sm font-medium">
                    Event Date
                  </Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="datetime-local"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content *
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your post content here..."
                  rows={8}
                  required
                />
              </div>

              {/* Media Upload Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Media Files (Optional)</h3>
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium">
                    Featured Image
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-48 object-cover rounded-lg mx-auto"
                        />
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview(null);
                              const fileInput = document.getElementById("image") as HTMLInputElement;
                              if (fileInput) fileInput.value = "";
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="image" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Click to upload an image
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </span>
                          </label>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                  <Label htmlFor="video" className="text-sm font-medium">
                    Video File
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {selectedVideo ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="bg-blue-100 rounded-lg p-4">
                            <Upload className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                            <p className="text-sm font-medium text-blue-900">{selectedVideo.name}</p>
                            <p className="text-xs text-blue-700">
                              {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedVideo(null);
                              const fileInput = document.getElementById("video") as HTMLInputElement;
                              if (fileInput) fileInput.value = "";
                            }}
                          >
                            Remove Video
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="video" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Click to upload a video
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">
                              MP4, AVI, MOV up to 50MB
                            </span>
                          </label>
                          <input
                            id="video"
                            name="video"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="sr-only"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio Upload */}
                <div className="space-y-2">
                  <Label htmlFor="audio" className="text-sm font-medium">
                    Audio File
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {selectedAudio ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="bg-green-100 rounded-lg p-4">
                            <Upload className="mx-auto h-8 w-8 text-green-600 mb-2" />
                            <p className="text-sm font-medium text-green-900">{selectedAudio.name}</p>
                            <p className="text-xs text-green-700">
                              {(selectedAudio.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedAudio(null);
                              const fileInput = document.getElementById("audio") as HTMLInputElement;
                              if (fileInput) fileInput.value = "";
                            }}
                          >
                            Remove Audio
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="audio" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Click to upload an audio file
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">
                              MP3, WAV, OGG up to 20MB
                            </span>
                          </label>
                          <input
                            id="audio"
                            name="audio"
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            className="sr-only"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : `Publish ${formData.type === 'news' ? 'News' : 'Event'}`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;