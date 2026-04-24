import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNav } from '@/components/bottom-nav';
import { resolveImageSource, UKRAINE_COLLECTIONS, UKRAINE_PLACES } from '@/constants/travel-data';
import { UI } from '@/constants/ui';

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
    backgroundColor: UI.colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 132,
    gap: 20,
  },
  label: {
    color: UI.colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: UI.colors.text,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
    maxWidth: 320,
  },
  subtitle: {
    marginTop: 12,
    color: UI.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  featuredCard: {
    height: 310,
    borderRadius: UI.radius.xl,
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
    color: '#D8E8FF',
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
    color: '#EEF3FA',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 280,
  },
  routesList: {
    gap: 14,
  },
  routeCard: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.card,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  routeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeDuration: {
    color: UI.colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  routeMood: {
    color: UI.colors.textSoft,
    fontSize: 13,
  },
  routeTitle: {
    color: UI.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  routeDescription: {
    color: UI.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  routeStops: {
    color: UI.colors.textSoft,
    fontSize: 13,
  },
  routeAction: {
    marginTop: 6,
    alignSelf: 'flex-start',
    borderRadius: 18,
    backgroundColor: UI.colors.accentSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  routeActionText: {
    color: UI.colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
});
