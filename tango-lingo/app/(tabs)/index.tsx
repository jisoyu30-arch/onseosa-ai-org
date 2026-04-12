import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { lessons } from '../../data/lessons';
import { getTodayQuote } from '../../data/dailyQuotes';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { xp, streak, completedLessons, wrongSentences } = useProgressStore();
  const todayQuote = getTodayQuote();

  // 다음 미완료 레슨 찾기
  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id));
  const reviewCount = wrongSentences.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>TangoLingo</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="flame" size={20} color={colors.streakOrange} />
              <Text style={styles.statText}>{streak}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="star" size={20} color={colors.xpGold} />
              <Text style={styles.statText}>{xp}</Text>
            </View>
          </View>
        </View>

        {/* 오늘의 레슨 */}
        {nextLesson && (
          <TouchableOpacity
            style={styles.lessonCard}
            onPress={() => router.push(`/lesson/${nextLesson.id}`)}
            activeOpacity={0.8}
          >
            <View style={styles.lessonBadge}>
              <Text style={styles.lessonBadgeText}>오늘의 레슨</Text>
            </View>
            <Text style={styles.lessonTitle}>{nextLesson.title}</Text>
            <Text style={styles.lessonTitleKo}>{nextLesson.titleKo}</Text>
            <Text style={styles.lessonSituation}>{nextLesson.situation}</Text>
            <View style={styles.startRow}>
              <Text style={styles.startText}>시작하기</Text>
              <Ionicons name="arrow-forward-circle" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* 완료 메시지 (모든 레슨 완료) */}
        {!nextLesson && (
          <View style={[styles.lessonCard, { backgroundColor: colors.success }]}>
            <Text style={styles.lessonBadgeText}>🎉 모든 레슨 완료!</Text>
            <Text style={styles.lessonTitleKo}>복습으로 실력을 다져보세요.</Text>
          </View>
        )}

        {/* 복습 카드 */}
        {reviewCount > 0 && (
          <TouchableOpacity
            style={styles.reviewCard}
            onPress={() => router.push('/(tabs)/review')}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-circle" size={28} color={colors.accent} />
            <View style={styles.reviewText}>
              <Text style={styles.reviewTitle}>복습하기</Text>
              <Text style={styles.reviewCount}>틀린 문장 {reviewCount}개</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}

        {/* AI 질문 */}
        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => router.push('/chat')}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color={colors.secondary} />
          <View style={styles.aiCardText}>
            <Text style={styles.aiCardTitle}>탱고 AI 선생님</Text>
            <Text style={styles.aiCardDesc}>탱고 용어, 문화, 스페인어 질문하기</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        {/* 학습 현황 */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>학습 현황</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBox}>
              <Text style={styles.progressValue}>{completedLessons.length}</Text>
              <Text style={styles.progressLabel}>완료 레슨</Text>
            </View>
            <View style={styles.progressBox}>
              <Text style={styles.progressValue}>{lessons.length - completedLessons.length}</Text>
              <Text style={styles.progressLabel}>남은 레슨</Text>
            </View>
            <View style={styles.progressBox}>
              <Text style={styles.progressValue}>{streak}</Text>
              <Text style={styles.progressLabel}>연속 학습</Text>
            </View>
          </View>
        </View>

        {/* 오늘의 탱고 한 문장 */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>오늘의 탱고 한 문장</Text>
          <Text style={styles.quoteSpanish}>{todayQuote.spanish}</Text>
          <Text style={styles.quoteKorean}>{todayQuote.korean}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  appTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  // 오늘의 레슨 카드
  lessonCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.md,
  },
  lessonBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  lessonBadgeText: {
    color: '#FFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  lessonTitle: {
    color: '#FFF',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: 2,
  },
  lessonTitleKo: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
  },
  lessonSituation: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  startText: {
    color: '#FFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  // 복습 카드
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  reviewText: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  reviewCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  // AI 카드
  aiCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  aiCardText: {
    flex: 1,
  },
  aiCardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  aiCardDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  // 학습 현황
  progressSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.sm,
  },
  progressValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.secondary,
  },
  progressLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  // 오늘의 문장
  quoteCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    ...shadow.sm,
  },
  quoteLabel: {
    fontSize: fontSize.xs,
    color: colors.accent,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  quoteSpanish: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  quoteKorean: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
