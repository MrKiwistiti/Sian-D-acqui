import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Role = 'admin' | 'investor' | 'founder';

type User = {
  id: number;
  email: string;
  name: string;
  role: Role;
};

type LoginResponse = {
  access_token: string;
  must_change_password: boolean;
  user: User;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  mustChangePassword: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; mustChangePassword: boolean }>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base URL de ton API (vite: VITE_API_URL) – ex: http://localhost:3001
const API_BASE = (import.meta as any)?.env?.VITE_API_URL ?? 'http://localhost:3001';

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    const raw = localStorage.getItem('mustChangePassword');
    return raw ? raw === 'true' : false;
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  // Persist
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mustChangePassword', mustChangePassword ? 'true' : 'false');
  }, [mustChangePassword]);

  async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
    if (!res.ok) {
      if (res.status === 401) logout();
      const text = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText} – ${text}`);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : (undefined as any);
  }

  async function login(email: string, password: string): Promise<{ ok: boolean; mustChangePassword: boolean }> {
    setLoading(true);
    const data = await api<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    setUser(data.user);
    setMustChangePassword(!!data.must_change_password);
    return { ok: true, mustChangePassword: !!data.must_change_password };
  }

  function logout() {
    setToken(null);
    setUser(null);
    setMustChangePassword(false);
  }

  async function changePassword(newPassword: string): Promise<boolean> {
    if (!token) return false;
    try {
      await api('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ newPassword }),
      });
      setMustChangePassword(false);
      return true;
    } catch (e) {
      console.error('Change password error:', e);
      return false;
    }
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      mustChangePassword,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      logout,
      changePassword,
    }),
    [user, token, mustChangePassword, isAuthenticated, isAdmin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
