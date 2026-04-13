import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { quizzes } from '../../data/quizzes';
import { Quiz } from '../../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

type ChallengePhase = 'intro' | 'quiz' | 'result';

function pickRandomQuizzes(count: number): Quiz[] {
  const allQuizIds = Object.keys(quizzes);
  const shuffled = [...allQuizIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((id) => quizzes[id]).filter(Boolean);
}

export default function ChallengeScreen() {
  const [phase, setPhase] = useState<ChallengePhase>('intro');
  const [challengeQuizzes, setChallengeQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const startChallenge = useCallback(() => {
    const picked = pickRandomQuizzes(5);
    setChallengeQuizzes(picked);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setPhase('quiz');
  }, []);

  const currentQuiz = challengeQuizzes[currentIndex] ?? null;

  const handleSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === currentQuiz?.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= challengeQuizzes.length) {
      setPhase('result');
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const handleShare = async () => {
    const text = `[Tango Lingo Challenge]\n오늘의 커플 챌린지 결과: ${score}/${challengeQuizzes.length} 정답!\n너도 도전해봐! 💃🕺`;
    await Clipboard.setStringAsync(text);
    Alert.alert('복사 완료!', '결과가 클립보드에 복사됐어요. 파트너에게 붙여넣기로 공유하세요!');
  };

  // --- Intro ---
  if (phase === 'intro') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>커플 챌린지</Text>

          <View style={styles.introCard}>
            <Text style={styles.introEmoji}>💃🕺</Text>
            <Text style={styles.introTitle}>오늘의 챌린지</Text>
            <Text style={styles.introDesc}>
              같은 5개 퀴즈를 풀어보세요!{'\n'}
              파트너와 점수를 비교하고 함께 성장해요.
            </Text>

            <View style={styles.ruleBox}>
              <View style={styles.ruleRow}>
                <Ionicons name="help-circle" size={18} color={colors.secondary} />
                <Text style={styles.ruleText}>랜덤 5문제</Text>
              </View>
              <View style={styles.ruleRow}>
                <Ionicons name="timer" size={18} color={colors.secondary} />
                <Text style={styles.ruleText}>시간 제한 없음</Text>
              </View>
              <View style={styles.ruleRow}>
                <Ionicons name="share-social" size={18} color={colors.secondary} />
                <Text style={styles.ruleText}>결과를 파트너에게 공유</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={startChallenge} activeOpacity={0.8}>
              <Text style={styles.startBtnText}>챌린지 시작!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- Quiz ---
  if (phase === 'quiz' && currentQuiz) {
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* 진행 표시 */}
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {challengeQuizzes.length}
            </Text>
            <Text style={styles.scoreText}>맞힌 수: {score}</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / challengeQuizzes.length) * 100}%` },
              ]}
            />
          </View>

          {/* 문제 */}
          <View style={styles.quizCard}>
            <Text style={styles.quizType}>
              {currentQuiz.type === 'multiple_choice' ? '객관식' :
               currentQuiz.type === 'fill_blank' ? '빈칸 채우기' :
               currentQuiz.type === 'word_order' ? '어순 배열' :
               currentQuiz.type === 'meaning_match' ? '의미 매칭' : '퀴즈'}
            </Text>
            <Text style={styles.quizQuestion}>{currentQuiz.question}</Text>
            {currentQuiz.questionKo && (
              <Text style={styles.quizQuestionKo}>{currentQuiz.questionKo}</Text>
            )}
          </View>

          {/* 선택지 */}
          {currentQuiz.options?.map((opt) => {
            const isOptCorrect = answered && opt === currentQuiz.correctAnswer;
            const isOptWrong = answered && opt === selectedAnswer && !isCorrect;
            const isOptSelected = !answered && opt === selectedAnswer;

            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionBtn,
                  isOptCorrect && styles.optionCorrect,
                  isOptWrong && styles.optionWrong,
                  isOptSelected && styles.optionSelected,
                ]}
                onPress={() => handleSelect(opt)}
                activeOpacity={0.8}
                disabled={answered}
              >
                <Text
                  style={[
                    styles.optionText,
                    answered && opt === currentQuiz.correctAnswer && styles.optionTextCorrect,
                    answered && opt === selectedAnswer && !isCorrect && styles.optionTextWrong,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* 피드백 */}
          {answered && (
            <View style={styles.feedbackBox}>
              <Ionicons
                name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                size={24}
                color={isCorrect ? colors.success : colors.error}
              />
              <Text style={[styles.feedbackText, { color: isCorrect ? colors.success : colors.error }]}>
                {isCorrect ? '정답!' : `오답 — 정답: ${currentQuiz.correctAnswer}`}
              </Text>
            </View>
          )}

          {answered && (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>
                {currentIndex + 1 >= challengeQuizzes.length ? '결과 보기' : '다음 문제'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- Result ---
  const percentage = challengeQuizzes.length > 0 ? Math.round((score / challengeQuizzes.length) * 100) : 0;
  const emoji = percentage === 100 ? '🎉' : percentage >= 60 ? '👏' : '💪';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{emoji}</Text>
          <Text style={styles.resultTitle}>챌린지 완료!</Text>
          <Text style={styles.resultScore}>
            {score} / {challengeQuizzes.length}
          </Text>
          <Text style={styles.resultPercent}>{percentage}% 정답</Text>
          <Text style={styles.resultMsg}>
            {percentage === 100 ? '완벽해요! 파트너도 이길 수 있을까?' :
             percentage >= 60 ? '잘했어요! 파트너의 점수가 궁금하죠?' :
             '괜찮아요! 다시 도전하면 더 잘할 수 있어요!'}
          </Text>

          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Ionicons name="share-social" size={20} color="#FFF" />
            <Text style={styles.shareBtnText}>파트너에게 공유</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.retryBtn} onPress={startChallenge} activeOpacity={0.8}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={styles.retryBtnText}>다시 도전</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.lg },

  // Intro
  introCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', ...shadow.md },
  introEmoji: { fontSize: 48, marginBottom: spacing.sm },
  introTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  introDesc: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  ruleBox: { alignSelf: 'stretch', gap: spacing.sm, marginBottom: spacing.lg },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ruleText: { fontSize: fontSize.md, color: colors.text },
  startBtn: { backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: borderRadius.full },
  startBtnText: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: '#FFF' },

  // Progress
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  progressText: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text },
  scoreText: { fontSize: fontSize.sm, color: colors.success, fontWeight: fontWeight.semibold },
  progressBar: { height: 6, backgroundColor: colors.borderLight, borderRadius: 3, marginBottom: spacing.lg, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },

  // Quiz
  quizCard: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.lg, marginBottom: spacing.md, ...shadow.sm },
  quizType: { fontSize: fontSize.xs, color: colors.textLight, fontWeight: fontWeight.semibold, textTransform: 'uppercase', marginBottom: spacing.xs },
  quizQuestion: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  quizQuestionKo: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },

  // Options
  optionBtn: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 2, borderColor: colors.border, ...shadow.sm },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.errorLight },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.successLight },
  optionWrong: { borderColor: colors.error, backgroundColor: colors.errorLight },
  optionText: { fontSize: fontSize.md, color: colors.text },
  optionTextCorrect: { color: colors.success, fontWeight: fontWeight.bold },
  optionTextWrong: { color: colors.error, fontWeight: fontWeight.bold },

  // Feedback
  feedbackBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, marginBottom: spacing.md },
  feedbackText: { fontSize: fontSize.md, fontWeight: fontWeight.bold },

  // Next
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.full, paddingVertical: spacing.md },
  nextBtnText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#FFF' },

  // Result
  resultCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', ...shadow.md },
  resultEmoji: { fontSize: 56, marginBottom: spacing.sm },
  resultTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  resultScore: { fontSize: 48, fontWeight: fontWeight.bold, color: colors.primary },
  resultPercent: { fontSize: fontSize.lg, color: colors.textSecondary, marginBottom: spacing.sm },
  resultMsg: { fontSize: fontSize.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primary, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: borderRadius.full, marginBottom: spacing.sm },
  shareBtnText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: '#FFF' },
  retryBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: borderRadius.full, borderWidth: 2, borderColor: colors.primary },
  retryBtnText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.primary },
});
