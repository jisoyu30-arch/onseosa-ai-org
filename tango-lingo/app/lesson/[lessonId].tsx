import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getLessonById } from '../../data/lessons';
import { sentences } from '../../data/sentences';
import { quizzes } from '../../data/quizzes';
import { SentenceCard } from '../../components/lesson/SentenceCard';
import { ProgressBar } from '../../components/lesson/ProgressBar';
import { LessonComplete } from '../../components/lesson/LessonComplete';
import { MultipleChoice } from '../../components/quiz/MultipleChoice';
import { FillBlank } from '../../components/quiz/FillBlank';
import { WordOrder } from '../../components/quiz/WordOrder';
import { useProgressStore } from '../../stores/useProgressStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';
import type { LessonPhase } from '../../types';

const XP_PER_CORRECT = 10;
const XP_BASE = 5; // 레슨 완료 기본 XP

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const lesson = getLessonById(lessonId!);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const addWrongSentence = useProgressStore((s) => s.addWrongSentence);
  const showEnglish = useSettingsStore((s) => s.showEnglish);
  const showChinese = useSettingsStore((s) => s.showChinese);

  const [phase, setPhase] = useState<LessonPhase>('sentences');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>레슨을 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const sentenceList = lesson.sentenceIds.map((id) => sentences[id]).filter(Boolean);
  const quizList = lesson.quizIds.map((id) => quizzes[id]).filter(Boolean);
  const totalSteps = sentenceList.length + quizList.length;

  // 현재 전체 진행률 계산
  const currentStep =
    phase === 'sentences'
      ? currentIndex
      : phase === 'quiz'
      ? sentenceList.length + currentIndex
      : totalSteps;

  // === 문장 카드 다음 ===
  const handleNextSentence = () => {
    if (currentIndex < sentenceList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 퀴즈로 전환
      setPhase('quiz');
      setCurrentIndex(0);
    }
  };

  // === 퀴즈 답변 ===
  const handleQuizAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectCount((c) => c + 1);
      setEarnedXp((x) => x + XP_PER_CORRECT);
    } else {
      // 틀린 문장 저장
      const quiz = quizList[currentIndex];
      if (quiz) addWrongSentence(quiz.sentenceId);
    }

    if (currentIndex < quizList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 레슨 완료
      const finalXp = earnedXp + (correct ? XP_PER_CORRECT : 0) + XP_BASE;
      setEarnedXp(finalXp);
      completeLesson(lesson.id, finalXp);
      setPhase('complete');
    }
  };

  // === 렌더 ===
  const renderContent = () => {
    if (phase === 'sentences') {
      const sentence = sentenceList[currentIndex];
      if (!sentence) return null;
      return (
        <SentenceCard
          sentence={sentence}
          onNext={handleNextSentence}
          showEnglish={showEnglish}
          showChinese={showChinese}
        />
      );
    }

    if (phase === 'quiz') {
      const quiz = quizList[currentIndex];
      if (!quiz) return null;

      switch (quiz.type) {
        case 'multiple_choice':
          return <MultipleChoice key={quiz.id} quiz={quiz} onAnswer={handleQuizAnswer} />;
        case 'fill_blank':
          return <FillBlank key={quiz.id} quiz={quiz} onAnswer={handleQuizAnswer} />;
        case 'word_order':
          return <WordOrder key={quiz.id} quiz={quiz} onAnswer={handleQuizAnswer} />;
        default:
          return <MultipleChoice key={quiz.id} quiz={quiz} onAnswer={handleQuizAnswer} />;
      }
    }

    if (phase === 'complete') {
      return (
        <LessonComplete
          correctCount={correctCount}
          totalQuizzes={quizList.length}
          xpEarned={earnedXp}
          onGoHome={() => router.replace('/(tabs)')}
        />
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 상단 바 */}
      {phase !== 'complete' && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.progressWrap}>
            <ProgressBar current={currentStep} total={totalSteps} />
          </View>
          <Text style={styles.phaseLabel}>
            {phase === 'sentences' ? '문장' : '퀴즈'}
          </Text>
        </View>
      )}

      {/* 상황 설명 (문장 단계 첫 번째일 때만) */}
      {phase === 'sentences' && currentIndex === 0 && (
        <View style={styles.situationBox}>
          <Text style={styles.situationEmoji}>📍</Text>
          <Text style={styles.situationText}>{lesson.situation}</Text>
        </View>
      )}

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {renderContent()}
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  progressWrap: {
    flex: 1,
  },
  phaseLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    minWidth: 36,
    textAlign: 'right',
  },
  situationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.accentLight,
    borderRadius: 8,
  },
  situationEmoji: {
    fontSize: 16,
  },
  situationText: {
    fontSize: fontSize.sm,
    color: colors.text,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});
