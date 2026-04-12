import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import type { Quiz } from '../../types';
import { QuizFeedback } from './QuizFeedback';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface DictationProps {
  quiz: Quiz;
  onAnswer: (correct: boolean) => void;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[¿¡.,!?;:'"()\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function Dictation({ quiz, onAnswer }: DictationProps) {
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (speaking) return;
    setSpeaking(true);
    Speech.speak(quiz.correctAnswer, {
      language: 'es',
      rate: 0.8,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
    });
  }, [quiz.correctAnswer, speaking]);

  const handleSubmit = () => {
    if (answered || !input.trim()) return;
    setAnswered(true);
  };

  const isCorrect = normalize(input) === normalize(quiz.correctAnswer);

  return (
    <View style={styles.container}>
      {quiz.questionKo && (
        <Text style={styles.hint}>{quiz.questionKo}</Text>
      )}

      <Text style={styles.instruction}>듣고 받아쓰기</Text>

      <TouchableOpacity
        style={[styles.speakerButton, speaking && styles.speakerActive]}
        onPress={speak}
        activeOpacity={0.7}
      >
        <Ionicons
          name={speaking ? 'volume-high' : 'volume-medium-outline'}
          size={48}
          color={speaking ? colors.primary : colors.secondary}
        />
        <Text style={styles.speakerLabel}>
          {speaking ? '재생 중...' : '듣기'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={[styles.input, answered && (isCorrect ? styles.inputCorrect : styles.inputWrong)]}
        value={input}
        onChangeText={setInput}
        placeholder="들은 문장을 입력하세요"
        placeholderTextColor={colors.textLight}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!answered}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />

      {!answered && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.replayButton} onPress={speak} activeOpacity={0.7}>
            <Ionicons name="refresh" size={18} color={colors.secondaryLight} />
            <Text style={styles.replayText}>다시 듣기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, !input.trim() && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={!input.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.submitText}>확인</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  hint: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  instruction: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  speakerButton: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadow.md,
  },
  speakerActive: {
    borderColor: colors.primary,
    backgroundColor: colors.errorLight,
  },
  speakerLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.lg,
    color: colors.text,
    backgroundColor: colors.surface,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  inputCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  inputWrong: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  replayText: {
    fontSize: fontSize.sm,
    color: colors.secondaryLight,
    fontWeight: fontWeight.medium,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
});
