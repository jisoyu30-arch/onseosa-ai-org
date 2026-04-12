import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { sentences } from '../../data/sentences';
import { getTomorrowCount } from '../../utils/spaced-repetition';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

export default function ReviewScreen() {
  const { sentenceReviews, getDueReviewIds, reviewCorrect, reviewWrong } = useProgressStore();
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const dueIds = useMemo(() => getDueReviewIds(), [sentenceReviews]);
  const reviewList = dueIds.map((id) => sentences[id]).filter(Boolean);
  const tomorrowCount = useMemo(() => getTomorrowCount(sentenceReviews), [sentenceReviews]);
  const totalTracked = Object.keys(sentenceReviews).length;

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleCorrect = (id: string) => {
    reviewCorrect(id);
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleWrong = (id: string) => {
    reviewWrong(id);
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>복습</Text>

        {/* 통계 */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{reviewList.length}</Text>
            <Text style={styles.statLabel}>오늘 복습</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{tomorrowCount}</Text>
            <Text style={styles.statLabel}>내일 예정</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalTracked}</Text>
            <Text style={styles.statLabel}>전체 추적</Text>
          </View>
        </View>

        {reviewList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text style={styles.emptyTitle}>오늘 복습 완료!</Text>
            <Text style={styles.emptyDesc}>
              {totalTracked === 0
                ? '레슨을 진행하면 틀린 문장이 여기에 쌓여요.'
                : `${tomorrowCount}개 문장이 내일 복습 예정이에요.`}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.countText}>
              오늘 복습할 문장 {reviewList.length}개
            </Text>

            {reviewList.map((sentence) => {
              const revealed = revealedIds.has(sentence.id);
              const review = sentenceReviews[sentence.id];
              return (
                <TouchableOpacity
                  key={sentence.id}
                  style={styles.card}
                  onPress={() => toggleReveal(sentence.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.spanish}>{sentence.spanish}</Text>

                  {!revealed && (
                    <Text style={styles.tapHint}>탭하여 뜻 보기</Text>
                  )}

                  {revealed && (
                    <>
                      <Text style={styles.korean}>{sentence.korean}</Text>
                      {review && review.wrongCount > 0 && (
                        <Text style={styles.wrongInfo}>
                          틀린 횟수: {review.wrongCount} · 간격: {review.interval}일
                        </Text>
                      )}
                      <View style={styles.actionRow}>
                        <TouchableOpacity
                          style={styles.wrongBtn}
                          onPress={() => handleWrong(sentence.id)}
                        >
                          <Ionicons name="close" size={18} color={colors.error} />
                          <Text style={styles.wrongBtnText}>다시 볼래</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.correctBtn}
                          onPress={() => handleCorrect(sentence.id)}
                        >
                          <Ionicons name="checkmark" size={18} color={colors.success} />
                          <Text style={styles.correctBtnText}>외웠어요</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statBox: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', ...shadow.sm },
  statValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.secondary },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  countText: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.lg, marginBottom: spacing.sm, ...shadow.sm },
  spanish: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  korean: { fontSize: fontSize.md, color: colors.secondary, marginBottom: spacing.sm },
  tapHint: { fontSize: fontSize.sm, color: colors.textLight, fontStyle: 'italic' },
  wrongInfo: { fontSize: fontSize.xs, color: colors.textLight, marginBottom: spacing.sm },
  actionRow: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
  wrongBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.errorLight },
  wrongBtnText: { fontSize: fontSize.sm, color: colors.error, fontWeight: fontWeight.semibold },
  correctBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.successLight },
  correctBtnText: { fontSize: fontSize.sm, color: colors.success, fontWeight: fontWeight.semibold },
  emptyBox: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  emptyDesc: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' },
});
