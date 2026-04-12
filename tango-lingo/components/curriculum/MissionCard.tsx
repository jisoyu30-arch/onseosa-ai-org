import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import type { CoupleMission } from '../../types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../constants/theme';

interface MissionCardProps {
  mission: CoupleMission;
  onComplete: () => void;
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  practice: { icon: 'body', label: '실전 연습', color: colors.primary },
  conversation: { icon: 'chatbubbles', label: '대화 미션', color: colors.secondaryLight },
  observation: { icon: 'eye', label: '관찰 미션', color: colors.accent },
  challenge: { icon: 'trophy', label: '챌린지', color: colors.xpGold },
};

export function MissionCard({ mission, onComplete }: MissionCardProps) {
  const config = TYPE_CONFIG[mission.type] || TYPE_CONFIG.practice;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="heart" size={32} color={colors.primary} />
        <View style={[styles.typeBadge, { backgroundColor: config.color }]}>
          <Text style={styles.typeText}>{config.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>{mission.title}</Text>

      <View style={styles.descBox}>
        <Text style={styles.description}>{mission.description}</Text>
      </View>

      <View style={styles.rewardRow}>
        <Ionicons name="star" size={18} color={colors.xpGold} />
        <Text style={styles.rewardText}>+{mission.xpReward} XP</Text>
      </View>

      <Button
        title="완료!"
        onPress={onComplete}
        size="lg"
        style={{ marginTop: spacing.lg, alignSelf: 'stretch' }}
      />
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
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  typeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  descBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignSelf: 'stretch',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.md,
  },
  rewardText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.xpGold,
  },
});
