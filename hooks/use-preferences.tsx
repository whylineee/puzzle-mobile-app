import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageOption = 'uk' | 'en';

type PreferencesState = {
  darkMode: boolean;
  pushEnabled: boolean;
  language: LanguageOption;
  hintsEnabled: boolean;
};

type PreferencesContextValue = {
  ready: boolean;
  preferences: PreferencesState;
  setDarkMode: (value: boolean) => void;
  setPushEnabled: (value: boolean) => void;
  setLanguage: (value: LanguageOption) => void;
  setHintsEnabled: (value: boolean) => void;
};

const STORAGE_KEY = 'puzzle.preferences.v1';

const defaultPreferences: PreferencesState = {
  darkMode: false,
  pushEnabled: true,
  language: 'uk',
  hintsEnabled: true,
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);

  useEffect(() => {
    let mounted = true;

    async function loadPreferences() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw) as Partial<PreferencesState>;
        if (!mounted) {
          return;
        }
        setPreferences((current) => ({
          ...current,
          ...parsed,
        }));
      } catch {
        // Keep default preferences when storage read fails.
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    loadPreferences();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)).catch(() => {
      // Preserve UX even if storage write fails.
    });
  }, [preferences, ready]);

  const value = useMemo(
    () => ({
      ready,
      preferences,
      setDarkMode: (value: boolean) => setPreferences((prev) => ({ ...prev, darkMode: value })),
      setPushEnabled: (value: boolean) => setPreferences((prev) => ({ ...prev, pushEnabled: value })),
      setLanguage: (value: LanguageOption) => setPreferences((prev) => ({ ...prev, language: value })),
      setHintsEnabled: (value: boolean) => setPreferences((prev) => ({ ...prev, hintsEnabled: value })),
    }),
    [preferences, ready],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
}
