import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/humsj-logo.jpg";

export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-card/50">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="HUMSJ Logo" className="h-12 w-12 rounded-full object-cover border-2 border-primary/30" />
              <div>
                <p className="font-heading text-lg font-bold text-gradient">HUMSJ</p>
                <p className="text-xs text-muted-foreground">External Affairs Sector</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Serving the community through Islamic education, charity, and support programs at Haramaya University.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-heading text-lg font-semibold text-primary">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "About", path: "/about" },
                { name: "Vision & Mission", path: "/vision-mission" },
                { name: "Structure", path: "/structure" },
                { name: "Programs", path: "/programs" },
                { name: "Register Child", path: "/children-registration" },
                { name: "Monthly Charity", path: "/monthly-charity" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="mb-4 font-heading text-lg font-semibold text-primary">Our Programs</h4>
            <ul className="space-y-2">
              {["Quran Teaching", "Islamic Education", "Financial Support", "Charity Projects"].map((item) => (
                <li key={item}>
                  <Link
                    to="/programs"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-heading text-lg font-semibold text-primary">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Haramaya University, Ethiopia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:humsj.ea@gmail.com" className="text-sm text-muted-foreground hover:text-primary">
                  humsj.ea@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+251912345678" className="text-sm text-muted-foreground hover:text-primary">
                  +251 912 345 678
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-lg bg-primary/20 p-2 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-gold">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-primary/20 p-2 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-gold">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-primary/20 p-2 text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-gold">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-primary/20 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Haramaya University Muslim Students Jema'a. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}