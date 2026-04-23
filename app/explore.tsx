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
import { Feather, Ionicons } from '@expo/vector-icons';
import { BottomNav } from '@/components/bottom-nav';
import { resolveImageSource, UKRAINE_CITIES, UKRAINE_COLLECTIONS, UKRAINE_PLACES } from '@/constants/travel-data';

const categories = ['Усі', 'Міста', 'Природа', 'Кава', 'Вікенд'];

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]);
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={revealStyle(topReveal, 10)}>
          <View style={styles.topRow}>
            <Text style={styles.label}>Досліджуй</Text>
            <View style={styles.locationGroup}>
              <Ionicons name="location-sharp" size={14} color="#2e74f6" />
              <Text style={styles.location}>Україна</Text>
              <Ionicons name="chevron-down" size={14} color="#2e74f6" />
            </View>
          </View>

          <Text style={styles.title}>Puzzle</Text>
          <Text style={styles.subtitle}>Міста, красиві локації та короткі маршрути по Україні.</Text>

          <View style={styles.searchBar}>
            <Feather name="search" size={18} color="#b6c0ce" />
            <TextInput
              placeholder="Шукати міста та місця"
              placeholderTextColor="#b4bfcd"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
            {categories.map((category, index) => (
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
                  <Ionicons name="star" size={14} color="#f7c552" />
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
                <Image
                  source={resolveImageSource(collection.image)}
                  style={styles.collectionImage}
                />
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
    backgroundColor: '#fbfbf8',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 132,
    gap: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#2f3440',
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  location: {
    fontSize: 15,
    color: '#6f7782',
  },
  title: {
    color: '#121a27',
    fontSize: 50,
    lineHeight: 52,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#667180',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 18,
  },
  searchBar: {
    height: 66,
    borderRadius: 24,
    backgroundColor: '#eef4fa',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#223040',
  },
  tabsRow: {
    paddingTop: 22,
    paddingBottom: 6,
    gap: 10,
  },
  tabPill: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activeTabPill: {
    backgroundColor: '#edf4ff',
  },
  tabText: {
    color: '#b0b6bf',
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2e74f6',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#222834',
    fontSize: 24,
    fontWeight: '800',
  },
  sectionAction: {
    color: '#2e74f6',
    fontSize: 15,
    fontWeight: '700',
  },
  cityRow: {
    gap: 16,
    paddingBottom: 6,
  },
  cityCard: {
    width: 248,
    height: 316,
    borderRadius: 30,
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
    backgroundColor: 'rgba(9, 25, 47, 0.28)',
  },
  cityName: {
    color: '#ffffff',
    fontSize: 31,
    lineHeight: 34,
    fontWeight: '800',
    marginBottom: 8,
  },
  cityTagline: {
    color: '#eef3fa',
    fontSize: 14,
    lineHeight: 21,
  },
  cityMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  cityMeta: {
    color: '#f0f5fb',
    fontSize: 12,
    fontWeight: '700',
  },
  placeRow: {
    gap: 16,
    paddingBottom: 10,
  },
  placeCard: {
    width: 230,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#eff3f8',
  },
  placeImage: {
    width: '100%',
    height: 258,
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
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  placeCaption: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 5,
  },
  placeTitle: {
    color: '#1f2630',
    fontSize: 18,
    fontWeight: '800',
  },
  placeMeta: {
    color: '#71808f',
    fontSize: 14,
  },
  collectionsList: {
    gap: 14,
  },
  collectionCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#d7deea',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  collectionImage: {
    width: '100%',
    height: 176,
  },
  collectionCopy: {
    padding: 18,
    gap: 8,
  },
  collectionMood: {
    color: '#2e74f6',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  collectionTitle: {
    color: '#1f2630',
    fontSize: 22,
    fontWeight: '800',
  },
  collectionDescription: {
    color: '#667180',
    fontSize: 14,
    lineHeight: 21,
  },
  collectionStops: {
    color: '#8f98a4',
    fontSize: 13,
  },
  emptyStateCard: {
    width: 230,
    minHeight: 150,
    borderRadius: 24,
    backgroundColor: '#f2f6fc',
    padding: 16,
    justifyContent: 'center',
    gap: 6,
  },
  emptyStateTitle: {
    color: '#1f2630',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyStateText: {
    color: '#7d8794',
    fontSize: 13,
    lineHeight: 19,
  },
});
