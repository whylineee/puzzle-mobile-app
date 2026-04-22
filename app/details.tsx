import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const PLACE_IMAGE =
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80';

const facilities = [
  { id: 'wifi', label: '1 Heater', icon: 'wifi' as const },
  { id: 'food', label: 'Dinner', icon: 'silverware-fork-knife' as const },
  { id: 'bath', label: '1 Tub', icon: 'bathtub-outline' as const },
  { id: 'pool', label: 'Pool', icon: 'pool' as const },
];

export default function DetailsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Image source={{ uri: PLACE_IMAGE }} style={styles.heroImage} />
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={20} color="#1d2d4a" />
          </Pressable>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>Coeurdes Alpes</Text>
          <Text style={styles.mapLink}>Show map</Text>
        </View>

        <Text style={styles.rating}>★ 4.5 (355 Reviews)</Text>
        <Text style={styles.description}>
          Aspen is as close as one can get to a storybook alpine town in America. The choose-your-own-adventure
          possibilities make it a great destination for skiing, hiking, dining and shopping.
        </Text>
        <Text style={styles.readMore}>Read more</Text>

        <Text style={styles.sectionTitle}>Facilities</Text>
        <View style={styles.facilityRow}>
          {facilities.map((item) => (
            <View key={item.id} style={styles.facilityBadge}>
              {item.icon === 'wifi' && <Ionicons name="wifi-outline" size={18} color="#7f8898" />}
              {item.icon === 'silverware-fork-knife' && (
                <MaterialCommunityIcons name="silverware-fork-knife" size={18} color="#7f8898" />
              )}
              {item.icon === 'bathtub-outline' && (
                <MaterialCommunityIcons name="bathtub-outline" size={18} color="#7f8898" />
              )}
              {item.icon === 'pool' && <MaterialIcons name="pool" size={18} color="#7f8898" />}
              <Text style={styles.facilityText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>$199</Text>
        </View>
        <Pressable style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fc',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 8,
    gap: 12,
  },
  heroCard: {
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 320,
  },
  backButton: {
    position: 'absolute',
    left: 14,
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#16233f',
    fontWeight: '700',
  },
  mapLink: {
    color: '#1f6df2',
    fontWeight: '600',
  },
  rating: {
    color: '#f4a100',
    fontWeight: '700',
    fontSize: 13,
  },
  description: {
    color: '#5f6878',
    fontSize: 14,
    lineHeight: 22,
  },
  readMore: {
    color: '#1f6df2',
    fontWeight: '700',
    marginTop: -2,
  },
  sectionTitle: {
    marginTop: 6,
    fontSize: 22,
    color: '#16233f',
    fontWeight: '700',
  },
  facilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  facilityBadge: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  facilityText: {
    color: '#6f7787',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#8d97a8',
    fontSize: 13,
    fontWeight: '600',
  },
  price: {
    color: '#21b56b',
    fontSize: 34,
    fontWeight: '800',
    marginTop: -4,
  },
  bookButton: {
    backgroundColor: '#1f6df2',
    paddingHorizontal: 28,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
