import { useState } from "react";
import { Heart, Landmark, Phone, CheckCircle, Copy, ArrowRight, ArrowLeft, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const bankAccounts = [
  { id: "cbe", name: "Commercial Bank of Ethiopia (CBE)", accountName: "HUMSJ External Affairs", accountNumber: "1000614307599", icon: Landmark },
  { id: "cbe-birr", name: "CBE Birr", accountName: "HUMSJ", accountNumber: "0985736451", icon: Phone },
  { id: "telebirr", name: "Telebirr", accountName: "HUMSJ", accountNumber: "0985736451", icon: Phone },
  { id: "mpesa", name: "M-Pesa", accountName: "HUMSJ", accountNumber: "0799129735", icon: Phone },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduate"];

type Step = "info" | "amount" | "transfer" | "confirm" | "success";

export default function MonthlyCharityRegistration() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: "", idNumber: "", phone: "", email: "", department: "", year: "",
    amount: "", paymentMethod: "", startMonth: "", transactionRef: "", notes: "",
  });

  const selectedBank = bankAccounts.find(b => b.id === formData.paymentMethod);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setReceiptFile(e.target.files[0]);
  };


  const handleSubmit = async () => {
    if (!formData.fullName || !formData.phone || !formData.transactionRef) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      let receiptUrl = "";
      if (receiptFile) {
        const fileRef = ref(storage, `monthly-charity-receipts/${Date.now()}-${receiptFile.name}`);
        await uploadBytes(fileRef, receiptFile);
        receiptUrl = await getDownloadURL(fileRef);
      }
      await addDoc(collection(db, "monthlyCharityRegistrations"), {
        ...formData, amount: parseFloat(formData.amount), receiptUrl, status: "pending", timestamp: serverTimestamp(),
      });
      setStep("success");
      toast({ title: "Registration Submitted!", description: "Your monthly charity commitment is pending verification." });
    } catch (error) {
      console.error("Error submitting:", error);
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: "", idNumber: "", phone: "", email: "", department: "", year: "", amount: "", paymentMethod: "", startMonth: "", transactionRef: "", notes: "" });
    setReceiptFile(null);
    setStep("info");
  };

  const steps: Step[] = ["info", "amount", "transfer", "confirm", "success"];

  return (
    <div className="min-h-screen islamic-pattern">
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 islamic-pattern-gold" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl animate-slide-up">
            <span className="text-gradient">Monthly Charity</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground animate-slide-up delay-100">
            Commit to monthly contributions and help those in need
          </p>
        </div>
      </section>

      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s ? "bg-primary text-primary-foreground" : steps.indexOf(step) > i ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {steps.indexOf(step) > i ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                {i < 4 && <div className={`w-8 h-1 mx-1 ${steps.indexOf(step) > i ? "bg-green-500" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="pb-16">
        <div className="container mx-auto px-4">
          {step === "info" && (
            <Card className="mx-auto max-w-lg dark-card border-primary/30">
              <CardHeader className="text-center border-b border-primary/20 pb-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-2xl text-gradient">Personal Information</CardTitle>
                <CardDescription>Step 1: Enter your details</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Full Name *</Label><Input placeholder="Your full name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="input-dark" /></div>
                  <div className="space-y-2"><Label>Phone Number *</Label><Input type="tel" placeholder="Your phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-dark" /></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Student ID (Optional)</Label><Input placeholder="Student ID" value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} className="input-dark" /></div>
                  <div className="space-y-2"><Label>Email (Optional)</Label><Input type="email" placeholder="Your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-dark" /></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Department *</Label><Input placeholder="e.g., Computer Science" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="input-dark" /></div>
                  <div className="space-y-2">
                    <Label>Year *</Label>
                    <Select value={formData.year} onValueChange={(v) => setFormData({ ...formData, year: v })}>
                      <SelectTrigger className="input-dark"><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent className="bg-card border-primary/20">{years.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full btn-gold mt-4" disabled={!formData.fullName || !formData.phone || !formData.department || !formData.year} onClick={() => setStep("amount")}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}


          {step === "amount" && (
            <Card className="mx-auto max-w-lg dark-card border-primary/30">
              <CardHeader className="text-center border-b border-primary/20 pb-6">
                <CardTitle className="font-heading text-2xl text-gradient">Contribution Details</CardTitle>
                <CardDescription>Step 2: Set your monthly contribution</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Monthly Amount (ETB) *</Label>
                  <Input type="number" min="1" placeholder="Enter amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="input-dark" />
                </div>
                <div className="space-y-2">
                  <Label>Start Month *</Label>
                  <Select value={formData.startMonth} onValueChange={(v) => setFormData({ ...formData, startMonth: v })}>
                    <SelectTrigger className="input-dark"><SelectValue placeholder="Select start month" /></SelectTrigger>
                    <SelectContent className="bg-card border-primary/20">{months.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                    <SelectTrigger className="input-dark"><SelectValue placeholder="Select payment method" /></SelectTrigger>
                    <SelectContent className="bg-card border-primary/20">{bankAccounts.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("info")}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="flex-1 btn-gold" disabled={!formData.amount || !formData.startMonth || !formData.paymentMethod} onClick={() => setStep("transfer")}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}


          {step === "transfer" && selectedBank && (
            <Card className="mx-auto max-w-lg dark-card border-primary/30">
              <CardHeader className="text-center border-b border-primary/20 pb-6">
                <CardTitle className="font-heading text-2xl text-gradient">Transfer Details</CardTitle>
                <CardDescription>Step 3: Send {formData.amount} ETB to this account</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <selectedBank.icon className="h-8 w-8 text-primary" />
                    <span className="font-semibold text-lg">{selectedBank.name}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                      <div><p className="text-xs text-muted-foreground">Account Name</p><p className="font-medium">{selectedBank.accountName}</p></div>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(selectedBank.accountName, "Account name")}><Copy className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-background/50 rounded">
                      <div><p className="text-xs text-muted-foreground">Account Number</p><p className="font-medium text-lg">{selectedBank.accountNumber}</p></div>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(selectedBank.accountNumber, "Account number")}><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <p className="text-sm text-amber-200"><strong>Important:</strong> After completing the transfer, click "I've Sent the Money" to confirm.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("amount")}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="flex-1 btn-gold" onClick={() => setStep("confirm")}>I've Sent the Money <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}


          {step === "confirm" && (
            <Card className="mx-auto max-w-lg dark-card border-primary/30">
              <CardHeader className="text-center border-b border-primary/20 pb-6">
                <CardTitle className="font-heading text-2xl text-gradient">Confirm Payment</CardTitle>
                <CardDescription>Step 4: Enter transaction details</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Transaction Reference / ID *</Label>
                  <Input placeholder="Enter transaction reference number" value={formData.transactionRef} onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })} className="input-dark" />
                  <p className="text-xs text-muted-foreground">This helps us verify your payment</p>
                </div>
                <div className="space-y-2">
                  <Label>Upload Receipt (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input type="file" accept="image/*" onChange={handleFileChange} className="input-dark" />
                    {receiptFile && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>
                </div>
                <div className="space-y-2"><Label>Notes (Optional)</Label><Textarea placeholder="Any additional notes..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="input-dark resize-none" rows={3} /></div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("transfer")}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                  <Button className="flex-1 btn-gold" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "success" && (
            <Card className="mx-auto max-w-lg dark-card border-primary/30">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 animate-glow">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="mb-4 font-heading text-3xl font-bold text-gradient">JazakAllahu Khairan!</h2>
                <p className="mb-2 text-lg text-foreground">Your monthly commitment of <strong>{formData.amount} ETB</strong> has been recorded.</p>
                <p className="mb-6 text-muted-foreground">Our team will verify your payment and activate your monthly charity subscription.</p>
                <div className="gold-line mb-6" />
                <Button onClick={resetForm} className="btn-gold">Register Another</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
