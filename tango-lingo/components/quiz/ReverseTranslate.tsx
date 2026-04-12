import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Quiz } from '../../types';
import { QuizFeedback } from './QuizFeedback';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface ReverseTranslateProps {
  quiz: Quiz;
  onAnswer: (correct: boolean) => void;
}

/**
 * 한국어를 보고 스페인어를 직접 입력하는 퀴즈.
 * question = 한국어 문장, correctAnswer = 스페인어 정답
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,;:!?¿¡"""''()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function ReverseTranslate({ quiz, onAnswer }: ReverseTranslateProps) {
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);

  const handleSubmit = () => {
    if (!input.trim() || answered) return;
    setAnswered(true);
  };

  const isCorrect = normalize(input) === normalize(quiz.correctAnswer);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>스페인어로 써보세요</Text>
      <Text style={styles.korean}>{quiz.question}</Text>

      <TextInput
        style={[styles.input, answered && (isCorrect ? styles.inputCorrect : styles.inputWrong)]}
        value={input}
        onChangeText={setInput}
        placeholder="스페인어로 입력..."
        placeholderTextColor={colors.textLight}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!answered}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />

      {!answered && (
        <TouchableOpacity
          style={[styles.submitBtn, !input.trim() && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!input.trim()}
        >
          <Text style={styles.submitText}>확인</Text>
        </TouchableOpacity>
      )}

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
  korean: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.secondary, textAlign: 'center', marginBottom: spacing.xl },
  input: {
    borderWidth: 2, borderColor: colors.border, borderRadius: borderRadius.md,
    padding: spacing.md, fontSize: fontSize.lg, color: colors.text,
    textAlign: 'center', backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  inputCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  inputWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: spacing.md - 2, borderRadius: borderRadius.md, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: colors.border },
  submitText: { color: '#FFF', fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});
