import { View, Text, StyleSheet } from 'react-native';
import type { TangoTerm } from '../../types';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../constants/theme';

interface TermCardProps {
  term: TangoTerm;
}

export function TermCard({ term }: TermCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>탱고 용어</Text>
      </View>

      <Text style={styles.term}>{term.term}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>사전적 뜻</Text>
        <Text style={styles.value}>{term.literalMeaning}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>탱고에서</Text>
        <Text style={styles.value}>{term.tangoMeaning}</Text>
      </View>

      <View style={styles.bodyRow}>
        <Text style={styles.bodyIcon}>🫀</Text>
        <Text style={styles.bodyText}>{term.bodyInterpretation}</Text>
      </View>

      <View style={styles.exampleBox}>
        <Text style={styles.exampleLabel}>실전 예시</Text>
        <Text style={styles.exampleText}>{term.example}</Text>
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
    color: colors.accent,
    backgroundColor: colors.accentLight,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  term: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  row: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  bodyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  bodyIcon: {
    fontSize: 20,
  },
  bodyText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.secondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  exampleBox: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: spacing.sm,
    marginTop: spacing.sm,
  },
  exampleLabel: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginBottom: 2,
  },
  exampleText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
});
