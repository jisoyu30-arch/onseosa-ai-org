import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { lessons } from '../../data/lessons';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

// 간단한 주간 목표
const WEEKLY_GOALS = {
  lessons: 5,
  xp: 100,
  streak: 7,
};

function BarChart({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(value / max, 1);
  return (
    <View style={styles.barItem}>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { height: `${pct * 100}%`, backgroundColor: color } as any]} />
      </View>
      <Text style={styles.barValue}>{value}</Text>
      <Text style={styles.barLabel}>{label}</Text>
    </View>
  );
}

export default function ReportScreen() {
  const router = useRouter();
  const { completedLessons, xp, streak, wrongSentences, sentenceReviews } = useProgressStore();

  const stats = useMemo(() => {
    // 퀴즈 정확도 계산 (복습 데이터 기반)
    const totalReviews = Object.values(sentenceReviews);
    const totalWrongCount = totalReviews.reduce((sum, r) => sum + r.wrongCount, 0);
    const totalAttempts = totalReviews.length + totalWrongCount;
    const accuracy = totalAttempts > 0
      ? Math.round((totalReviews.length / totalAttempts) * 100)
      : 0;

    return {
      lessonsCompleted: completedLessons.length,
      totalLessons: lessons.length,
      xp,
      streak,
      reviewPending: wrongSentences.length,
      accuracy,
    };
  }, [completedLessons, xp, streak, wrongSentences, sentenceReviews]);

  const lessonGoalPct = Math.min(stats.lessonsCompleted / WEEKLY_GOALS.lessons, 1);
  const xpGoalPct = Math.min(stats.xp / WEEKLY_GOALS.xp, 1);
  const streakGoalPct = Math.min(stats.streak / WEEKLY_GOALS.streak, 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주간 리포트</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 요약 카드 */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>이번 주 학습 요약</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.summaryValue}>{stats.lessonsCompleted}</Text>
              <Text style={styles.summaryLabel}>완료 레슨</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="star" size={24} color={colors.xpGold} />
              <Text style={styles.summaryValue}>{stats.xp}</Text>
              <Text style={styles.summaryLabel}>XP</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="flame" size={24} color={colors.streakOrange} />
              <Text style={styles.summaryValue}>{stats.streak}일</Text>
              <Text style={styles.summaryLabel}>연속 학습</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="analytics" size={24} color={colors.secondary} />
              <Text style={styles.summaryValue}>{stats.accuracy}%</Text>
              <Text style={styles.summaryLabel}>정확도</Text>
            </View>
          </View>
        </View>

        {/* 바 차트 */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>학습 현황</Text>
          <View style={styles.chartRow}>
            <BarChart label="레슨" value={stats.lessonsCompleted} max={stats.totalLessons} color={colors.success} />
            <BarChart label="XP" value={stats.xp} max={500} color={colors.xpGold} />
            <BarChart label="연속" value={stats.streak} max={30} color={colors.streakOrange} />
            <BarChart label="복습대기" value={stats.reviewPending} max={20} color={colors.accent} />
          </View>
        </View>

        {/* 이번 주 목표 */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>이번 주 목표</Text>

          <View style={styles.goalRow}>
            <View style={styles.goalInfo}>
              <Ionicons name="book" size={18} color={colors.primary} />
              <Text style={styles.goalLabel}>레슨 {WEEKLY_GOALS.lessons}개 완료</Text>
            </View>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${lessonGoalPct * 100}%` } as any]} />
            </View>
            <Text style={styles.goalPct}>{Math.round(lessonGoalPct * 100)}%</Text>
          </View>

          <View style={styles.goalRow}>
            <View style={styles.goalInfo}>
              <Ionicons name="star" size={18} color={colors.xpGold} />
              <Text style={styles.goalLabel}>XP {WEEKLY_GOALS.xp} 달성</Text>
            </View>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${xpGoalPct * 100}%`, backgroundColor: colors.xpGold } as any]} />
            </View>
            <Text style={styles.goalPct}>{Math.round(xpGoalPct * 100)}%</Text>
          </View>

          <View style={styles.goalRow}>
            <View style={styles.goalInfo}>
              <Ionicons name="flame" size={18} color={colors.streakOrange} />
              <Text style={styles.goalLabel}>연속 {WEEKLY_GOALS.streak}일</Text>
            </View>
            <View style={styles.goalTrack}>
              <View style={[styles.goalFill, { width: `${streakGoalPct * 100}%`, backgroundColor: colors.streakOrange } as any]} />
            </View>
            <Text style={styles.goalPct}>{Math.round(streakGoalPct * 100)}%</Text>
          </View>
        </View>

        {/* 격려 메시지 */}
        <View style={styles.encourageCard}>
          <Text style={styles.encourageEmoji}>
            {stats.lessonsCompleted >= 5 ? '🎉' : stats.streak >= 3 ? '🔥' : '💪'}
          </Text>
          <Text style={styles.encourageText}>
            {stats.lessonsCompleted >= 5
              ? '이번 주 레슨 목표 달성! 멋져요!'
              : stats.streak >= 3
              ? `${stats.streak}일 연속 학습 중! 계속 가세요!`
              : '꾸준히 하면 실력이 늘어요. 오늘도 화이팅!'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },

  // 요약 카드
  summaryCard: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  summaryTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#FFF', marginBottom: spacing.md },
  summaryGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center', gap: 2 },
  summaryValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: '#FFF' },
  summaryLabel: { fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)' },

  // 바 차트
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  chartTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md },
  chartRow: { flexDirection: 'row', justifyContent: 'space-around', height: 140, alignItems: 'flex-end' },
  barItem: { alignItems: 'center', gap: 4, width: 50 },
  barTrack: {
    width: 24,
    height: 100,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: { width: '100%', borderRadius: borderRadius.sm },
  barValue: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text },
  barLabel: { fontSize: fontSize.xs, color: colors.textSecondary },

  // 목표
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
    ...shadow.sm,
  },
  goalTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  goalInfo: { flexDirection: 'row', alignItems: 'center', gap: 4, width: 130 },
  goalLabel: { fontSize: fontSize.sm, color: colors.text },
  goalTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  goalPct: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.textSecondary, width: 40, textAlign: 'right' },

  // 격려
  encourageCard: {
    backgroundColor: colors.accentLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  encourageEmoji: { fontSize: 36 },
  encourageText: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text, textAlign: 'center' },
});
