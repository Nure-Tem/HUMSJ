import { useState } from "react";
import { Heart, User, Building2, Phone, Mail, MapPin, FileText, Upload, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { z } from "zod";

const helpRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  organizationName: z.string().optional(),
  helpType: z.string().min(1, "Please select type of help needed"),
  problemDescription: z.string().min(20, "Please describe the problem in detail (minimum 20 characters)"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),
});

type HelpRegistrationFormData = z.infer<typeof helpRegistrationSchema>;

const HelpRegistration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<HelpRegistrationFormData>({
    fullName: "",
    organizationName: "",
    helpType: "",
    problemDescription: "",
    city: "",
    country: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      helpRegistrationSchema.parse(formData);

      // Upload file to Cloudinary if present
      let documentUrl = null;
      if (selectedFile) {
        try {
          toast({
            title: "Uploading document...",
            description: "Please wait while we upload your file",
          });
          documentUrl = await uploadToCloudinary(selectedFile);
        } catch (uploadError) {
          console.error("Upload failed:", uploadError);
          // Continue without the file if upload fails
        }
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        documentUrl,
        documentName: selectedFile?.name || null,
        status: "pending",
        timestamp: serverTimestamp(),
      };

      // Submit to Firebase
      await addDoc(collection(db, "helpRegistrations"), submissionData);

      toast({
        title: "Request Submitted Successfully!",
        description: "Your request has been submitted. We will contact you soon.",
      });

      // Reset form
      setFormData({
        fullName: "",
        organizationName: "",
        helpType: "",
        problemDescription: "",
        city: "",
        country: "",
        phone: "",
        email: "",
      });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("document") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error: any) {
      console.error("Submission error:", error);
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: error.message || "An error occurred. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      {/* SEO Meta would be handled by react-helmet or similar */}
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Heart className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold heading-blue mb-4">
            Help Registration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Register your society or yourself if you need assistance. We are here to help 
            those in need through our various support programs.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <HelpCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">Quick Response</h3>
              <p className="text-sm text-green-700">We review requests within 48 hours</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Confidential</h3>
              <p className="text-sm text-blue-700">Your information is kept private</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <User className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800">Personal Support</h3>
              <p className="text-sm text-purple-700">Dedicated team to assist you</p>
            </CardContent>
          </Card>
        </div>


        {/* Registration Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Registration Form</CardTitle>
            <CardDescription className="text-blue-100">
              Please fill in all required fields marked with *
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 heading-blue border-b pb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal / Organization Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      <Building2 className="w-4 h-4 inline mr-1" />
                      Organization / Society Name (Optional)
                    </Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder="If registering for an organization"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+251 9XX XXX XXX"
                      className="h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 heading-blue border-b pb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Enter your country"
                      className="h-11"
                      required
                    />
                  </div>
                </div>
              </div>


              {/* Help Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 heading-blue border-b pb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Help Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="helpType">Type of Help Needed *</Label>
                  <Select
                    value={formData.helpType}
                    onValueChange={(value) => handleSelectChange("helpType", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select the type of help you need" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">🍞 Food Assistance</SelectItem>
                      <SelectItem value="education">📚 Education Support</SelectItem>
                      <SelectItem value="medical">🏥 Medical Help</SelectItem>
                      <SelectItem value="shelter">🏠 Shelter / Housing</SelectItem>
                      <SelectItem value="financial">💰 Financial Aid</SelectItem>
                      <SelectItem value="clothing">👕 Clothing</SelectItem>
                      <SelectItem value="orphan">👶 Orphan Support</SelectItem>
                      <SelectItem value="other">📋 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemDescription">Description of the Problem *</Label>
                  <Textarea
                    id="problemDescription"
                    name="problemDescription"
                    value={formData.problemDescription}
                    onChange={handleInputChange}
                    placeholder="Please describe your situation and the help you need in detail. Include any relevant information that will help us understand your needs better..."
                    rows={6}
                    className="resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Minimum 20 characters. Be as detailed as possible.
                  </p>
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 heading-blue border-b pb-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  Supporting Document (Optional)
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="document">Upload Document or Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Input
                      id="document"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <label htmlFor="document" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        {selectedFile ? (
                          <span className="text-blue-600 font-medium">{selectedFile.name}</span>
                        ) : (
                          <>
                            <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PDF, DOC, JPG, PNG (Max 5MB)
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> All requests are reviewed by our committee. We will contact you 
                  within 3-5 business days. Please ensure all information provided is accurate and truthful.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" /> Submit Registration
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-gray-500 mt-8 text-sm">
          Need immediate assistance? Contact us at{" "}
          <a href="tel:+251985736451" className="text-blue-600 hover:underline">
            +251 985 736 451
          </a>{" "}
          or{" "}
          <a href="mailto:help@humsj.org" className="text-blue-600 hover:underline">
            help@humsj.org
          </a>
        </p>
      </div>
    </div>
  );
};

export default HelpRegistration;
