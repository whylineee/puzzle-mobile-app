import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'puzzle.auth.v1';

type AuthUser = {
  name: string;
  email: string;
};

type AuthContextValue = {
  ready: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const initialUser: AuthUser = {
  name: 'Марія',
  email: 'maria@puzzle.app',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Сесія невідома, доки не прочитано AsyncStorage (не вважати залогіненим заздалегідь).
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAuthState() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw) as AuthUser | null;
        if (!mounted) {
          return;
        }
        if (parsed && typeof parsed.email === 'string' && typeof parsed.name === 'string') {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch {
        // Keep default auth state on storage parse/read failures.
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    loadAuthState();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user)).catch(() => {
      // Do not break UI if persisting auth fails.
    });
  }, [ready, user]);

  const login = useCallback((email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.includes('@')) {
      return { ok: false, error: 'Вкажіть коректний email.' };
    }
    if (password.trim().length < 6) {
      return { ok: false, error: 'Пароль має містити щонайменше 6 символів.' };
    }
    const nextUser = { ...initialUser, email: normalizedEmail };
    setUser(nextUser);
    return { ok: true };
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedName.length < 2) {
      return { ok: false, error: 'Імʼя має містити щонайменше 2 символи.' };
    }
    if (!normalizedEmail.includes('@')) {
      return { ok: false, error: 'Вкажіть коректний email.' };
    }
    if (password.trim().length < 6) {
      return { ok: false, error: 'Пароль має містити щонайменше 6 символів.' };
    }
    setUser({ name: normalizedName, email: normalizedEmail });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      isAuthenticated: Boolean(user),
      user,
      login,
      signup,
      logout,
    }),
    [login, logout, ready, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
