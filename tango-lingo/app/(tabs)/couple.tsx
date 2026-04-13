import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { roleplays } from '../../data/roleplays';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

export default function CoupleScreen() {
  const router = useRouter();
  const roleplayList = Object.values(roleplays);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>커플 모드</Text>
        <Text style={styles.subtitle}>파트너와 번갈아 역할극을 해보세요</Text>

        {/* 커플 챌린지 */}
        <TouchableOpacity
          style={styles.challengeCard}
          onPress={() => router.push('/challenge')}
          activeOpacity={0.8}
        >
          <View style={styles.challengeIcon}>
            <Ionicons name="trophy" size={28} color={colors.xpGold} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>커플 챌린지</Text>
            <Text style={styles.cardSituation}>같은 5문제를 풀고 점수를 비교해보세요!</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        {/* 역할극 목록 */}
        {roleplayList.map((rp) => (
          <TouchableOpacity
            key={rp.id}
            style={styles.card}
            onPress={() => router.push(`/roleplay/${rp.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="people" size={28} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{rp.titleKo}</Text>
              <Text style={styles.cardSituation}>{rp.situation}</Text>
              <Text style={styles.cardLines}>{rp.lines.length}개 대사</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        ))}

        {roleplayList.length === 0 && (
          <View style={styles.emptyBox}>
            <Ionicons name="heart" size={48} color={colors.primaryLight} />
            <Text style={styles.emptyText}>역할극이 준비 중이에요</Text>
          </View>
        )}

        {/* 안내 */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.secondaryLight} />
          <Text style={styles.infoText}>
            한 사람이 Profesor(A), 다른 사람이 Alumno(B) 역할을 맡아{'\n'}
            번갈아 대사를 읽어보세요.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  pageTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.xpGold,
    ...shadow.md,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  cardSituation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  cardLines: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadow.sm,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
