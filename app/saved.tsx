import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNav } from '@/components/bottom-nav';
import { getSavedPlaces, resolveImageSource } from '@/constants/travel-data';
import { UI } from '@/constants/ui';

const savedPlaces = getSavedPlaces();

export default function SavedScreen() {
  const router = useRouter();
  const headerReveal = useRef(new Animated.Value(0)).current;
  const listReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.stagger(120, [
      Animated.timing(headerReveal, {
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
  }, [headerReveal, listReveal]);

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
        <Animated.View style={revealStyle(headerReveal, 10)}>
          <Text style={styles.label}>Збережено</Text>
          <Text style={styles.title}>Місця, які хочеться не загубити</Text>
          <Text style={styles.subtitle}>Тут твоя персональна добірка для наступних вікендів і спонтанних поїздок.</Text>
        </Animated.View>

        <Animated.View style={[styles.list, revealStyle(listReveal, 20)]}>
          {savedPlaces.map((place) => (
            <Pressable
              key={place.slug}
              style={styles.placeCard}
              onPress={() => router.push({ pathname: '/details', params: { slug: place.slug } })}
            >
              <Image source={resolveImageSource(place.image)} style={styles.placeImage} />
              <View style={styles.placeCopy}>
                <Text style={styles.placeRegion}>{place.region}</Text>
                <Text style={styles.placeTitle}>{place.title}</Text>
                <Text style={styles.placeMeta}>
                  {place.city} · {place.category}
                </Text>
                <Text style={styles.placeExcerpt}>{place.excerpt}</Text>
                <View style={styles.placeFooter}>
                  <Text style={styles.placeBudget}>{place.price}</Text>
                  <Text style={styles.placeRating}>★ {place.rating}</Text>
                </View>
              </View>
            </Pressable>
          ))}
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
  list: {
    gap: 14,
  },
  placeCard: {
    borderRadius: UI.radius.lg,
    overflow: 'hidden',
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
    flexDirection: 'row',
    minHeight: 164,
  },
  placeImage: {
    width: 126,
    height: '100%',
  },
  placeCopy: {
    padding: 18,
    gap: 8,
    flex: 1,
  },
  placeRegion: {
    color: UI.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  placeTitle: {
    color: UI.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  placeMeta: {
    color: UI.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  placeExcerpt: {
    color: UI.colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  placeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  placeBudget: {
    color: UI.colors.success,
    fontSize: 16,
    fontWeight: '800',
  },
  placeRating: {
    color: UI.colors.textSoft,
    fontSize: 15,
    fontWeight: '700',
  },
});
