import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getLessonById } from '../../data/lessons';
import { sentences } from '../../data/sentences';
import { quizzes } from '../../data/quizzes';
import { getTermsForLesson } from '../../data/tango-terms';
import { getBonusById } from '../../data/bonuses';
import { getMissionById } from '../../data/missions';
import { homeworks } from '../../data/homeworks';
import { getGrammarNoteById } from '../../data/grammar-notes';
import { SentenceCard } from '../../components/lesson/SentenceCard';
import { ProgressBar } from '../../components/lesson/ProgressBar';
import { LessonComplete } from '../../components/lesson/LessonComplete';
import { MultipleChoice } from '../../components/quiz/MultipleChoice';
import { FillBlank } from '../../components/quiz/FillBlank';
import { WordOrder } from '../../components/quiz/WordOrder';
import { MeaningMatch } from '../../components/quiz/MeaningMatch';
import { ReverseTranslate } from '../../components/quiz/ReverseTranslate';
import { Dictation } from '../../components/quiz/Dictation';
import { TermCard } from '../../components/curriculum/TermCard';
import { GrammarCard } from '../../components/curriculum/GrammarCard';
import { BonusKnowledgeCard } from '../../components/curriculum/BonusKnowledgeCard';
import { MissionCard } from '../../components/curriculum/MissionCard';
import { HomeworkCard } from '../../components/curriculum/HomeworkCard';
import { useProgressStore } from '../../stores/useProgressStore';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../constants/theme';
import type { LessonPhase } from '../../types';
import { Button } from '../../components/common/Button';

const XP_PER_CORRECT = 10;
const XP_BASE = 5;

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
  const termList = lesson.termIds ? getTermsForLesson(lesson.termIds) : [];
  const bonus = lesson.bonusId ? getBonusById(lesson.bonusId) : undefined;
  const mission = lesson.missionId ? getMissionById(lesson.missionId) : undefined;
  const homeworkList = lesson.homeworkIds ? lesson.homeworkIds.map((id) => homeworks[id]).filter(Boolean) : [];
  const grammarNote = lesson.grammarId ? getGrammarNoteById(lesson.grammarId) : undefined;

  // 전체 스텝 수 계산
  const grammarSteps = grammarNote ? 1 : 0;
  const termSteps = termList.length;
  const bonusSteps = bonus ? 1 : 0;
  const missionSteps = mission ? 1 : 0;
  const homeworkSteps = homeworkList.length;
  const totalSteps = sentenceList.length + quizList.length + grammarSteps + termSteps + bonusSteps + missionSteps + homeworkSteps;

  const currentStep =
    phase === 'sentences' ? currentIndex
    : phase === 'quiz' ? sentenceList.length + currentIndex
    : phase === 'grammar' ? sentenceList.length + quizList.length
    : phase === 'term' ? sentenceList.length + quizList.length + grammarSteps + currentIndex
    : phase === 'bonus' ? sentenceList.length + quizList.length + grammarSteps + termSteps + currentIndex
    : phase === 'mission' ? sentenceList.length + quizList.length + grammarSteps + termSteps + bonusSteps
    : phase === 'homework' ? sentenceList.length + quizList.length + grammarSteps + termSteps + bonusSteps + missionSteps + currentIndex
    : totalSteps;

  const phaseLabel =
    phase === 'sentences' ? '문장'
    : phase === 'quiz' ? '퀴즈'
    : phase === 'grammar' ? '문법'
    : phase === 'term' ? '용어'
    : phase === 'bonus' ? '보너스'
    : phase === 'mission' ? '미션'
    : phase === 'homework' ? '숙제'
    : '';

  // === 다음 단계로 진행하는 헬퍼 ===
  const goToComplete = (xp: number) => {
    completeLesson(lesson.id, xp);
    setPhase('complete');
  };

  const goToHomeworkOrComplete = (xp: number) => {
    if (homeworkList.length > 0) {
      setPhase('homework');
      setCurrentIndex(0);
    } else {
      goToComplete(xp);
    }
  };

  const advanceAfterQuiz = (finalXp: number) => {
    if (grammarNote) {
      setPhase('grammar');
      setCurrentIndex(0);
    } else if (termList.length > 0) {
      setPhase('term');
      setCurrentIndex(0);
    } else if (bonus) {
      setPhase('bonus');
      setCurrentIndex(0);
    } else if (mission) {
      setPhase('mission');
      setCurrentIndex(0);
    } else {
      goToHomeworkOrComplete(finalXp);
    }
  };

  const advanceAfterGrammar = () => {
    if (termList.length > 0) {
      setPhase('term');
      setCurrentIndex(0);
    } else if (bonus) {
      setPhase('bonus');
      setCurrentIndex(0);
    } else if (mission) {
      setPhase('mission');
      setCurrentIndex(0);
    } else {
      goToHomeworkOrComplete(earnedXp);
    }
  };

  const advanceAfterTerm = () => {
    if (currentIndex < termList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (bonus) {
      setPhase('bonus');
      setCurrentIndex(0);
    } else if (mission) {
      setPhase('mission');
      setCurrentIndex(0);
    } else {
      goToHomeworkOrComplete(earnedXp);
    }
  };

  const advanceAfterBonus = () => {
    if (mission) {
      setPhase('mission');
      setCurrentIndex(0);
    } else {
      goToHomeworkOrComplete(earnedXp);
    }
  };

  const advanceAfterMission = (missionXp: number) => {
    const finalXp = earnedXp + missionXp;
    setEarnedXp(finalXp);
    goToHomeworkOrComplete(finalXp);
  };

  const advanceAfterHomework = (hwXp: number) => {
    const newXp = earnedXp + hwXp;
    setEarnedXp(newXp);
    if (currentIndex < homeworkList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeLesson(lesson.id, newXp);
      setPhase('complete');
    }
  };

  // === 문장 카드 다음 ===
  const handleNextSentence = () => {
    if (currentIndex < sentenceList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setPhase('quiz');
      setCurrentIndex(0);
    }
  };

  // === 퀴즈 답변 ===
  const handleQuizAnswer = (correct: boolean) => {
    let newXp = earnedXp;
    if (correct) {
      setCorrectCount((c) => c + 1);
      newXp += XP_PER_CORRECT;
      setEarnedXp(newXp);
    } else {
      const quiz = quizList[currentIndex];
      if (quiz) addWrongSentence(quiz.sentenceId);
    }

    if (currentIndex < quizList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const finalXp = newXp + XP_BASE;
      setEarnedXp(finalXp);
      advanceAfterQuiz(finalXp);
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
        case 'meaning_match':
          return <MeaningMatch key={quiz.id} quiz={quiz} onAnswer={handleQuizAnswer} />;
        case 'reverse_translate':
          return <ReverseTranslate key={quiz.id} quiz={quiz} onAnswer={handleQuizAnswer} />;
        case 'listening':
          return <Dictation key={quiz.id} quiz={quiz} onAnswer={handleQuizAnswer} />;
        default:
          return <MultipleChoice key={quiz.id} quiz={quiz} onAnswer={handleQuizAnswer} />;
      }
    }

    if (phase === 'grammar' && grammarNote) {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <GrammarCard note={grammarNote} />
          <View style={styles.nextWrap}>
            <Button title="다음" onPress={advanceAfterGrammar} size="lg" />
          </View>
        </ScrollView>
      );
    }

    if (phase === 'term') {
      const term = termList[currentIndex];
      if (!term) return null;
      return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TermCard term={term} />
          <View style={styles.nextWrap}>
            <Button title="다음" onPress={advanceAfterTerm} size="lg" />
          </View>
        </ScrollView>
      );
    }

    if (phase === 'bonus' && bonus) {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <BonusKnowledgeCard bonus={bonus} />
          <View style={styles.nextWrap}>
            <Button title="다음" onPress={advanceAfterBonus} size="lg" />
          </View>
        </ScrollView>
      );
    }

    if (phase === 'mission' && mission) {
      return (
        <MissionCard
          mission={mission}
          onComplete={() => advanceAfterMission(mission.xpReward)}
        />
      );
    }

    if (phase === 'homework') {
      const hw = homeworkList[currentIndex];
      if (!hw) return null;
      return (
        <HomeworkCard
          homework={hw}
          onComplete={() => advanceAfterHomework(hw.xpReward)}
        />
      );
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
          <Text style={styles.phaseLabel}>{phaseLabel}</Text>
        </View>
      )}

      {/* 상황 설명 (문장 첫 번째만) */}
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
    minWidth: 40,
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  nextWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
});
