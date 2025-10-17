import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectDetailPage } from "./components/ProjectDetailPage";
import { EventsPage } from "./components/EventsPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { ChangePasswordPage } from "./components/ChangePasswordPage";
import { StartupDashboard } from "./components/StartupDashboardComplete";
import { StartupLoginPage } from "./components/StartupLoginPage";
import { NewsPage } from "./components/NewsPage";
import { AboutPage } from "./components/AboutPage";
import { ChatButton } from "./components/ChatButton";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

type Page = "home" | "projects" | "project" | "news" | "events" | "about" | "login" | "signup" | "change-password" | "dashboard" | "admin" | "startup-login" | "startup-dashboard";

// Hook to announce page changes to screen readers
function usePageAnnouncement() {
  const announcePageChange = (pageName: string) => {
    // Create temporary element for announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Page ${pageName} loaded`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  return { announcePageChange };
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isStartupAuthenticated, setIsStartupAuthenticated] = useState<boolean>(false);
  const { announcePageChange } = usePageAnnouncement();
  const { isAuthenticated, isAdmin, mustChangePassword } = useAuth();

  // Load startup authentication state from localStorage on startup
  useEffect(() => {
    const savedStartupAuth = localStorage.getItem('startup_authenticated');
    if (savedStartupAuth === 'true') {
      setIsStartupAuthenticated(true);
    }
  }, []);

  // Redirect to change password if user must change password
  useEffect(() => {
    if (isAuthenticated && mustChangePassword && currentPage !== "change-password") {
      setCurrentPage("change-password");
    }
  }, [isAuthenticated, mustChangePassword, currentPage]);

  // Startup authentication functions (kept for compatibility)
  const handleStartupLogin = (email: string, password: string): boolean => {
    // Simple authentication logic for startup
    if ((email === "startup@ecotrack.com" && password === "startup123") || 
        (email === "founder@example.com" && password === "founder123")) {
      setIsStartupAuthenticated(true);
      localStorage.setItem('startup_authenticated', 'true');
      localStorage.setItem('startup_user', JSON.stringify({ email, role: 'startup' }));
      return true;
    }
    return false;
  };

  const handleNavigate = (page: string, id?: string) => {
    const previousPage = currentPage;
    setCurrentPage(page as Page);
    if (id) {
      setSelectedProjectId(id);
    }
    
    // Announce page change to screen readers
    if (page !== previousPage) {
      announcePageChange(page);
      
      // Focus main content for screen readers
      setTimeout(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
      }, 100);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "projects":
        return <ProjectsPage onNavigate={handleNavigate} />;
      case "project":
        return <ProjectDetailPage projectId={selectedProjectId} onNavigate={handleNavigate} />;
      case "news":
        return <NewsPage />;
      case "about":
        return <AboutPage onNavigate={handleNavigate} />;
      case "events":
        return <EventsPage isAdmin={isAdmin} />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "signup":
        return <SignUpPage onNavigate={handleNavigate} />;
      case "change-password":
        if (!isAuthenticated) {
          setCurrentPage("login");
          return <LoginPage onNavigate={handleNavigate} />;
        }
        return <ChangePasswordPage onNavigate={handleNavigate} />;
      case "startup-login":
        return <StartupLoginPage onLogin={handleStartupLogin} onNavigate={handleNavigate} />;
      case "startup-dashboard":
        if (!isStartupAuthenticated) {
          setCurrentPage("startup-login");
          return <StartupLoginPage onLogin={handleStartupLogin} onNavigate={handleNavigate} />;
        }
        return <StartupDashboard onNavigate={handleNavigate} />;
      case "dashboard":
        return <ComingSoonPage title="Dashboard" />;
      case "admin":
        if (!isAuthenticated) {
          setCurrentPage("login");
          return <LoginPage onNavigate={handleNavigate} />;
        }
        return <AdminDashboard onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Get current user for chat
  const getCurrentUser = () => {
    if (isAuthenticated) {
      return {
        id: "admin-javier",
        name: "Javier Admin",
        role: "admin" as const
      };
    }
    if (isStartupAuthenticated) {
      return {
        id: "startup-ecotrack",
        name: "EcoTrack Team",
        role: "startup" as const
      };
    }
    return null;
  };

  const currentUser = getCurrentUser();

  return (
    <AccessibilityProvider>
        <div className="min-h-screen flex flex-col">
          <Header 
            currentPage={currentPage} 
            onNavigate={handleNavigate} 
          />
          <main 
            id="main-content" 
            className="flex-1" 
            role="main"
            tabIndex={-1}
            aria-label="Main content"
          >
            {renderPage()}
          </main>
          <Footer onNavigate={handleNavigate} />
          
          {/* Chat Button - Only show when authenticated */}
          {currentUser && (
            <ChatButton 
              currentUser={currentUser}
              unreadCount={0}
            />
          )}
          

        </div>
    </AccessibilityProvider>
  );
}

// Temporary component for pages under development
function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl opacity-20">🚧</div>
        <h1 className="text-3xl font-bold">{title} Page</h1>
        <p className="text-muted-foreground">
          This page is under development.
        </p>
      </div>
    </div>
  );
}