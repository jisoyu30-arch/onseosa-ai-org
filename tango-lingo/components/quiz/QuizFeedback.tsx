import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';

interface QuizFeedbackProps {
  correct: boolean;
  correctAnswer: string;
  onNext: () => void;
}

export function QuizFeedback({ correct, correctAnswer, onNext }: QuizFeedbackProps) {
  return (
    <View style={[styles.container, correct ? styles.correctBg : styles.wrongBg]}>
      <View style={styles.row}>
        <Ionicons
          name={correct ? 'checkmark-circle' : 'close-circle'}
          size={32}
          color={correct ? colors.success : colors.error}
        />
        <Text style={[styles.label, correct ? styles.correctText : styles.wrongText]}>
          {correct ? '정답!' : '오답'}
        </Text>
      </View>

      {!correct && (
        <Text style={styles.answer}>정답: {correctAnswer}</Text>
      )}

      <Button
        title="다음"
        onPress={onNext}
        variant={correct ? 'primary' : 'secondary'}
        style={{ marginTop: spacing.md, alignSelf: 'stretch' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  correctBg: {
    backgroundColor: colors.successLight,
  },
  wrongBg: {
    backgroundColor: colors.errorLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  correctText: {
    color: colors.success,
  },
  wrongText: {
    color: colors.error,
  },
  answer: {
    fontSize: fontSize.md,
    color: colors.text,
    marginTop: spacing.sm,
    fontWeight: fontWeight.medium,
  },
});
