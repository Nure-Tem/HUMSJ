import { useState } from "react";
import { Heart, CreditCard, Phone, User, Building, Calendar, FileText } from "lucide-react";
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

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  idNumber: z.string().max(20).optional(),
  phone: z.string().min(10, "Valid phone number required").max(15),
  department: z.string().min(2, "Department is required").max(100),
  year: z.string().min(1, "Year is required"),
  amount: z.string().min(1, "Amount is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  startMonth: z.string().min(1, "Start month is required"),
  notes: z.string().max(500).optional(),
});

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduate"];

export default function MonthlyCharityRegistration() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    phone: "",
    department: "",
    year: "",
    amount: "",
    paymentMethod: "",
    startMonth: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = registrationSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: "Validation Error",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "monthly_charity_registrations"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);
      toast({
        title: "Registration Successful!",
        description: "Your monthly charity commitment has been recorded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen islamic-pattern">
        <div className="container mx-auto px-4 py-20">
          <Card className="mx-auto max-w-lg dark-card border-primary/30">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 animate-glow">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mb-4 font-heading text-3xl font-bold text-gradient">
                Commitment Recorded!
              </h2>
              <p className="mb-6 text-muted-foreground">
                Your monthly charity commitment has been recorded. May Allah bless you for your generosity.
              </p>
              <div className="gold-line mb-6" />
              <Button 
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    fullName: "",
                    idNumber: "",
                    phone: "",
                    department: "",
                    year: "",
                    amount: "",
                    paymentMethod: "",
                    startMonth: "",
                    notes: "",
                  });
                }}
                className="btn-gold"
              >
                Register Another Person
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 islamic-pattern-gold" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 animate-glow">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl lg:text-6xl animate-slide-up">
            <span className="text-gradient">Monthly Charity</span>
            <br />
            <span className="text-foreground">Registration</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground animate-slide-up delay-100">
            Student Sadaqah Program
          </p>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground/80 animate-slide-up delay-200">
            Commit to monthly contributions and help those in need consistently
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 lg:py-24 islamic-pattern">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl dark-card shadow-elegant">
            <CardHeader className="text-center border-b border-primary/20 pb-6">
              <div className="gold-line mb-4" />
              <CardTitle className="font-heading text-2xl text-gradient">Registration Form</CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill in your details to commit to monthly charity
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Enter your full name"
                        required
                        className="input-dark"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber" className="text-foreground">ID Number (Optional)</Label>
                      <Input
                        id="idNumber"
                        value={formData.idNumber}
                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                        placeholder="Student ID"
                        className="input-dark"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                        required
                        className="input-dark"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-foreground">Department *</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="e.g., Computer Science"
                        required
                        className="input-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Year *</Label>
                    <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-primary/20">
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contribution Details */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Contribution Details
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-foreground">Monthly Amount (ETB) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="e.g., 50"
                        required
                        className="input-dark"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Payment Method *</Label>
                      <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                        <SelectTrigger className="input-dark">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-primary/20">
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="mobile">Mobile Money (Telebirr/CBE Birr)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Start Month *</Label>
                    <Select value={formData.startMonth} onValueChange={(value) => setFormData({ ...formData, startMonth: value })}>
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="Select start month" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-primary/20">
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Additional Notes
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-foreground">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any additional information..."
                      rows={4}
                      className="input-dark resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full btn-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Commitment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}