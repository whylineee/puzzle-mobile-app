import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BottomNav } from '@/components/bottom-nav';
import { resolveImageSource, UKRAINE_CITIES, UKRAINE_COLLECTIONS, UKRAINE_PLACES } from '@/constants/travel-data';
import { UI } from '@/constants/ui';

const categories = ['Усі', 'Міста', 'Природа', 'Кава', 'Вікенд'];
const QUICK_START_KEY = 'puzzle.quickStart.v1';

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [quickStartSlug, setQuickStartSlug] = useState(UKRAINE_PLACES[0].slug);
  const topReveal = useRef(new Animated.Value(0)).current;
  const cardsReveal = useRef(new Animated.Value(0)).current;
  const collectionsReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.stagger(120, [
      Animated.timing(topReveal, {
        toValue: 1,
        duration: 440,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardsReveal, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(collectionsReveal, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [cardsReveal, collectionsReveal, topReveal]);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(QUICK_START_KEY)
      .then((value) => {
        if (mounted && value) {
          setQuickStartSlug(value);
        }
      })
      .catch(() => {
        // Keep default recommendation when quick start read fails.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const revealStyle = (progress: Animated.Value, offset = 18) => ({
    opacity: progress,
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [offset, 0],
        }),
      },
    ],
  });

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCities = useMemo(() => {
    if (!normalizedQuery) {
      return UKRAINE_CITIES;
    }

    return UKRAINE_CITIES.filter((city) =>
      `${city.name} ${city.region} ${city.tagline} ${city.vibe}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const filteredPlaces = useMemo(() => {
    const byCategory = UKRAINE_PLACES.filter((place) => {
      if (activeCategory === 'Усі') {
        return true;
      }
      if (activeCategory === 'Кава') {
        return place.tags.some((tag) => tag.toLowerCase().includes('кава')) || place.category.toLowerCase().includes('кава');
      }
      if (activeCategory === 'Природа') {
        return (
          place.category.toLowerCase().includes('море') ||
          place.category.toLowerCase().includes('природ') ||
          place.tags.some((tag) => tag.toLowerCase().includes('природ') || tag.toLowerCase().includes('море'))
        );
      }
      if (activeCategory === 'Вікенд') {
        return place.duration.toLowerCase().includes('день');
      }
      return true;
    });

    if (!normalizedQuery) {
      return byCategory;
    }

    return byCategory.filter((place) =>
      `${place.title} ${place.city} ${place.region} ${place.category} ${place.tags.join(' ')} ${place.excerpt}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [activeCategory, normalizedQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Animated.View style={revealStyle(topReveal, 10)}>
          <View style={styles.topRow}>
            <Text style={styles.label}>Досліджуй</Text>
            <View style={styles.locationGroup}>
              <Ionicons name="location-sharp" size={14} color={UI.colors.accent} />
              <Text style={styles.location}>Україна</Text>
              <Ionicons name="chevron-down" size={14} color={UI.colors.accent} />
            </View>
          </View>

          <Text style={styles.title}>Puzzle</Text>
          <Text style={styles.subtitle}>Міста, красиві локації та короткі маршрути по Україні.</Text>

          <View style={styles.heroStrip}>
            <Text style={styles.heroStripLabel}>Editor’s pick</Text>
            <Text style={styles.heroStripTitle}>Львів + Чернівці на довгі вихідні</Text>
            <Text style={styles.heroStripMeta}>
              Тиха архітектура, ранкова кава і міста, що добре працюють у повільному темпі.
            </Text>
          </View>

          <View style={styles.quickStartCard}>
            <Text style={styles.quickStartLabel}>Швидкий старт</Text>
            <Text style={styles.quickStartTitle}>Повернутись до останнього маршруту</Text>
            <View style={styles.quickStartActions}>
              <Pressable
                style={styles.quickStartButton}
                onPress={() => {
                  router.push({ pathname: '/details', params: { slug: quickStartSlug } });
                }}
              >
                <Text style={styles.quickStartButtonText}>Продовжити</Text>
              </Pressable>
              <Pressable
                style={styles.quickStartGhost}
                onPress={() => {
                  const nextSlug = UKRAINE_PLACES[(UKRAINE_PLACES.findIndex((entry) => entry.slug === quickStartSlug) + 1) % UKRAINE_PLACES.length].slug;
                  setQuickStartSlug(nextSlug);
                  AsyncStorage.setItem(QUICK_START_KEY, nextSlug).catch(() => {
                    // Keep in-memory state if persistence fails.
                  });
                }}
              >
                <Text style={styles.quickStartGhostText}>Інша рекомендація</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Feather name="search" size={18} color={UI.colors.textSoft} />
            <TextInput
              placeholder="Шукати міста та місця"
              placeholderTextColor={UI.colors.textSoft}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
            {categories.map((category) => (
              <Pressable
                key={category}
                style={[styles.tabPill, activeCategory === category && styles.activeTabPill]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[styles.tabText, activeCategory === category && styles.activeTabText]}>{category}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={revealStyle(cardsReveal, 18)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Міста</Text>
            <Pressable onPress={() => setActiveCategory('Міста')}>
              <Text style={styles.sectionAction}>Підібрати місто</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cityRow}>
            {filteredCities.map((city) => (
              <View key={city.slug} style={styles.cityCard}>
                <Image source={resolveImageSource(city.image)} style={styles.cityImage} />
                <View style={styles.cityOverlay} />
                <View style={styles.cityTopBadge}>
                  <Text style={styles.cityTopBadgeText}>{city.region}</Text>
                </View>
                <Text style={styles.cityName}>{city.name}</Text>
                <Text style={styles.cityTagline}>{city.tagline}</Text>
                <View style={styles.cityMetaRow}>
                  <Text style={styles.cityMeta}>{city.stay}</Text>
                  <Text style={styles.cityMeta}>{city.vibe}</Text>
                </View>
              </View>
            ))}
            {!filteredCities.length ? (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>Нічого не знайдено</Text>
                <Text style={styles.emptyStateText}>Спробуй інший запит або очисти пошук.</Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Цікаві локації</Text>
            <Pressable
              onPress={() => {
                setActiveCategory('Усі');
                setQuery('');
              }}
            >
              <Text style={styles.sectionAction}>Дивитися все</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.placeRow}>
            {filteredPlaces.map((place) => (
              <Pressable
                key={place.slug}
                style={styles.placeCard}
                onPress={() => router.push({ pathname: '/details', params: { slug: place.slug } })}
              >
                <Image source={resolveImageSource(place.image)} style={styles.placeImage} />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#F7C552" />
                  <Text style={styles.ratingText}>{place.rating}</Text>
                </View>
                <View style={styles.placeCaption}>
                  <Text style={styles.placeTitle}>{place.title}</Text>
                  <Text style={styles.placeMeta}>
                    {place.city} · {place.duration}
                  </Text>
                </View>
              </Pressable>
            ))}
            {!filteredPlaces.length ? (
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>Локацій не знайдено</Text>
                <Text style={styles.emptyStateText}>Зміни категорію або введи інший запит.</Text>
              </View>
            ) : null}
          </ScrollView>
        </Animated.View>

        <Animated.View style={revealStyle(collectionsReveal, 20)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Маршрути</Text>
            <Pressable onPress={() => router.push('/collections')}>
              <Text style={styles.sectionAction}>Відкрити</Text>
            </Pressable>
          </View>

          <View style={styles.collectionsList}>
            {UKRAINE_COLLECTIONS.slice(0, 2).map((collection) => (
              <View key={collection.slug} style={styles.collectionCard}>
                <Image source={resolveImageSource(collection.image)} style={styles.collectionImage} />
                <View style={styles.collectionCopy}>
                  <Text style={styles.collectionMood}>{collection.mood}</Text>
                  <Text style={styles.collectionTitle}>{collection.title}</Text>
                  <Text style={styles.collectionDescription}>{collection.description}</Text>
                  <Text style={styles.collectionStops}>{collection.stops.join(' · ')}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UI.colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 132,
    gap: 22,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: UI.colors.text,
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  location: {
    fontSize: 15,
    color: UI.colors.textMuted,
  },
  title: {
    color: UI.colors.text,
    fontSize: 52,
    lineHeight: 54,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: UI.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 310,
    marginBottom: 16,
  },
  heroStrip: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.surfaceMuted,
    padding: 18,
    marginBottom: 18,
    gap: 6,
  },
  quickStartCard: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  quickStartLabel: {
    color: UI.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  quickStartTitle: {
    color: UI.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  quickStartActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickStartButton: {
    borderRadius: 14,
    backgroundColor: UI.colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  quickStartButtonText: {
    color: UI.colors.card,
    fontSize: 13,
    fontWeight: '800',
  },
  quickStartGhost: {
    borderRadius: 14,
    backgroundColor: UI.colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  quickStartGhostText: {
    color: UI.colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  heroStripLabel: {
    color: UI.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroStripTitle: {
    color: UI.colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    maxWidth: 280,
  },
  heroStripMeta: {
    color: UI.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  searchBar: {
    height: 62,
    borderRadius: UI.radius.md,
    backgroundColor: UI.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: UI.colors.text,
  },
  tabsRow: {
    paddingTop: 18,
    paddingBottom: 4,
    gap: 10,
  },
  tabPill: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: UI.radius.sm,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeTabPill: {
    backgroundColor: UI.colors.accentSoft,
  },
  tabText: {
    color: UI.colors.textSoft,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: UI.colors.accent,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: UI.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sectionAction: {
    color: UI.colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  cityRow: {
    gap: 16,
    paddingBottom: 6,
  },
  cityCard: {
    width: 260,
    height: 300,
    borderRadius: UI.radius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 18,
  },
  cityImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  cityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 25, 47, 0.34)',
  },
  cityTopBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: UI.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cityTopBadgeText: {
    color: UI.colors.card,
    fontSize: 12,
    fontWeight: '700',
  },
  cityName: {
    color: UI.colors.card,
    fontSize: 30,
    lineHeight: 33,
    fontWeight: '800',
    marginBottom: 8,
  },
  cityTagline: {
    color: '#EEF3FA',
    fontSize: 14,
    lineHeight: 21,
  },
  cityMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  cityMeta: {
    color: '#F0F5FB',
    fontSize: 12,
    fontWeight: '700',
  },
  placeRow: {
    gap: 16,
    paddingBottom: 10,
  },
  placeCard: {
    width: 230,
    borderRadius: UI.radius.lg,
    overflow: 'hidden',
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  placeImage: {
    width: '100%',
    height: 248,
  },
  ratingBadge: {
    position: 'absolute',
    left: 14,
    top: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 64, 79, 0.86)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ratingText: {
    color: UI.colors.card,
    fontSize: 14,
    fontWeight: '700',
  },
  placeCaption: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 5,
  },
  placeTitle: {
    color: UI.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  placeMeta: {
    color: UI.colors.textMuted,
    fontSize: 14,
  },
  collectionsList: {
    gap: 12,
  },
  collectionCard: {
    borderRadius: UI.radius.lg,
    overflow: 'hidden',
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  collectionImage: {
    width: '100%',
    height: 164,
  },
  collectionCopy: {
    padding: 18,
    gap: 8,
  },
  collectionMood: {
    color: UI.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  collectionTitle: {
    color: UI.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  collectionDescription: {
    color: UI.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  collectionStops: {
    color: UI.colors.textSoft,
    fontSize: 13,
  },
  emptyStateCard: {
    width: 230,
    minHeight: 150,
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.cardSoft,
    padding: 16,
    justifyContent: 'center',
    gap: 6,
  },
  emptyStateTitle: {
    color: UI.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyStateText: {
    color: UI.colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
});
