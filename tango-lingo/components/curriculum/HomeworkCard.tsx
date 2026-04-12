import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Homework } from '../../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface HomeworkCardProps {
  homework: Homework;
  onComplete: () => void;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  speaking: { icon: 'mic', label: '발화 숙제', color: colors.primary },
  couple: { icon: 'heart', label: '커플 숙제', color: '#E91E63' },
  real_world: { icon: 'globe', label: '실전 숙제', color: colors.secondaryLight },
  reflection: { icon: 'bulb', label: '생각 숙제', color: colors.accent },
  recording: { icon: 'recording', label: '녹음 숙제', color: '#9C27B0' },
};

export function HomeworkCard({ homework, onComplete }: HomeworkCardProps) {
  const config = TYPE_CONFIG[homework.type] || TYPE_CONFIG.speaking;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="book" size={28} color={colors.secondary} />
        <Text style={styles.headerTitle}>오늘의 숙제</Text>
      </View>

      <View style={[styles.typeBadge, { backgroundColor: config.color }]}>
        <Ionicons name={config.icon as any} size={14} color="#FFF" />
        <Text style={styles.typeText}>{config.label}</Text>
      </View>

      <View style={styles.instructionBox}>
        <Text style={styles.instruction}>{homework.instruction}</Text>
      </View>

      <View style={styles.rewardRow}>
        <Ionicons name="star" size={16} color={colors.xpGold} />
        <Text style={styles.rewardText}>+{homework.xpReward} XP</Text>
      </View>

      <TouchableOpacity style={styles.completeBtn} onPress={onComplete} activeOpacity={0.7}>
        <Ionicons name="checkmark-circle" size={20} color="#FFF" />
        <Text style={styles.completeBtnText}>완료!</Text>
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
  header: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  typeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
  instructionBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignSelf: 'stretch',
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  instruction: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.lg,
  },
  rewardText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.xpGold,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadow.sm,
  },
  completeBtnText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
});
