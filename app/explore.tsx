import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';

const popularPlaces = [
  {
    id: '1',
    title: 'Alley Palace',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
    rating: '4.1',
  },
  {
    id: '2',
    title: 'Coeurdes Alpes',
    image:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=80',
    rating: '4.5',
  },
];

const recommendedPlaces = [
  {
    id: '3',
    title: 'Explore Aspen',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    title: 'Luxurious Aspen',
    image:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80',
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Text style={styles.exploreLabel}>Explore</Text>
          <View style={styles.locationGroup}>
            <Ionicons name="location-sharp" size={14} color="#3a7ce8" />
            <Text style={styles.location}>Aspen, USA</Text>
          </View>
        </View>
        <Text style={styles.title}>Puzzle</Text>

        <View style={styles.searchWrapper}>
          <Feather name="search" size={16} color="#a0a8b7" />
          <TextInput
            placeholder="Find things to do"
            placeholderTextColor="#9ea8b8"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.tabsRow}>
          <Text style={[styles.tabText, styles.activeTabText]}>Location</Text>
          <Text style={styles.tabText}>Hotels</Text>
          <Text style={styles.tabText}>Food</Text>
          <Text style={styles.tabText}>Adventure</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>

        <View style={styles.popularRow}>
          {popularPlaces.map((place) => (
            <Pressable
              key={place.id}
              style={styles.popularCard}
              onPress={() => router.push('/details')}
            >
              <Image source={{ uri: place.image }} style={styles.popularImage} />
              <View style={styles.popularMeta}>
                <Text style={styles.popularTitle}>{place.title}</Text>
                <Text style={styles.popularRating}>★ {place.rating}</Text>
              </View>
              <View style={styles.favoriteDot}>
                <Ionicons name="heart" size={14} color="#f65f78" />
              </View>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recommended</Text>
        <View style={styles.recommendedRow}>
          {recommendedPlaces.map((place) => (
            <Pressable key={place.id} style={styles.recommendedCard} onPress={() => router.push('/details')}>
              <Image source={{ uri: place.image }} style={styles.recommendedImage} />
              <Text style={styles.recommendedTitle}>{place.title}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home" size={18} style={[styles.bottomIcon, styles.bottomIconActive]} />
        <MaterialIcons name="apps" size={19} style={styles.bottomIcon} />
        <Ionicons name="heart-outline" size={18} style={styles.bottomIcon} />
        <FontAwesome6 name="user" size={16} style={styles.bottomIcon} />
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
    paddingBottom: 90,
    paddingTop: 8,
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exploreLabel: {
    fontSize: 14,
    color: '#757b86',
  },
  location: {
    fontSize: 13,
    color: '#3a7ce8',
    fontWeight: '600',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#0c1a31',
    marginTop: -10,
  },
  searchWrapper: {
    backgroundColor: '#edf1f8',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    fontSize: 15,
    color: '#1a2540',
    flex: 1,
    paddingVertical: 0,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 4,
  },
  tabText: {
    color: '#a0a7b6',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1f6df2',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    color: '#172440',
    fontWeight: '700',
  },
  sectionLink: {
    color: '#1f6df2',
    fontWeight: '600',
  },
  popularRow: {
    flexDirection: 'row',
    gap: 12,
  },
  popularCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  popularImage: {
    width: '100%',
    height: 170,
  },
  popularMeta: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
  },
  favoriteDot: {
    position: 'absolute',
    right: 10,
    bottom: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16233f',
  },
  popularRating: {
    color: '#f4a100',
    fontSize: 12,
    fontWeight: '700',
  },
  recommendedRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendedCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 8,
    gap: 6,
  },
  recommendedImage: {
    width: '100%',
    height: 92,
    borderRadius: 12,
  },
  recommendedTitle: {
    fontSize: 13,
    color: '#172440',
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#2e3b57',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  bottomIcon: {
    color: '#a8b0bf',
  },
  bottomIconActive: {
    color: '#1f6df2',
  },
});
