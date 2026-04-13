import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { minimalPairs } from '../../data/minimal-pairs';
import { speak, stopSpeaking } from '../../utils/audio';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';
import type { MinimalPair } from '../../data/minimal-pairs';

const QUIZ_COUNT = 10;

interface QuizItem {
  pair: MinimalPair;
  playWord: 'A' | 'B'; // 실제 재생할 단어
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateQuiz(): QuizItem[] {
  const shuffled = shuffleArray(minimalPairs);
  const selected = shuffled.slice(0, QUIZ_COUNT);
  return selected.map((pair) => ({
    pair,
    playWord: Math.random() < 0.5 ? 'A' : 'B',
  }));
}

type Phase = 'ready' | 'playing' | 'waiting' | 'feedback' | 'result';

export default function MinimalPairsScreen() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizItem[]>(() => generateQuiz());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [userAnswer, setUserAnswer] = useState<'A' | 'B' | null>(null);
  const [score, setScore] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const current = quiz[currentIndex];
  const isCorrect = userAnswer === current?.playWord;

  // 단어 재생
  const playCurrentWord = useCallback(async () => {
    if (!current) return;
    const word = current.playWord === 'A' ? current.pair.wordA : current.pair.wordB;
    setIsSpeaking(true);
    setPhase('playing');
    try {
      await speak(word, 'es', false);
    } catch {
      // TTS error ignored
    }
    setIsSpeaking(false);
    setPhase('waiting');
  }, [current]);

  // 시작/다시 듣기
  const handlePlay = useCallback(() => {
    stopSpeaking();
    playCurrentWord();
  }, [playCurrentWord]);

  // 사용자 선택
  const handleAnswer = useCallback((choice: 'A' | 'B') => {
    if (phase !== 'waiting') return;
    setUserAnswer(choice);
    if (choice === current?.playWord) {
      setScore((prev) => prev + 1);
    }
    setPhase('feedback');
  }, [phase, current]);

  // 다음 문제
  const handleNext = useCallback(() => {
    setUserAnswer(null);
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPhase('ready');
    } else {
      setPhase('result');
    }
  }, [currentIndex, quiz.length]);

  // 재시작
  const handleRestart = useCallback(() => {
    setQuiz(generateQuiz());
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer(null);
    setPhase('ready');
  }, []);

  // A 또는 B 단어를 피드백에서 재생
  const handlePlayWord = useCallback(async (word: string) => {
    setIsSpeaking(true);
    try {
      await speak(word, 'es', true);
    } catch {
      // ignore
    }
    setIsSpeaking(false);
  }, []);

  // ========== 결과 화면 ==========
  if (phase === 'result') {
    const percentage = Math.round((score / quiz.length) * 100);
    const emoji = percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '💪';
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>결과</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.resultArea}>
          <Text style={styles.resultEmoji}>{emoji}</Text>
          <Text style={styles.resultScore}>
            {score}/{quiz.length}
          </Text>
          <Text style={styles.resultPercent}>{percentage}% 정답</Text>
          <Text style={styles.resultMessage}>
            {percentage >= 80
              ? '훌륭해요! 소리 구분 능력이 좋습니다.'
              : percentage >= 50
              ? '괜찮아요! 조금 더 연습하면 완벽해질 거예요.'
              : '소리 구분은 어렵습니다. 반복 연습이 핵심이에요!'}
          </Text>

          <TouchableOpacity style={styles.restartBtn} onPress={handleRestart} activeOpacity={0.7}>
            <Ionicons name="refresh" size={18} color="#FFF" />
            <Text style={styles.restartBtnText}>다시 도전</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.backBtnText}>홈으로</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ========== 퀴즈 화면 ==========
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>미니멀 페어</Text>
        <Text style={styles.scoreText}>{score}점</Text>
      </View>

      {/* 진행도 */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentIndex + 1) / quiz.length) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {currentIndex + 1}/{quiz.length}
      </Text>

      {/* 카드 영역 */}
      <View style={styles.cardArea}>
        <View style={styles.card}>
          {/* 듣기 버튼 */}
          <TouchableOpacity
            style={[styles.listenBtn, isSpeaking && styles.listenBtnActive]}
            onPress={handlePlay}
            disabled={isSpeaking || phase === 'feedback'}
            activeOpacity={0.7}
          >
            <Ionicons
              name="volume-high"
              size={32}
              color={isSpeaking ? '#FFF' : colors.secondary}
            />
          </TouchableOpacity>

          <Text style={styles.listenHint}>
            {phase === 'ready'
              ? '듣기를 눌러 시작하세요'
              : phase === 'playing'
              ? '듣는 중...'
              : phase === 'waiting'
              ? '어떤 단어를 들었나요?'
              : ''}
          </Text>

          {/* 선택지 */}
          <View style={styles.choicesRow}>
            <TouchableOpacity
              style={[
                styles.choiceBtn,
                phase === 'feedback' && current.playWord === 'A' && styles.choiceBtnCorrect,
                phase === 'feedback' && userAnswer === 'A' && !isCorrect && styles.choiceBtnWrong,
              ]}
              onPress={() => handleAnswer('A')}
              disabled={phase !== 'waiting'}
              activeOpacity={0.7}
            >
              <Text style={styles.choiceWord}>{current.pair.wordA}</Text>
              <Text style={styles.choiceMeaning}>{current.pair.meaningA}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.choiceBtn,
                phase === 'feedback' && current.playWord === 'B' && styles.choiceBtnCorrect,
                phase === 'feedback' && userAnswer === 'B' && !isCorrect && styles.choiceBtnWrong,
              ]}
              onPress={() => handleAnswer('B')}
              disabled={phase !== 'waiting'}
              activeOpacity={0.7}
            >
              <Text style={styles.choiceWord}>{current.pair.wordB}</Text>
              <Text style={styles.choiceMeaning}>{current.pair.meaningB}</Text>
            </TouchableOpacity>
          </View>

          {/* 피드백 */}
          {phase === 'feedback' && (
            <View style={styles.feedbackArea}>
              <Text style={[styles.feedbackLabel, { color: isCorrect ? colors.success : colors.error }]}>
                {isCorrect ? '정답!' : '오답'}
              </Text>

              {/* 각 단어 들어보기 */}
              <View style={styles.feedbackPlayRow}>
                <TouchableOpacity
                  style={styles.feedbackPlayBtn}
                  onPress={() => handlePlayWord(current.pair.wordA)}
                  disabled={isSpeaking}
                >
                  <Ionicons name="volume-medium" size={16} color={colors.secondary} />
                  <Text style={styles.feedbackPlayText}>{current.pair.wordA}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.feedbackPlayBtn}
                  onPress={() => handlePlayWord(current.pair.wordB)}
                  disabled={isSpeaking}
                >
                  <Ionicons name="volume-medium" size={16} color={colors.secondary} />
                  <Text style={styles.feedbackPlayText}>{current.pair.wordB}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.explanation}>{current.pair.explanation}</Text>

              <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.7}>
                <Text style={styles.nextBtnText}>
                  {currentIndex < quiz.length - 1 ? '다음' : '결과 보기'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  scoreText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.accent,
  },
  // 진행도
  progressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  // 카드
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.md,
  },
  listenBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  listenBtnActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  listenHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  // 선택지
  choicesRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  choiceBtn: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  choiceBtnCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  choiceBtnWrong: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  choiceWord: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  choiceMeaning: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  // 피드백
  feedbackArea: {
    marginTop: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  feedbackLabel: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
  },
  feedbackPlayRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  feedbackPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  feedbackPlayText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.secondary,
  },
  explanation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadow.sm,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  // 결과
  resultArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  resultScore: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  resultPercent: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  resultMessage: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  restartBtnText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  backBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  backBtnText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
  },
});
