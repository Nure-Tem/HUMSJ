import { useState, useEffect } from "react";
import { Gift, User, Calendar, FileText, DollarSign, Package, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { z } from "zod";

const distributionSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required").max(100),
  supportType: z.string().min(1, "Support type is required"),
  amount: z.string().min(1, "Amount/value is required"),
  date: z.string().min(1, "Date is required"),
  givenBy: z.string().min(2, "Name of person who gave is required").max(100),
  notes: z.string().max(500).optional(),
});

const supportTypes = [
  "Food",
  "Money",
  "Clothing",
  "School Material",
  "Medical Support",
  "Housing Support",
  "Other"
];

interface DistributionRecord {
  id: string;
  recipientName: string;
  supportType: string;
  amount: string;
  date: string;
  givenBy: string;
  notes?: string;
  createdAt: any;
}

export default function CharityDistribution() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState<DistributionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    recipientName: "",
    supportType: "",
    amount: "",
    date: "",
    givenBy: "",
    notes: "",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const q = query(collection(db, "charity_distributions"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DistributionRecord[];
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = distributionSchema.safeParse(formData);
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
      await addDoc(collection(db, "charityDistributions"), {
        ...formData,
        timestamp: serverTimestamp(),
      });

      toast({
        title: "Record Added!",
        description: "Charity distribution has been recorded successfully.",
      });

      setFormData({
        recipientName: "",
        supportType: "",
        amount: "",
        date: "",
        givenBy: "",
        notes: "",
      });

      fetchRecords();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 islamic-pattern-gold" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 animate-glow">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold md:text-5xl lg:text-6xl animate-slide-up">
            <span className="text-gradient">Charity Distribution</span>
            <br />
            <span className="text-foreground">Records</span>
          </h1>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-muted-foreground animate-slide-up delay-100">
            <Lock className="h-4 w-4" />
            <span className="text-sm">Admin Access Only</span>
          </div>
        </div>
      </section>

      {/* Form and Table Section */}
      <section className="py-16 lg:py-24 islamic-pattern">
        <div className="container mx-auto px-4 space-y-12">
          {/* Add New Record Form */}
          <Card className="dark-card shadow-elegant">
            <CardHeader className="border-b border-primary/20 pb-6">
              <div className="gold-line-left mb-4" />
              <CardTitle className="font-heading text-2xl text-gradient">Record New Distribution</CardTitle>
              <CardDescription className="text-muted-foreground">
                Add a new charity distribution record
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName" className="text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Recipient Name *
                    </Label>
                    <Input
                      id="recipientName"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      placeholder="Name of recipient"
                      required
                      className="input-dark"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      Type of Support *
                    </Label>
                    <Select value={formData.supportType} onValueChange={(value) => setFormData({ ...formData, supportType: value })}>
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-primary/20">
                        {supportTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Amount/Value *
                    </Label>
                    <Input
                      id="amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="e.g., 500 ETB or 5kg rice"
                      required
                      className="input-dark"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="input-dark"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="givenBy" className="text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Given By *
                    </Label>
                    <Input
                      id="givenBy"
                      value={formData.givenBy}
                      onChange={(e) => setFormData({ ...formData, givenBy: e.target.value })}
                      placeholder="Society Service member name"
                      required
                      className="input-dark"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <Label htmlFor="notes" className="text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Notes (Optional)
                    </Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes"
                      className="input-dark"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="btn-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Record"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card className="dark-card shadow-elegant overflow-hidden">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="font-heading text-xl text-gradient">Distribution History</CardTitle>
              <CardDescription className="text-muted-foreground">
                All recorded charity distributions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">Loading records...</div>
              ) : records.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No distribution records yet. Add your first record above.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-primary/20 hover:bg-transparent">
                        <TableHead className="text-primary">Recipient</TableHead>
                        <TableHead className="text-primary">Type</TableHead>
                        <TableHead className="text-primary">Amount/Value</TableHead>
                        <TableHead className="text-primary">Date</TableHead>
                        <TableHead className="text-primary">Given By</TableHead>
                        <TableHead className="text-primary">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id} className="border-primary/10 hover:bg-primary/5">
                          <TableCell className="font-medium text-foreground">{record.recipientName}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
                              {record.supportType}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{record.amount}</TableCell>
                          <TableCell className="text-muted-foreground">{record.date}</TableCell>
                          <TableCell className="text-muted-foreground">{record.givenBy}</TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px] truncate">
                            {record.notes || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}