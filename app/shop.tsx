import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SHOP_ITEMS } from '@/constants/shop-data';
import { UI } from '@/constants/ui';
import { usePreferences } from '@/hooks/use-preferences';
import { useShop } from '@/hooks/use-shop';

const categories = [
  { id: 'all', label: 'Усе' },
  { id: 'boosters', label: 'Бустери' },
  { id: 'themes', label: 'Теми' },
  { id: 'bundles', label: 'Бандли' },
] as const;

type CategoryId = (typeof categories)[number]['id'];
const SHOP_CATEGORY_KEY = 'puzzle.shop.lastCategory.v1';

export default function ShopScreen() {
  const router = useRouter();
  const { preferences } = usePreferences();
  const { buyItem, coins, ownedItemIds } = useShop();
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [message, setMessage] = useState('Обери товар, щоб прокачати досвід гри.');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return SHOP_ITEMS;
    }
    return SHOP_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(SHOP_CATEGORY_KEY)
      .then((value) => {
        if (!mounted || !value) {
          return;
        }
        const isValid = categories.some((entry) => entry.id === value);
        if (isValid) {
          setActiveCategory(value as CategoryId);
        }
      })
      .catch(() => {
        // Keep default category when storage read fails.
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(SHOP_CATEGORY_KEY, activeCategory).catch(() => {
      // Keep current in-memory category when persist fails.
    });
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Shop</Text>
        <Text style={styles.title}>Прокачай гру під себе</Text>
        <Text style={styles.subtitle}>Швидкі покупки в 1-2 натиски. Категорія запам’ятовується в межах сесії.</Text>

        {preferences.hintsEnabled ? (
          <View style={styles.hintCard}>
            <Text style={styles.hintTitle}>Підказка</Text>
            <Text style={styles.hintBody}>Найкращий старт - взяти пакет підказок і тему для комфортних вечірніх сесій.</Text>
          </View>
        ) : null}

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Баланс</Text>
          <Text style={styles.balanceValue}>{coins} coins</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              style={[styles.tabPill, activeCategory === category.id && styles.activeTabPill]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text style={[styles.tabText, activeCategory === category.id && styles.activeTabText]}>{category.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filteredItems.map((item) => {
            const owned = ownedItemIds.includes(item.id);
            return (
              <View key={item.id} style={styles.itemCard}>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>{item.priceCoins} coins</Text>
                  <Pressable
                    style={[styles.buyButton, owned && styles.buyButtonOwned]}
                    onPress={() => {
                      if (owned) {
                        setMessage('Цей товар уже придбано.');
                        return;
                      }
                      const result = buyItem(item.id);
                      setMessage(result.message);
                    }}
                  >
                    <Text style={[styles.buyButtonText, owned && styles.buyButtonTextOwned]}>{owned ? 'В колекції' : 'Купити'}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.message}>{message}</Text>

        <Pressable style={styles.backButton} onPress={() => router.push('/profile')}>
          <Text style={styles.backButtonText}>Повернутись у профіль</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: UI.colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40, gap: 14 },
  label: { color: UI.colors.accent, fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: UI.colors.text, fontSize: 34, lineHeight: 38, fontWeight: '800', maxWidth: 330 },
  subtitle: { color: UI.colors.textMuted, fontSize: 15, lineHeight: 22, maxWidth: 330 },
  hintCard: { borderRadius: UI.radius.lg, backgroundColor: UI.colors.accentSoft, padding: 14, gap: 6 },
  hintTitle: { color: UI.colors.accent, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  hintBody: { color: UI.colors.text, fontSize: 14, lineHeight: 20 },
  balanceCard: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
    padding: 16,
    gap: 2,
  },
  balanceLabel: { color: UI.colors.textMuted, fontSize: 13, fontWeight: '700' },
  balanceValue: { color: UI.colors.text, fontSize: 28, lineHeight: 32, fontWeight: '800' },
  tabsRow: { gap: 10, paddingBottom: 4 },
  tabPill: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: UI.radius.sm,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: UI.colors.line,
    backgroundColor: UI.colors.surface,
  },
  activeTabPill: {
    backgroundColor: UI.colors.accentSoft,
    borderColor: UI.colors.accentSoft,
  },
  tabText: { color: UI.colors.textMuted, fontSize: 13, fontWeight: '700' },
  activeTabText: { color: UI.colors.accent },
  grid: { gap: 12 },
  itemCard: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
    padding: 16,
    gap: 8,
  },
  itemCategory: { color: UI.colors.textSoft, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  itemName: { color: UI.colors.text, fontSize: 20, fontWeight: '800' },
  itemDescription: { color: UI.colors.textMuted, fontSize: 14, lineHeight: 20 },
  itemFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemPrice: { color: UI.colors.success, fontSize: 16, fontWeight: '800' },
  buyButton: {
    borderRadius: 14,
    backgroundColor: UI.colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  buyButtonOwned: { backgroundColor: UI.colors.accentSoft },
  buyButtonText: { color: UI.colors.card, fontSize: 13, fontWeight: '800' },
  buyButtonTextOwned: { color: UI.colors.accent },
  message: { color: UI.colors.textMuted, fontSize: 14, lineHeight: 20 },
  backButton: {
    borderRadius: UI.radius.sm,
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backButtonText: { color: UI.colors.text, fontSize: 15, fontWeight: '700' },
});
