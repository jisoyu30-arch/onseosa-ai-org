import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Quiz } from '../../types';
import { QuizFeedback } from './QuizFeedback';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface FillBlankProps {
  quiz: Quiz;
  onAnswer: (correct: boolean) => void;
}

export function FillBlank({ quiz, onAnswer }: FillBlankProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
  };

  const isCorrect = selected === quiz.correctAnswer;

  // 빈칸 부분 하이라이트
  const questionParts = quiz.question.split('_____');

  return (
    <View style={styles.container}>
      {quiz.questionKo && (
        <Text style={styles.hint}>{quiz.questionKo}</Text>
      )}

      <View style={styles.sentenceRow}>
        <Text style={styles.sentence}>
          {questionParts[0]}
          <Text style={[styles.blank, selected && styles.blankFilled]}>
            {selected || '_____'}
          </Text>
          {questionParts[1] || ''}
        </Text>
      </View>

      <View style={styles.options}>
        {quiz.options?.map((option, i) => {
          const isCorrectOption = answered && option === quiz.correctAnswer;
          const isWrongOption = answered && option === selected && option !== quiz.correctAnswer;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.chip,
                isCorrectOption && styles.correct,
                isWrongOption && styles.wrong,
                selected === option && !answered && styles.selected,
              ]}
              onPress={() => handleSelect(option)}
              disabled={answered}
              activeOpacity={0.7}
            >
              <Text style={styles.chipText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {answered && (
        <QuizFeedback
          correct={isCorrect}
          correctAnswer={`${questionParts[0]}${quiz.correctAnswer}${questionParts[1] || ''}`}
          onNext={() => onAnswer(isCorrect)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  hint: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  sentenceRow: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sentence: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
  },
  blank: {
    color: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    fontWeight: fontWeight.bold,
  },
  blankFilled: {
    color: colors.secondary,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadow.sm,
  },
  selected: {
    borderColor: colors.secondaryLight,
  },
  correct: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  wrong: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  chipText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
});
