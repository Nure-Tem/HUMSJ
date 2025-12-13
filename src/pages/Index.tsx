import { Link } from "react-router-dom";
import { BookOpen, Heart, Users, HandHeart, ArrowRight, Star, Baby, Building2, CreditCard, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-mosque.jpg";
import logo from "@/assets/humsj-logo.jpg";

const features = [
  {
    icon: BookOpen,
    title: "Quran & Islamic Education",
    description: "Teaching Quran recitation, memorization, and Islamic knowledge to students and the community.",
  },
  {
    icon: HandHeart,
    title: "Financial & Community Support",
    description: "Providing assistance to those in need through various financial aid and support programs.",
  },
  {
    icon: Heart,
    title: "Charity Sub-Sector",
    description: "Managing Sadaqah projects, fundraising initiatives, and community outreach programs.",
  },
];

const stats = [
  { value: "500+", label: "Students Taught" },
  { value: "100+", label: "Families Supported" },
  { value: "50+", label: "Charity Projects" },
  { value: "10+", label: "Years of Service" },
];

const quickLinks = [
  { icon: Baby, title: "Register Child", description: "Enroll in our programs", path: "/children-registration" },
  { icon: CreditCard, title: "Monthly Charity", description: "Student Sadaqah Program", path: "/monthly-charity" },
  { icon: Building2, title: "Our Structure", description: "View organization", path: "/structure" },
  { icon: Star, title: "Vision & Mission", description: "Learn our goals", path: "/vision-mission" },
];

export default function Index() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          <div className="absolute inset-0 islamic-pattern-gold" />
        </div>
        
        <div className="container relative mx-auto flex min-h-[90vh] items-center px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Left Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 backdrop-blur-sm animate-fade-in border border-primary/30">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium text-primary">External Affairs Sector</span>
              </div>
              
              <h1 className="mb-6 font-heading text-4xl font-bold leading-tight md:text-5xl lg:text-6xl animate-slide-up">
                <span className="text-foreground">Haramaya University</span>
                <br />
                <span className="text-gradient">Muslim Students Jema'a</span>
              </h1>
              
              <p className="mb-8 text-lg text-muted-foreground md:text-xl animate-slide-up delay-100">
                Serving the community through Islamic education, charitable initiatives, and comprehensive support programs. Together, we build a stronger Ummah.
              </p>
              
              <div className="flex flex-wrap gap-4 animate-slide-up delay-200">
                <Button size="lg" className="btn-gold" asChild>
                  <Link to="/programs">
                    Explore Programs
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" className="btn-outline-gold" asChild>
                  <Link to="/donate">Support Our Work</Link>
                </Button>
              </div>
            </div>

            {/* Right - Logo */}
            <div className="hidden lg:flex justify-center animate-fade-in delay-300">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-2xl animate-glow" />
                <img 
                  src={logo} 
                  alt="HUMSJ Logo" 
                  className="relative h-64 w-64 rounded-full object-cover border-4 border-primary/30 shadow-gold" 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Quick Links */}
      <section className="py-12 -mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {quickLinks.map((link, index) => (
              <Link
                key={link.title}
                to={link.path}
                className="group dark-card p-5 transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <link.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 lg:py-24 islamic-pattern">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="gold-line mb-6" />
            <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl animate-slide-up">
              <span className="text-gradient">Our Mission</span>
            </h2>
            <p className="text-lg text-muted-foreground animate-slide-up delay-100 leading-relaxed">
              The External Affairs Sector of HUMSJ is dedicated to extending our Islamic values and services beyond the university walls. We work tirelessly to educate, support, and uplift both our student community and the broader society through various programs rooted in the teachings of Islam.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="gold-line mb-6" />
            <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
              <span className="text-gradient">What We Do</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our three main pillars of service to the community
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="group dark-card border-0 transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 inline-flex rounded-xl bg-primary/20 p-4 transition-all duration-300 group-hover:bg-primary group-hover:shadow-gold">
                    <feature.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button className="btn-outline-gold" asChild>
              <Link to="/programs">
                View All Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 islamic-pattern-gold relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center dark-card p-8 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="mb-2 font-heading text-4xl font-bold text-gradient md:text-5xl">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 islamic-pattern">
        <div className="container relative mx-auto px-4 text-center">
          <div className="gold-line mb-6" />
          <h2 className="mb-6 font-heading text-3xl font-bold md:text-4xl">
            <span className="text-gradient">Join Us in Making a Difference</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Your support helps us continue our mission of serving the community. Every contribution, big or small, makes a meaningful impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="btn-gold" asChild>
              <Link to="/donate">
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Link>
            </Button>
            <Button size="lg" className="btn-outline-gold" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}