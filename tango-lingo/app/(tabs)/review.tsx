import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStore } from '../../stores/useProgressStore';
import { sentences } from '../../data/sentences';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

export default function ReviewScreen() {
  const { wrongSentences, removeWrongSentence } = useProgressStore();
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const reviewList = wrongSentences.map((id) => sentences[id]).filter(Boolean);

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>복습</Text>

        {reviewList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
            <Text style={styles.emptyTitle}>복습할 문장이 없어요!</Text>
            <Text style={styles.emptyDesc}>레슨을 진행하면 틀린 문장이 여기에 쌓여요.</Text>
          </View>
        ) : (
          <>
            <Text style={styles.countText}>
              틀린 문장 {reviewList.length}개
            </Text>

            {reviewList.map((sentence) => {
              const revealed = revealedIds.has(sentence.id);
              return (
                <TouchableOpacity
                  key={sentence.id}
                  style={styles.card}
                  onPress={() => toggleReveal(sentence.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.spanish}>{sentence.spanish}</Text>
                  {revealed && (
                    <>
                      <Text style={styles.korean}>{sentence.korean}</Text>
                      <TouchableOpacity
                        style={styles.masteredBtn}
                        onPress={() => removeWrongSentence(sentence.id)}
                      >
                        <Ionicons name="checkmark" size={16} color={colors.success} />
                        <Text style={styles.masteredText}>외웠어요</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {!revealed && (
                    <Text style={styles.tapHint}>탭하여 뜻 보기</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  pageTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  countText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  spanish: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  korean: {
    fontSize: fontSize.md,
    color: colors.secondary,
    marginBottom: spacing.sm,
  },
  tapHint: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  masteredBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.successLight,
  },
  masteredText: {
    fontSize: fontSize.sm,
    color: colors.success,
    fontWeight: fontWeight.semibold,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  emptyDesc: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
