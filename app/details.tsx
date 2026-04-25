import { useEffect, useMemo, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Alert,
  Animated,
  Easing,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  Share,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getPlaceBySlug, resolveImageSource } from '@/constants/travel-data';
import { useSavedPlaces } from '@/hooks/use-saved-places';
import { useTripPlanner } from '@/hooks/use-trip-planner';
import { UI } from '@/constants/ui';

function FacilityIcon({ kind }: { kind: string }) {
  if (kind === 'coffee') {
    return <MaterialCommunityIcons name="coffee-outline" size={26} color="#B4BCC6" />;
  }

  if (kind === 'food') {
    return <MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#B4BCC6" />;
  }

  if (kind === 'stay') {
    return <Ionicons name="bed-outline" size={26} color="#B4BCC6" />;
  }

  if (kind === 'museum') {
    return <Ionicons name="library-outline" size={26} color="#B4BCC6" />;
  }

  if (kind === 'car') {
    return <Ionicons name="car-outline" size={26} color="#B4BCC6" />;
  }

  return <MaterialIcons name="landscape" size={26} color="#B4BCC6" />;
}

export default function DetailsScreen() {
  const router = useRouter();
  const { isSaved, toggleSaved } = useSavedPlaces();
  const params = useLocalSearchParams<{ slug?: string }>();
  const place = useMemo(() => getPlaceBySlug(params.slug), [params.slug]);
  const { completed, plan, ready, setDate, setNote, toggleChecklistItem, total } = useTripPlanner(place.slug);
  const heroReveal = useRef(new Animated.Value(0)).current;
  const contentReveal = useRef(new Animated.Value(0)).current;
  const footerReveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.stagger(130, [
      Animated.timing(heroReveal, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentReveal, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(footerReveal, {
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
  }, [contentReveal, footerReveal, heroReveal, params.slug]);

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

  const openMap = async () => {
    const query = encodeURIComponent(`${place.title}, ${place.city}, ${place.region}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return;
    }
    Alert.alert('Не вдалося відкрити мапу', 'Спробуй ще раз або перевір підключення до інтернету.');
  };

  const sharePlace = async () => {
    try {
      await Share.share({
        message: `${place.title} (${place.city}) — ${place.excerpt}`,
      });
    } catch {
      Alert.alert('Не вдалося поділитися', 'Спробуй ще раз через кілька секунд.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={revealStyle(heroReveal, 12)}>
          <View style={styles.heroCard}>
            <Image source={resolveImageSource(place.image)} style={styles.heroImage} />
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Feather name="chevron-left" size={24} color="#AAB3BE" />
            </Pressable>
            <Pressable
              style={[styles.saveButton, isSaved(place.slug) && styles.saveButtonActive]}
              onPress={() => toggleSaved(place.slug)}
            >
              <Ionicons name={isSaved(place.slug) ? 'heart' : 'heart-outline'} size={20} color="#FFFFFF" />
            </Pressable>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>{place.city}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={revealStyle(contentReveal, 20)}>
          <View style={styles.metaRow}>
            <Text style={styles.metaRegion}>{place.region}</Text>
            <Text style={styles.metaCategory}>{place.category}</Text>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{place.title}</Text>
            <View style={styles.titleActions}>
              <Pressable onPress={openMap} hitSlop={8}>
                <Text style={styles.mapLink}>На мапі</Text>
              </Pressable>
              <Pressable onPress={sharePlace} hitSlop={8}>
                <Text style={styles.shareLink}>Поділитися</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={15} color="#F6B443" />
            <Text style={styles.ratingText}>
              {place.rating} · {place.category} · {place.duration}
            </Text>
          </View>

          <Text style={styles.description}>{place.description}</Text>

          <View style={styles.tagsRow}>
            {place.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Що включено</Text>
          <View style={styles.facilitiesRow}>
            {place.facilities.map((item) => (
              <View key={item.id} style={styles.facilityCard}>
                <FacilityIcon kind={item.kind} />
                <Text style={styles.facilityText}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.storyBlock}>
            <Text style={styles.storyLabel}>Коротко про маршрут</Text>
            <Text style={styles.storyText}>{place.excerpt}</Text>
          </View>

          {place.gallery?.length ? (
            <View style={styles.galleryBlock}>
              <Text style={styles.galleryLabel}>Ще фото локації</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                {place.gallery.map((image, index) => (
                  <Image
                    key={`${place.slug}-gallery-${index}`}
                    source={resolveImageSource(image)}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.plannerCard}>
            <View style={styles.plannerHeader}>
              <Text style={styles.plannerTitle}>План поїздки</Text>
              <Text style={styles.plannerProgress}>
                {completed}/{total} готово
              </Text>
            </View>

            {!ready ? <Text style={styles.plannerHint}>Завантажуємо твій план...</Text> : null}

            <Text style={styles.fieldLabel}>Дата візиту</Text>
            <TextInput
              value={plan.date}
              onChangeText={(value) => setDate(place.slug, value.slice(0, 10))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={UI.colors.textSoft}
              style={styles.fieldInput}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={10}
            />

            <Text style={styles.fieldLabel}>Нотатка</Text>
            <TextInput
              value={plan.note}
              onChangeText={(value) => setNote(place.slug, value.slice(0, 240))}
              placeholder="Що важливо не забути перед поїздкою?"
              placeholderTextColor={UI.colors.textSoft}
              style={[styles.fieldInput, styles.noteInput]}
              multiline
              textAlignVertical="top"
              maxLength={240}
            />
            <Text style={styles.noteCounter}>{plan.note.length}/240</Text>

            <View style={styles.checklistWrap}>
              {plan.checklist.map((item) => (
                <Pressable
                  key={item.id}
                  style={[styles.checklistItem, item.done && styles.checklistItemDone]}
                  onPress={() => toggleChecklistItem(place.slug, item.id)}
                >
                  <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
                    {item.done ? <Ionicons name="checkmark" size={14} color="#FFFFFF" /> : null}
                  </View>
                  <Text style={[styles.checklistLabel, item.done && styles.checklistLabelDone]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View style={[styles.footer, revealStyle(footerReveal, 22)]}>
        <View>
          <Text style={styles.priceLabel}>Орієнтовний бюджет</Text>
          <Text style={styles.price}>{place.price}</Text>
        </View>
        <Pressable style={styles.bookButton} onPress={() => router.push('/collections')} accessibilityRole="button">
          <Text style={styles.bookButtonText}>Спланувати</Text>
          <Ionicons name="arrow-forward" size={22} color="#ffffff" />
        </Pressable>
      </Animated.View>
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
    paddingTop: 16,
    paddingBottom: 156,
    gap: 18,
  },
  heroCard: {
    borderRadius: UI.radius.xl,
    overflow: 'hidden',
    backgroundColor: '#DBE7F3',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 400,
  },
  backButton: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 58,
    height: 58,
    borderRadius: UI.radius.sm,
    backgroundColor: '#F8FBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 44, 58, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonActive: {
    backgroundColor: 'rgba(46, 116, 246, 0.85)',
  },
  heroTag: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    borderRadius: UI.radius.sm,
    backgroundColor: 'rgba(56, 64, 79, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  heroTagText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metaRegion: {
    color: UI.colors.accent,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metaCategory: {
    color: UI.colors.textSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
  },
  titleActions: {
    alignItems: 'flex-end',
    gap: 6,
  },
  title: {
    flex: 1,
    color: UI.colors.text,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  mapLink: {
    color: UI.colors.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  shareLink: {
    color: UI.colors.textSoft,
    fontSize: 14,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    color: UI.colors.textMuted,
    fontSize: 15,
  },
  description: {
    color: '#43505F',
    fontSize: 16,
    lineHeight: 27,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    borderRadius: 16,
    backgroundColor: UI.colors.accentSoft,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  tagText: {
    color: UI.colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 8,
    color: UI.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  facilityCard: {
    width: '48%',
    minHeight: 108,
    borderRadius: UI.radius.md,
    backgroundColor: UI.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  facilityText: {
    color: UI.colors.textSoft,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  storyBlock: {
    marginTop: 4,
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.card,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: UI.colors.line,
  },
  storyLabel: {
    color: UI.colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  storyText: {
    color: '#445261',
    fontSize: 15,
    lineHeight: 23,
  },
  galleryBlock: {
    marginTop: 8,
    gap: 10,
  },
  galleryLabel: {
    color: UI.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  galleryRow: {
    gap: 12,
    paddingRight: 8,
  },
  galleryImage: {
    width: 240,
    height: 150,
    borderRadius: 20,
  },
  plannerCard: {
    marginTop: 10,
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
    padding: 16,
    gap: 10,
  },
  plannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plannerTitle: {
    color: UI.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  plannerProgress: {
    color: UI.colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  plannerHint: {
    color: UI.colors.textMuted,
    fontSize: 13,
  },
  fieldLabel: {
    marginTop: 6,
    color: UI.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  fieldInput: {
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI.colors.line,
    backgroundColor: UI.colors.surface,
    paddingHorizontal: 12,
    color: UI.colors.text,
    fontSize: 15,
  },
  noteInput: {
    minHeight: 86,
    paddingTop: 10,
    paddingBottom: 10,
  },
  noteCounter: {
    alignSelf: 'flex-end',
    color: UI.colors.textSoft,
    fontSize: 12,
    marginTop: -4,
  },
  checklistWrap: {
    gap: 8,
    marginTop: 2,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI.colors.line,
    backgroundColor: UI.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  checklistItemDone: {
    backgroundColor: UI.colors.accentSoft,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: UI.colors.textSoft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxDone: {
    borderColor: UI.colors.accent,
    backgroundColor: UI.colors.accent,
  },
  checklistLabel: {
    flex: 1,
    color: UI.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  checklistLabelDone: {
    color: UI.colors.accent,
  },
  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: UI.radius.lg,
    backgroundColor: 'rgba(255, 252, 247, 0.97)',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: UI.colors.line,
    ...UI.shadow,
  },
  priceLabel: {
    color: UI.colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  price: {
    marginTop: 6,
    color: UI.colors.success,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  bookButton: {
    height: 68,
    minWidth: 176,
    paddingHorizontal: 26,
    borderRadius: UI.radius.md,
    backgroundColor: UI.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
});
