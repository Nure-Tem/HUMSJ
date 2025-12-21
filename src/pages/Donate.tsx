import { Heart, Users, BookOpen, Gift, Phone, Landmark, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import patternBg from "@/assets/pattern-bg.jpg";

const charityProjects = [
  {
    title: "Orphan Sponsorship",
    description: "Support orphaned children with education, food, and essential needs.",
    goal: "100+ orphans",
    icon: Users,
  },
  {
    title: "Quran Education Fund",
    description: "Help us provide Quran education materials and teacher stipends.",
    goal: "ETB 250,000+",
    icon: BookOpen,
  },
  {
    title: "Eid Gift Program",
    description: "Bring joy to needy families during Eid celebrations.",
    goal: "500+ families",
    icon: Gift,
  },
  {
    title: "Emergency Relief",
    description: "Support families facing unexpected financial hardships.",
    goal: "Ongoing",
    icon: Heart,
  },
];

const donationMethods = [
  {
    icon: Landmark,
    title: "Bank Transfer",
    details: [
      "Bank: Commercial Bank of Ethiopia (CBE)",
      "Account Name: HUMSJ External Affairs",
      "Account Number: 1000614307599",
    ],
  },
  {
    icon: Phone,
    title: "Mobile Banking",
    details: [
      "CBE Birr: 0985736451",
      "Telebirr: 0985736451",
      "M-Pesa: 0799129735",
    ],
  },
  {
    icon: CreditCard,
    title: "In-Person",
    details: [
      "Visit our office at Haramaya University",
      "Contact: +251 985 736 451",
      "Office Hours: Sun-Thu, 9AM-5PM",
    ],
  },
];

export default function Donate() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${patternBg})` }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 animate-fade-in">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Support Our Mission</span>
          </div>
          <h1 className="mb-6 font-heading text-4xl font-bold heading-blue md:text-5xl lg:text-6xl animate-slide-up">
            Donate & Support
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground animate-slide-up delay-100">
            Your generosity enables us to continue serving the community. Every contribution makes a meaningful difference in someone's life.
          </p>
        </div>
      </section>

      {/* Islamic Quote */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="mx-auto max-w-3xl">
            <p className="mb-4 font-heading text-xl italic text-foreground md:text-2xl">
              "The believer's shade on the Day of Resurrection will be his charity."
            </p>
            <footer className="text-muted-foreground">— Prophet Muhammad ﷺ (Al-Tirmidhi)</footer>
          </blockquote>
        </div>
      </section>

      {/* Active Charity Projects */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold heading-blue md:text-4xl">
              Active Charity Projects
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Choose a cause close to your heart and contribute to our ongoing initiatives
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {charityProjects.map((project, index) => (
              <Card 
                key={project.title}
                className="group border-border/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="mb-3 inline-flex w-fit rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <project.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-heading text-lg heading-blue">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
                  <div className="rounded-lg bg-muted px-3 py-2">
                    <p className="text-xs text-muted-foreground">Goal</p>
                    <p className="font-semibold text-primary">{project.goal}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Methods */}
      <section className="bg-muted/50 py-16 islamic-pattern lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold heading-blue md:text-4xl">
              How to Donate
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Choose your preferred method of donation
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {donationMethods.map((method, index) => (
              <Card 
                key={method.title}
                className="border-border/50 bg-card/80 backdrop-blur-sm animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-3 inline-flex rounded-xl bg-accent/10 p-4 text-accent">
                    <method.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-heading text-xl heading-blue">{method.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {method.details.map((detail, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact for Donations */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-card lg:p-12">
            <h2 className="mb-4 font-heading text-2xl font-bold heading-blue md:text-3xl">
              Ready to Donate?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Make a donation now and track your contribution. Our team will verify your payment 
              and credit it to your account.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/donate-now">Donate Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-6 font-heading text-3xl font-bold heading-yellow md:text-4xl">
            JazakAllahu Khairan
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
            May Allah reward you abundantly for your generosity. Your support helps us continue 
            serving the community and spreading beneficial knowledge.
          </p>
        </div>
      </section>
    </div>
  );
}
