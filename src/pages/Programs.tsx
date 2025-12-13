import { BookOpen, GraduationCap, HandHeart, Heart, Users, Calendar, Baby, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const programs = [
  {
    id: "quran-teaching",
    icon: BookOpen,
    title: "Quran Teaching Program",
    description: "Comprehensive Quran education including recitation (Tilawah), memorization (Hifz), and Tajweed rules.",
    details: [
      "Weekly Quran classes for all levels",
      "One-on-one memorization sessions",
      "Tajweed and proper pronunciation training",
      "Quran competition preparation",
    ],
    participants: "Open to all Muslim students and community members",
    contribution: "Volunteer as a teacher or donate teaching materials",
    color: "primary",
  },
  {
    id: "islamic-education",
    icon: GraduationCap,
    title: "Islamic Education",
    description: "Educational programs covering Islamic theology, history, jurisprudence, and contemporary issues.",
    details: [
      "Regular Islamic lectures and seminars",
      "Fiqh and Aqeedah study circles",
      "Dawah training workshops",
      "Islamic history and civilization courses",
    ],
    participants: "University students and interested community members",
    contribution: "Sponsor a lecture series or provide educational resources",
    color: "accent",
  },
  {
    id: "financial-support",
    icon: HandHeart,
    title: "Financial Support Program",
    description: "Providing financial assistance to students and community members facing economic hardship.",
    details: [
      "Emergency financial aid for students",
      "Sponsorship for orphans and needy families",
      "Educational materials and supplies",
      "Medical expense assistance",
    ],
    participants: "Verified students and community members in need",
    contribution: "Donate funds or sponsor a student's education",
    color: "primary",
  },
  {
    id: "charity-sadaqah",
    icon: Heart,
    title: "Sadaqah Projects",
    description: "Managing voluntary charity projects that address immediate community needs.",
    details: [
      "Food distribution programs",
      "Clothing and essentials drives",
      "Eid gifts for orphans",
      "Emergency relief initiatives",
    ],
    participants: "Families in need, orphans, and vulnerable community members",
    contribution: "Donate items, volunteer time, or provide monetary support",
    color: "accent",
  },
  {
    id: "fundraising",
    icon: Users,
    title: "Fundraising Initiatives",
    description: "Organized fundraising campaigns to support our various charitable activities.",
    details: [
      "Annual charity dinners",
      "Online crowdfunding campaigns",
      "Partnership with local businesses",
      "Student-led fundraising events",
    ],
    participants: "Open to all supporters and well-wishers",
    contribution: "Organize events, spread awareness, or make donations",
    color: "primary",
  },
  {
    id: "community-outreach",
    icon: Calendar,
    title: "Community Outreach",
    description: "Programs that connect the university with the broader community for mutual benefit.",
    details: [
      "Community service projects",
      "Interfaith dialogue sessions",
      "Public health awareness campaigns",
      "Environmental conservation initiatives",
    ],
    participants: "Students, faculty, and community volunteers",
    contribution: "Volunteer for projects or propose new initiatives",
    color: "accent",
  },
];

export default function Programs() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-28">
        <div className="absolute inset-0 islamic-pattern-gold opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <BookOpen className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl animate-slide-up">
            Our Programs & Activities
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90 animate-slide-up delay-100">
            Discover the various ways we serve the community through education, support, and charitable initiatives.
          </p>
        </div>
      </section>

      {/* External Affairs Special Sections */}
      <section className="py-16 lg:py-20 gradient-cream islamic-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="gold-line mb-6" />
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl mb-4">
              External Affairs Programs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Special programs under the Society Service / External Affairs Sector
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Quran & Islamic Education for Children */}
            <Card className="ornamental-frame shadow-elegant border-0 overflow-hidden animate-slide-up">
              <CardHeader className="bg-primary p-6 text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center">
                  <Baby className="h-7 w-7 text-accent" />
                </div>
                <CardTitle className="font-heading text-xl text-primary-foreground">
                  Quran & Islamic Education for Community Children
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Dedicated programs for children in the surrounding community to learn Quran, Islamic values, and moral education.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Quran recitation and memorization classes
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Islamic studies and moral education
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Weekend and holiday programs
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Character building activities
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/children-registration">Register Your Child</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Charity Support for Families */}
            <Card className="ornamental-frame shadow-elegant border-0 overflow-hidden animate-slide-up delay-100">
              <CardHeader className="bg-accent p-6 text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Home className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="font-heading text-xl text-accent-foreground">
                  Charity Support for Families
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Comprehensive support programs for families in need within and around the university community.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Monthly food assistance packages
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Emergency financial support
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Educational support for children
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Eid and Ramadan special programs
                  </li>
                </ul>
                <Button asChild variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <Link to="/donate">Support This Program</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="gold-line mb-6" />
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl mb-4">
              All Programs
            </h2>
          </div>
          <div className="space-y-8">
            {programs.map((program, index) => (
              <Card 
                key={program.id}
                id={program.id}
                className="overflow-hidden border-border/30 shadow-card hover:shadow-elegant transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="grid lg:grid-cols-3">
                  <CardHeader className={`${program.color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'} p-6 lg:p-8`}>
                    <div className={`mb-4 inline-flex w-fit rounded-xl ${program.color === 'accent' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'} p-4`}>
                      <program.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-heading text-2xl">{program.title}</CardTitle>
                    <p className="text-muted-foreground">{program.description}</p>
                  </CardHeader>
                  
                  <CardContent className="col-span-2 p-6 lg:p-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="mb-3 font-semibold text-foreground">Activities Include:</h4>
                        <ul className="space-y-2">
                          {program.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${program.color === 'accent' ? 'bg-accent' : 'bg-primary'}`} />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-2 font-semibold text-foreground">Who Can Participate:</h4>
                          <p className="text-sm text-muted-foreground">{program.participants}</p>
                        </div>
                        
                        <div>
                          <h4 className="mb-2 font-semibold text-foreground">How to Contribute:</h4>
                          <p className="text-sm text-muted-foreground">{program.contribution}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-navy py-16 lg:py-24 islamic-pattern-gold">
        <div className="container mx-auto px-4 text-center">
          <div className="gold-line mb-6" />
          <h2 className="mb-4 font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Get Involved?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
            Whether you want to participate in our programs or support our work, we welcome you to join our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link to="/donate">Support Our Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
