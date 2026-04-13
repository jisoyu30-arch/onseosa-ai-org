import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Sentence } from '../../types';
import { PronunciationPanel } from './PronunciationPanel';
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
  const [practiceOpen, setPracticeOpen] = useState(false);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
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
          <Text style={[styles.toggleText, engVisible && styles.toggleTextActive]}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, chnVisible && styles.toggleActive]}
          onPress={() => setChnVisible(!chnVisible)}
        >
          <Text style={[styles.toggleText, chnVisible && styles.toggleTextActive]}>中</Text>
        </TouchableOpacity>
      </View>

      {/* 영어 */}
      {engVisible && <Text style={styles.auxiliary}>{sentence.english}</Text>}

      {/* 중국어 */}
      {chnVisible && <Text style={styles.auxiliary}>{sentence.chinese}</Text>}

      {/* 발음 연습 토글 */}
      <TouchableOpacity
        style={[styles.practiceToggle, practiceOpen && styles.practiceToggleActive]}
        onPress={() => setPracticeOpen(!practiceOpen)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="mic"
          size={16}
          color={practiceOpen ? '#FFF' : colors.primary}
        />
        <Text style={[styles.practiceToggleText, practiceOpen && styles.practiceToggleTextActive]}>
          {practiceOpen ? '발음 연습 접기' : '발음 연습'}
        </Text>
      </TouchableOpacity>

      {/* 발음 패널 */}
      {practiceOpen && (
        <PronunciationPanel key={sentence.id} sentence={sentence} />
      )}

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.7}>
        <Text style={styles.nextText}>다음</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
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
  practiceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  practiceToggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  practiceToggleText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  practiceToggleTextActive: {
    color: '#FFF',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    ...shadow.sm,
  },
  nextText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
