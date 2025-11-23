import { Separator } from "./ui/separator";
import { useState } from "react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");

  // Note: Newsletter submission currently disabled - just to remove unused handler warning
  void email;
  void setEmail;

  const quickLinks = [
    { label: "Accueil", value: "home" },
    { label: "Menu", value: "menu" },
    { label: "Contact", value: "contact" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* À propos */}
          <section className="space-y-4" aria-labelledby="about-section">
            <h2 id="about-section" className="font-bold text-2xl tracking-wide text-primary">
              Pizzeria Sian D'Acqui
            </h2>
            <p className="text-sm text-gray-700">
              Pizzeria artisanale à Saint-Roman-de-Bellet. 
              Pizzas au feu de bois avec des ingrédients frais et locaux.
              Venez découvrir nos spécialités italiennes authentiques.
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
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
          <span>
            © 2025 Pizzeria Sian D'Acqui — Tous droits réservés
          </span>
          <nav className="flex space-x-4" aria-label="Liens légaux">
            <button className="hover:text-foreground transition-colors focus-outline" aria-label="Voir les mentions légales">
              Mentions légales
            </button>
            <button className="hover:text-foreground transition-colors focus-outline" aria-label="Voir la politique de confidentialité">
              Confidentialité
            </button>
            <button className="hover:text-foreground transition-colors focus-outline" aria-label="Voir les conditions d'utilisation">
              Conditions
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}