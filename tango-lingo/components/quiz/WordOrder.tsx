import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Quiz } from '../../types';
import { QuizFeedback } from './QuizFeedback';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface WordOrderProps {
  quiz: Quiz;
  onAnswer: (correct: boolean) => void;
}

export function WordOrder({ quiz, onAnswer }: WordOrderProps) {
  const [placed, setPlaced] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(
    () => [...(quiz.words || [])].sort(() => Math.random() - 0.5)
  );
  const [answered, setAnswered] = useState(false);

  const handlePlace = (word: string) => {
    if (answered) return;
    setPlaced([...placed, word]);
    setAvailable(available.filter((w, i) => {
      // 첫 번째 매칭만 제거
      const idx = available.indexOf(word);
      return i !== idx;
    }));
  };

  const handleRemove = (index: number) => {
    if (answered) return;
    const word = placed[index];
    setPlaced(placed.filter((_, i) => i !== index));
    setAvailable([...available, word]);
  };

  const handleCheck = () => {
    setAnswered(true);
  };

  const userAnswer = placed.join(' ');
  const isCorrect = userAnswer === quiz.correctAnswer;
  const allPlaced = available.length === 0;

  return (
    <View style={styles.container}>
      {quiz.questionKo && (
        <Text style={styles.hint}>{quiz.questionKo}</Text>
      )}
      <Text style={styles.question}>{quiz.question}</Text>

      {/* 배치된 단어 영역 */}
      <View style={styles.placedArea}>
        {placed.length === 0 ? (
          <Text style={styles.placeholder}>단어를 눌러 문장을 만드세요</Text>
        ) : (
          <View style={styles.placedRow}>
            {placed.map((word, i) => (
              <TouchableOpacity
                key={i}
                style={styles.placedChip}
                onPress={() => handleRemove(i)}
                disabled={answered}
              >
                <Text style={styles.placedText}>{word}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* 선택 가능한 단어 */}
      <View style={styles.wordPool}>
        {available.map((word, i) => (
          <TouchableOpacity
            key={i}
            style={styles.wordChip}
            onPress={() => handlePlace(word)}
            activeOpacity={0.7}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 확인 버튼 */}
      {allPlaced && !answered && (
        <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
          <Text style={styles.checkText}>확인</Text>
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
  question: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  placedArea: {
    minHeight: 60,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    justifyContent: 'center',
  },
  placeholder: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: fontSize.sm,
  },
  placedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  placedChip: {
    backgroundColor: colors.secondaryLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  placedText: {
    color: '#FFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  wordPool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  wordChip: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.sm,
  },
  wordText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  checkBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  checkText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
