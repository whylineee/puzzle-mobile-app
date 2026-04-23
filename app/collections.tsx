import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNav } from '@/components/bottom-nav';
import { resolveImageSource, UKRAINE_COLLECTIONS, UKRAINE_PLACES } from '@/constants/travel-data';

export default function CollectionsScreen() {
  const router = useRouter();
  const heroReveal = useRef(new Animated.Value(0)).current;
  const listReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.stagger(120, [
      Animated.timing(heroReveal, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(listReveal, {
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
  }, [heroReveal, listReveal]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={revealStyle(heroReveal, 10)}>
          <Text style={styles.label}>Маршрути</Text>
          <Text style={styles.title}>Готові сценарії для подорожей Україною</Text>
          <Text style={styles.subtitle}>
            Добірки з правильним ритмом: менше хаосу, більше красивих точок і логічних зупинок.
          </Text>
        </Animated.View>

        <Animated.View style={revealStyle(listReveal, 20)}>
          <View style={styles.featuredCard}>
            <Image source={resolveImageSource(UKRAINE_COLLECTIONS[0].image)} style={styles.featuredImage} />
            <View style={styles.featuredOverlay} />
            <View style={styles.featuredCopy}>
              <Text style={styles.featuredMood}>{UKRAINE_COLLECTIONS[0].mood}</Text>
              <Text style={styles.featuredTitle}>{UKRAINE_COLLECTIONS[0].title}</Text>
              <Text style={styles.featuredDescription}>{UKRAINE_COLLECTIONS[0].description}</Text>
            </View>
          </View>

          <View style={styles.routesList}>
            {UKRAINE_COLLECTIONS.map((collection, index) => (
              <View key={collection.slug} style={styles.routeCard}>
                <View style={styles.routeMeta}>
                  <Text style={styles.routeDuration}>{collection.duration}</Text>
                  <Text style={styles.routeMood}>{collection.mood}</Text>
                </View>
                <Text style={styles.routeTitle}>{collection.title}</Text>
                <Text style={styles.routeDescription}>{collection.description}</Text>
                <Text style={styles.routeStops}>{collection.stops.join(' · ')}</Text>
                <Pressable
                  style={styles.routeAction}
                  onPress={() =>
                    router.push({
                      pathname: '/details',
                      params: { slug: UKRAINE_PLACES[index % UKRAINE_PLACES.length].slug },
                    })
                  }
                >
                  <Text style={styles.routeActionText}>Відкрити локацію</Text>
                </Pressable>
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
  label: {
    color: '#2e74f6',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: '#141d29',
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    maxWidth: 320,
  },
  subtitle: {
    marginTop: 12,
    color: '#667180',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  featuredCard: {
    height: 310,
    borderRadius: 34,
    overflow: 'hidden',
    marginBottom: 18,
  },
  featuredImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 27, 49, 0.28)',
  },
  featuredCopy: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 22,
  },
  featuredMood: {
    color: '#d8e8ff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  featuredTitle: {
    color: '#ffffff',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
    marginBottom: 8,
  },
  featuredDescription: {
    color: '#eef3fa',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 280,
  },
  routesList: {
    gap: 14,
  },
  routeCard: {
    borderRadius: 28,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 8,
    shadowColor: '#d7deea',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  routeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeDuration: {
    color: '#2e74f6',
    fontSize: 13,
    fontWeight: '800',
  },
  routeMood: {
    color: '#99a2ad',
    fontSize: 13,
  },
  routeTitle: {
    color: '#1f2630',
    fontSize: 22,
    fontWeight: '800',
  },
  routeDescription: {
    color: '#667180',
    fontSize: 14,
    lineHeight: 22,
  },
  routeStops: {
    color: '#9ba4af',
    fontSize: 13,
  },
  routeAction: {
    marginTop: 6,
    alignSelf: 'flex-start',
    borderRadius: 18,
    backgroundColor: '#eef4ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  routeActionText: {
    color: '#2e74f6',
    fontSize: 14,
    fontWeight: '700',
  },
});
