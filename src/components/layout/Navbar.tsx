import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/humsj-logo.jpg";

const mainLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Programs", path: "/programs" },
  { name: "News", path: "/news" },
  { name: "Contact", path: "/contact" },
];

const serviceLinks = [
  { name: "Register Child", path: "/children-registration" },
  { name: "Monthly Charity", path: "/monthly-charity" },
  { name: "Help Registration", path: "/help-registration" },
  { name: "Charity Distribution", path: "/charity-distribution" },
  { name: "Vision & Mission", path: "/vision-mission" },
  { name: "Structure", path: "/structure" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={logo} alt="HUMSJ Logo" className="h-10 w-10 rounded-full object-cover lg:h-12 lg:w-12 border-2 border-primary/30 group-hover:border-primary transition-colors" />
              <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <p className="font-heading text-lg font-bold text-gradient lg:text-xl">HUMSJ</p>
              <p className="text-xs text-muted-foreground">External Affairs</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary/10 ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                onBlur={() => setTimeout(() => setServicesOpen(false), 150)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg hover:bg-primary/10 ${
                  serviceLinks.some(l => location.pathname === l.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Services
                <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-primary/20 rounded-lg shadow-lg py-2 z-50">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setServicesOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors hover:bg-primary/10 ${
                        location.pathname === link.path
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button asChild className="btn-gold">
              <Link to="/donate">Support Us</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex items-center justify-center rounded-lg p-2 text-foreground hover:bg-primary/10 transition-colors lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-primary/20 pb-4 lg:hidden animate-fade-in max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col space-y-1 pt-4">
              {mainLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Services Section in Mobile */}
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Services</p>
              </div>
              {serviceLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ml-2 ${
                    location.pathname === link.path
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="px-4 pt-2">
                <Button asChild className="w-full btn-gold">
                  <Link to="/donate" onClick={() => setIsOpen(false)}>Support Us</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
