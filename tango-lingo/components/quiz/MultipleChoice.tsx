import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Quiz } from '../../types';
import { QuizFeedback } from './QuizFeedback';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface MultipleChoiceProps {
  quiz: Quiz;
  onAnswer: (correct: boolean) => void;
}

export function MultipleChoice({ quiz, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
  };

  const isCorrect = selected === quiz.correctAnswer;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{quiz.question}</Text>

      <View style={styles.options}>
        {quiz.options?.map((option, i) => {
          const isCorrectOption = answered && option === quiz.correctAnswer;
          const isWrongOption = answered && option === selected && option !== quiz.correctAnswer;
          const isSelected = selected === option && !answered;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                isCorrectOption && styles.correct,
                isWrongOption && styles.wrong,
                isSelected && styles.selected,
              ]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.7}
              disabled={answered}
            >
              <Text style={[
                styles.optionText,
                isCorrectOption && styles.correctText,
                isWrongOption && styles.wrongText,
              ]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {answered && (
        <QuizFeedback
          correct={isCorrect}
          correctAnswer={quiz.correctAnswer}
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
  question: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
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
  optionText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  correctText: {
    color: colors.success,
    fontWeight: fontWeight.bold,
  },
  wrongText: {
    color: colors.error,
    fontWeight: fontWeight.bold,
  },
});
