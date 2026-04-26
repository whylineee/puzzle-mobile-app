import { Href, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { UI } from '@/constants/ui';
import { useAuth } from '@/hooks/use-auth';
import { usePreferences } from '@/hooks/use-preferences';

export default function SettingsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { preferences, setDarkMode, setHintsEnabled, setLanguage, setPushEnabled } = usePreferences();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Settings</Text>
        <Text style={styles.title}>Налаштуй додаток під свій ритм</Text>
        <Text style={styles.subtitle}>Зберігаємо останні вибори локально, щоб усе було під рукою при наступному запуску.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Зручність</Text>
          <SettingRow label="Темна тема (preview)" value={preferences.darkMode} onValueChange={setDarkMode} />
          <SettingRow label="Push-нагадування" value={preferences.pushEnabled} onValueChange={setPushEnabled} />
          <SettingRow label="Показувати підказки" value={preferences.hintsEnabled} onValueChange={setHintsEnabled} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Мова</Text>
          <View style={styles.languageWrap}>
            <Pressable style={[styles.languageChip, preferences.language === 'uk' && styles.languageChipActive]} onPress={() => setLanguage('uk')}>
              <Text style={[styles.languageText, preferences.language === 'uk' && styles.languageTextActive]}>Українська</Text>
            </Pressable>
            <Pressable style={[styles.languageChip, preferences.language === 'en' && styles.languageChipActive]} onPress={() => setLanguage('en')}>
              <Text style={[styles.languageText, preferences.language === 'en' && styles.languageTextActive]}>English</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.hintCard}>
          <Text style={styles.hintTitle}>UX підказка</Text>
          <Text style={styles.hintBody}>Коли вмикаєш підказки, на нових екранах з’являються короткі пояснення ключових дій.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/shop' as Href)}>
            <Text style={styles.secondaryButtonText}>Відкрити Shop</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push((isAuthenticated ? '/profile' : '/auth') as Href)}>
            <Text style={styles.secondaryButtonText}>{isAuthenticated ? 'Повернутись у профіль' : 'Увійти в акаунт'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: UI.colors.surfaceMuted, true: UI.colors.accentSoft }} thumbColor={value ? UI.colors.accent : UI.colors.card} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: UI.colors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40, gap: 14 },
  label: { color: UI.colors.accent, fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: UI.colors.text, fontSize: 34, lineHeight: 38, fontWeight: '800', maxWidth: 330 },
  subtitle: { color: UI.colors.textMuted, fontSize: 15, lineHeight: 22, maxWidth: 330 },
  card: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
    padding: 18,
    gap: 12,
  },
  cardTitle: { color: UI.colors.text, fontSize: 18, fontWeight: '800' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: UI.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowLabel: { color: UI.colors.text, fontSize: 14, fontWeight: '600', maxWidth: '72%' },
  languageWrap: { flexDirection: 'row', gap: 10 },
  languageChip: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI.colors.line,
    backgroundColor: UI.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  languageChipActive: { backgroundColor: UI.colors.accentSoft, borderColor: UI.colors.accentSoft },
  languageText: { color: UI.colors.textMuted, fontSize: 14, fontWeight: '700' },
  languageTextActive: { color: UI.colors.accent },
  hintCard: {
    borderRadius: UI.radius.lg,
    backgroundColor: UI.colors.accentSoft,
    padding: 16,
    gap: 6,
  },
  hintTitle: { color: UI.colors.accent, fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  hintBody: { color: UI.colors.text, fontSize: 14, lineHeight: 21 },
  actions: { gap: 10 },
  secondaryButton: {
    borderRadius: UI.radius.sm,
    backgroundColor: UI.colors.card,
    borderWidth: 1,
    borderColor: UI.colors.line,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: { color: UI.colors.text, fontSize: 15, fontWeight: '700' },
});
