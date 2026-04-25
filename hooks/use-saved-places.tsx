import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlaceBySlug, SAVED_PLACE_SLUGS } from '@/constants/travel-data';

const STORAGE_KEY = 'puzzle.savedPlaces.v1';

type SavedPlacesContextValue = {
  ready: boolean;
  savedSlugs: string[];
  savedPlaces: ReturnType<typeof getPlaceBySlug>[];
  isSaved: (slug: string) => boolean;
  toggleSaved: (slug: string) => void;
};

const SavedPlacesContext = createContext<SavedPlacesContextValue | null>(null);

export function SavedPlacesProvider({ children }: { children: ReactNode }) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>(SAVED_PLACE_SLUGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSavedPlaces() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && mounted) {
          const cleaned = parsed.filter((slug): slug is string => typeof slug === 'string');
          setSavedSlugs(cleaned);
        }
      } catch {
        // Keep default values when storage read fails.
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    loadSavedPlaces();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(savedSlugs)).catch(() => {
      // Avoid crashing UI on storage write failures.
    });
  }, [ready, savedSlugs]);

  const isSaved = useCallback((slug: string) => savedSlugs.includes(slug), [savedSlugs]);

  const toggleSaved = useCallback((slug: string) => {
    setSavedSlugs((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      return [slug, ...current];
    });
  }, []);

  const savedPlaces = useMemo(() => {
    return savedSlugs.map((slug) => getPlaceBySlug(slug));
  }, [savedSlugs]);

  const value = useMemo(
    () => ({
      ready,
      savedSlugs,
      savedPlaces,
      isSaved,
      toggleSaved,
    }),
    [isSaved, ready, savedPlaces, savedSlugs, toggleSaved],
  );

  return <SavedPlacesContext.Provider value={value}>{children}</SavedPlacesContext.Provider>;
}

export function useSavedPlaces() {
  const context = useContext(SavedPlacesContext);
  if (!context) {
    throw new Error('useSavedPlaces must be used within SavedPlacesProvider');
  }
  return context;
}
