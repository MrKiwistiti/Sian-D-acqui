import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Search } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function HeaderFixed({ currentPage, onNavigate }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { label: "Accueil", value: "home" },
    { label: "Menu", value: "menu" },
    { label: "Contact", value: "contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("projects");
    }
  };

  return (
    <>
      {/* site banner - real restaurant banner */}
      <div className="site-banner" role="img" aria-label="Bannière Pizzeria Sian D'Acqui">
        <img src="/images/banneracqui.PNG" alt="Pizzeria Sian D'Acqui - bannière" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <nav className="hidden md:flex" role="navigation" aria-label="Navigation principale">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.value}>
                  <NavigationMenuLink
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer focus-outline rounded-md ${
                      currentPage === item.value ? "text-primary" : "text-muted-foreground"
                    }`}
                    onClick={() => onNavigate(item.value)}
                    role="button"
                    tabIndex={0}
                    aria-current={currentPage === item.value ? "page" : undefined}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onNavigate(item.value);
                      }
                    }}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center space-x-2">
          <div className="hidden lg:block">
            <form onSubmit={handleSearch} className="relative" role="search" aria-label="Recherche">
              <label htmlFor="desktop-search" className="sr-only">Rechercher</label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
              <Input
                id="desktop-search"
                type="search"
                placeholder="Rechercher..."
                className="pl-10 w-64 focus-outline"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-describedby="search-description"
              />
              <div id="search-description" className="sr-only">Entrez des mots-clés pour la recherche</div>
            </form>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden focus-outline"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label={isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
            aria-expanded={isSearchOpen}
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </Button>

          <div className="hidden sm:flex">
            <Button variant="default" size="sm" onClick={() => onNavigate("contact")}>Commander</Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden focus-outline" aria-label="Ouvrir le menu de navigation">
                <Menu className="w-4 h-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72" role="dialog" aria-label="Menu de navigation">
              <div className="flex flex-col space-y-4 mt-8">
                <form onSubmit={handleSearch} role="search" aria-label="Recherche mobile">
                  <div className="relative">
                    <label htmlFor="mobile-search" className="sr-only">Rechercher</label>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
                    <Input id="mobile-search" type="search" placeholder="Rechercher..." className="pl-10 focus-outline" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                </form>

                <nav className="flex flex-col space-y-2" role="navigation" aria-label="Navigation mobile">
                  {navigationItems.map((item) => (
                    <Button key={item.value} variant={currentPage === item.value ? "secondary" : "ghost"} className="justify-start focus-outline" onClick={() => onNavigate(item.value)} aria-current={currentPage === item.value ? "page" : undefined}>
                      {item.label}
                    </Button>
                  ))}
                </nav>

                <div className="border-t pt-4 space-y-2">
                  <Button className="w-full" onClick={() => onNavigate("contact")}>Commander</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>

        {isSearchOpen && (
          <div className="border-t lg:hidden" role="search" aria-label="Recherche mobile étendue">
            <div className="container mx-auto px-4 py-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <label htmlFor="mobile-search-expanded" className="sr-only">Rechercher</label>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
                  <Input id="mobile-search-expanded" type="search" placeholder="Rechercher..." className="pl-10 focus-outline" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
                </div>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
