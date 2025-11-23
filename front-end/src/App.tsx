import { useState } from "react";
import { HeaderFixed as Header } from "./components/HeaderFixed";
import { Footer } from "./components/Footer";
import { PizzeriaHome } from "./components/PizzeriaHome";
import { MenuPage } from "./components/MenuPage";
import { ContactPage } from "./components/ContactPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { PizzaDetailPage } from "./components/PizzaDetailPage";
import { AccessibilityProvider } from "./components/AccessibilityProvider";
import { AuthProvider } from "./contexts/AuthContext";

type Page = "home" | "menu" | "contact" | "admin" | "pizza-detail";

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
  const [selectedPizzaId, setSelectedPizzaId] = useState<string>("");
  const { announcePageChange } = usePageAnnouncement();

  // Login/signup removed: app runs in public mode without auth flows

  const handleNavigate = (page: string, id?: string) => {
    const previousPage = currentPage;
    setCurrentPage(page as Page);
    if (id) {
      setSelectedPizzaId(id);
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
        return <PizzeriaHome onNavigate={handleNavigate} />;
      case "menu":
        return <MenuPage onNavigate={handleNavigate} />;
      case "contact":
        return <ContactPage onNavigate={handleNavigate} />;
      case "admin":
        return <AdminDashboard onNavigate={handleNavigate} />;
      case "pizza-detail":
        return <PizzaDetailPage pizzaId={selectedPizzaId} onNavigate={handleNavigate} />;
      default:
        return <PizzeriaHome onNavigate={handleNavigate} />;
    }
  };

  // No auth user in public mode

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
          
          {/* Chat removed in public (no-login) mode */}
          

        </div>
    </AccessibilityProvider>
  );
}