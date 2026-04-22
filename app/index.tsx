import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Animated, Easing, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/constants/theme';
import { HERO_IMAGE } from '@/constants/travel-data';

export default function WelcomeScreen() {
  const router = useRouter();
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
        <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.overlay} />
          <View style={styles.glow} />

          <Animated.View style={[styles.brandBlock, revealStyle(brandReveal, 10)]}>
            <Text style={styles.brand}>Puzzle</Text>
          </Animated.View>

          <Animated.View style={[styles.copyBlock, revealStyle(copyReveal, 20)]}>
            <Text style={styles.eyebrow}>Відкривай</Text>
            <Text style={styles.title}>Україну{'\n'}по-новому</Text>
            <Text style={styles.body}>
              Міста, тихі локації, маршрути на вікенд і красиві місця, куди хочеться повертатися.
            </Text>
          </Animated.View>

          <Animated.View style={[styles.footer, revealStyle(ctaReveal, 24)]}>
            <Pressable style={styles.primaryButton} onPress={() => router.push('/explore')}>
              <Text style={styles.primaryButtonText}>Дослідити</Text>
            </Pressable>
          </Animated.View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b8d8fb',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  hero: {
    flex: 1,
    borderRadius: 34,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 20,
    justifyContent: 'space-between',
    backgroundColor: '#0a315d',
  },
  heroImage: {
    borderRadius: 34,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 27, 49, 0.20)',
  },
  glow: {
    position: 'absolute',
    right: -35,
    top: 190,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  brandBlock: {
    alignItems: 'center',
  },
  brand: {
    color: '#ffffff',
    fontSize: 84,
    lineHeight: 90,
    fontFamily: Fonts.serif,
    fontStyle: 'italic',
    fontWeight: '700',
    letterSpacing: -3,
  },
  copyBlock: {
    gap: 6,
  },
  eyebrow: {
    color: '#f3f8ff',
    fontSize: 30,
    fontWeight: '300',
  },
  title: {
    color: '#ffffff',
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '800',
    letterSpacing: -2.2,
  },
  body: {
    maxWidth: 265,
    marginTop: 8,
    color: '#e7eef8',
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    gap: 12,
  },
  primaryButton: {
    height: 62,
    borderRadius: 22,
    backgroundColor: '#2669f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '800',
  },
});
