import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Quiz } from '../../types';
import { QuizFeedback } from './QuizFeedback';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface MeaningMatchProps {
  quiz: Quiz;
  onAnswer: (correct: boolean) => void;
}

/**
 * 스페인어 문장을 보고 한국어 뜻을 고르는 퀴즈.
 * question = 스페인어 문장, options = 한국어 뜻 4개
 */
export function MeaningMatch({ quiz, onAnswer }: MeaningMatchProps) {
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
      <Text style={styles.label}>이 문장의 뜻은?</Text>
      <Text style={styles.spanish}>{quiz.question}</Text>

      <View style={styles.options}>
        {quiz.options?.map((option, i) => {
          const isCorrectOption = answered && option === quiz.correctAnswer;
          const isWrongOption = answered && option === selected && option !== quiz.correctAnswer;
          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.option,
                isCorrectOption && styles.correct,
                isWrongOption && styles.wrong,
                selected === option && !answered && styles.selected,
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
  container: { flex: 1, padding: spacing.lg },
  label: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg, marginBottom: spacing.xs },
  spanish: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.primary, textAlign: 'center', marginBottom: spacing.xl, fontStyle: 'italic' },
  options: { gap: spacing.sm },
  option: { padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, ...shadow.sm },
  selected: { borderColor: colors.secondaryLight },
  correct: { borderColor: colors.success, backgroundColor: colors.successLight },
  wrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  optionText: { fontSize: fontSize.md, color: colors.text, fontWeight: fontWeight.medium, textAlign: 'center' },
  correctText: { color: colors.success, fontWeight: fontWeight.bold },
  wrongText: { color: colors.error, fontWeight: fontWeight.bold },
});
