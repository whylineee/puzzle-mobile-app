import { useEffect, useMemo, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getPlaceBySlug, resolveImageSource } from '@/constants/travel-data';

function FacilityIcon({ kind }: { kind: string }) {
  if (kind === 'coffee') {
    return <MaterialCommunityIcons name="coffee-outline" size={26} color="#b4bcc6" />;
  }

  if (kind === 'food') {
    return <MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#b4bcc6" />;
  }

  if (kind === 'stay') {
    return <Ionicons name="bed-outline" size={26} color="#b4bcc6" />;
  }

  if (kind === 'museum') {
    return <Ionicons name="library-outline" size={26} color="#b4bcc6" />;
  }

  if (kind === 'car') {
    return <Ionicons name="car-outline" size={26} color="#b4bcc6" />;
  }

  return <MaterialIcons name="landscape" size={26} color="#b4bcc6" />;
}

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug?: string }>();
  const place = useMemo(() => getPlaceBySlug(params.slug), [params.slug]);
  const heroReveal = useRef(new Animated.Value(0)).current;
  const contentReveal = useRef(new Animated.Value(0)).current;
  const footerReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.stagger(130, [
      Animated.timing(heroReveal, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentReveal, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerReveal, {
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
  }, [contentReveal, footerReveal, heroReveal, params.slug]);

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

  const openMap = async () => {
    const query = encodeURIComponent(`${place.title}, ${place.city}, ${place.region}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return;
    }
    Alert.alert('Не вдалося відкрити мапу', 'Спробуй ще раз або перевір підключення до інтернету.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={revealStyle(heroReveal, 12)}>
          <View style={styles.heroCard}>
            <Image source={resolveImageSource(place.image)} style={styles.heroImage} />
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={24} color="#aab3be" />
            </Pressable>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{place.city}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={revealStyle(contentReveal, 20)}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{place.title}</Text>
            <Pressable onPress={openMap} hitSlop={8}>
              <Text style={styles.mapLink}>На мапі</Text>
            </Pressable>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={15} color="#f6b443" />
            <Text style={styles.ratingText}>
              {place.rating} · {place.category} · {place.duration}
            </Text>
          </View>

          <Text style={styles.description}>{place.description}</Text>

          <View style={styles.tagsRow}>
            {place.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Що включено</Text>
          <View style={styles.facilitiesRow}>
            {place.facilities.map((item) => (
              <View key={item.id} style={styles.facilityCard}>
                <FacilityIcon kind={item.kind} />
                <Text style={styles.facilityText}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.storyBlock}>
            <Text style={styles.storyLabel}>Коротко про маршрут</Text>
            <Text style={styles.storyText}>{place.excerpt}</Text>
          </View>

          {place.gallery?.length ? (
            <View style={styles.galleryBlock}>
              <Text style={styles.galleryLabel}>Ще фото локації</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                {place.gallery.map((image, index) => (
                  <Image
                    key={`${place.slug}-gallery-${index}`}
                    source={resolveImageSource(image)}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.footer, revealStyle(footerReveal, 22)]}>
        <View>
          <Text style={styles.priceLabel}>Орієнтовний бюджет</Text>
          <Text style={styles.price}>{place.price}</Text>
        </View>
        <Pressable
          style={styles.bookButton}
          onPress={() => router.push({ pathname: '/collections' })}
          accessibilityRole="button"
        >
          <Text style={styles.bookButtonText}>Спланувати</Text>
          <Ionicons name="arrow-forward" size={22} color="#ffffff" />
        </Pressable>
      </Animated.View>
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
    paddingTop: 16,
    paddingBottom: 156,
    gap: 18,
  },
  heroCard: {
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#dbe7f3',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 400,
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#f8fbff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTag: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 64, 79, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  heroTagText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
  },
  title: {
    flex: 1,
    color: '#252b34',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  mapLink: {
    color: '#2e74f6',
    fontSize: 16,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    color: '#747c86',
    fontSize: 15,
  },
  description: {
    color: '#425261',
    fontSize: 17,
    lineHeight: 29,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    borderRadius: 16,
    backgroundColor: '#eef4fb',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  tagText: {
    color: '#2e74f6',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 8,
    color: '#252b34',
    fontSize: 24,
    fontWeight: '800',
  },
  facilitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  facilityCard: {
    flex: 1,
    minHeight: 112,
    borderRadius: 24,
    backgroundColor: '#f4f6f9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  facilityText: {
    color: '#8d96a3',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  storyBlock: {
    marginTop: 4,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 8,
    shadowColor: '#d7deea',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  storyLabel: {
    color: '#2e74f6',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  storyText: {
    color: '#445261',
    fontSize: 15,
    lineHeight: 23,
  },
  galleryBlock: {
    marginTop: 8,
    gap: 10,
  },
  galleryLabel: {
    color: '#252b34',
    fontSize: 20,
    fontWeight: '800',
  },
  galleryRow: {
    gap: 12,
    paddingRight: 8,
  },
  galleryImage: {
    width: 240,
    height: 150,
    borderRadius: 20,
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.97)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#7da8eb',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  priceLabel: {
    color: '#252b34',
    fontSize: 15,
    fontWeight: '500',
  },
  price: {
    marginTop: 6,
    color: '#2ecc9d',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  bookButton: {
    height: 68,
    minWidth: 176,
    paddingHorizontal: 26,
    borderRadius: 24,
    backgroundColor: '#2669f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
});
