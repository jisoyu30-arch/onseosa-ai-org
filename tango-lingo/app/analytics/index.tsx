import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { sentences } from '../../data/sentences';
import { levels, units } from '../../data/lessons';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

// --- 간이 파이 차트 (View 기반) ---
function MiniPieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  return (
    <View style={pieStyles.container}>
      {/* 바 형태 차트 */}
      <View style={pieStyles.barRow}>
        {data.map((d) => (
          <View
            key={d.label}
            style={[
              pieStyles.barSegment,
              { flex: d.value, backgroundColor: d.color },
            ]}
          />
        ))}
      </View>
      {/* 범례 */}
      <View style={pieStyles.legend}>
        {data.map((d) => (
          <View key={d.label} style={pieStyles.legendItem}>
            <View style={[pieStyles.dot, { backgroundColor: d.color }]} />
            <Text style={pieStyles.legendText}>
              {d.label} ({d.value})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const pieStyles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  barRow: { flexDirection: 'row', height: 20, borderRadius: borderRadius.sm, overflow: 'hidden', marginBottom: spacing.sm },
  barSegment: { minWidth: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: fontSize.xs, color: colors.textSecondary },
});

// --- 메인 화면 ---
export default function AnalyticsScreen() {
  const { xp, streak, completedLessons, lastStudyDate, sentenceReviews, wrongSentences } = useProgressStore();

  // 총 학습 일수: completedLessons가 있는 날짜 수 추정 (간단히 completedLessons.length / 3으로 추정하거나, streak 사용)
  const totalStudyDays = useMemo(() => {
    // 간단 추정: 최소 streak 또는 completedLessons / 3 (하루 약 3레슨)
    return Math.max(streak, Math.ceil(completedLessons.length / 3), lastStudyDate ? 1 : 0);
  }, [streak, completedLessons, lastStudyDate]);

  const avgXpPerDay = totalStudyDays > 0 ? Math.round(xp / totalStudyDays) : 0;

  // 레벨별 완료 현황
  const levelCompletion = useMemo(() => {
    const levelColors = [colors.primary, colors.secondary, colors.accent, colors.success, colors.streakOrange];
    return levels.map((lv, i) => {
      const levelUnits = units.filter((u) => u.levelId === lv.id);
      const levelLessonIds = levelUnits.flatMap((u) => u.lessonIds);
      const completed = levelLessonIds.filter((id) => completedLessons.includes(id)).length;
      return {
        label: lv.titleKo,
        value: completed,
        total: levelLessonIds.length,
        color: levelColors[i % levelColors.length],
      };
    });
  }, [completedLessons]);

  // 가장 많이 복습한 문장 (wrongCount 기준)
  const topReviewed = useMemo(() => {
    return Object.entries(sentenceReviews)
      .sort(([, a], [, b]) => b.wrongCount - a.wrongCount)
      .slice(0, 5)
      .map(([id, review]) => {
        const s = sentences[id];
        return { id, spanish: s?.spanish ?? id, korean: s?.korean ?? '', wrongCount: review.wrongCount };
      });
  }, [sentenceReviews]);

  // 약점 카테고리 (틀린 문장 태그 분석)
  const weakCategories = useMemo(() => {
    const tagCount: Record<string, number> = {};
    wrongSentences.forEach((id) => {
      const s = sentences[id];
      if (s) {
        s.tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] ?? 0) + 1;
        });
      }
    });
    return Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [wrongSentences]);

  // 최장 스트릭 (현재 스트릭만 추적 가능 — 별도 히스토리 없으므로 현재 값 표시)
  const longestStreak = streak; // 현재 저장소에 최장 기록이 없으므로 현재 값 사용

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>학습 분석</Text>

        {/* 전체 통계 */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{totalStudyDays}</Text>
            <Text style={styles.statLabel}>총 학습일</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color={colors.xpGold} />
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>총 XP</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color={colors.success} />
            <Text style={styles.statValue}>{avgXpPerDay}</Text>
            <Text style={styles.statLabel}>일평균 XP</Text>
          </View>
        </View>

        {/* 스트릭 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>스트릭</Text>
          <View style={styles.streakRow}>
            <View style={styles.streakItem}>
              <Ionicons name="flame" size={28} color={colors.streakOrange} />
              <Text style={styles.streakValue}>{streak}일</Text>
              <Text style={styles.streakLabel}>현재 연속</Text>
            </View>
            <View style={styles.streakItem}>
              <Ionicons name="trophy" size={28} color={colors.xpGold} />
              <Text style={styles.streakValue}>{longestStreak}일</Text>
              <Text style={styles.streakLabel}>최장 기록</Text>
            </View>
          </View>
        </View>

        {/* 레벨별 완료 현황 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>레벨별 진행</Text>
          <MiniPieChart
            data={levelCompletion.map((lc) => ({
              label: lc.label,
              value: lc.value,
              color: lc.color,
            }))}
          />
          {levelCompletion.map((lc) => (
            <View key={lc.label} style={styles.levelRow}>
              <View style={[styles.levelDot, { backgroundColor: lc.color }]} />
              <Text style={styles.levelLabel}>{lc.label}</Text>
              <Text style={styles.levelProgress}>
                {lc.value}/{lc.total}
              </Text>
              <View style={styles.levelBar}>
                <View
                  style={[
                    styles.levelBarFill,
                    {
                      width: lc.total > 0 ? `${(lc.value / lc.total) * 100}%` : '0%',
                      backgroundColor: lc.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* 가장 많이 복습한 문장 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>가장 많이 복습한 문장</Text>
          {topReviewed.length === 0 ? (
            <Text style={styles.emptyText}>아직 복습 기록이 없어요.</Text>
          ) : (
            topReviewed.map((item, i) => (
              <View key={item.id} style={styles.reviewRow}>
                <Text style={styles.reviewRank}>{i + 1}</Text>
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewSpanish}>{item.spanish}</Text>
                  <Text style={styles.reviewKorean}>{item.korean}</Text>
                </View>
                <Text style={styles.reviewCount}>{item.wrongCount}회</Text>
              </View>
            ))
          )}
        </View>

        {/* 약점 카테고리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>약점 카테고리</Text>
          {weakCategories.length === 0 ? (
            <Text style={styles.emptyText}>틀린 문장이 없어요. 잘하고 있어요!</Text>
          ) : (
            weakCategories.map(([tag, count]) => (
              <View key={tag} style={styles.weakRow}>
                <Ionicons name="alert-circle" size={18} color={colors.warning} />
                <Text style={styles.weakTag}>{tag}</Text>
                <Text style={styles.weakCount}>{count}개 오답</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.lg },

  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', ...shadow.sm },
  statValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginTop: spacing.xs },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },

  section: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.sm },

  streakRow: { flexDirection: 'row', justifyContent: 'space-around' },
  streakItem: { alignItems: 'center', gap: 4 },
  streakValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
  streakLabel: { fontSize: fontSize.xs, color: colors.textSecondary },

  levelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  levelDot: { width: 10, height: 10, borderRadius: 5 },
  levelLabel: { fontSize: fontSize.sm, color: colors.text, width: 80 },
  levelProgress: { fontSize: fontSize.xs, color: colors.textSecondary, width: 40, textAlign: 'right' },
  levelBar: { flex: 1, height: 8, backgroundColor: colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  levelBarFill: { height: '100%', borderRadius: 4 },

  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  reviewRank: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.textLight, width: 24, textAlign: 'center' },
  reviewContent: { flex: 1 },
  reviewSpanish: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.text },
  reviewKorean: { fontSize: fontSize.xs, color: colors.textSecondary },
  reviewCount: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.error },

  weakRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  weakTag: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  weakCount: { fontSize: fontSize.sm, color: colors.error },

  emptyText: { fontSize: fontSize.sm, color: colors.textLight, fontStyle: 'italic' },
});
