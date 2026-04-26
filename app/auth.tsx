import { useMemo, useState } from 'react';
import { Href, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { UI } from '@/constants/ui';
import { useAuth } from '@/hooks/use-auth';

export default function AuthScreen() {
  const router = useRouter();
  const { isAuthenticated, login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const disabled = useMemo(() => {
    if (mode === 'signup') {
      return !name.trim() || !email.trim() || !password.trim();
    }
    return !email.trim() || !password.trim();
  }, [email, mode, name, password]);

  const handleSubmit = () => {
    const result = mode === 'login' ? login(email, password) : signup(name, email, password);
    setMessage(result.ok ? 'Успішно! Тепер можна продовжити подорож.' : result.error ?? 'Щось пішло не так.');
    if (result.ok) {
      router.replace('/explore' as Href);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Auth</Text>
        <Text style={styles.title}>Увійди, щоб синхронізувати прогрес</Text>
        <Text style={styles.subtitle}>Локальний MVP: авторизація працює в межах додатку без серверу.</Text>

        {isAuthenticated ? (
          <View style={styles.card}>
            <Text style={styles.successText}>Ти вже в акаунті.</Text>
            <Pressable style={styles.primaryButton} onPress={() => router.replace('/explore' as Href)}>
              <Text style={styles.primaryButtonText}>На головну</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.modeSwitch}>
              <Pressable style={[styles.modeButton, mode === 'login' && styles.modeButtonActive]} onPress={() => setMode('login')}>
                <Text style={[styles.modeText, mode === 'login' && styles.modeTextActive]}>Вхід</Text>
              </Pressable>
              <Pressable style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]} onPress={() => setMode('signup')}>
                <Text style={[styles.modeText, mode === 'signup' && styles.modeTextActive]}>Реєстрація</Text>
              </Pressable>
            </View>

            {mode === 'signup' ? (
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Імʼя</Text>
                <TextInput value={name} onChangeText={setName} placeholder="Марія" placeholderTextColor={UI.colors.textSoft} style={styles.input} />
              </View>
            ) : null}

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput value={email} onChangeText={setEmail} placeholder="name@mail.com" autoCapitalize="none" keyboardType="email-address" placeholderTextColor={UI.colors.textSoft} style={styles.input} />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Пароль</Text>
              <TextInput value={password} onChangeText={setPassword} placeholder="мінімум 6 символів" secureTextEntry placeholderTextColor={UI.colors.textSoft} style={styles.input} />
            </View>

            <Pressable style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]} disabled={disabled} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>{mode === 'login' ? 'Увійти' : 'Створити акаунт'}</Text>
            </Pressable>

            {message ? <Text style={styles.message}>{message}</Text> : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  modeSwitch: {
    flexDirection: 'row',
    backgroundColor: UI.colors.cardSoft,
    borderRadius: UI.radius.sm,
    padding: 4,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  modeButtonActive: { backgroundColor: UI.colors.accentSoft },
  modeText: { color: UI.colors.textMuted, fontSize: 14, fontWeight: '700' },
  modeTextActive: { color: UI.colors.accent },
  fieldWrap: { gap: 6 },
  fieldLabel: { color: UI.colors.text, fontSize: 13, fontWeight: '700' },
  input: {
    height: 52,
    borderRadius: 16,
    backgroundColor: UI.colors.surface,
    borderWidth: 1,
    borderColor: UI.colors.line,
    paddingHorizontal: 14,
    color: UI.colors.text,
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 4,
    height: 52,
    borderRadius: UI.radius.sm,
    backgroundColor: UI.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: UI.colors.card, fontSize: 16, fontWeight: '800' },
  message: { color: UI.colors.textMuted, fontSize: 14, lineHeight: 20 },
  successText: { color: UI.colors.success, fontSize: 15, fontWeight: '700' },
});
