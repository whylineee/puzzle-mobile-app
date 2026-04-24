import { Href, usePathname, useRouter } from 'expo-router';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { UI } from '@/constants/ui';

type MainRoute = '/explore' | '/collections' | '/saved' | '/profile';

const navItems = [
  {
    key: 'explore',
    label: 'Головна',
    route: '/explore' as MainRoute,
    icon: ({ active }: { active: boolean }) => (
      <Ionicons name="home" size={18} color={active ? '#ffffff' : UI.colors.textSoft} />
    ),
  },
  {
    key: 'collections',
    label: 'Маршрути',
    route: '/collections' as MainRoute,
    icon: ({ active }: { active: boolean }) => (
      <MaterialIcons name="apps" size={19} color={active ? '#ffffff' : UI.colors.textSoft} />
    ),
  },
  {
    key: 'saved',
    label: 'Збережено',
    route: '/saved' as MainRoute,
    icon: ({ active }: { active: boolean }) => (
      <Ionicons name="heart-outline" size={18} color={active ? '#ffffff' : UI.colors.textSoft} />
    ),
  },
  {
    key: 'profile',
    label: 'Профіль',
    route: '/profile' as MainRoute,
    icon: ({ active }: { active: boolean }) => (
      <FontAwesome6 name="user" size={15} color={active ? '#ffffff' : UI.colors.textSoft} />
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      {navItems.map((item) => {
        const active = pathname === item.route;

        return (
          <Pressable
            key={item.key}
            style={[styles.item, active && styles.itemActive]}
            onPress={() => {
              if (!active) {
                router.replace(item.route as Href);
              }
            }}
          >
            {item.icon({ active })}
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    height: 78,
    borderRadius: UI.radius.lg,
    backgroundColor: 'rgba(255, 252, 247, 0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: UI.colors.line,
    ...UI.shadow,
  },
  item: {
    minWidth: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: UI.radius.sm,
  },
  itemActive: {
    backgroundColor: UI.colors.accent,
  },
  label: {
    color: UI.colors.textSoft,
    fontSize: 11,
    fontWeight: '600',
  },
  labelActive: {
    color: '#ffffff',
  },
});
