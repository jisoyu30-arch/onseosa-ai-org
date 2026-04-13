import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

type ShadowingPhase = 'idle' | 'listening' | 'recording' | 'comparing';

interface ShadowingCardProps {
  spanish: string;
  korean: string;
  phase: ShadowingPhase;
  hasRecording: boolean;
  onPlayOriginal: () => void;
  onPlayMine: () => void;
  onStopRecording: () => void;
}

const PHASE_CONFIG: Record<ShadowingPhase, { icon: string; label: string; color: string }> = {
  idle: { icon: 'ellipse', label: '준비', color: colors.textSecondary },
  listening: { icon: 'volume-high', label: '듣는 중', color: colors.secondary },
  recording: { icon: 'mic', label: '따라하세요', color: colors.primary },
  comparing: { icon: 'sync', label: '비교 중', color: colors.accent },
};

export function ShadowingCard({
  spanish,
  korean,
  phase,
  hasRecording,
  onPlayOriginal,
  onPlayMine,
  onStopRecording,
}: ShadowingCardProps) {
  const config = PHASE_CONFIG[phase];

  return (
    <View style={styles.container}>
      {/* 상태 표시 */}
      <View style={[styles.phaseIndicator, { backgroundColor: config.color }]}>
        <Ionicons name={config.icon as any} size={16} color="#FFF" />
        <Text style={styles.phaseText}>{config.label}</Text>
      </View>

      {/* 스페인어 문장 */}
      <Text style={styles.spanish}>{spanish}</Text>

      {/* 한국어 번역 */}
      <Text style={styles.korean}>{korean}</Text>

      {/* 녹음 중일 때 — 중지 버튼 */}
      {phase === 'recording' && (
        <View style={styles.recordingSection}>
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>녹음 중...</Text>
          </View>
          <TouchableOpacity style={styles.stopBtn} onPress={onStopRecording} activeOpacity={0.7}>
            <Ionicons name="stop" size={20} color="#FFF" />
            <Text style={styles.stopBtnText}>중지</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 비교 버튼들 — 녹음 완료 후 */}
      {hasRecording && phase !== 'recording' && phase !== 'listening' && (
        <View style={styles.playbackRow}>
          <TouchableOpacity style={styles.playBtn} onPress={onPlayOriginal} activeOpacity={0.7}>
            <Ionicons name="volume-high" size={18} color={colors.secondary} />
            <Text style={styles.playBtnText}>원본 듣기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} onPress={onPlayMine} activeOpacity={0.7}>
            <Ionicons name="ear" size={18} color={colors.primary} />
            <Text style={[styles.playBtnText, { color: colors.primary }]}>내 목소리</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  phaseText: {
    color: '#FFF',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  spanish: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  korean: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  recordingSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  recordingText: {
    fontSize: fontSize.sm,
    color: colors.error,
    fontWeight: fontWeight.medium,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error,
  },
  stopBtnText: {
    color: '#FFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  playbackRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  playBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.secondary,
  },
});
