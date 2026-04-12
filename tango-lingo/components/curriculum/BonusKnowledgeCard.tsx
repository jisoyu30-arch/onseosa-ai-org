import { View, Text, StyleSheet } from 'react-native';
import type { BonusCard } from '../../types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../constants/theme';

interface BonusKnowledgeCardProps {
  bonus: BonusCard;
}

const CATEGORY_LABELS: Record<string, string> = {
  history: '탱고 역사',
  etiquette: '밀롱가 에티켓',
  music: '음악 이야기',
  culture: '탱고 문화',
};

const CATEGORY_COLORS: Record<string, string> = {
  history: '#8B5CF6',
  etiquette: colors.accent,
  music: colors.secondaryLight,
  culture: colors.primary,
};

export function BonusKnowledgeCard({ bonus }: BonusKnowledgeCardProps) {
  const catColor = CATEGORY_COLORS[bonus.category] || colors.accent;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{bonus.emoji}</Text>
        <View style={[styles.catBadge, { backgroundColor: catColor }]}>
          <Text style={styles.catText}>{CATEGORY_LABELS[bonus.category]}</Text>
        </View>
      </View>

      <Text style={styles.title}>{bonus.titleKo}</Text>

      <View style={styles.contentBox}>
        <Text style={styles.content}>{bonus.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 48,
  },
  catBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  catText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  contentBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  content: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
});
