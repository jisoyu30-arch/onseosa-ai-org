import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Sentence } from '../../types';
import { PronunciationPanel } from './PronunciationPanel';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface SentenceCardProps {
  sentence: Sentence;
  onNext: () => void;
  showEnglish?: boolean;
  showChinese?: boolean;
}

export function SentenceCard({ sentence, onNext, showEnglish = false, showChinese = false }: SentenceCardProps) {
  const learningMode = useSettingsStore((s) => s.learningMode);

  // 모드별 메인 문장, 발음, 토글 설정
  const mainText =
    learningMode === 'en' ? sentence.english :
    learningMode === 'zh' ? sentence.chinese :
    sentence.spanish;

  const pronunciation =
    learningMode === 'en' ? sentence.pronunciationEn :
    learningMode === 'zh' ? sentence.pronunciationZh :
    sentence.pronunciation;

  // 보조 언어 토글: 메인이 아닌 언어들
  const toggles =
    learningMode === 'es'
      ? [
          { key: 'en', label: 'EN', text: sentence.english },
          { key: 'zh', label: '中', text: sentence.chinese },
        ]
      : learningMode === 'en'
      ? [
          { key: 'es', label: 'ES', text: sentence.spanish },
          { key: 'zh', label: '中', text: sentence.chinese },
        ]
      : [
          { key: 'es', label: 'ES', text: sentence.spanish },
          { key: 'en', label: 'EN', text: sentence.english },
        ];

  const [visibleToggles, setVisibleToggles] = useState<Record<string, boolean>>({
    en: learningMode === 'es' ? showEnglish : false,
    zh: learningMode === 'es' ? showChinese : false,
    es: false,
  });
  const [practiceOpen, setPracticeOpen] = useState(false);

  const handleToggle = (key: string) => {
    setVisibleToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 메인 문장 */}
      <Text style={styles.mainSentence}>{mainText}</Text>

      {/* 발음 */}
      {pronunciation && (
        <Text style={styles.pronunciation}>[{pronunciation}]</Text>
      )}

      {/* 한국어 — 항상 표시 */}
      <Text style={styles.korean}>{sentence.korean}</Text>

      {/* 보조 언어 토글 */}
      <View style={styles.toggleRow}>
        {toggles.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.toggleBtn, visibleToggles[t.key] && styles.toggleActive]}
            onPress={() => handleToggle(t.key)}
          >
            <Text style={[styles.toggleText, visibleToggles[t.key] && styles.toggleTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 토글된 보조 언어 표시 */}
      {toggles.map(
        (t) =>
          visibleToggles[t.key] && (
            <Text key={t.key} style={styles.auxiliary}>
              {t.text}
            </Text>
          ),
      )}

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
  mainSentence: {
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
