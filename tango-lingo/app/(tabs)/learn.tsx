import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useDialogueProgress } from '../../stores/useDialogueProgress';
import { useCurriculumStore } from '../../stores/useCurriculumStore';
import { curriculum365, getDayPlan, PHASE_INFO, type DayPlan } from '../../data/curriculum-365';
import { allDialogues } from '../../data/dialogues';
import { useTheme } from '../../utils/useTheme';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const PHASE_COLORS = {
  1: '#9CA3AF',   // A1 회색
  2: '#60A5FA',   // A2 파랑
  3: '#34D399',   // B1 초록
  4: '#F59E0B',   // B1+ 주황
};

export default function LearnCalendar() {
  const router = useRouter();
  const theme = useTheme();
  const { colors, spacing } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const mode = useSettingsStore((s) => s.learningMode);
  const progress = useDialogueProgress((s) => s.langs[mode]);
  const isCompleted = useDialogueProgress((s) => s.isCompleted);
  const getCurrentDay = useCurriculumStore((s) => s.getCurrentDay);
  const currentDay = getCurrentDay(mode);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const selectedPlan = selectedDay ? getDayPlan(selectedDay) : null;

  // Phase별 통계
  const phaseStats = useMemo(() => {
    const stats: Record<number, { total: number; done: number }> = { 1: { total: 0, done: 0 }, 2: { total: 0, done: 0 }, 3: { total: 0, done: 0 }, 4: { total: 0, done: 0 } };
    for (const plan of curriculum365) {
      stats[plan.phase].total += plan.newDialogueIds.length;
      stats[plan.phase].done += plan.newDialogueIds.filter((id) => isCompleted(mode, id)).length;
    }
    return stats;
  }, [mode, progress.completedIds]);

  const totalDone = Object.values(phaseStats).reduce((s, p) => s + p.done, 0);
  const totalTotal = Object.values(phaseStats).reduce((s, p) => s + p.total, 0);
  const totalPct = totalTotal > 0 ? Math.round((totalDone / totalTotal) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>365일 캘린더</Text>
        <Text style={styles.sub}>B1 회화 자유로운 1년 여정</Text>

        {/* 언어 스위처 */}
        <View style={{ marginTop: 8 }}>
          <LanguageSwitcher />
        </View>

        {/* 전체 진도 */}
        <View style={styles.summaryCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>커리큘럼 진도</Text>
            <Text style={styles.summaryValue}>
              {totalDone} / {totalTotal}
              <Text style={styles.summaryPct}>  ({totalPct}%)</Text>
            </Text>
          </View>
          <View style={styles.dayPill}>
            <Text style={styles.dayPillText}>오늘 Day {currentDay}</Text>
          </View>
        </View>
        <View style={styles.totalTrack}>
          <View style={[styles.totalFill, { width: `${totalPct}%` }]} />
        </View>

        {/* Phase 4섹션 */}
        {[1, 2, 3, 4].map((phaseNum) => {
          const info = PHASE_INFO[phaseNum as 1 | 2 | 3 | 4];
          const stat = phaseStats[phaseNum];
          const phasePct = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
          const phaseDays = curriculum365.filter((p) => p.phase === phaseNum);
          const color = PHASE_COLORS[phaseNum as 1 | 2 | 3 | 4];

          return (
            <View key={phaseNum} style={styles.phaseSection}>
              {/* Phase 헤더 */}
              <View style={[styles.phaseHeader, { borderLeftColor: color }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.phaseTitle, { color }]}>{info.label}</Text>
                  <Text style={styles.phaseSub}>{info.range} · {info.goal}</Text>
                </View>
                <Text style={[styles.phaseStat, { color }]}>
                  {stat.done}/{stat.total} ({phasePct}%)
                </Text>
              </View>

              {/* Day 그리드 */}
              <View style={styles.grid}>
                {phaseDays.map((plan) => {
                  const isToday = plan.day === currentDay;
                  const isFuture = plan.day > currentDay;
                  const dayCompleted = plan.newDialogueIds.length > 0
                    && plan.newDialogueIds.every((id) => isCompleted(mode, id));
                  const dayPartial = plan.newDialogueIds.some((id) => isCompleted(mode, id));

                  let bg = colors.surface;
                  let border = colors.border;
                  let textColor = colors.textSecondary;

                  if (plan.isReviewDay) {
                    bg = colors.borderLight;
                    border = colors.border;
                    textColor = colors.textLight;
                  } else if (dayCompleted) {
                    bg = color;
                    textColor = '#fff';
                  } else if (dayPartial) {
                    bg = color + '88';
                    textColor = '#fff';
                  } else if (isFuture) {
                    bg = colors.surface;
                    border = colors.borderLight;
                    textColor = colors.textLight;
                  }

                  return (
                    <Pressable
                      key={plan.day}
                      onPress={() => setSelectedDay(plan.day)}
                      style={[
                        styles.dayBox,
                        {
                          backgroundColor: bg,
                          borderColor: isToday ? colors.primary : border,
                          borderWidth: isToday ? 2 : 1,
                        },
                      ]}
                    >
                      <Text style={[styles.dayNum, { color: textColor }]}>{plan.day}</Text>
                      {plan.isReviewDay && (
                        <Text style={[styles.dayMark, { color: textColor }]}>↻</Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Day 상세 모달 */}
      <Modal
        visible={selectedDay !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDay(null)}
      >
        <Pressable style={styles.modalBg} onPress={() => setSelectedDay(null)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.surface }]} onPress={(e) => e.stopPropagation()}>
            {selectedPlan && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalDay, { color: PHASE_COLORS[selectedPlan.phase] }]}>
                    Day {selectedPlan.day}
                  </Text>
                  <Pressable onPress={() => setSelectedDay(null)} hitSlop={10}>
                    <Ionicons name="close" size={22} color={colors.text} />
                  </Pressable>
                </View>

                <Text style={[styles.modalPhase, { color: colors.textSecondary }]}>
                  {PHASE_INFO[selectedPlan.phase].label}
                </Text>

                <Text style={[styles.modalTheme, { color: colors.text }]}>
                  {selectedPlan.isReviewDay ? '↻' : '📍'} {selectedPlan.themeKo}
                </Text>

                <View style={styles.modalBadges}>
                  <View style={[styles.modalBadge, { backgroundColor: PHASE_COLORS[selectedPlan.phase] + '22' }]}>
                    <Text style={{ color: PHASE_COLORS[selectedPlan.phase], fontSize: 11, fontWeight: '800' }}>
                      {selectedPlan.level}
                    </Text>
                  </View>
                  {selectedPlan.isReviewDay && (
                    <View style={[styles.modalBadge, { backgroundColor: colors.borderLight }]}>
                      <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '800' }}>복습일</Text>
                    </View>
                  )}
                </View>

                {selectedPlan.newDialogueIds.length > 0 && (
                  <View style={{ marginTop: 12, gap: 6 }}>
                    <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>학습 대화</Text>
                    {selectedPlan.newDialogueIds.map((id) => {
                      const d = allDialogues[id];
                      if (!d) return null;
                      const done = isCompleted(mode, id);
                      return (
                        <View
                          key={id}
                          style={[styles.modalDialogue, { borderColor: colors.border, backgroundColor: done ? colors.successLight : 'transparent' }]}
                        >
                          {done && <Ionicons name="checkmark-circle" size={16} color={colors.success} />}
                          <Text style={[styles.modalDialogueText, { color: colors.text }]} numberOfLines={2}>
                            {d.situation}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {selectedPlan.day === currentDay && !selectedPlan.isReviewDay && (
                  <Pressable
                    onPress={() => { setSelectedDay(null); router.push('/(tabs)'); }}
                    style={[styles.goBtn, { backgroundColor: colors.primary }]}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700' }}>오늘 학습으로 →</Text>
                  </Pressable>
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(t: ReturnType<typeof useTheme>) {
  const { colors, spacing, borderRadius, fontSize, fontWeight } = t;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.md, paddingBottom: spacing.xxl },

    title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text },
    sub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },

    summaryCard: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.md,
      borderWidth: 1, borderColor: colors.border, marginTop: spacing.md,
    },
    summaryLabel: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: fontWeight.medium },
    summaryValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary, marginTop: 2 },
    summaryPct: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.medium },
    dayPill: { backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    dayPillText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    totalTrack: { height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: colors.borderLight, marginTop: spacing.sm, marginBottom: spacing.lg },
    totalFill: { height: '100%', backgroundColor: colors.primary },

    phaseSection: { marginBottom: spacing.lg },
    phaseHeader: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
      paddingLeft: 10, marginBottom: spacing.sm,
      borderLeftWidth: 4,
    },
    phaseTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
    phaseSub: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
    phaseStat: { fontSize: 12, fontWeight: '800' },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    dayBox: {
      width: 28, height: 28, borderRadius: 4,
      alignItems: 'center', justifyContent: 'center',
    },
    dayNum: { fontSize: 9, fontWeight: '700' },
    dayMark: { fontSize: 8, marginTop: -2 },

    modalBg: {
      flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center', padding: 20,
    },
    modalCard: { padding: 20, borderRadius: 16, gap: 4 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    modalDay: { fontSize: 28, fontWeight: '900' },
    modalPhase: { fontSize: 12, marginTop: -4 },
    modalTheme: { fontSize: 16, fontWeight: '700', marginTop: 8 },
    modalBadges: { flexDirection: 'row', gap: 6, marginTop: 8 },
    modalBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    modalSubtitle: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
    modalDialogue: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      padding: 10, borderRadius: 8, borderWidth: 1,
    },
    modalDialogueText: { fontSize: 13, flex: 1 },
    goBtn: { padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  });
}
