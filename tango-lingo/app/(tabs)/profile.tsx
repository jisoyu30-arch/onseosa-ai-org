import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDialogueProgress } from '../../stores/useDialogueProgress';
import { useGoalStore, LEVEL_LABELS, LEVEL_TARGETS, type CefrLevel } from '../../stores/useGoalStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useCurriculumStore } from '../../stores/useCurriculumStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useTestStore } from '../../stores/useTestStore';
import { useRouter } from 'expo-router';
import { scheduleDailyReminder, cancelAllReminders, requestNotificationPermission } from '../../utils/notifications';
import { useTheme } from '../../utils/useTheme';
import { estimateLevel, LEVEL_CRITERIA_KO } from '../../utils/levelEstimator';
import type { LearningMode } from '../../types';

const LANGS: { code: LearningMode; flag: string; name: string }[] = [
  { code: 'es', flag: '🇪🇸', name: '스페인어' },
  { code: 'en', flag: '🇬🇧', name: '영어' },
  { code: 'zh', flag: '🇨🇳', name: '중국어' },
];

const LEVELS: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

const LEVEL_COLORS: Record<CefrLevel, string> = {
  A1: '#9CA3AF',
  A2: '#60A5FA',
  B1: '#34D399',
  B2: '#F59E0B',
  C1: '#EF4444',
};

export default function Profile() {
  const { colors, spacing } = useTheme();
  const langs = useDialogueProgress((s) => s.langs);
  const resetLang = useDialogueProgress((s) => s.resetLang);
  const resetAll = useDialogueProgress((s) => s.resetAll);
  const goals = useGoalStore((s) => s.goals);
  const setGoal = useGoalStore((s) => s.setGoal);
  const computePace = useGoalStore((s) => s.computePace);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const resetStart = useCurriculumStore((s) => s.resetStart);
  const curLangs = useCurriculumStore((s) => s.langs);
  const currentMode = useSettingsStore((s) => s.learningMode);
  const testLangs = useTestStore((s) => s.langs);
  const router = useRouter();
  const settings = useSettingsStore((s) => ({
    enabled: s.notificationEnabled,
    hour: s.notificationHour,
    minute: s.notificationMinute,
  }));
  const updateSettings = useSettingsStore((s) => s.update);

  const toggleNotification = async () => {
    if (settings.enabled) {
      await cancelAllReminders();
      updateSettings({ notificationEnabled: false });
    } else {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('권한 필요', '알림 권한을 허용해주세요.');
        return;
      }
      await scheduleDailyReminder(settings.hour, settings.minute);
      updateSettings({ notificationEnabled: true });
    }
  };

  const changeTime = async (deltaH: number, deltaM: number) => {
    const newH = (settings.hour + deltaH + 24) % 24;
    const newM = (settings.minute + deltaM + 60) % 60;
    updateSettings({ notificationHour: newH, notificationMinute: newM });
    if (settings.enabled) {
      await scheduleDailyReminder(newH, newM);
    }
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    Alert.alert(title, message, [
      { text: '취소', style: 'cancel' },
      { text: '실행', style: 'destructive', onPress: onConfirm },
    ]);
  };

  const handleRestartCurrentLang = () => {
    confirmAction(
      `${LANGS.find((l) => l.code === currentMode)?.name} 진도 리셋`,
      '학습한 대화·XP·스트릭이 모두 초기화됩니다. 시작일도 오늘로 리셋. 되돌릴 수 없어요.',
      () => {
        resetLang(currentMode);
        resetStart(currentMode);
      },
    );
  };

  const handleResetStartDate = () => {
    confirmAction(
      '시작일을 오늘로',
      '학습 기록은 유지하되 Day 1부터 다시 시작합니다.',
      () => resetStart(currentMode),
    );
  };

  const handleResetAlphabet = () => {
    confirmAction(
      '알파벳 진도 리셋',
      '들은 알파벳 기록이 초기화됩니다.',
      async () => {
        await AsyncStorage.removeItem('@tangolingo_alphabet_heard_v2_es').catch(() => {});
        await AsyncStorage.removeItem('@tangolingo_alphabet_heard_v2_en').catch(() => {});
        await AsyncStorage.removeItem('@tangolingo_alphabet_heard_v2_zh').catch(() => {});
        Alert.alert('완료', '알파벳 진도 리셋됨');
      },
    );
  };

  const handleResetAll = () => {
    confirmAction(
      '⚠️ 모든 데이터 리셋',
      '3개 언어의 모든 진도·스트릭·XP·알파벳·시작일이 초기화됩니다. 절대 되돌릴 수 없어요!',
      async () => {
        resetAll();
        (['es', 'en', 'zh'] as LearningMode[]).forEach((m) => resetStart(m));
        await AsyncStorage.multiRemove([
          '@tangolingo_alphabet_heard_v2_es',
          '@tangolingo_alphabet_heard_v2_en',
          '@tangolingo_alphabet_heard_v2_zh',
        ]).catch(() => {});
        Alert.alert('완료', '모든 데이터 초기화됨');
      },
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        <Text style={[styles.title, { color: colors.text }]}>나의 진도</Text>
        <Text style={[styles.titleSub, { color: colors.textSecondary }]}>
          현재 레벨은 학습량·테스트 결과로 자동 산정됩니다
        </Text>

        {/* 레벨 시험 진입 */}
        <Pressable
          onPress={() => router.push('/test')}
          style={[styles.testCard, { backgroundColor: colors.primary }]}
        >
          <Text style={{ fontSize: 26 }}>📝</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '800' }}>레벨 시험 보기</Text>
            <Text style={{ color: '#fff', fontSize: 12, opacity: 0.95, marginTop: 2 }}>
              5문제 자동 출제 · 결과가 레벨에 반영
            </Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 20 }}>→</Text>
        </Pressable>

        {LANGS.map((l) => {
          const progress = langs[l.code];
          const goal = goals[l.code];
          const pace = computePace(l.code, progress.completedIds.length);
          const target = LEVEL_TARGETS[goal.targetLevel];

          // 자동 레벨 산정 (대화 + 테스트 결과 반영)
          const test = testLangs[l.code];
          const estimate = estimateLevel({
            completedDialogues: progress.completedIds.length,
            testCorrect: test?.totalCorrect ?? 0,
            testWrong: test?.totalWrong ?? 0,
          });
          const currentLevelColor = LEVEL_COLORS[estimate.current];
          const targetLevelColor = LEVEL_COLORS[goal.targetLevel];

          return (
            <View
              key={l.code}
              style={[styles.langCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.langHeader}>
                <Text style={{ fontSize: 26 }}>{l.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.langName, { color: colors.text }]}>{l.name}</Text>
                </View>
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 18 }}>
                  🔥 {progress.streak}
                </Text>
              </View>

              {/* 현재 → 목표 레벨 표시 (자동 산정) */}
              <View style={styles.levelRow}>
                <View style={styles.levelBox}>
                  <Text style={[styles.levelTag, { color: colors.textSecondary }]}>현재 (자동)</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                    <Text style={[styles.levelBig, { color: currentLevelColor }]}>{estimate.current}</Text>
                    <Text style={[styles.levelDesc, { color: colors.textSecondary }]}>
                      · {LEVEL_CRITERIA_KO[estimate.current]}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: colors.textLight, fontSize: 18 }}>→</Text>
                <View style={[styles.levelBox, { alignItems: 'flex-end' }]}>
                  <Text style={[styles.levelTag, { color: colors.textSecondary }]}>목표</Text>
                  <Text style={[styles.levelBig, { color: targetLevelColor }]}>{goal.targetLevel}</Text>
                </View>
              </View>

              {/* 다음 레벨까지 진도바 */}
              {estimate.current !== 'C1' && (
                <>
                  <View style={[styles.track, { backgroundColor: colors.border }]}>
                    <View style={[styles.fill, { width: `${estimate.pctToNext}%`, backgroundColor: currentLevelColor }]} />
                  </View>
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
                    다음 레벨까지 {estimate.pctToNext}% (점수 {estimate.score} / {estimate.nextThreshold})
                  </Text>
                </>
              )}

              {/* 학습 통계 */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: colors.primary }]}>{progress.completedIds.length}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>대화 완료</Text>
                </View>
                <View style={[styles.statSep, { backgroundColor: colors.border }]} />
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: colors.warning }]}>{progress.xp}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP</Text>
                </View>
                <View style={[styles.statSep, { backgroundColor: colors.border }]} />
                <View style={styles.statBox}>
                  <Text style={[styles.statVal, { color: colors.secondary }]}>D-{pace.daysLeft}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{pace.dailyPace}/일</Text>
                </View>
              </View>

              {/* 페이스 뱃지 */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={[styles.pill, { backgroundColor: pace.onTrack ? colors.successLight : colors.errorLight }]}>
                  <Text style={{ color: pace.onTrack ? colors.success : colors.error, fontSize: 10, fontWeight: '800' }}>
                    {pace.onTrack ? '페이스 유지' : '뒤처짐'}
                  </Text>
                </View>
              </View>

              {/* 목표 레벨 변경 */}
              <Text style={[styles.goalSelectLabel, { color: colors.textSecondary }]}>🎯 목표 레벨 선택</Text>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {LEVELS.map((lv) => {
                  const active = goal.targetLevel === lv;
                  return (
                    <Pressable
                      key={lv}
                      onPress={() => setGoal(l.code, { targetLevel: lv })}
                      style={[
                        styles.levelBtn,
                        {
                          backgroundColor: active ? LEVEL_COLORS[lv] : 'transparent',
                          borderColor: active ? LEVEL_COLORS[lv] : colors.border,
                        },
                      ]}
                    >
                      <Text style={{ color: active ? '#fff' : colors.text, fontSize: 11, fontWeight: '700' }}>
                        {lv}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* 알림 설정 */}
        <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>📱 매일 학습 알림</Text>
              <Text style={[styles.dangerSub, { color: colors.textSecondary }]}>
                {settings.enabled
                  ? `매일 ${String(settings.hour).padStart(2, '0')}:${String(settings.minute).padStart(2, '0')}에 알려드려요`
                  : '꺼져있음'}
              </Text>
            </View>
            <Pressable
              onPress={toggleNotification}
              style={[
                styles.toggle,
                { backgroundColor: settings.enabled ? colors.primary : colors.border },
              ]}
            >
              <View style={[
                styles.toggleKnob,
                {
                  alignSelf: settings.enabled ? 'flex-end' : 'flex-start',
                  backgroundColor: '#fff',
                },
              ]} />
            </Pressable>
          </View>

          {settings.enabled && (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>알림 시간</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <View style={styles.timeRow}>
                  <Pressable onPress={() => changeTime(-1, 0)} style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>−</Text>
                  </Pressable>
                  <Text style={[styles.timeText, { color: colors.text }]}>
                    {String(settings.hour).padStart(2, '0')}
                  </Text>
                  <Pressable onPress={() => changeTime(1, 0)} style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>+</Text>
                  </Pressable>
                </View>
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>:</Text>
                <View style={styles.timeRow}>
                  <Pressable onPress={() => changeTime(0, -10)} style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>−</Text>
                  </Pressable>
                  <Text style={[styles.timeText, { color: colors.text }]}>
                    {String(settings.minute).padStart(2, '0')}
                  </Text>
                  <Pressable onPress={() => changeTime(0, 10)} style={[styles.timeBtn, { backgroundColor: colors.background, borderColor: colors.border }]}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>+</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={{ color: colors.textLight, fontSize: 11, marginTop: 6 }}>
                시: ±1, 분: ±10
              </Text>
            </View>
          )}
        </View>

        {/* 설정 */}
        <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>⚙️ 설정</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>테마</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              {(['light', 'dark'] as const).map((m) => {
                const active = themeMode === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setThemeMode(m)}
                    style={[
                      styles.themeBtn,
                      { backgroundColor: active ? colors.primary : 'transparent', borderColor: active ? colors.primary : colors.border },
                    ]}
                  >
                    <Text style={{ color: active ? '#fff' : colors.text, fontWeight: '600' }}>
                      {m === 'light' ? '☀️ 라이트' : '🌙 다크'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* 진도 관리 */}
        <View style={[styles.settingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>🔄 진도 관리</Text>
          <Text style={[styles.dangerSub, { color: colors.textSecondary }]}>
            현재 언어: {LANGS.find((l) => l.code === currentMode)?.flag} {LANGS.find((l) => l.code === currentMode)?.name}
          </Text>

          <Pressable style={[styles.dangerBtn, { borderColor: colors.border }]} onPress={handleResetStartDate}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dangerBtnTitle, { color: colors.text }]}>📅 시작일을 오늘로</Text>
              <Text style={[styles.dangerBtnSub, { color: colors.textSecondary }]}>Day 1부터 다시. 학습 기록은 유지.</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.dangerBtn, { borderColor: colors.warning }]} onPress={handleResetAlphabet}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dangerBtnTitle, { color: colors.warning }]}>🔤 알파벳 진도 리셋</Text>
              <Text style={[styles.dangerBtnSub, { color: colors.textSecondary }]}>들은 알파벳 기록만 초기화</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.dangerBtn, { borderColor: colors.warning }]} onPress={handleRestartCurrentLang}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dangerBtnTitle, { color: colors.warning }]}>
                ↻ {LANGS.find((l) => l.code === currentMode)?.name} 처음부터
              </Text>
              <Text style={[styles.dangerBtnSub, { color: colors.textSecondary }]}>이 언어의 대화·XP·스트릭 + 시작일 리셋</Text>
            </View>
          </Pressable>

          <Pressable style={[styles.dangerBtn, { borderColor: colors.error }]} onPress={handleResetAll}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.dangerBtnTitle, { color: colors.error }]}>⚠️ 모든 데이터 리셋</Text>
              <Text style={[styles.dangerBtnSub, { color: colors.textSecondary }]}>3개 언어 + 알파벳 + 시작일 전부 초기화</Text>
            </View>
          </Pressable>
        </View>

        <Text style={{ color: colors.textLight, fontSize: 11, textAlign: 'center', marginTop: 16 }}>
          TangoLingo · 탱고로 배우는 3개국어
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800' },
  titleSub: { fontSize: 12, marginTop: 2 },

  langCard: { padding: 16, borderRadius: 14, borderWidth: 1, gap: 10 },
  langHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  langName: { fontSize: 16, fontWeight: '700' },

  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  levelBox: { flex: 1, gap: 2 },
  levelTag: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  levelBig: { fontSize: 22, fontWeight: '900' },
  levelDesc: { fontSize: 11 },

  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%' },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: 10, borderRadius: 10,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statSep: { width: 1, height: 28 },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, marginTop: 2 },

  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },

  goalSelectLabel: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  levelBtn: { flex: 1, paddingVertical: 7, borderRadius: 8, borderWidth: 1, alignItems: 'center' },

  settingCard: { padding: 16, borderRadius: 14, borderWidth: 1, marginTop: 4 },
  settingTitle: { fontSize: 15, fontWeight: '700' },
  settingLabel: { fontSize: 12, fontWeight: '700' },
  themeBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  dangerSub: { fontSize: 11, marginTop: 4, marginBottom: 4 },
  testCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12 },
  toggle: { width: 50, height: 28, borderRadius: 14, padding: 2, justifyContent: 'center' },
  toggleKnob: { width: 24, height: 24, borderRadius: 12 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  timeText: { fontSize: 22, fontWeight: '800', minWidth: 36, textAlign: 'center' },
  dangerBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, marginTop: 8 },
  dangerBtnTitle: { fontSize: 14, fontWeight: '700' },
  dangerBtnSub: { fontSize: 11, marginTop: 2 },
});
