import { View, Text, StyleSheet } from 'react-native';
import type { GrammarNote } from '../../data/grammar-notes';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../constants/theme';

interface GrammarCardProps {
  note: GrammarNote;
}

export function GrammarCard({ note }: GrammarCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>문법 노트</Text>
      </View>

      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.titleKo}>{note.titleKo}</Text>

      <View style={styles.contentBox}>
        <Text style={styles.content}>{note.content}</Text>
      </View>

      <View style={styles.examplesSection}>
        <Text style={styles.examplesLabel}>예문</Text>
        {note.examples.map((ex, i) => (
          <View key={i} style={styles.exampleRow}>
            <Text style={styles.exampleSpanish}>{ex.spanish}</Text>
            <Text style={styles.exampleKorean}>{ex.korean}</Text>
          </View>
        ))}
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
    marginBottom: spacing.md,
  },
  badge: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.secondary,
    backgroundColor: '#E8F4FD',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  titleKo: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  contentBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  content: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 22,
  },
  examplesSection: {
    borderLeftWidth: 3,
    borderLeftColor: colors.secondaryLight,
    paddingLeft: spacing.md,
  },
  examplesLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  exampleRow: {
    marginBottom: spacing.sm,
  },
  exampleSpanish: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.secondary,
    fontStyle: 'italic',
  },
  exampleKorean: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
