import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { lessons } from '../../data/lessons';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

export default function ProfileScreen() {
  const { xp, streak, completedLessons, lastStudyDate, wrongSentences } = useProgressStore();

  const stats = [
    { icon: 'star' as const, label: 'XP', value: xp, color: colors.xpGold },
    { icon: 'flame' as const, label: '연속 학습', value: `${streak}일`, color: colors.streakOrange },
    { icon: 'checkmark-circle' as const, label: '완료 레슨', value: `${completedLessons.length}/${lessons.length}`, color: colors.success },
    { icon: 'refresh' as const, label: '복습 대기', value: wrongSentences.length, color: colors.accent },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>프로필</Text>

        {/* 아바타 영역 */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="musical-notes" size={40} color={colors.primary} />
          </View>
          <Text style={styles.greeting}>탱고 학습자</Text>
          {lastStudyDate && (
            <Text style={styles.lastStudy}>
              마지막 학습: {lastStudyDate}
            </Text>
          )}
        </View>

        {/* 통계 그리드 */}
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statBox}>
              <Ionicons name={stat.icon} size={24} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* 학습 완료 레슨 목록 */}
        {completedLessons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>완료한 레슨</Text>
            {completedLessons.map((lessonId) => {
              const lesson = lessons.find((l) => l.id === lessonId);
              if (!lesson) return null;
              return (
                <View key={lessonId} style={styles.completedRow}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={styles.completedText}>{lesson.titleKo}</Text>
                </View>
              );
            })}
          </View>
        )}
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
    marginBottom: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  lastStudy: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statBox: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadow.sm,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  completedText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
});
