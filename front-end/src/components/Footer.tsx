import logo from "../assets/jeb_incubator_logo.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement newsletter subscription
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  const quickLinks = [
    { label: "Home", value: "home" },
    { label: "Projects", value: "projects" },
    { label: "News", value: "news" },
    { label: "Calendar", value: "events" },
    { label: "About", value: "about" },
  ];

  // const resources = [
  //   "Documentation",
  //   "FAQ",
  //   "Startup Guide",
  //   "Legal Resources",
  // ];

  return (
    <footer className="bg-muted/30 border-t" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* À propos */}
          <section className="space-y-4" aria-labelledby="about-section">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/10 p-1" role="img" aria-label="JEB Incubator Logo">
                <ImageWithFallback
                  src={logo}
                  alt="JEB Incubator Logo"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <h2 id="about-section" className="font-bold text-lg tracking-wide">
                JEB Incubator
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              JEB Incubator supports startups and alumni with
              mentorship, exposure, and access to our partner
              network. The platform showcases their projects,
              surfaces their needs, and enables high-quality
              introductions.
            </p>
          </section>

          {/* Navigation */}
          <section className="space-y-4" aria-labelledby="nav-section">
            <h3 id="nav-section" className="font-medium">Navigation</h3>
            <nav>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.value}>
                    <button
                      onClick={() => onNavigate(link.value)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-outline"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* Newsletter */}
          <section className="space-y-4" aria-labelledby="newsletter-section">
            <h3 id="newsletter-section" className="font-medium">JEB Newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Get monthly updates from the incubator and our
              startups.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="space-y-2"
              aria-labelledby="newsletter-section"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address for newsletter subscription
              </label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-outline"
                autoComplete="email"
                aria-describedby="newsletter-description"
              />
              <div id="newsletter-description" className="sr-only">
                Enter your email to receive monthly updates from JEB Incubator
              </div>
              <Button
                type="submit"
                size="sm"
                className="w-full focus-outline"
                aria-label="Subscribe to newsletter"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                Subscribe
              </Button>
            </form>
          </section>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
          <span>
            © 2025 JEB Incubator — All rights reserved
          </span>
          <nav className="flex space-x-4" aria-label="Legal links">
            <button className="hover:text-foreground transition-colors focus-outline" aria-label="View legal notice">
              Legal Notice
            </button>
            <button className="hover:text-foreground transition-colors focus-outline" aria-label="View privacy policy">
              Privacy Policy
            </button>
            <button className="hover:text-foreground transition-colors focus-outline" aria-label="View terms of use">
              Terms of Use
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}