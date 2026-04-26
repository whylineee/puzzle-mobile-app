import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHOP_ITEMS } from '@/constants/shop-data';

type ShopContextValue = {
  ready: boolean;
  coins: number;
  ownedItemIds: string[];
  buyItem: (itemId: string) => { ok: boolean; message: string };
};

const STORAGE_KEY = 'puzzle.shop.v1';

type StoredShopState = {
  coins: number;
  ownedItemIds: string[];
};

const initialState: StoredShopState = {
  coins: 1500,
  ownedItemIds: ['hint-pack-small'],
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<StoredShopState>(initialState);

  useEffect(() => {
    let mounted = true;

    async function loadShopState() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw) as Partial<StoredShopState>;
        if (!mounted) {
          return;
        }
        setState((current) => ({
          coins: typeof parsed.coins === 'number' ? parsed.coins : current.coins,
          ownedItemIds: Array.isArray(parsed.ownedItemIds)
            ? parsed.ownedItemIds.filter((item): item is string => typeof item === 'string')
            : current.ownedItemIds,
        }));
      } catch {
        // Keep defaults if storage read fails.
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    }

    loadShopState();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Skip persisting failures to avoid UI blocking.
    });
  }, [ready, state]);

  const buyItem = useCallback((itemId: string) => {
    const item = SHOP_ITEMS.find((entry) => entry.id === itemId);
    if (!item) {
      return { ok: false, message: 'Товар не знайдено.' };
    }
    if (state.ownedItemIds.includes(itemId)) {
      return { ok: false, message: 'Цей товар уже у твоїй колекції.' };
    }
    if (state.coins < item.priceCoins) {
      return { ok: false, message: 'Недостатньо монет для покупки.' };
    }
    setState((current) => ({
      coins: current.coins - item.priceCoins,
      ownedItemIds: [itemId, ...current.ownedItemIds],
    }));
    return { ok: true, message: `Придбано: ${item.name}` };
  }, [state.coins, state.ownedItemIds]);

  const value = useMemo(
    () => ({
      ready,
      coins: state.coins,
      ownedItemIds: state.ownedItemIds,
      buyItem,
    }),
    [buyItem, ready, state.coins, state.ownedItemIds],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
}
