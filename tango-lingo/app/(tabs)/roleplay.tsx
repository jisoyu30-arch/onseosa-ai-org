import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/useTheme';
import { roleplays } from '../../data/roleplays';
import LanguageSwitcher from '../../components/LanguageSwitcher';

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

        {/* 언어 스위처 */}
        <LanguageSwitcher />

        {/* AI 모드 — 자유 대화 (큰 빨강) */}
        <Pressable
          onPress={() => router.push('/roleplay/ai')}
          style={[styles.banner, { backgroundColor: colors.primary }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={[styles.iconBubble, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
              <Text style={{ fontSize: 24 }}>🌹</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={styles.modeTag}>
                  <Text style={styles.modeTagText}>🤖 AI MODE</Text>
                </View>
              </View>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800', marginTop: 4 }}>
                Mila와 자유 대화
              </Text>
              <Text style={{ color: '#fff', fontSize: 12, opacity: 0.95, marginTop: 2 }}>
                AI 탱고 베테랑과 실시간 대화 · 무한 시나리오
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </View>
        </Pressable>

        {/* 스크립트 모드 섹션 헤더 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <View style={[styles.scriptTag, { backgroundColor: colors.secondary + '22' }]}>
            <Text style={[styles.scriptTagText, { color: colors.secondary }]}>📖 SCRIPT MODE</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>준비된 시나리오</Text>
        </View>
        <Text style={[styles.sub, { color: colors.textLight, marginTop: -8 }]}>
          정해진 대화 따라가며 연습 (오프라인 가능)
        </Text>

        {Object.values(roleplays).map((rp: any) => (
          <Pressable
            key={rp.id}
            onPress={() => router.push(`/roleplay/${rp.id}`)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{rp.titleKo ?? rp.title}</Text>
                {rp.situation && (
                  <Text style={[styles.cardDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                    {rp.situation}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800' },
  sub: { fontSize: 13, marginTop: 4 },
  banner: { padding: 16, borderRadius: 14 },
  iconBubble: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  modeTag: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  modeTagText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  scriptTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  scriptTagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardDesc: { fontSize: 12, marginTop: 2 },
});
