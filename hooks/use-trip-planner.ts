import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'puzzle.tripPlanner.v1';
const DEFAULT_CHECKLIST = [
  { id: 'transport', label: 'Перевірити транспорт' },
  { id: 'booking', label: 'Уточнити бронювання' },
  { id: 'docs', label: 'Підготувати документи та квитки' },
  { id: 'weather', label: 'Переглянути погоду на дату' },
  { id: 'budget', label: 'Скласти базовий бюджет' },
] as const;

type ChecklistItemState = {
  id: string;
  label: string;
  done: boolean;
};

type TripPlan = {
  date: string;
  note: string;
  checklist: ChecklistItemState[];
};

type StoredPlans = Record<string, TripPlan>;

function createDefaultPlan(): TripPlan {
  return {
    date: '',
    note: '',
    checklist: DEFAULT_CHECKLIST.map((item) => ({ ...item, done: false })),
  };
}

export function useTripPlanner(placeSlug: string) {
  const [plans, setPlans] = useState<StoredPlans>({});
  const [ready, setReady] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPlans() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }

        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && mounted) {
          setPlans(parsed as StoredPlans);
        }
      } catch {
        // Keep default empty planner state on parsing/storage errors.
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    loadPlans();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plans)).catch(() => {
        // Ignore persistence failures to avoid interrupting UX.
      });
    }, 250);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [plans, ready]);

  const getPlan = useCallback(
    (slug: string) => {
      return plans[slug] ?? createDefaultPlan();
    },
    [plans],
  );

  const ensurePlan = useCallback((slug: string) => plans[slug] ?? createDefaultPlan(), [plans]);

  const setDate = useCallback(
    (slug: string, date: string) => {
      setPlans((current) => {
        const base = current[slug] ?? createDefaultPlan();
        return {
          ...current,
          [slug]: { ...base, date },
        };
      });
    },
    [setPlans],
  );

  const setNote = useCallback(
    (slug: string, note: string) => {
      setPlans((current) => {
        const base = current[slug] ?? createDefaultPlan();
        return {
          ...current,
          [slug]: { ...base, note },
        };
      });
    },
    [setPlans],
  );

  const toggleChecklistItem = useCallback(
    (slug: string, itemId: string) => {
      setPlans((current) => {
        const base = current[slug] ?? createDefaultPlan();
        const checklist = base.checklist.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item,
        );
        return {
          ...current,
          [slug]: { ...base, checklist },
        };
      });
    },
    [setPlans],
  );

  const plan = useMemo(() => ensurePlan(placeSlug), [ensurePlan, placeSlug]);
  const completed = useMemo(() => plan.checklist.filter((item) => item.done).length, [plan.checklist]);
  const total = plan.checklist.length;

  return {
    ready,
    plan,
    completed,
    total,
    getPlan,
    setDate,
    setNote,
    toggleChecklistItem,
  };
}
