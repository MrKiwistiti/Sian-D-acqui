import { useState, useEffect } from 'react';
import { startupsAPI, type Startup } from './api';

export function useStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await startupsAPI.getAll();
        setStartups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch startups');
        console.error('Error fetching startups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await startupsAPI.getAll();
      setStartups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch startups');
      console.error('Error fetching startups:', err);
    } finally {
      setLoading(false);
    }
  };

  return { startups, loading, error, refetch };
}

export function useStartup(id: number) {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await startupsAPI.getById(id);
        setStartup(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch startup');
        console.error('Error fetching startup:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStartup();
    }
  }, [id]);

  return { startup, loading, error };
}
