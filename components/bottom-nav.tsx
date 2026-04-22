import { Href, usePathname, useRouter } from 'expo-router';
import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type MainRoute = '/explore' | '/collections' | '/saved' | '/profile';

const navItems = [
  {
    key: 'explore',
    label: 'Головна',
    route: '/explore' as MainRoute,
    icon: ({ active }: { active: boolean }) => (
      <Ionicons name="home" size={18} color={active ? '#ffffff' : '#aab2bc'} />
    ),
  },
  {
    key: 'collections',
    label: 'Маршрути',
    route: '/collections' as MainRoute,
    icon: ({ active }: { active: boolean }) => (
      <MaterialIcons name="apps" size={19} color={active ? '#ffffff' : '#aab2bc'} />
    ),
  },
  {
    key: 'saved',
    label: 'Збережено',
    route: '/saved' as MainRoute,
    icon: ({ active }: { active: boolean }) => (
      <Ionicons name="heart-outline" size={18} color={active ? '#ffffff' : '#aab2bc'} />
    ),
  },
  {
    key: 'profile',
    label: 'Профіль',
    route: '/profile' as MainRoute,
    icon: ({ active }: { active: boolean }) => (
      <FontAwesome6 name="user" size={15} color={active ? '#ffffff' : '#aab2bc'} />
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
    height: 86,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.97)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#7da8eb',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  item: {
    minWidth: 68,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
  },
  itemActive: {
    backgroundColor: '#2e74f6',
  },
  label: {
    color: '#aab2bc',
    fontSize: 11,
    fontWeight: '600',
  },
  labelActive: {
    color: '#ffffff',
  },
});
