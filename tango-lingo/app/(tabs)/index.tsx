import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useDialogueProgress } from '../../stores/useDialogueProgress';
import { useGoalStore } from '../../stores/useGoalStore';
import { useCurriculumStore } from '../../stores/useCurriculumStore';
import { useTheme } from '../../utils/useTheme';
import { allDialogues } from '../../data/dialogues';
import { getDayPlan, curriculum365 as curriculum100, PHASE_INFO } from '../../data/curriculum-365';
import { enrichDialogueLines } from '../../utils/dialogueHelper';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import DialogueCard from '../../components/DialogueCard';
import PosLegend from '../../components/PosLegend';
import IntroCard from '../../components/IntroCard';

export default function TodayHome() {
  const { colors, spacing } = useTheme();
  const mode = useSettingsStore((s) => s.learningMode);
  const lang = useDialogueProgress((s) => s.langs[mode]);
  const completeDialogue = useDialogueProgress((s) => s.completeDialogue);
  const isCompleted = useDialogueProgress((s) => s.isCompleted);
  const goal = useGoalStore((s) => s.goals[mode]);
  const getCurrentDay = useCurriculumStore((s) => s.getCurrentDay);

  const currentDay = getCurrentDay(mode);
  const dayPlan = getDayPlan(currentDay);

  // 오늘의 신규 + 누적된 미완료 (최대 3개) — 학습할 거리
  const todayItems = useMemo(() => {
    const items: { dialogueId: string; isNew: boolean; planDay: number }[] = [];

    // 1) 오늘 day 신규
    if (dayPlan) {
      for (const id of dayPlan.newDialogueIds) {
        if (!isCompleted(mode, id)) {
          items.push({ dialogueId: id, isNew: true, planDay: currentDay });
        }
      }
    }

    // 2) 이전 day의 미완료 (backlog) — 최대 3개까지 채움
    if (items.length < 3) {
      for (let d = 1; d < currentDay && items.length < 3; d++) {
        const plan = getDayPlan(d);
        if (!plan) continue;
        for (const id of plan.newDialogueIds) {
          if (!isCompleted(mode, id) && items.length < 3) {
            items.push({ dialogueId: id, isNew: false, planDay: d });
          }
        }
      }
    }

    return items;
  }, [mode, currentDay, lang.completedIds, isCompleted]);

  const enriched = useMemo(
    () =>
      todayItems
        .map((item) => {
          const dialogue = allDialogues[item.dialogueId];
          if (!dialogue) return null;
          return { ...item, dialogue, lines: enrichDialogueLines(dialogue) };
        })
        .filter(Boolean) as Array<{ dialogueId: string; isNew: boolean; planDay: number; dialogue: any; lines: any[] }>,
    [todayItems],
  );

  const totalCurriculumDialogues = useMemo(
    () => curriculum100.reduce((sum, p) => sum + p.newDialogueIds.length, 0),
    [],
  );
  const completedFromCurriculum = useMemo(() => {
    const allCurriculumIds = new Set(curriculum100.flatMap((p) => p.newDialogueIds));
    return lang.completedIds.filter((id) => allCurriculumIds.has(id)).length;
  }, [lang.completedIds]);

  const dayDoneAll = todayItems.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <View>
          <Text style={[styles.hello, { color: colors.textSecondary }]}>오늘의 탱고</Text>
          <Text style={[styles.title, { color: colors.text }]}>TangoLingo</Text>
        </View>

        {/* Day 카드 */}
        <View style={[styles.dayCard, { backgroundColor: colors.primary }]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
            <Text style={styles.dayBig}>Day {currentDay}</Text>
            <Text style={styles.dayTotal}>/ 365</Text>
          </View>
          {dayPlan && (
            <>
              <Text style={styles.dayPhase}>
                {PHASE_INFO[dayPlan.phase].label} · {PHASE_INFO[dayPlan.phase].goal}
              </Text>
              <Text style={styles.dayTheme}>
                {dayPlan.isReviewDay ? '↻' : '📍'} {dayPlan.themeKo}
              </Text>
              <View style={styles.dayPills}>
                <View style={styles.dayPill}>
                  <Text style={styles.dayPillText}>{dayPlan.level}</Text>
                </View>
                <View style={styles.dayPill}>
                  <Text style={styles.dayPillText}>🔥 {lang.streak}일</Text>
                </View>
                <View style={styles.dayPill}>
                  <Text style={styles.dayPillText}>⭐ {lang.xp} XP</Text>
                </View>
              </View>
            </>
          )}
          <View style={styles.dayProgressBar}>
            <View
              style={[
                styles.dayProgressFill,
                { width: `${Math.min(100, (completedFromCurriculum / totalCurriculumDialogues) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.dayProgressText}>
            {completedFromCurriculum} / {totalCurriculumDialogues} 대화 학습
          </Text>
        </View>

        {/* 언어 스위처 */}
        <LanguageSwitcher />

        {/* Day 1 — 오리엔테이션 */}
        {currentDay === 1 && <IntroCard />}

        {/* 품사 범례 (대화 학습용) */}
        {currentDay !== 1 && <PosLegend />}

        {/* 오늘의 학습 거리 */}
        {!dayDoneAll && (
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {currentDay === 1 ? '🎯 첫 대화' : `오늘의 학습 (${todayItems.length}개)`}
          </Text>
        )}

        {enriched.map((item) => (
          <View
            key={item.dialogueId}
            style={[styles.setCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {item.isNew ? (
                <View style={[styles.tag, { backgroundColor: colors.success + '22' }]}>
                  <Text style={{ color: colors.success, fontSize: 10, fontWeight: '800' }}>✨ 신규</Text>
                </View>
              ) : (
                <View style={[styles.tag, { backgroundColor: colors.warning + '22' }]}>
                  <Text style={{ color: colors.warning, fontSize: 10, fontWeight: '800' }}>↩ Day {item.planDay}</Text>
                </View>
              )}
              <Text style={[styles.setSituation, { color: colors.textSecondary }]}>
                💬 {item.dialogue.situation}
              </Text>
            </View>
            <View style={{ gap: 4, marginTop: 8 }}>
              {item.lines.map((line: any, i: number) => (
                <DialogueCard key={i} line={line} />
              ))}
            </View>
            <Pressable
              onPress={() => completeDialogue(mode, item.dialogueId, 10)}
              style={[styles.doneBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>학습 완료 · +10 XP</Text>
            </Pressable>
          </View>
        ))}

        {dayDoneAll && (
          <View style={[styles.doneBanner, { backgroundColor: colors.successLight }]}>
            <Text style={{ fontSize: 32 }}>🎉</Text>
            <Text style={{ color: colors.success, fontSize: 16, fontWeight: '800' }}>
              Day {currentDay} 완료!
            </Text>
            <Text style={{ color: colors.text, fontSize: 13, textAlign: 'center', marginTop: 4 }}>
              내일 Day {Math.min(currentDay + 1, 100)}에 만나요
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hello: { fontSize: 14 },
  title: { fontSize: 28, fontWeight: '800', marginTop: 2 },

  dayCard: { padding: 18, borderRadius: 16, gap: 8 },
  dayBig: { color: '#fff', fontSize: 36, fontWeight: '900', lineHeight: 40 },
  dayTotal: { color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.8, paddingBottom: 4 },
  dayPhase: { color: '#fff', fontSize: 12, opacity: 0.85, fontWeight: '600' },
  dayTheme: { color: '#fff', fontSize: 15, fontWeight: '700' },
  dayPills: { flexDirection: 'row', gap: 6, marginTop: 4 },
  dayPill: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  dayPillText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  dayProgressBar: { height: 5, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden', marginTop: 8 },
  dayProgressFill: { height: '100%', backgroundColor: '#fff' },
  dayProgressText: { color: '#fff', fontSize: 11, opacity: 0.9, marginTop: 4 },

  sectionTitle: { fontSize: 16, fontWeight: '700' },
  setCard: { padding: 14, borderRadius: 14, borderWidth: 1 },
  setSituation: { fontSize: 12, fontWeight: '700' },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  doneBtn: { marginTop: 10, padding: 12, borderRadius: 10, alignItems: 'center' },
  doneBanner: { padding: 22, borderRadius: 14, alignItems: 'center', gap: 6 },
});
