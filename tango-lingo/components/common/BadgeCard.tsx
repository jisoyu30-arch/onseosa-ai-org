import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '../../data/badges';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

export function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <View style={[styles.card, !earned && styles.cardLocked]}>
      <Text style={[styles.emoji, !earned && styles.emojiLocked]}>
        {earned ? badge.emoji : '🔒'}
      </Text>
      <Text style={[styles.title, !earned && styles.textLocked]} numberOfLines={1}>
        {badge.titleKo}
      </Text>
      <Text style={[styles.description, !earned && styles.textLocked]} numberOfLines={2}>
        {badge.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%' as any,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 2,
    ...shadow.sm,
  },
  cardLocked: {
    opacity: 0.5,
    backgroundColor: colors.borderLight,
  },
  emoji: { fontSize: 28, marginBottom: 2 },
  emojiLocked: { fontSize: 22 },
  title: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 13,
  },
  textLocked: { color: colors.textLight },
});
