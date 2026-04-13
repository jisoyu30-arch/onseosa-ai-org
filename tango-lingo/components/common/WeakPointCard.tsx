import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { sentences } from '../../data/sentences';
import { lessons } from '../../data/lessons';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface WeakCategory {
  tag: string;
  count: number;
  examples: { id: string; spanish: string; korean: string }[];
  relevantLessonId: string | null;
}

/** 틀린 문장을 태그별로 분석하여 상위 3개 약점 카테고리를 보여주는 카드 */
export function WeakPointCard() {
  const router = useRouter();
  const { wrongSentences } = useProgressStore();

  const weakCategories = useMemo((): WeakCategory[] => {
    if (wrongSentences.length === 0) return [];

    // 태그별 카운트 + 예시 수집
    const tagMap: Record<string, { count: number; examples: { id: string; spanish: string; korean: string }[] }> = {};

    wrongSentences.forEach((id) => {
      const s = sentences[id];
      if (!s) return;
      s.tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = { count: 0, examples: [] };
        }
        tagMap[tag].count += 1;
        if (tagMap[tag].examples.length < 2) {
          tagMap[tag].examples.push({ id: s.id, spanish: s.spanish, korean: s.korean });
        }
      });
    });

    // 상위 3개
    return Object.entries(tagMap)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([tag, data]) => {
        // 이 태그와 관련된 레슨 찾기 (첫 번째 예시의 문장이 속한 레슨)
        const exampleId = data.examples[0]?.id;
        let relevantLessonId: string | null = null;
        if (exampleId) {
          const lesson = lessons.find((l) => l.sentenceIds.includes(exampleId));
          if (lesson) relevantLessonId = lesson.id;
        }
        return { tag, count: data.count, examples: data.examples, relevantLessonId };
      });
  }, [wrongSentences]);

  if (weakCategories.length === 0) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="warning" size={20} color={colors.warning} />
        <Text style={styles.title}>약점 분석</Text>
      </View>
      <Text style={styles.subtitle}>자주 틀리는 카테고리예요. 집중 연습해보세요!</Text>

      {weakCategories.map((cat, i) => (
        <View key={cat.tag} style={styles.categoryBlock}>
          <View style={styles.categoryHeader}>
            <Text style={styles.rank}>{i + 1}</Text>
            <Text style={styles.tagName}>{cat.tag}</Text>
            <Text style={styles.countBadge}>{cat.count}개 오답</Text>
          </View>

          {cat.examples.map((ex) => (
            <View key={ex.id} style={styles.exampleRow}>
              <Text style={styles.exampleSpanish}>{ex.spanish}</Text>
              <Text style={styles.exampleKorean}>{ex.korean}</Text>
            </View>
          ))}

          {cat.relevantLessonId && (
            <TouchableOpacity
              style={styles.practiceBtn}
              onPress={() => router.push(`/lesson/${cat.relevantLessonId}`)}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={16} color={colors.primary} />
              <Text style={styles.practiceBtnText}>이 카테고리 집중 연습</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
    ...shadow.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },

  categoryBlock: { marginBottom: spacing.md },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  rank: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.warning, width: 20, textAlign: 'center' },
  tagName: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  countBadge: { fontSize: fontSize.xs, color: colors.error, fontWeight: fontWeight.semibold, backgroundColor: colors.errorLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },

  exampleRow: { paddingLeft: 28, marginBottom: 4 },
  exampleSpanish: { fontSize: fontSize.sm, color: colors.secondary, fontWeight: fontWeight.medium },
  exampleKorean: { fontSize: fontSize.xs, color: colors.textSecondary },

  practiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginLeft: 28,
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.errorLight,
  },
  practiceBtnText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
});
