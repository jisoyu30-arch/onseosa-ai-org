import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { lessons, levels, units } from '../../data/lessons';
import { sentences } from '../../data/sentences';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface WordEntry {
  spanish: string;
  korean: string;
  example: string;
  exampleKo: string;
  levelId: string;
}

// 스페인어 불용어 (관사, 전치사, 접속사 등)
const STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por',
  'para', 'al', 'es', 'no', 'me', 'te', 'se', 'lo', 'le', 'ya', 'si',
  'yo', 'mi', 'tu', 'su', 'nos', 'que', 'qué', 'más', 'muy', 'sin',
  'hay', 'sí', 'eso', 'ese', 'esa', 'esto', 'esta', 'este', 'como',
]);

function extractWords(completedLessonIds: string[]): WordEntry[] {
  const wordMap = new Map<string, WordEntry>();

  for (const lessonId of completedLessonIds) {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) continue;

    // 레슨이 속한 레벨 찾기
    const unit = units.find((u) => u.id === lesson.unitId);
    const levelId = unit?.levelId ?? 'lv1';

    for (const sentenceId of lesson.sentenceIds) {
      const sentence = sentences[sentenceId];
      if (!sentence) continue;

      // 스페인어 문장에서 단어 추출
      const words = sentence.spanish
        .replace(/[¿?¡!.,;:'"()—\-]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .map((w) => w.toLowerCase());

      for (const word of words) {
        if (STOP_WORDS.has(word)) continue;
        if (wordMap.has(word)) continue;

        wordMap.set(word, {
          spanish: word,
          korean: '', // 단어 단위 번역은 없으므로 문장에서 유추
          example: sentence.spanish,
          exampleKo: sentence.korean,
          levelId,
        });
      }
    }
  }

  return Array.from(wordMap.values());
}

export default function VocabularyScreen() {
  const router = useRouter();
  const { completedLessons } = useProgressStore();
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const allWords = useMemo(() => extractWords(completedLessons), [completedLessons]);

  const wordsByLevel = useMemo(() => {
    const grouped: Record<string, WordEntry[]> = {};
    for (const word of allWords) {
      if (!grouped[word.levelId]) grouped[word.levelId] = [];
      grouped[word.levelId].push(word);
    }
    return grouped;
  }, [allWords]);

  const displayWords = selectedLevel ? (wordsByLevel[selectedLevel] ?? []) : allWords;

  const toggleFlip = (word: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>단어장</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 레벨 필터 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterChip, !selectedLevel && styles.filterChipActive]}
              onPress={() => setSelectedLevel(null)}
            >
              <Text style={[styles.filterText, !selectedLevel && styles.filterTextActive]}>
                전체 ({allWords.length})
              </Text>
            </TouchableOpacity>
            {levels.map((level) => {
              const count = wordsByLevel[level.id]?.length ?? 0;
              if (count === 0) return null;
              return (
                <TouchableOpacity
                  key={level.id}
                  style={[styles.filterChip, selectedLevel === level.id && styles.filterChipActive]}
                  onPress={() => setSelectedLevel(level.id)}
                >
                  <Text style={[styles.filterText, selectedLevel === level.id && styles.filterTextActive]}>
                    {level.titleKo} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* 단어 카드 */}
        {completedLessons.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>아직 학습한 레슨이 없어요</Text>
            <Text style={styles.emptyDesc}>레슨을 완료하면 단어가 여기에 추가됩니다</Text>
          </View>
        ) : displayWords.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📖</Text>
            <Text style={styles.emptyTitle}>이 레벨에 단어가 없어요</Text>
          </View>
        ) : (
          <View style={styles.cardGrid}>
            {displayWords.map((word) => {
              const isFlipped = flippedCards.has(word.spanish);
              return (
                <TouchableOpacity
                  key={word.spanish}
                  style={[styles.wordCard, isFlipped && styles.wordCardFlipped]}
                  onPress={() => toggleFlip(word.spanish)}
                  activeOpacity={0.8}
                >
                  {isFlipped ? (
                    <>
                      <Text style={styles.wordExampleLabel}>예문</Text>
                      <Text style={styles.wordExample}>{word.example}</Text>
                      <Text style={styles.wordExampleKo}>{word.exampleKo}</Text>
                      <Text style={styles.flipHint}>탭하여 돌아가기</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.wordSpanish}>{word.spanish}</Text>
                      <Text style={styles.flipHint}>탭하여 예문 보기</Text>
                    </>
                  )}
                </TouchableOpacity>
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

  filterScroll: { marginBottom: spacing.md },
  filterRow: { flexDirection: 'row', gap: spacing.xs },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  filterChipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  filterText: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.textSecondary },
  filterTextActive: { color: '#FFF' },

  cardGrid: { gap: spacing.sm },
  wordCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    ...shadow.sm,
  },
  wordCardFlipped: {
    backgroundColor: colors.secondaryLight,
  },
  wordSpanish: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  wordExampleLabel: {
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  wordExample: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  wordExampleKo: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  flipHint: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: spacing.sm,
  },

  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  emptyDesc: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center' },
});
