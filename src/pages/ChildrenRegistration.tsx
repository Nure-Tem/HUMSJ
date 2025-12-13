import { useState } from "react";
import { BookOpen, Users, Heart, Calendar, School, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { z } from "zod";

const programs = [
  { id: "quran-class", label: "Quran Class", icon: BookOpen },
  { id: "islamic-studies", label: "Islamic Studies", icon: School },
  { id: "moral-education", label: "Moral Education", icon: Star },
  { id: "weekend-program", label: "Weekend Program", icon: Calendar },
  { id: "holiday-program", label: "Holiday Program", icon: Users },
  { id: "charity-support", label: "Charity Support", icon: Heart },
];

const registrationSchema = z.object({
  childName: z.string().min(2, "Child's name is required").max(100),
  age: z.string().min(1, "Age is required"),
  guardianName: z.string().min(2, "Guardian name is required").max(100),
  phone: z.string().min(10, "Valid phone number required").max(15),
  address: z.string().min(5, "Address is required").max(200),
  programs: z.array(z.string()).min(1, "Select at least one program"),
  notes: z.string().max(500).optional(),
});

export default function ChildrenRegistration() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    childName: "",
    age: "",
    guardianName: "",
    phone: "",
    address: "",
    programs: [] as string[],
    notes: "",
  });

  const handleProgramToggle = (programId: string) => {
    setFormData((prev) => ({
      ...prev,
      programs: prev.programs.includes(programId)
        ? prev.programs.filter((p) => p !== programId)
        : [...prev.programs, programId],
    }));
  };

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
      await addDoc(collection(db, "children_registrations"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);
      toast({
        title: "Registration Successful!",
        description: "Registration received successfully.",
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
                <Star className="h-10 w-10 text-primary" />
              </div>
              <h2 className="mb-4 font-heading text-3xl font-bold text-gradient">
                Registration Received Successfully!
              </h2>
              <p className="mb-6 text-muted-foreground">
                Thank you for registering. We will contact you soon with more details about the programs.
              </p>
              <div className="gold-line mb-6" />
              <Button onClick={() => setIsSuccess(false)} className="btn-gold">
                Register Another Child
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
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl lg:text-6xl animate-slide-up">
            <span className="text-gradient">Children</span>
            <br />
            <span className="text-foreground">Registration</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground animate-slide-up delay-100">
            External Affairs Sector - Society Service
          </p>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground/80 animate-slide-up delay-200">
            Register your child for our Islamic education and community programs
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
                Please fill in all the required information below
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Child Information */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm text-primary">1</span>
                    Child Information
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="childName" className="text-foreground">Child's Full Name *</Label>
                      <Input
                        id="childName"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        placeholder="Enter child's full name"
                        required
                        className="input-dark"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-foreground">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        min="3"
                        max="18"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="Enter age"
                        required
                        className="input-dark"
                      />
                    </div>
                  </div>
                </div>

                {/* Guardian Information */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm text-primary">2</span>
                    Guardian Information
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="guardianName" className="text-foreground">Parent/Guardian Full Name *</Label>
                      <Input
                        id="guardianName"
                        value={formData.guardianName}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        placeholder="Enter guardian's name"
                        required
                        className="input-dark"
                      />
                    </div>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter full address"
                      required
                      className="input-dark"
                    />
                  </div>
                </div>

                {/* Program Selection */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm text-primary">3</span>
                    Program Selection *
                  </h3>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    {programs.map((program) => {
                      const Icon = program.icon;
                      const isSelected = formData.programs.includes(program.id);
                      return (
                        <div
                          key={program.id}
                          onClick={() => handleProgramToggle(program.id)}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all duration-300 ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-gold"
                              : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleProgramToggle(program.id)}
                            className="pointer-events-none border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          />
                          <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                            {program.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-primary flex items-center gap-2">
                    <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm text-primary">4</span>
                    Additional Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-foreground">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special requirements or information..."
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
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
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