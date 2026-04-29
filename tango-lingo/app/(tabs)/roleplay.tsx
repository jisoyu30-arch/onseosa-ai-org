import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../utils/useTheme';
import { roleplays } from '../../data/roleplays';

export default function RoleplayTab() {
  const router = useRouter();
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>롤플레이</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            밀롱가 실전 상황을 연기해보세요
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/roleplay/ai')}
          style={[styles.banner, { backgroundColor: colors.primary }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 28 }}>🌹</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>
                Mila와 자유 대화
              </Text>
              <Text style={{ color: '#fff', fontSize: 12, opacity: 0.95, marginTop: 2 }}>
                AI 탱고 베테랑과 실시간 대화 연습
              </Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 20 }}>→</Text>
          </View>
        </Pressable>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>연습 가능한 시나리오</Text>

        {Object.values(roleplays).map((rp: any) => (
          <Pressable
            key={rp.id}
            onPress={() => router.push(`/roleplay/${rp.id}`)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>{rp.titleKo ?? rp.title}</Text>
            {rp.situation && (
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{rp.situation}</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 4 },
  banner: { padding: 14, borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardDesc: { fontSize: 13 },
});
