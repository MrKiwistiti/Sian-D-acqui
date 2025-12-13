const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Startup {
  id: number;
  apiId: number;
  name: string;
  description: string | null;
  legalStatus: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string | null;
  websiteUrl: string | null;
  socialMediaUrl: string | null;
  projectStatus: string | null;
  needs: string | null;
  sector: string;
  maturity: string;
}

export interface Founder {
  id: number;
  apiId: number;
  name: string;
  startupId: number;
}

export interface News {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  published_at: string;
  category?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location: string;
  organizer: string;
  category?: string;
  max_participants?: number;
  registration_url?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  price: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pizza {
  id: number;
  name: string;
  description?: string;
  price: number;
  size: string;
  available: boolean;
  vegetarian: boolean;
  imageUrl?: string;
  preparationTime: number;
  ingredients: Ingredient[];
  createdAt: string;
  updatedAt: string;
}

// Startups API
export const startupsAPI = {
  async getAll(): Promise<Startup[]> {
    const response = await fetch(`${API_BASE_URL}/startups`);
    if (!response.ok) {
      throw new Error('Failed to fetch startups');
    }
    return response.json();
  },

  async getById(id: number): Promise<Startup> {
    const response = await fetch(`${API_BASE_URL}/startups/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch startup');
    }
    return response.json();
  },

  async create(startup: Omit<Startup, 'id' | 'created_at' | 'updated_at'>): Promise<Startup> {
    const response = await fetch(`${API_BASE_URL}/startups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(startup),
    });
    if (!response.ok) {
      throw new Error('Failed to create startup');
    }
    return response.json();
  },

  async update(id: number, startup: Partial<Startup>): Promise<Startup> {
    const response = await fetch(`${API_BASE_URL}/startups/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(startup),
    });
    if (!response.ok) {
      throw new Error('Failed to update startup');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/startups/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete startup');
    }
  },
};

// News API
export const newsAPI = {
  async getAll(): Promise<News[]> {
    const response = await fetch(`${API_BASE_URL}/news`);
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    return response.json();
  },

  async getById(id: number): Promise<News> {
    const response = await fetch(`${API_BASE_URL}/news/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news item');
    }
    return response.json();
  },

  async create(news: Omit<News, 'id' | 'created_at' | 'updated_at'>): Promise<News> {
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(news),
    });
    if (!response.ok) {
      throw new Error('Failed to create news');
    }
    return response.json();
  },

  async update(id: number, news: Partial<News>): Promise<News> {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(news),
    });
    if (!response.ok) {
      throw new Error('Failed to update news');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete news');
    }
  },
};

// Events API
export const eventsAPI = {
  async getAll(): Promise<Event[]> {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },

  async getById(id: number): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return response.json();
  },

  async create(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  },

  async update(id: number, event: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  },
};

export const foundersAPI = {
  async getAll(): Promise<Founder[]> {
    const response = await fetch(`${API_BASE_URL}/founders`);
    if (!response.ok) {
      throw new Error("Failed to fetch founders");
    }
    return response.json();
  },

  async getById(id: number): Promise<Founder> {
    const response = await fetch(`${API_BASE_URL}/founders/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch founder");
    }
    return response.json();
  }
};

export function useFounders() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFounders() {
      try {
        setLoading(true);
        const data = await foundersAPI.getAll();
        setFounders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchFounders();
  }, []);

  return { founders, loading, error };
}

// General API utility
export const api = {
  startups: startupsAPI,
  news: newsAPI,
  events: eventsAPI,
  founders: foundersAPI
};

// React hooks for API data
import { useState, useEffect } from 'react';

export function useStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStartups() {
      try {
        setLoading(true);
        const data = await startupsAPI.getAll();
        setStartups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStartups();
  }, []);

  return { startups, loading, error };
}

export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const data = await newsAPI.getAll();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return { news, loading, error };
}

// Pizzas API
export const pizzasAPI = {
  async getAll(): Promise<Pizza[]> {
    const response = await fetch(`${API_BASE_URL}/pizzas`);
    if (!response.ok) {
      throw new Error('Failed to fetch pizzas');
    }
    return response.json();
  },

  async getAvailable(): Promise<Pizza[]> {
    const response = await fetch(`${API_BASE_URL}/pizzas/available`);
    if (!response.ok) {
      throw new Error('Failed to fetch available pizzas');
    }
    return response.json();
  },

  async getVegetarian(): Promise<Pizza[]> {
    const response = await fetch(`${API_BASE_URL}/pizzas/vegetarian`);
    if (!response.ok) {
      throw new Error('Failed to fetch vegetarian pizzas');
    }
    return response.json();
  },

  async getById(id: number): Promise<Pizza> {
    const response = await fetch(`${API_BASE_URL}/pizzas/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pizza');
    }
    return response.json();
  },
};

export function usePizzas(vegetarianOnly: boolean = false) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPizzas() {
      try {
        setLoading(true);
        const data = vegetarianOnly 
          ? await pizzasAPI.getVegetarian()
          : await pizzasAPI.getAvailable();
        setPizzas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPizzas();
  }, [vegetarianOnly]);

  return { pizzas, loading, error };
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await eventsAPI.getAll();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}
