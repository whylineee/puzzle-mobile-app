import { useEffect, useRef } from 'react';
import { Href, useRouter } from 'expo-router';
import { Animated, Easing, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/constants/theme';
import { HERO_IMAGE, resolveImageSource } from '@/constants/travel-data';
import { UI } from '@/constants/ui';
import { useAuth } from '@/hooks/use-auth';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const brandReveal = useRef(new Animated.Value(0)).current;
  const copyReveal = useRef(new Animated.Value(0)).current;
  const ctaReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.stagger(140, [
      Animated.timing(brandReveal, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(copyReveal, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ctaReveal, {
        toValue: 1,
        duration: 540,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [brandReveal, copyReveal, ctaReveal]);

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
      <View style={styles.screen}>
        <ImageBackground source={resolveImageSource(HERO_IMAGE)} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.overlay} />
          <View style={styles.glow} />

          <View style={styles.topMeta}>
            <Text style={styles.topMetaText}>Ukraine travel collection</Text>
            <Text style={styles.topMetaText}>Spring / Summer guide</Text>
          </View>

          <Animated.View style={[styles.brandBlock, revealStyle(brandReveal, 10)]}>
            <Text style={styles.brand}>Puzzle</Text>
          </Animated.View>

          <Animated.View style={[styles.copyBlock, revealStyle(copyReveal, 20)]}>
            <Text style={styles.eyebrow}>Відкривай</Text>
            <Text style={styles.title}>Україну{'\n'}по-новому</Text>
            <Text style={styles.body}>
              Міста, тихі локації, маршрути на вікенд і красиві місця, куди хочеться повертатися.
            </Text>
            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Київ</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Львів</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Одеса</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.footer, revealStyle(ctaReveal, 24)]}>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/explore')}>
              <Text style={styles.primaryButtonText}>Дослідити</Text>
            </Pressable>
            {!isAuthenticated ? (
              <Pressable style={styles.secondaryButton} onPress={() => router.push('/auth' as Href)}>
                <Text style={styles.secondaryButtonText}>Увійти в акаунт</Text>
              </Pressable>
            ) : null}
            <Text style={styles.footerNote}>Від curated city breaks до тихих локальних маршрутів.</Text>
          </Animated.View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UI.colors.background,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  hero: {
    flex: 1,
    borderRadius: UI.radius.xl,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
    justifyContent: 'space-between',
    backgroundColor: '#0A315D',
  },
  heroImage: {
    borderRadius: UI.radius.xl,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 24, 44, 0.28)',
  },
  glow: {
    position: 'absolute',
    right: -60,
    top: 170,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  topMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  topMetaText: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    fontFamily: Fonts.mono,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: 10,
  },
  brand: {
    color: UI.colors.card,
    fontSize: 78,
    lineHeight: 84,
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    fontWeight: '700',
    letterSpacing: -3,
  },
  copyBlock: {
    gap: 8,
  },
  eyebrow: {
    color: '#f3f8ff',
    fontSize: 24,
    fontWeight: '400',
  },
  title: {
    color: UI.colors.card,
    fontSize: 52,
    lineHeight: 56,
    fontWeight: '800',
    letterSpacing: -2.2,
  },
  body: {
    maxWidth: 280,
    marginTop: 6,
    color: '#e7eef8',
    fontSize: 16,
    lineHeight: 24,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  badge: {
    borderRadius: UI.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badgeText: {
    color: UI.colors.card,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    gap: 12,
  },
  primaryButton: {
    height: 60,
    borderRadius: UI.radius.md,
    backgroundColor: UI.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: UI.colors.card,
    fontSize: 19,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 52,
    borderRadius: UI.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: UI.colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 260,
  },
});
