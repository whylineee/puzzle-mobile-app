import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNav } from '@/components/bottom-nav';
import { PROFILE_DATA } from '@/constants/travel-data';

export default function ProfileScreen() {
  const router = useRouter();
  const topReveal = useRef(new Animated.Value(0)).current;
  const cardsReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.stagger(120, [
      Animated.timing(topReveal, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardsReveal, {
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
  }, [cardsReveal, topReveal]);

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
        <Animated.View style={revealStyle(topReveal, 10)}>
          <Text style={styles.label}>Профіль</Text>
          <View style={styles.heroCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>М</Text>
            </View>
            <Text style={styles.name}>{PROFILE_DATA.name}</Text>
            <Text style={styles.city}>{PROFILE_DATA.city}</Text>
            <Text style={styles.tagline}>{PROFILE_DATA.tagline}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.grid, revealStyle(cardsReveal, 18)]}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{PROFILE_DATA.visitedCities}</Text>
            <Text style={styles.statLabel}>відвіданих міст</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{PROFILE_DATA.savedPlaces}</Text>
            <Text style={styles.statLabel}>збережених місць</Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Наступна поїздка</Text>
            <Text style={styles.panelTitle}>{PROFILE_DATA.nextTrip}</Text>
            <Text style={styles.panelText}>Мʼякий західний маршрут із двома містами, архітектурою й повільними ранками.</Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Твої вподобання</Text>
            <View style={styles.preferenceWrap}>
              {PROFILE_DATA.preferences.map((preference) => (
                <View key={preference} style={styles.preference}>
                  <Text style={styles.preferenceText}>{preference}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Нотатка від Puzzle</Text>
            <Text style={styles.panelText}>Тобі добре підійдуть камерні маршрути: Чернівці, Львів, Камʼянець та ранкова Одеса поза піком сезону.</Text>
            <Pressable style={styles.panelButton} onPress={() => router.push('/collections')}>
              <Text style={styles.panelButtonText}>Оновити добірки</Text>
            </Pressable>
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
    gap: 18,
  },
  label: {
    color: '#2e74f6',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroCard: {
    borderRadius: 32,
    backgroundColor: '#ffffff',
    padding: 22,
    alignItems: 'center',
    shadowColor: '#d7deea',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#2e74f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    color: '#141d29',
    fontSize: 28,
    fontWeight: '800',
  },
  city: {
    marginTop: 4,
    color: '#2e74f6',
    fontSize: 15,
    fontWeight: '700',
  },
  tagline: {
    marginTop: 10,
    color: '#667180',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  grid: {
    gap: 14,
  },
  statCard: {
    borderRadius: 28,
    backgroundColor: '#eef4ff',
    padding: 20,
  },
  statNumber: {
    color: '#141d29',
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 6,
    color: '#6f7b89',
    fontSize: 14,
  },
  panel: {
    borderRadius: 28,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 8,
    shadowColor: '#d7deea',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  panelLabel: {
    color: '#2e74f6',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: '#1f2630',
    fontSize: 22,
    fontWeight: '800',
  },
  panelText: {
    color: '#667180',
    fontSize: 14,
    lineHeight: 22,
  },
  preferenceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preference: {
    borderRadius: 16,
    backgroundColor: '#eef4ff',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  preferenceText: {
    color: '#2e74f6',
    fontSize: 14,
    fontWeight: '700',
  },
  panelButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    borderRadius: 18,
    backgroundColor: '#2669f6',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  panelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
