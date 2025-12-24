import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Phone, Calendar, Award, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Leader {
  id: string;
  name: string;
  phone: string;
  position: string;
  startYear: number;
  endYear: number;
  gender: "male" | "female";
  timestamp?: any;
}

export default function ExternalAffairsLeaders() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedYears, setExpandedYears] = useState<string[]>([]);
  const [filterGender, setFilterGender] = useState<"all" | "male" | "female">("all");

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const leadersSnapshot = await getDocs(
        query(collection(db, "externalAffairsLeaders"), orderBy("endYear", "desc"))
      );
      const leadersData = leadersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Leader[];
      setLeaders(leadersData);
    } catch (error) {
      console.error("Error fetching leaders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeaders = leaders.filter(leader => 
    filterGender === "all" || leader.gender === filterGender
  );

  // Group leaders by year range
  const groupedByYear = filteredLeaders.reduce((acc, leader) => {
    const yearRange = `${leader.startYear}-${leader.endYear}`;
    if (!acc[yearRange]) acc[yearRange] = [];
    acc[yearRange].push(leader);
    return acc;
  }, {} as Record<string, Leader[]>);

  const sortedYearRanges = Object.keys(groupedByYear).sort((a, b) => {
    const yearA = parseInt(a.split("-")[1]);
    const yearB = parseInt(b.split("-")[1]);
    return yearB - yearA;
  });

  const toggleYear = (year: string) => {
    setExpandedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    );
  };

  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes("external affairs amir") || pos.includes("general amir")) return "bg-amber-100 text-amber-800 border-amber-300";
    if (pos.includes("qirat")) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (pos.includes("charity")) return "bg-blue-100 text-blue-800 border-blue-300";
    if (pos.includes("dawa")) return "bg-purple-100 text-purple-800 border-purple-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-28">
        <div className="absolute inset-0 islamic-pattern-gold opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Users className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold heading-yellow md:text-5xl lg:text-6xl animate-slide-up">
            External Affairs Leaders
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-pink animate-slide-up delay-100">
            Honoring Our Leaders (2000 - 2018)
          </p>
          <p className="mx-auto max-w-3xl text-base text-pink/80 mt-4 animate-slide-up delay-200">
            A tribute to the dedicated individuals who have served in the External Affairs department of HUMSJ
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={filterGender === "all" ? "default" : "outline"}
              onClick={() => setFilterGender("all")}
              className={filterGender === "all" ? "bg-primary" : ""}
            >
              All Leaders
            </Button>
            <Button
              variant={filterGender === "male" ? "default" : "outline"}
              onClick={() => setFilterGender("male")}
              className={filterGender === "male" ? "bg-blue-600" : ""}
            >
              Male Leaders
            </Button>
            <Button
              variant={filterGender === "female" ? "default" : "outline"}
              onClick={() => setFilterGender("female")}
              className={filterGender === "female" ? "bg-pink-600" : ""}
            >
              Female Leaders
            </Button>
          </div>
        </div>
      </section>

      {/* Leaders Timeline */}
      <section className="py-16 lg:py-24 gradient-cream islamic-pattern">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {filteredLeaders.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No leaders data available yet</p>
                  <p className="text-gray-400 mt-2">Check back soon for updates</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {sortedYearRanges.map((yearRange, index) => {
                  const isExpanded = expandedYears.includes(yearRange);
                  const yearLeaders = groupedByYear[yearRange];
                  
                  return (
                    <Card 
                      key={yearRange} 
                      className="overflow-hidden shadow-elegant animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleYear(yearRange)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-heading text-primary">
                                {yearRange}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {yearLeaders.length} leader{yearLeaders.length > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-6 w-6 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="border-t bg-gray-50/50">
                          <div className="grid gap-4 md:grid-cols-2 pt-4">
                            {yearLeaders.map((leader) => (
                              <div 
                                key={leader.id}
                                className={`p-4 rounded-xl border-2 bg-white shadow-sm hover:shadow-md transition-all ${
                                  leader.gender === "female" ? "border-pink-200" : "border-blue-200"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                    leader.gender === "female" ? "bg-pink-100" : "bg-blue-100"
                                  }`}>
                                    <Award className={`h-5 w-5 ${
                                      leader.gender === "female" ? "text-pink-600" : "text-blue-600"
                                    }`} />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-foreground">{leader.name}</h3>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getPositionColor(leader.position)}`}>
                                      {leader.position}
                                    </span>
                                    <a 
                                      href={`tel:${leader.phone}`}
                                      className="flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      <Phone className="h-4 w-4" />
                                      {leader.phone}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="gold-line mb-6" />
            <h2 className="font-heading text-2xl font-bold heading-blue md:text-3xl mb-8">
              Legacy of Service
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
                <div className="text-4xl font-heading font-bold text-primary mb-2">
                  {leaders.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Leaders</div>
              </div>
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-6">
                <div className="text-4xl font-heading font-bold text-blue-600 mb-2">
                  {leaders.filter(l => l.gender === "male").length}
                </div>
                <div className="text-sm text-muted-foreground">Male Leaders</div>
              </div>
              <div className="rounded-xl bg-pink-50 border border-pink-200 p-6">
                <div className="text-4xl font-heading font-bold text-pink-600 mb-2">
                  {leaders.filter(l => l.gender === "female").length}
                </div>
                <div className="text-sm text-muted-foreground">Female Leaders</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
