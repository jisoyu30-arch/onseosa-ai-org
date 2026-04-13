import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Platform } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { LearningMode } from '../../types';
import { lessons, units } from '../../data/lessons';
import { badges, Badge } from '../../data/badges';
import { BadgeCard } from '../../components/common/BadgeCard';
import { requestNotificationPermission, scheduleDailyReminder, cancelAllReminders } from '../../utils/notifications';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

function checkBadgeEarned(badge: Badge, completedLessons: string[], xp: number, streak: number): boolean {
  const { type, value, levelId } = badge.condition;
  switch (type) {
    case 'lessons_completed':
      return completedLessons.length >= value;
    case 'xp':
      return xp >= value;
    case 'streak':
      return streak >= value;
    case 'level_complete': {
      if (!levelId) return false;
      const levelUnits = units.filter((u) => u.levelId === levelId);
      const levelLessonIds = levelUnits.flatMap((u) => u.lessonIds);
      return levelLessonIds.every((id) => completedLessons.includes(id));
    }
    default:
      return false;
  }
}

const HOUR_OPTIONS = [7, 8, 9, 10, 11, 12, 18, 19, 20, 21, 22];

export default function ProfileScreen() {
  const router = useRouter();
  const { xp, streak, completedLessons, lastStudyDate, wrongSentences } = useProgressStore();
  const { notificationEnabled, notificationHour, notificationMinute, learningMode, update } = useSettingsStore();
  const { mode: themeMode, toggle: toggleTheme } = useThemeStore();

  const languageOptions: { mode: LearningMode; flag: string; label: string }[] = [
    { mode: 'es', flag: '\uD83C\uDDE6\uD83C\uDDF7', label: '스페인어' },
    { mode: 'en', flag: '\uD83C\uDDFA\uD83C\uDDF8', label: '영어' },
    { mode: 'zh', flag: '\uD83C\uDDE8\uD83C\uDDF3', label: '중국어' },
  ];

  const earnedBadges = useMemo(
    () => badges.map((b) => ({ badge: b, earned: checkBadgeEarned(b, completedLessons, xp, streak) })),
    [completedLessons, xp, streak],
  );
  const earnedCount = earnedBadges.filter((b) => b.earned).length;

  const stats = [
    { icon: 'star' as const, label: 'XP', value: xp, color: colors.xpGold },
    { icon: 'flame' as const, label: '연속 학습', value: `${streak}일`, color: colors.streakOrange },
    { icon: 'checkmark-circle' as const, label: '완료 레슨', value: `${completedLessons.length}/${lessons.length}`, color: colors.success },
    { icon: 'refresh' as const, label: '복습 대기', value: wrongSentences.length, color: colors.accent },
  ];

  const handleToggleNotification = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
      await scheduleDailyReminder(notificationHour, notificationMinute);
    } else {
      await cancelAllReminders();
    }
    update({ notificationEnabled: enabled });
  };

  const handleChangeHour = async (hour: number) => {
    update({ notificationHour: hour });
    if (notificationEnabled) {
      await scheduleDailyReminder(hour, notificationMinute);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>프로필</Text>

        {/* 아바타 */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name="musical-notes" size={40} color={colors.primary} />
          </View>
          <Text style={styles.greeting}>탱고 학습자</Text>
          {lastStudyDate && (
            <Text style={styles.lastStudy}>마지막 학습: {lastStudyDate}</Text>
          )}
        </View>

        {/* 통계 */}
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statBox}>
              <Ionicons name={stat.icon} size={24} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* 주간 리포트 */}
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() => router.push('/report')}
          activeOpacity={0.8}
        >
          <Ionicons name="bar-chart" size={22} color={colors.secondary} />
          <Text style={styles.reportBtnText}>주간 리포트 보기</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
        </TouchableOpacity>

        {/* 학습 분석 */}
        <TouchableOpacity
          style={styles.reportBtn}
          onPress={() => router.push('/analytics')}
          activeOpacity={0.8}
        >
          <Ionicons name="analytics" size={22} color={colors.accent} />
          <Text style={styles.reportBtnText}>학습 분석 보기</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
        </TouchableOpacity>

        {/* 배지 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배지 ({earnedCount}/{badges.length})</Text>
          <View style={styles.badgeGrid}>
            {earnedBadges.map(({ badge, earned }) => (
              <BadgeCard key={badge.id} badge={badge} earned={earned} />
            ))}
          </View>
        </View>

        {/* 다크 모드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>화면 설정</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon" size={22} color={colors.secondary} />
              <Text style={styles.settingLabel}>다크 모드</Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={themeMode === 'dark' ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* 학습 언어 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>학습 언어</Text>
          <View style={styles.langRow}>
            {languageOptions.map((opt) => (
              <TouchableOpacity
                key={opt.mode}
                style={[styles.langChip, learningMode === opt.mode && styles.langChipActive]}
                onPress={() => update({ learningMode: opt.mode })}
                activeOpacity={0.7}
              >
                <Text style={styles.langFlag}>{opt.flag}</Text>
                <Text style={[styles.langLabel, learningMode === opt.mode && styles.langLabelActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>학습 알림</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={22} color={colors.primary} />
              <Text style={styles.settingLabel}>매일 알림</Text>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={handleToggleNotification}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={notificationEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>

          {notificationEnabled && (
            <>
              <Text style={styles.timeLabel}>알림 시간</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                <View style={styles.timeRow}>
                  {HOUR_OPTIONS.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[styles.timeChip, notificationHour === hour && styles.timeChipActive]}
                      onPress={() => handleChangeHour(hour)}
                    >
                      <Text style={[styles.timeText, notificationHour === hour && styles.timeTextActive]}>
                        {hour < 12 ? `오전 ${hour}시` : hour === 12 ? '낮 12시' : `오후 ${hour - 12}시`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <Text style={styles.timeHint}>
                매일 {notificationHour < 12 ? `오전 ${notificationHour}` : notificationHour === 12 ? '낮 12' : `오후 ${notificationHour - 12}`}시에 알림이 울려요
              </Text>
            </>
          )}
        </View>

        {/* 완료 레슨 */}
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
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.lg },

  avatarSection: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.errorLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  greeting: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text },
  lastStudy: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  statBox: { width: '48%' as any, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', ...shadow.sm },
  statValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginTop: spacing.xs },
  statLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },

  section: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.sm },

  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  settingLabel: { fontSize: fontSize.md, color: colors.text, fontWeight: fontWeight.medium },

  timeLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.md, marginBottom: spacing.xs },
  timeScroll: { marginBottom: spacing.xs },
  timeRow: { flexDirection: 'row', gap: spacing.xs },
  timeChip: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm + 2, borderRadius: borderRadius.full, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.background },
  timeChipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  timeText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary },
  timeTextActive: { color: '#FFF' },
  timeHint: { fontSize: fontSize.xs, color: colors.textLight, fontStyle: 'italic', marginTop: spacing.xs },

  reportBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm, ...shadow.sm },
  reportBtnText: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'flex-start' },

  langRow: { flexDirection: 'row', gap: spacing.sm },
  langChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm, borderRadius: borderRadius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.background },
  langChipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  langFlag: { fontSize: fontSize.lg },
  langLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.textSecondary },
  langLabelActive: { color: '#FFF' },

  completedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  completedText: { fontSize: fontSize.md, color: colors.text },
});
