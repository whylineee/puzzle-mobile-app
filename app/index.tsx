import { ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.overlay} />
        <View style={styles.brandRow}>
          <Text style={styles.brandText}>Puzzle</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Plan your</Text>
          <Text style={styles.title}>Luxurious{'\n'}Vacation</Text>

          <Pressable style={styles.exploreButton} onPress={() => router.push('/explore')}>
            <Text style={styles.exploreButtonText}>Explore</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#b7d2f2',
  },
  hero: {
    flex: 1,
    marginHorizontal: 18,
    marginVertical: 24,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  heroImage: {
    borderRadius: 28,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 23, 39, 0.42)',
  },
  brandRow: {
    paddingHorizontal: 22,
    paddingTop: 24,
  },
  brandText: {
    color: '#fff',
    fontSize: 50,
    fontStyle: 'italic',
    fontWeight: '700',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 28,
    gap: 6,
  },
  subtitle: {
    color: '#e8edf5',
    fontSize: 32,
    fontWeight: '300',
  },
  title: {
    color: '#fff',
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '700',
    marginBottom: 16,
  },
  exploreButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#1f6df2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
