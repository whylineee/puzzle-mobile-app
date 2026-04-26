import { Href, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNav } from '@/components/bottom-nav';
import { PROFILE_DATA } from '@/constants/travel-data';
import { useAuth } from '@/hooks/use-auth';
import { useSavedPlaces } from '@/hooks/use-saved-places';
import { UI } from '@/constants/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const { savedPlaces } = useSavedPlaces();
  const { isAuthenticated, user, logout } = useAuth();
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
            <Text style={styles.name}>{user?.name ?? PROFILE_DATA.name}</Text>
            <Text style={styles.city}>{PROFILE_DATA.city}</Text>
            <Text style={styles.tagline}>{PROFILE_DATA.tagline}</Text>
            <View style={styles.quickActions}>
              <Pressable style={styles.quickActionButton} onPress={() => router.push('/settings' as Href)}>
                <Text style={styles.quickActionButtonText}>Налаштування</Text>
              </Pressable>
              <Pressable style={styles.quickActionButton} onPress={() => router.push('/shop' as Href)}>
                <Text style={styles.quickActionButtonText}>Shop</Text>
              </Pressable>
              <Pressable style={styles.quickActionButton} onPress={() => router.push((isAuthenticated ? '/explore' : '/auth') as Href)}>
                <Text style={styles.quickActionButtonText}>{isAuthenticated ? 'На головну' : 'Увійти'}</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.grid, revealStyle(cardsReveal, 18)]}>
          {!isAuthenticated ? (
            <View style={styles.panel}>
              <Text style={styles.panelLabel}>Потрібен вхід</Text>
              <Text style={styles.panelText}>Увійдіть, щоб зберігати персональні налаштування й синхронізувати профіль у межах додатку.</Text>
              <Pressable style={styles.panelButton} onPress={() => router.push('/auth' as Href)}>
                <Text style={styles.panelButtonText}>Перейти до Auth</Text>
              </Pressable>
            </View>
          ) : null}
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{PROFILE_DATA.visitedCities}</Text>
            <Text style={styles.statLabel}>відвіданих міст</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{savedPlaces.length}</Text>
            <Text style={styles.statLabel}>збережених місць</Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Наступна поїздка</Text>
            <Text style={styles.panelTitle}>{PROFILE_DATA.nextTrip}</Text>
            <Text style={styles.panelText}>
              Мʼякий західний маршрут із двома містами, архітектурою й повільними ранками.
            </Text>
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
            <Text style={styles.panelText}>
              Тобі добре підійдуть камерні маршрути: Чернівці, Львів, Камʼянець та ранкова Одеса поза піком сезону.
            </Text>
            <Pressable style={styles.panelButton} onPress={() => router.push('/collections')}>
              <Text style={styles.panelButtonText}>Оновити добірки</Text>
            </Pressable>
            {isAuthenticated ? (
              <Pressable style={styles.panelGhostButton} onPress={logout}>
                <Text style={styles.panelGhostButtonText}>Вийти з акаунта</Text>
              </Pressable>
            ) : null}
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
    gap: 18,
  },
  label: {
    color: UI.colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroCard: {
    borderRadius: UI.radius.xl,
    backgroundColor: UI.colors.card,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: UI.colors.accent,
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
    color: UI.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  city: {
    marginTop: 4,
    color: UI.colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  tagline: {
    marginTop: 10,
    color: UI.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 14,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  quickActionButton: {
    borderRadius: 14,
    backgroundColor: UI.colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quickActionButtonText: {
    color: UI.colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    gap: 14,
  },
  statCard: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  statNumber: {
    color: UI.colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 6,
    color: UI.colors.textMuted,
    fontSize: 14,
  },
  panel: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.card,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  panelLabel: {
    color: UI.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: UI.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  panelText: {
    color: UI.colors.textMuted,
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
    backgroundColor: UI.colors.accentSoft,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  preferenceText: {
    color: UI.colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  panelButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
    borderRadius: 18,
    backgroundColor: UI.colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  panelButtonText: {
    color: UI.colors.card,
    fontSize: 14,
    fontWeight: '700',
  },
  panelGhostButton: {
    marginTop: 2,
    alignSelf: 'flex-start',
    borderRadius: 16,
    backgroundColor: UI.colors.accentSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  panelGhostButtonText: {
    color: UI.colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
});
