import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.hero}>
        <View style={[styles.glow, styles.glowTop]} />
        <View style={[styles.glow, styles.glowBottom]} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Puzzle Mobile App</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Sliding Puzzle{'\n'}Starter</Text>
          <Text style={styles.subtitle}>
            Чистий Expo-проєкт уже готовий до розробки: маршрути налаштовані, стартовий екран є, а перша
            ігрова механіка вже працює.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureCard}>
              <Text style={styles.featureLabel}>4x4 поле</Text>
              <Text style={styles.featureText}>Класичний sliding puzzle із лічильником ходів.</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureLabel}>Швидкий старт</Text>
              <Text style={styles.featureText}>Можна одразу запускати гру та розширювати логіку.</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.ctaButton} onPress={() => router.push('/game')}>
          <Text style={styles.ctaButtonText}>Почати гру</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  hero: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(59, 130, 246, 0.18)',
  },
  glowTop: {
    width: 240,
    height: 240,
    top: -50,
    right: -40,
  },
  glowBottom: {
    width: 260,
    height: 260,
    bottom: 90,
    left: -70,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#dbeafe',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    gap: 20,
  },
  title: {
    color: '#fff',
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '800',
  },
  subtitle: {
    color: '#dbe7ff',
    fontSize: 17,
    lineHeight: 26,
  },
  featureList: {
    gap: 12,
  },
  featureCard: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  featureLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  featureText: {
    color: '#dbe7ff',
    fontSize: 14,
    lineHeight: 22,
  },
  ctaButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
  },
});
