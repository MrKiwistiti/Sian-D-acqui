import { useState, useEffect } from 'react';
import type { Project } from "../types/frontend";
import type { NewsItem, Event } from "../types/frontend";
import { useStartups, useNews, useEvents } from '../services/api';
import { DataAdapter } from '../services/dataAdapter';

// Hooks qui retournent les données dans le format attendu par les composants
export function useProjectsData() {
  const { startups, loading, error } = useStartups();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (startups.length > 0) {
      const convertedProjects = startups.map((startup: any) => 
        DataAdapter.startupToProject(startup)
      );
      setProjects(convertedProjects);
    }
  }, [startups]);

  return { projects, loading, error };
}

export function useNewsData() {
  const { news, loading, error } = useNews();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (news.length > 0) {
      const convertedNews = news.map((article: any) => 
        DataAdapter.newsToNewsItem(article)
      );
      setNewsItems(convertedNews);
    }
  }, [news]);

  return { news: newsItems, loading, error };
}

export function useEventsData() {
  const { events, loading, error } = useEvents();
  const [eventsData, setEventsData] = useState<Event[]>([]);

  useEffect(() => {
    if (events.length > 0) {
      const convertedEvents = events.map((event: any) => 
        DataAdapter.eventToFrontendEvent(event)
      );
      setEventsData(convertedEvents);
    }
  }, [events]);

  return { events: eventsData, loading, error };
}

// Hook personnalisé pour la gestion complète des événements (CRUD)
export function useEventsManagement() {
  const { events, loading, error } = useEventsData();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const createEvent = async (eventData: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: string;
    maxAttendees?: number;
  }) => {
    setIsCreating(true);
    try {
      // Convertir les données frontend vers le format backend
      const backendEventData = {
        name: eventData.title,
        description: eventData.description,
        dates: eventData.date,
        location: eventData.location,
        eventType: eventData.type,
        targetAudience: "General"
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendEventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const newEvent = await response.json();
      // Rafraîchir la page pour recharger les événements
      window.location.reload();
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setIsDeleting(eventId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Rafraîchir la page pour recharger les événements
      window.location.reload();
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    deleteEvent,
    isCreating,
    isDeleting
  };
}

// Hook personnalisé pour la gestion complète des projets/startups (CRUD)
export function useProjectsManagement() {
  const { projects, loading, error } = useProjectsData();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const createProject = async (projectData: {
    name: string;
    description: string;
    sector: string;
    maturity: string;
    address: string;
    email: string;
    phone: string;
    websiteUrl?: string;
    needs?: string;
  }) => {
    setIsCreating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/startups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          legalStatus: 'SARL',
          projectStatus: 'Active'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject = await response.json();
      window.location.reload();
      return newProject;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    setIsDeleting(projectId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/startups/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      window.location.reload();
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    deleteProject,
    isCreating,
    isDeleting
  };
}

// Hook personnalisé pour la gestion complète des news (CRUD)
export function useNewsManagement() {
  const { news, loading, error } = useNewsData();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const createNews = async (newsData: {
    title: string;
    content: string;
    category?: string;
    author?: string;
  }) => {
    setIsCreating(true);
    try {
      // Convertir les données frontend vers le format backend
      const backendNewsData = {
        title: newsData.title,
        description: newsData.content, // content -> description
        category: newsData.category || 'General',
        newsDate: new Date().toISOString(),
        location: null
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendNewsData),
      });

      if (!response.ok) {
        throw new Error('Failed to create news');
      }

      const newNews = await response.json();
      window.location.reload();
      return newNews;
    } catch (err) {
      console.error('Error creating news:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteNews = async (newsId: string) => {
    setIsDeleting(newsId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/news/${newsId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete news');
      }

      window.location.reload();
    } catch (err) {
      console.error('Error deleting news:', err);
      throw err;
    } finally {
      setIsDeleting(null);
    }
  };

  return {
    news,
    loading,
    error,
    createNews,
    deleteNews,
    isCreating,
    isDeleting
  };
}

// Stats calculées dynamiquement à partir des vraies données
export function useStatsData() {
  const [stats, setStats] = useState({
    companiesSupported: "0+",
    fundsRaised: "€0M",
    successRate: "0%",
    newsCount: 0,
    eventsCount: 0,
    // Nouvelles stats pour le dashboard admin
    activeProjects: 0,
    scaleUpProjects: 0,
    totalFunding: "€0M",
    averageAge: "0 ans",
    growthRate: "0%"
  });

  const { projects } = useProjectsData();
  const { news } = useNewsData();
  const { events } = useEventsData();

  useEffect(() => {
    if (projects.length === 0) return;

    // Calculer les statistiques avancées
    const activeProjects = projects.filter((p: any) => 
      p.stage === "Growth" || p.stage === "Scale-up" || p.stage === "Serie A" || p.stage === "Serie B"
    ).length;

    const scaleUpProjects = projects.filter((p: any) => 
      p.stage === "Scale-up" || p.stage === "Serie B"
    ).length;

    // Estimer le financement total basé sur la maturité et le secteur
    const estimatedFunding = projects.reduce((total: number, project: any) => {
      let funding = 0;
      
      // Estimation basée sur la maturité
      switch (project.maturity) {
        case "MVP":
          funding += 500000; // 500k moyenne pour MVP
          break;
        case "Product-Market Fit":
          funding += 2000000; // 2M moyenne pour PMF
          break;
        case "Prototype":
          funding += 200000; // 200k moyenne pour prototype
          break;
        case "Idea":
          funding += 50000; // 50k moyenne pour idée
          break;
      }

      // Bonus pour certains secteurs
      if (project.sector === "FinTech" || project.sector === "DeepTech") {
        funding *= 1.5;
      }

      return total + funding;
    }, 0);

    // Calculer l'âge moyen des projets
    const currentYear = new Date().getFullYear();
    const ages = projects
      .filter((p: any) => p.founded)
      .map((p: any) => currentYear - p.founded);
    const averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

    // Calculer le taux de succès (projets en croissance/scale-up)
    const successRate = projects.length > 0 ? Math.round((activeProjects / projects.length) * 100) : 0;

    // Calculer le taux de croissance (nouveaux projets cette année)
    const thisYearProjects = projects.filter((p: any) => 
      p.founded && p.founded === currentYear
    ).length;
    const growthRate = Math.round((thisYearProjects / projects.length) * 100);

    setStats({
      companiesSupported: `${projects.length}+`,
      fundsRaised: `€${Math.round(estimatedFunding / 1000000)}M`,
      successRate: `${successRate}%`,
      newsCount: news.length,
      eventsCount: events.length,
      activeProjects,
      scaleUpProjects,
      totalFunding: `€${Math.round(estimatedFunding / 1000000)}M`,
      averageAge: `${averageAge} ans`,
      growthRate: `${growthRate}%`
    });
  }, [projects.length, news.length, events.length, projects]);

  return stats;
}

// Hook pour charger les utilisateurs
export function useUsersData() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}

// Hook personnalisé pour la gestion complète des utilisateurs (CRUD)
export function useUsersManagement() {
  const { users, loading, error } = useUsersData();
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const createUser = async (userData: {
    email: string;
    name: string;
    role: string;
  }) => {
    setIsCreating(true);
    try {
      // L'API n'attend que email, name et role
      const apiData = {
        email: userData.email,
        name: userData.name,
        role: userData.role
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create user: ${errorData}`);
      }

      const newUser = await response.json();
      window.location.reload();
      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setIsDeleting(userId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      window.location.reload();
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setIsDeleting(null);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update user role: ${errorData}`);
      }

      window.location.reload();
    } catch (err) {
      console.error('Error updating user role:', err);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    deleteUser,
    updateUserRole,
    isCreating,
    isDeleting
  };
}

// Hook personnalisé pour les analytics (CRUD + statistiques)
export function useAnalytics() {
  const { projects } = useProjectsData();
  const { events } = useEventsData();
  const { news } = useNewsData();
  const { users } = useUsersData();

  // Calcul des statistiques générales
  const totalStats = {
    totalProjects: projects.length,
    totalEvents: events.length,
    totalNews: news.length,
    totalUsers: users.length,
    totalAdmins: users.filter(user => user.role === 'admin').length,
    totalRegularUsers: users.filter(user => user.role === 'user').length,
  };

  // Statistiques par secteur (si disponible)
  const sectorStats = projects.reduce((acc: Record<string, number>, project: any) => {
    const sector = project.sector || 'Other';
    acc[sector] = (acc[sector] || 0) + 1;
    return acc;
  }, {});

  // Statistiques par statut de projet (basé sur le champ maturity)
  const statusStats = projects.reduce((acc: Record<string, number>, project: any) => {
    const maturity = project.maturity || 'Undefined';
    // Utiliser le label anglais direct (les valeurs API sont déjà en anglais)
    acc[maturity] = (acc[maturity] || 0) + 1;
    return acc;
  }, {});

  // Statistiques par mois (exemple avec events)
  const monthlyStats = events.reduce((acc: Record<string, number>, event: any) => {
    if (event.date) {
      const month = new Date(event.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});

  // Statistiques récentes (basées sur les données disponibles)
  const recentActivity = {
    newProjects: 0, // Pas de champ createdAt disponible
    newEvents: 0,   // Pas de champ createdAt disponible
    newNews: 0,     // Pas de champ createdAt disponible
    // On peut utiliser des données statiques pour l'exemple
    totalActivity: projects.length + events.length + news.length,
  };

  return {
    totalStats,
    sectorStats,
    statusStats,
    monthlyStats,
    recentActivity,
    isLoading: false, // Pour l'instant, basé sur les données déjà chargées
  };
}
