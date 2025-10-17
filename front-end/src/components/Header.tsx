import logo from "../assets/jeb_incubator_logo.png";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Menu, Search, LogOut } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
} from "./ui/navigation-menu";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({
  currentPage,
  onNavigate,
}: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const navigationItems = [
    { label: "Home", value: "home" },
    { label: "Projects", value: "projects" },
    { label: "News", value: "news" },
    { label: "Events", value: "events" },
    { label: "About", value: "about" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("projects");
      // TODO: Implement search
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          className="flex items-center space-x-2 focus-outline rounded-md p-1 -m-1"
          onClick={() => onNavigate("home")}
          aria-label="JEB Incubator Home"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/10 p-1">
            <ImageWithFallback
              src={logo}
              alt="JEB Incubator Logo"
              className="w-full h-full object-cover rounded-md rounded-[15px]"
            />
          </div>
          <span className="font-bold text-xl hidden sm:block tracking-wide">
            JEB Incubator
          </span>
        </button>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex" role="navigation" aria-label="Main navigation">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.value}>
                  <NavigationMenuLink
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary cursor-pointer focus-outline rounded-md ${
                      currentPage === item.value
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => onNavigate(item.value)}
                    role="button"
                    tabIndex={0}
                    aria-current={currentPage === item.value ? "page" : undefined}
                    onKeyDown={(e: { key: string; preventDefault: () => void; }) => {
                      if (e.key === 'Enter' || e.key === ' ') {
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

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Desktop Search */}
          <div className="hidden lg:block">
            <form onSubmit={handleSearch} className="relative" role="search" aria-label="Search projects">
              <label htmlFor="desktop-search" className="sr-only">
                Search for a project
              </label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
              <Input
                id="desktop-search"
                type="search"
                placeholder="Search for a project..."
                className="pl-10 w-64 focus-outline"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-describedby="search-description"
              />
              <div id="search-description" className="sr-only">
                Enter keywords to search for projects in our incubator
              </div>
            </form>
          </div>

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden focus-outline"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label={isSearchOpen ? "Close search" : "Open search"}
            aria-expanded={isSearchOpen}
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </Button>

          {/* CTA Buttons */}
          {!isAuthenticated ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("startup-login")}
                className="hidden sm:flex"
              >
                Startup Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("login")}
                className="hidden sm:flex"
              >
                Login
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onNavigate("signup")}
                className="hidden sm:flex"
              >
                Sign Up
              </Button>
              <Button
                size="sm"
                onClick={() => onNavigate("projects")}
              >
                Apply
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Hello, {user?.name}
              </span>
              
              {isAdmin && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onNavigate("admin")}
                  className="hidden sm:flex"
                >
                  Admin Panel
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="hidden sm:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden focus-outline"
                aria-label="Open navigation menu"
              >
                <Menu className="w-4 h-4" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72" role="dialog" aria-label="Navigation menu">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Mobile search */}
                <form onSubmit={handleSearch} role="search" aria-label="Mobile search">
                  <div className="relative">
                    <label htmlFor="mobile-search" className="sr-only">
                      Search for a project
                    </label>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
                    <Input
                      id="mobile-search"
                      type="search"
                      placeholder="Search..."
                      className="pl-10 focus-outline"
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                    />
                  </div>
                </form>

                {/* Navigation mobile */}
                <nav className="flex flex-col space-y-2" role="navigation" aria-label="Mobile navigation">
                  {navigationItems.map((item) => (
                    <Button
                      key={item.value}
                      variant={
                        currentPage === item.value
                          ? "secondary"
                          : "ghost"
                      }
                      className="justify-start focus-outline"
                      onClick={() => onNavigate(item.value)}
                      aria-current={currentPage === item.value ? "page" : undefined}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>

                <div className="border-t pt-4 space-y-2">
                  {!isAuthenticated ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onNavigate("login")}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => onNavigate("signup")}
                      >
                        Sign Up
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => onNavigate("projects")}
                      >
                        Apply
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-muted-foreground px-2 py-1">
                        Logged in as {user?.name}
                      </div>
                      
                      <Button
                        className="w-full"
                        onClick={() => onNavigate("projects")}
                      >
                        Apply
                      </Button>
                      
                      {isAdmin && (
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => onNavigate("admin")}
                        >
                          Admin Panel
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile expanded search */}
      {isSearchOpen && (
        <div className="border-t lg:hidden" role="search" aria-label="Mobile search expanded">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <label htmlFor="mobile-search-expanded" className="sr-only">
                  Search for a project
                </label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
                <Input
                  id="mobile-search-expanded"
                  type="search"
                  placeholder="Search for a project..."
                  className="pl-10 focus-outline"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}