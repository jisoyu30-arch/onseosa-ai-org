import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { Chunk } from '../../data/chunks';
import { speak } from '../../utils/audio';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface ChunkCardProps {
  chunk: Chunk;
  onNext: () => void;
}

const CHUNK_COLORS = [
  { bg: '#FFF0F0', border: '#E63946' },  // 탱고 레드 계열
  { bg: '#F0F4FF', border: '#457B9D' },  // 네이비 계열
  { bg: '#FFF8E7', border: '#F4A261' },  // 골드 계열
] as const;

export function ChunkCard({ chunk, onNext }: ChunkCardProps) {
  const [speaking, setSpeaking] = useState(false);

  // 청크 id에서 인덱스 추출해서 색상 순환
  const lastDigit = parseInt(chunk.id.slice(-1), 10) || 0;
  const colorScheme = CHUNK_COLORS[lastDigit % CHUNK_COLORS.length];

  const handleSpeak = async () => {
    if (speaking) return;
    setSpeaking(true);
    try {
      await speak(chunk.spanish, 'es', true);
    } finally {
      setSpeaking(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* 청크 블록 */}
      <View style={[styles.chunkBlock, { backgroundColor: colorScheme.bg, borderColor: colorScheme.border }]}>
        {/* 스페인어 (메인) */}
        <Text style={styles.spanish}>{chunk.spanish}</Text>

        {/* TTS 버튼 */}
        <TouchableOpacity
          style={[styles.speakBtn, speaking && styles.speakBtnActive]}
          onPress={handleSpeak}
          activeOpacity={0.7}
        >
          <Ionicons
            name={speaking ? 'volume-high' : 'volume-medium'}
            size={20}
            color={speaking ? '#FFF' : colors.primary}
          />
        </TouchableOpacity>

        {/* 직역 분해 */}
        <View style={styles.literalBox}>
          <Text style={styles.literalLabel}>단어별 의미</Text>
          <Text style={styles.literalText}>{chunk.literal}</Text>
        </View>
      </View>

      {/* 한국어 의미 */}
      <Text style={styles.korean}>{chunk.korean}</Text>

      {/* 영어 */}
      <Text style={styles.auxiliary}>{chunk.english}</Text>

      {/* 중국어 */}
      <Text style={styles.auxiliary}>{chunk.chinese}</Text>

      {/* 사용 상황 */}
      <View style={styles.usageBox}>
        <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.usageText}>{chunk.usage}</Text>
      </View>

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
  chunkBlock: {
    width: '100%',
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.sm,
  },
  spanish: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  speakBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  speakBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  literalBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  literalLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  literalText: {
    fontSize: fontSize.sm,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  korean: {
    fontSize: fontSize.xl,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  auxiliary: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  usageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  usageText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    ...shadow.sm,
  },
  nextText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
