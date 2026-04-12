import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scenarios } from '../../services/conversation';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

export default function PracticeListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대화 연습</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>상황을 골라서 AI와 스페인어로 대화해보세요</Text>

        {scenarios.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.card}
            onPress={() => router.push(`/practice/${s.id}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardEmoji}>{s.emoji}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{s.titleKo}</Text>
              <Text style={styles.cardTitleEs}>{s.title}</Text>
              <Text style={styles.cardDesc}>{s.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.lg, textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm, ...shadow.sm },
  cardEmoji: { fontSize: 32, width: 48, textAlign: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  cardTitleEs: { fontSize: fontSize.sm, color: colors.primary, fontStyle: 'italic' },
  cardDesc: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2, lineHeight: 16 },
});
