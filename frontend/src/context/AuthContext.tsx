import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { createApiClient } from '../api/client';
import type { User } from '../types';

interface Session { token: string; user: User; }
interface AuthValue { token: string | null; user: User | null; login(email: string, password: string): Promise<void>; register(name: string, email: string, password: string): Promise<void>; logout(): void; api: ReturnType<typeof createApiClient>; }
const key = 'car-dealership-auth';
const AuthContext = createContext<AuthValue | null>(null);

function initialSession(): Session | null {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') as Session | null; } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const save = useCallback((next: Session | null) => {
    setSession(next);
    if (next) localStorage.setItem(key, JSON.stringify(next));
    else localStorage.removeItem(key);
  }, []);
  const api = useMemo(() => createApiClient(() => session?.token ?? null, () => save(null)), [session?.token, save]);
  const login = async (email: string, password: string) => save(await api.post<Session>('/auth/login', { email, password }));
  const register = async (name: string, email: string, password: string) => save(await api.post<Session>('/auth/register', { name, email, password }));
  return <AuthContext.Provider value={{ token: session?.token ?? null, user: session?.user ?? null, login, register, logout: () => save(null), api }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
}
