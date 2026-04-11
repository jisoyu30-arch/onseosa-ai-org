import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Sentence } from '../../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface SentenceCardProps {
  sentence: Sentence;
  onNext: () => void;
  showEnglish?: boolean;
  showChinese?: boolean;
}

export function SentenceCard({ sentence, onNext, showEnglish = false, showChinese = false }: SentenceCardProps) {
  const [engVisible, setEngVisible] = useState(showEnglish);
  const [chnVisible, setChnVisible] = useState(showChinese);

  return (
    <View style={styles.container}>
      {/* 스페인어 — 메인 */}
      <Text style={styles.spanish}>{sentence.spanish}</Text>

      {/* 발음 */}
      {sentence.pronunciation && (
        <Text style={styles.pronunciation}>[{sentence.pronunciation}]</Text>
      )}

      {/* 한국어 — 기본 표시 */}
      <Text style={styles.korean}>{sentence.korean}</Text>

      {/* 보조 언어 토글 */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, engVisible && styles.toggleActive]}
          onPress={() => setEngVisible(!engVisible)}
        >
          <Text style={[styles.toggleText, engVisible && styles.toggleTextActive]}>
            EN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, chnVisible && styles.toggleActive]}
          onPress={() => setChnVisible(!chnVisible)}
        >
          <Text style={[styles.toggleText, chnVisible && styles.toggleTextActive]}>
            中
          </Text>
        </TouchableOpacity>
      </View>

      {/* 영어 */}
      {engVisible && <Text style={styles.auxiliary}>{sentence.english}</Text>}

      {/* 중국어 */}
      {chnVisible && <Text style={styles.auxiliary}>{sentence.chinese}</Text>}

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.7}>
        <Text style={styles.nextText}>다음</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  spanish: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  pronunciation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  korean: {
    fontSize: fontSize.xl,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  toggleBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  toggleActive: {
    borderColor: colors.secondaryLight,
    backgroundColor: colors.secondaryLight,
  },
  toggleText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFF',
  },
  auxiliary: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
    ...shadow.sm,
  },
  nextText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
