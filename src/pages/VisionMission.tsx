import { Target, Eye, Flag, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function VisionMission() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-28">
        <div className="absolute inset-0 islamic-pattern-gold opacity-30" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
            <Star className="h-8 w-8 text-accent" />
          </div>
          <h1 className="mb-4 font-heading text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl animate-slide-up">
            Vision, Mission & Goal
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90 animate-slide-up delay-100">
            Haramaya University Muslim Students Jema'a
          </p>
        </div>
      </section>

      {/* Vision, Mission, Goal Cards */}
      <section className="py-16 lg:py-24 gradient-cream islamic-pattern">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-12">
            {/* Vision */}
            <Card className="ornamental-frame shadow-elegant border-0 overflow-hidden animate-slide-up">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="bg-primary p-8 lg:p-10 lg:w-1/3 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-accent" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-primary-foreground lg:text-3xl">
                      Our Vision
                    </h2>
                    <div className="mt-4 h-1 w-16 rounded-full bg-accent/50" />
                  </div>
                  <div className="p-8 lg:p-10 lg:w-2/3 flex items-center">
                    <div>
                      <p className="text-lg leading-relaxed text-foreground lg:text-xl">
                        To be a leading Islamic student organization that nurtures spiritually conscious, 
                        academically excellent, and socially responsible Muslim graduates who serve as 
                        role models in their communities and contribute positively to society.
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-accent">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="ornamental-frame shadow-elegant border-0 overflow-hidden animate-slide-up delay-100">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row-reverse">
                  <div className="bg-accent p-8 lg:p-10 lg:w-1/3 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-accent-foreground lg:text-3xl">
                      Our Mission
                    </h2>
                    <div className="mt-4 h-1 w-16 rounded-full bg-primary/50" />
                  </div>
                  <div className="p-8 lg:p-10 lg:w-2/3 flex items-center">
                    <div>
                      <ul className="space-y-4 text-foreground">
                        <li className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span>To provide comprehensive Islamic education and Quran learning opportunities for Muslim students and the community</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span>To foster unity, brotherhood, and mutual support among Muslim students</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span>To serve the external community through dawah, charity, and social welfare programs</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <span>To develop future leaders who embody Islamic values and ethics</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goal */}
            <Card className="ornamental-frame shadow-elegant border-0 overflow-hidden animate-slide-up delay-200">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="gradient-navy p-8 lg:p-10 lg:w-1/3 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                      <Flag className="h-8 w-8 text-accent" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-primary-foreground lg:text-3xl">
                      Our Goal
                    </h2>
                    <div className="mt-4 h-1 w-16 rounded-full bg-accent/50" />
                  </div>
                  <div className="p-8 lg:p-10 lg:w-2/3 flex items-center">
                    <div>
                      <p className="text-lg leading-relaxed text-foreground lg:text-xl mb-6">
                        Our primary goals include:
                      </p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
                          <h4 className="font-semibold text-primary mb-2">Spiritual Growth</h4>
                          <p className="text-sm text-muted-foreground">Strengthen the faith and Islamic knowledge of members</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
                          <h4 className="font-semibold text-primary mb-2">Academic Excellence</h4>
                          <p className="text-sm text-muted-foreground">Support members in achieving academic success</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
                          <h4 className="font-semibold text-primary mb-2">Community Service</h4>
                          <p className="text-sm text-muted-foreground">Extend our services to benefit the wider community</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4 border border-border/50">
                          <h4 className="font-semibold text-primary mb-2">Unity & Brotherhood</h4>
                          <p className="text-sm text-muted-foreground">Build strong bonds among Muslim students</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Decorative Section Divider */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="section-divider">
            <div className="flex items-center gap-2 text-accent">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-6 w-6 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 gradient-navy islamic-pattern-gold">
        <div className="container mx-auto px-4 text-center">
          <blockquote className="mx-auto max-w-3xl">
            <p className="font-heading text-2xl italic text-primary-foreground/90 md:text-3xl lg:text-4xl">
              "The best of people are those who are most beneficial to others"
            </p>
            <footer className="mt-6 text-accent">
              — Prophet Muhammad (ﷺ)
            </footer>
          </blockquote>
        </div>
      </section>
    </div>
  );
}
