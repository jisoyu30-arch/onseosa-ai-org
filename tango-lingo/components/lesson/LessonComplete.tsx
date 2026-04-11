import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';

interface LessonCompleteProps {
  correctCount: number;
  totalQuizzes: number;
  xpEarned: number;
  onGoHome: () => void;
}

export function LessonComplete({ correctCount, totalQuizzes, xpEarned, onGoHome }: LessonCompleteProps) {
  const ratio = totalQuizzes > 0 ? correctCount / totalQuizzes : 1;
  const emoji = ratio >= 0.75 ? '🎉' : ratio >= 0.5 ? '👏' : '💪';
  const message = ratio >= 0.75 ? '¡Excelente!' : ratio >= 0.5 ? '¡Bien hecho!' : '¡Sigue practicando!';
  const messageKo = ratio >= 0.75 ? '훌륭해요!' : ratio >= 0.5 ? '잘했어요!' : '계속 연습해봐요!';

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>{messageKo}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          <Text style={styles.statValue}>{correctCount}/{totalQuizzes}</Text>
          <Text style={styles.statLabel}>정답</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="star" size={28} color={colors.xpGold} />
          <Text style={styles.statValue}>+{xpEarned}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
      </View>

      <Button title="홈으로" onPress={onGoHome} size="lg" style={{ marginTop: spacing.xl }} />
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
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    minWidth: 100,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
