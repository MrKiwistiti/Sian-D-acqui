import type { Project, NewsItem, Event as FrontendEvent, Sector, Maturity } from "../types/frontend";
import type { Startup, News } from "./api";
import type { Founder } from "./api";

// Adaptateurs pour convertir les données de l'API vers le format du frontend
export class DataAdapter {
  static startupToProject(startup: Startup): Project {
    return {
      id: startup.id.toString(),
      name: startup.name,
      baseline: startup.description ? startup.description.substring(0, 100) + "..." : "Description non disponible", 
      description: startup.description || "Description non disponible",
      sector: mapSector(startup.sector),
      maturity: mapMaturity(startup.maturity),
      location: startup.address,
      needs: startup.needs || undefined,
      website: startup.websiteUrl || undefined,
      websiteUrl: startup.websiteUrl || undefined,
      social: startup.socialMediaUrl || undefined,
      email: startup.email || undefined,
      founded: extractYearFromDate(startup.createdAt)?.toString() || "2024",
      metrics: {
        mrr: "N/A", // Ces données ne sont pas dans l'API JEB
        users: "N/A"
      }
    };
  }

  static newsToNewsItem(news: News): NewsItem {
    return {
      id: news.id.toString(),
      title: news.title,
      excerpt: news.content ? news.content.substring(0, 150) + "..." : "Résumé non disponible",
      content: news.content || "Contenu non disponible",
      description: "Description non disponible",
      author: "JEB Incubator",
      publishedAt: news.created_at || new Date().toISOString(),
      tags: news.category ? [news.category] : [],
      image: news.image_url || undefined,
      source: "JEB Incubator"
    };
  }

  static eventToFrontendEvent(event: any): FrontendEvent {
    // Adapter la structure réelle de l'API JEB
    return {
      id: event.id.toString(),
      title: event.name || event.title,
      description: event.description || "Description non disponible",
      date: event.dates || event.start_date || new Date().toISOString().split('T')[0],
      time: extractTime(event.dates || event.start_date) || "14:00",
      location: event.location || "Lieu non spécifié",
      type: mapEventType(event.eventType || event.category),
      maxAttendees: event.max_participants,
      currentAttendees: 0, // Cette donnée n'est pas dans l'API
      price: 0, // Prix par défaut
      registrationUrl: event.registration_url,
      speakers: event.targetAudience ? [event.targetAudience] : undefined
    };
  }
  
  static founderToItem(founder: Founder) {
    return {
      id: founder.id.toString(),
      name: founder.name,
      startupId: founder.startupId.toString()
    };
  }
}

// Fonctions helper pour le mapping

function mapSector(sector: string): Sector {
  // Mapping direct des secteurs de l'API vers les types frontend
  const sectorMap: { [key: string]: Sector } = {
    'DeepTech': 'DeepTech',
    'EdTech': 'EdTech', 
    'FinTech': 'FinTech',
    'HealthTech': 'HealthTech',
    'Logistics': 'Logistics',
    'SaaS': 'SaaS',
    'Sustainability': 'Sustainability'
  };
  
  return sectorMap[sector] || 'DeepTech';
}

function mapMaturity(maturity: string): Maturity {
  // Mapping direct des niveaux de maturité de l'API vers les types frontend
  const maturityMap: { [key: string]: Maturity } = {
    'Idea': 'Idea',
    'Prototype': 'Prototype',
    'MVP': 'MVP',
    'Product-Market Fit': 'Product-Market Fit'
  };
  
  return maturityMap[maturity] || 'Idea';
}

function mapEventType(eventType?: string): FrontendEvent['type'] {
  if (!eventType) return 'networking';
  
  const typeMap: { [key: string]: FrontendEvent['type'] } = {
    'workshop': 'workshop',
    'conference': 'conference',
    'networking': 'networking',
    'demo': 'demo',
    'pitch session': 'demo',
    'meetup': 'networking',
    'formation': 'workshop',
    'concours': 'demo'
  };
  
  return typeMap[eventType.toLowerCase()] || 'conference';
}

function extractTime(dateString: string): string | null {
  if (!dateString) return null;
  
  try {
    // Si c'est juste une date (format YYYY-MM-DD), retourner une heure par défaut
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return "14:00";
    }
    
    // Si c'est un datetime complet, extraire l'heure
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "14:00";
    
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch {
    return "14:00";
  }
}

// Fonction pour extraire l'année d'une date ISO
function extractYearFromDate(dateString: string | null): number | null {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return date.getFullYear();
  } catch {
    return null;
  }
}
