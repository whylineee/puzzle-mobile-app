import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNav } from '@/components/bottom-nav';
import { getSavedPlaces, resolveImageSource } from '@/constants/travel-data';

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
  list: {
    gap: 14,
  },
  placeCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#d7deea',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  placeImage: {
    width: '100%',
    height: 190,
  },
  placeCopy: {
    padding: 18,
    gap: 8,
  },
  placeTitle: {
    color: '#1f2630',
    fontSize: 22,
    fontWeight: '800',
  },
  placeMeta: {
    color: '#2e74f6',
    fontSize: 14,
    fontWeight: '700',
  },
  placeExcerpt: {
    color: '#667180',
    fontSize: 14,
    lineHeight: 22,
  },
  placeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  placeBudget: {
    color: '#19b786',
    fontSize: 16,
    fontWeight: '800',
  },
  placeRating: {
    color: '#8d96a3',
    fontSize: 15,
    fontWeight: '700',
  },
});
