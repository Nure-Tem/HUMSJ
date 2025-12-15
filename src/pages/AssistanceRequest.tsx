import { useState } from "react";
import { HandHeart, User, Phone, FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { z } from "zod";

const assistanceSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  assistanceType: z.string().min(1, "Please select assistance type"),
  monthlyIncome: z.string().min(1, "Monthly income is required"),
  familyMembers: z.string().min(1, "Number of family members is required"),
  requestDetails: z.string().min(20, "Please provide detailed information (minimum 20 characters)"),
  urgencyLevel: z.string().min(1, "Please select urgency level"),
});

type AssistanceFormData = z.infer<typeof assistanceSchema>;

const AssistanceRequest = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AssistanceFormData>({
    fullName: "",
    phone: "",
    address: "",
    assistanceType: "",
    monthlyIncome: "",
    familyMembers: "",
    requestDetails: "",
    urgencyLevel: "",
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      assistanceSchema.parse(formData);

      await addDoc(collection(db, "assistanceRequests"), {
        ...formData,
        status: "pending",
        timestamp: serverTimestamp(),
      });

      toast({
        title: "Request Submitted Successfully",
        description: "Your assistance request has been received. We will contact you soon.",
      });

      setFormData({
        fullName: "",
        phone: "",
        address: "",
        assistanceType: "",
        monthlyIncome: "",
        familyMembers: "",
        requestDetails: "",
        urgencyLevel: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <HandHeart className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request for Assistance</h1>
          <p className="text-lg text-gray-600">
            We are here to help those in need. Please fill out this form with accurate information.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Assistance Application Form</CardTitle>
            <CardDescription>
              All information will be kept confidential and reviewed by our committee.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Family & Financial Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="familyMembers">Number of Family Members *</Label>
                    <Input
                      id="familyMembers"
                      name="familyMembers"
                      type="number"
                      value={formData.familyMembers}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome">Monthly Income (RM) *</Label>
                    <Input
                      id="monthlyIncome"
                      name="monthlyIncome"
                      type="number"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      placeholder="e.g., 1500"
                      required
                    />
                  </div>
                </div>
              </div>


              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Assistance Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assistanceType">Type of Assistance Needed *</Label>
                    <Select
                      value={formData.assistanceType}
                      onValueChange={(value) => handleSelectChange("assistanceType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assistance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financial Aid</SelectItem>
                        <SelectItem value="medical">Medical Assistance</SelectItem>
                        <SelectItem value="education">Education Support</SelectItem>
                        <SelectItem value="food">Food Assistance</SelectItem>
                        <SelectItem value="housing">Housing Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                    <Select
                      value={formData.urgencyLevel}
                      onValueChange={(value) => handleSelectChange("urgencyLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait</SelectItem>
                        <SelectItem value="medium">Medium - Within a month</SelectItem>
                        <SelectItem value="high">High - Within a week</SelectItem>
                        <SelectItem value="urgent">Urgent - Immediate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requestDetails">Detailed Request Information *</Label>
                  <Textarea
                    id="requestDetails"
                    name="requestDetails"
                    value={formData.requestDetails}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about your situation and the assistance you need..."
                    rows={6}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Minimum 20 characters. Please be as detailed as possible.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All requests will be reviewed by our assistance committee. 
                  We will contact you within 3-5 business days.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssistanceRequest;
