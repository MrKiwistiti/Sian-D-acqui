// Types pour les données du frontend (remplace les types de mockData.ts)

// Types pour les secteurs et maturité basés sur l'API
export type Sector = "DeepTech" | "EdTech" | "FinTech" | "HealthTech" | "Logistics" | "SaaS" | "Sustainability";
export type Maturity = "Idea" | "Prototype" | "MVP" | "Product-Market Fit";

// Configuration des secteurs avec leurs labels et couleurs
export const SECTOR_CONFIG: Record<Sector, { label: string; color: string; icon: string }> = {
  "DeepTech": { label: "Deep Tech", color: "bg-purple-100 text-purple-800", icon: "🔬" },
  "EdTech": { label: "Éducation", color: "bg-green-100 text-green-800", icon: "📚" },
  "FinTech": { label: "Finance", color: "bg-blue-100 text-blue-800", icon: "💰" },
  "HealthTech": { label: "Santé", color: "bg-red-100 text-red-800", icon: "🏥" },
  "Logistics": { label: "Logistique", color: "bg-orange-100 text-orange-800", icon: "🚛" },
  "SaaS": { label: "SaaS", color: "bg-indigo-100 text-indigo-800", icon: "☁️" },
  "Sustainability": { label: "Durabilité", color: "bg-emerald-100 text-emerald-800", icon: "🌱" }
};

// Configuration des niveaux de maturité
export const MATURITY_CONFIG: Record<Maturity, { label: string; color: string; description: string }> = {
  "Idea": { label: "Idée", color: "bg-gray-100 text-gray-800", description: "Concept initial" },
  "Prototype": { label: "Prototype", color: "bg-yellow-100 text-yellow-800", description: "Version de test" },
  "MVP": { label: "MVP", color: "bg-blue-100 text-blue-800", description: "Produit minimum viable" },
  "Product-Market Fit": { label: "PMF", color: "bg-green-100 text-green-800", description: "Adéquation produit-marché" }
};

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  description: string;
  author: string;
  publishedAt: string;
  tags: string[];
  image?: string;
  source?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "conference" | "workshop" | "networking" | "demo";
  speakers?: string[];
  maxAttendees?: number;
  currentAttendees?: number;
  price?: number;
  registrationUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  sector: Sector;
  maturity: Maturity;
  address?: string;
  needs?: string;
  baseline?: string;
  location?: string;
  founded?: string;
  website?: string;
  social?: string;
  email?: string;
  websiteUrl?: string;
  metrics?: {
    mrr?: string;
    users?: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
}

// Stats statiques conservées (peut être calculé dynamiquement plus tard)
export const staticStats = {
  companiesSupported: "120+",
  fundsRaised: "€30M",
  successRate: "78%"
};
