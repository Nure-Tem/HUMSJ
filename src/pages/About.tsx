import { Users, Target, Heart, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import patternBg from "@/assets/pattern-bg.jpg";
import ustMusab from "@/assets/ust-musab.jpg";
import ustYusuf from "@/assets/ust-yusuf.jpg";
import ustMahdi from "@/assets/ust-mahdi.jpg";

const values = [
  {
    icon: Target,
    title: "Our Vision",
    description: "To be a leading Islamic organization that empowers communities through education, support, and charitable work.",
  },
  {
    icon: Heart,
    title: "Our Mission",
    description: "To serve Allah by serving His creation through comprehensive Islamic education and community development programs.",
  },
  {
    icon: Users,
    title: "Who We Serve",
    description: "University students, local community members, and anyone seeking Islamic knowledge or support services.",
  },
  {
    icon: Award,
    title: "Our Values",
    description: "Sincerity, Excellence, Brotherhood, Service, and Continuous Improvement in all our endeavors.",
  },
];

const team = [
  {
    name: "Ust. Mus'ab",
    role: "General Amir",
    image: ustMusab,
  },
  {
    name: "Ust. Yusuf",
    role: "Vice Amir",
    image: ustYusuf,
  },
  {
    name: "Ust. Mahdi",
    role: "External Affairs Head",
    image: ustMahdi,
  },
];

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${patternBg})` }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl animate-slide-up">
            About External Affairs
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground animate-slide-up delay-100">
            Learn about our sector, our purpose, and the dedicated team working to serve the community.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The External Affairs Sector is one of the key divisions of the Haramaya University Muslim Students Jema'a (HUMSJ). Established to extend the reach of our Islamic activities beyond the university campus, we work tirelessly to bridge the gap between academic Islamic knowledge and community service.
              </p>
              <p>
                Our sector focuses on three main areas: Islamic Education (including Quran teaching and dawah activities), Financial Support for those in need, and our Charity Sub-Sector which manages Sadaqah and fundraising projects.
              </p>
              <p>
                We believe that serving others is one of the most noble acts of worship. Through our programs, we aim to embody the prophetic tradition of caring for our neighbors and supporting the less fortunate members of our society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-muted/50 py-16 islamic-pattern lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Our Purpose & Values
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((item, index) => (
              <Card 
                key={item.title}
                className="border-border/50 bg-card/80 backdrop-blur-sm animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="flex gap-4 p-6">
                  <div className="shrink-0 rounded-xl bg-primary/10 p-3 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Our Goals & Responsibilities
            </h2>
            
            <div className="space-y-6">
              {[
                "Provide comprehensive Quran education to students and community members",
                "Organize regular Islamic lectures, seminars, and dawah activities",
                "Support financially disadvantaged students and community members",
                "Manage charity projects and distribute Sadaqah to those in need",
                "Build bridges between the university and the external community",
                "Collaborate with other Islamic organizations for greater impact",
                "Document and report all activities for transparency and accountability",
              ].map((goal, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="text-foreground">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              Our Leadership Team
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Meet the dedicated individuals leading our sector's initiatives
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div 
                key={member.name}
                className="group text-center animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative mx-auto mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-primary/20 transition-all duration-300 group-hover:border-primary">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
