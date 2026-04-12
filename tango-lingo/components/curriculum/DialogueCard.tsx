import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface DialogueLine {
  speaker: string;
  spanish: string;
  korean: string;
}

interface DialogueCardProps {
  situation: string;
  lines: DialogueLine[];
}

export function DialogueCard({ situation, lines }: DialogueCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>실전 대화</Text>
      </View>

      <Text style={styles.situation}>{situation}</Text>

      <View style={styles.dialogueBox}>
        {lines.map((line, i) => (
          <View key={i} style={styles.lineRow}>
            <View style={styles.speakerBadge}>
              <Text style={styles.speakerText}>{line.speaker}</Text>
            </View>
            <View style={styles.lineContent}>
              <Text style={styles.spanish}>{line.spanish}</Text>
              <Text style={styles.korean}>{line.korean}</Text>
            </View>
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
    color: colors.secondaryLight,
    backgroundColor: '#E3F2FD',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  situation: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  dialogueBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  lineRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  speakerBadge: {
    backgroundColor: colors.secondaryLight,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  speakerText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
  lineContent: {
    flex: 1,
  },
  spanish: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 1,
  },
  korean: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
