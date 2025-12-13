import { Building2, Users, BookOpen, Wallet, Heart, Globe, Info, Megaphone, BookMarked } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const departments = [
  {
    id: "dawa-irshad",
    name: "Dawa Irshad & Fejril Islam",
    description: "Responsible for Islamic propagation, guidance, and organizing religious activities",
    icon: Megaphone,
    color: "primary",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Supports academic excellence and educational programs for students",
    icon: BookOpen,
    color: "accent",
  },
  {
    id: "beytel-al-mal",
    name: "Beytel Al-Mal",
    description: "Manages financial resources, treasury, and fund allocation",
    icon: Wallet,
    color: "primary",
  },
  {
    id: "social-affairs",
    name: "Social Affairs",
    description: "Handles social welfare, student support, and community relations",
    icon: Users,
    color: "accent",
  },
  {
    id: "society-service",
    name: "Society Service / External Affairs",
    description: "Serves the external community through education, charity, and dawah programs",
    icon: Globe,
    isHighlighted: true,
    subsectors: [
      { name: "Charity", description: "Manages sadaqah, fundraising, and support for the needy", icon: Heart },
      { name: "Dawa", description: "External dawah activities and Islamic education for the community", icon: Megaphone },
      { name: "Qirat", description: "Quran teaching, recitation classes, and tajweed programs", icon: BookMarked },
    ],
  },
  {
    id: "information",
    name: "Information",
    description: "Manages communications, media, and information dissemination",
    icon: Info,
    color: "primary",
  },
];

export default function Structure() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-28">
        <div className="absolute inset-0 islamic-pattern-gold opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Building2 className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl animate-slide-up">
            Organizational Structure
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90 animate-slide-up delay-100">
            Haramaya University Muslim Students Jema'a
          </p>
        </div>
      </section>

      {/* Structure Overview */}
      <section className="py-16 lg:py-24 gradient-cream islamic-pattern">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            {/* Header Card */}
            <Card className="mb-12 ornamental-frame shadow-elegant border-0 text-center animate-slide-up">
              <CardContent className="p-8 lg:p-12">
                <div className="gold-line mb-6" />
                <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl mb-4">
                  HUMSJ Departments
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The Haramaya University Muslim Students Jema'a is organized into specialized departments, 
                  each working together to serve our members and the community.
                </p>
              </CardContent>
            </Card>

            {/* Departments Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept, index) => {
                const Icon = dept.icon;
                const isHighlighted = dept.isHighlighted;

                if (isHighlighted) {
                  return (
                    <Card 
                      key={dept.id}
                      className="md:col-span-2 lg:col-span-3 border-2 border-accent shadow-elegant overflow-hidden animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="gradient-hero text-center py-8">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                          <Icon className="h-8 w-8 text-accent" />
                        </div>
                        <CardTitle className="font-heading text-2xl text-primary-foreground lg:text-3xl">
                          {dept.name}
                        </CardTitle>
                        <p className="text-primary-foreground/80 mt-2">{dept.description}</p>
                        <div className="mt-4 inline-block rounded-full bg-accent px-4 py-1 text-sm font-medium text-accent-foreground">
                          External Affairs Sector
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 lg:p-8">
                        <h4 className="font-heading text-lg font-semibold text-primary mb-6 text-center">
                          Subsectors
                        </h4>
                        <div className="grid gap-4 sm:grid-cols-3">
                          {dept.subsectors?.map((sub, i) => {
                            const SubIcon = sub.icon;
                            return (
                              <div 
                                key={i} 
                                className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center hover:border-primary/40 hover:shadow-soft transition-all"
                              >
                                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                  <SubIcon className="h-6 w-6 text-primary" />
                                </div>
                                <h5 className="font-heading text-lg font-semibold text-primary mb-2">
                                  {i + 1}. {sub.name}
                                </h5>
                                <p className="text-sm text-muted-foreground">{sub.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <Card 
                    key={dept.id}
                    className="border-border/50 shadow-card hover:shadow-elegant transition-all animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className={`mb-4 h-12 w-12 rounded-xl ${dept.color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'} flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${dept.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                        {dept.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Flow */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="gold-line mb-6" />
            <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl mb-8">
              Working Together for the Ummah
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
                <div className="text-4xl font-heading font-bold text-primary mb-2">6</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </div>
              <div className="rounded-xl bg-accent/10 border border-accent/30 p-6">
                <div className="text-4xl font-heading font-bold text-accent mb-2">3</div>
                <div className="text-sm text-muted-foreground">External Affairs Subsectors</div>
              </div>
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
                <div className="text-4xl font-heading font-bold text-primary mb-2">1</div>
                <div className="text-sm text-muted-foreground">United Vision</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
