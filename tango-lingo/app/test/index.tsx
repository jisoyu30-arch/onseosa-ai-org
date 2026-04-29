import { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useDialogueProgress } from '../../stores/useDialogueProgress';
import { useTestStore } from '../../stores/useTestStore';
import { useTheme } from '../../utils/useTheme';
import { useSpeech } from '../../utils/useSpeech';
import { generateTest, type Question } from '../../utils/testGenerator';
import { estimateLevel, LEVEL_CRITERIA_KO } from '../../utils/levelEstimator';

export default function TestScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const { speak } = useSpeech();
  const mode = useSettingsStore((s) => s.learningMode);
  const completedIds = useDialogueProgress((s) => s.langs[mode].completedIds);
  const recordResult = useTestStore((s) => s.recordResult);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'question' | 'answered' | 'finished'>('intro');

  const start = () => {
    const q = generateTest(completedIds, mode, 5);
    if (q.length === 0) {
      setPhase('finished');
      return;
    }
    setQuestions(q);
    setCurrentIdx(0);
    setSelectedIdx(null);
    setCorrect(0);
    setWrong(0);
    setPhase('question');
  };

  const select = (idx: number) => {
    if (phase !== 'question') return;
    setSelectedIdx(idx);
    const q = questions[currentIdx];
    if (idx === q.correctIndex) {
      setCorrect((c) => c + 1);
    } else {
      setWrong((w) => w + 1);
    }
    setPhase('answered');
  };

  const next = () => {
    if (currentIdx + 1 >= questions.length) {
      // 시험 종료 — 결과 기록
      recordResult(mode, correct + (selectedIdx === questions[currentIdx].correctIndex ? 0 : 0), wrong);
      setPhase('finished');
      return;
    }
    setCurrentIdx(currentIdx + 1);
    setSelectedIdx(null);
    setPhase('question');
  };

  // ========== 인트로 ==========
  if (phase === 'intro') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Header colors={colors} onClose={() => router.back()} title="레벨 시험" />
        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ fontSize: 36, marginBottom: 8 }}>📝</Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>5문제 미니 시험</Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary }]}>
              학습한 대화에서 자동 출제됩니다.{'\n'}
              번역·빈칸·듣기 3가지 유형.
            </Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary, marginTop: 8 }]}>
              학습 완료한 대화: <Text style={{ color: colors.primary, fontWeight: '800' }}>{completedIds.length}개</Text>
            </Text>
            {completedIds.length < 1 && (
              <Text style={{ color: colors.warning, fontSize: 12, marginTop: 8 }}>
                ⚠️ 최소 1개 대화 학습 필요. (sentences 풀에서 일부 출제 가능)
              </Text>
            )}
          </View>
          <Pressable style={[styles.startBtn, { backgroundColor: colors.primary }]} onPress={start}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>시험 시작 →</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ========== 결과 ==========
  if (phase === 'finished') {
    const total = correct + wrong;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Header colors={colors} onClose={() => router.back()} title="결과" />
        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, alignItems: 'center' }]}>
            <Text style={{ fontSize: 56, marginBottom: 8 }}>
              {score >= 80 ? '🏆' : score >= 60 ? '🎉' : score >= 40 ? '👍' : '💪'}
            </Text>
            <Text style={[styles.scoreText, { color: scoreColor(score, colors) }]}>{score}점</Text>
            <Text style={[styles.cardSub, { color: colors.textSecondary, marginTop: 4 }]}>
              {correct} 맞음 · {wrong} 틀림
            </Text>
            {questions.length === 0 && (
              <Text style={{ color: colors.warning, fontSize: 13, marginTop: 12, textAlign: 'center' }}>
                아직 시험 문제 만들 데이터 부족.{'\n'}대화 몇 개 학습하고 다시 와요.
              </Text>
            )}
            <Text style={[styles.cardSub, { color: colors.textSecondary, marginTop: 12, textAlign: 'center' }]}>
              💡 이 결과가 자동 레벨 산정에 반영됩니다
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable style={[styles.btn, { backgroundColor: colors.secondary, flex: 1 }]} onPress={start}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>↻ 다시</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor: colors.primary, flex: 2 }]} onPress={() => router.back()}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>완료</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ========== 문제 ==========
  const q = questions[currentIdx];
  if (!q) return null;
  const progress = ((currentIdx + (phase === 'answered' ? 1 : 0)) / questions.length) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header colors={colors} onClose={() => router.back()} title={`${currentIdx + 1} / ${questions.length}`} />
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {/* 힌트 */}
        <Text style={[styles.hint, { color: colors.textSecondary }]}>{q.hint}</Text>

        {/* 문제 */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, alignItems: 'center' }]}>
          {q.type === 'listen' && (
            <Pressable
              onPress={() => speak(q.audioText!, mode)}
              style={[styles.listenBtn, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="volume-high" size={32} color="#fff" />
            </Pressable>
          )}
          <Text style={[styles.questionText, { color: colors.text }]}>
            {q.prompt}
          </Text>
          {q.promptKo && q.type !== 'translate' && (
            <Text style={[styles.questionSub, { color: colors.textSecondary }]}>{q.promptKo}</Text>
          )}
        </View>

        {/* 선택지 */}
        <View style={{ gap: 8 }}>
          {q.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === q.correctIndex;
            const showResult = phase === 'answered';
            const bg = !showResult
              ? colors.surface
              : isCorrect
              ? colors.successLight
              : isSelected
              ? colors.errorLight
              : colors.surface;
            const borderC = !showResult
              ? colors.border
              : isCorrect
              ? colors.success
              : isSelected
              ? colors.error
              : colors.border;

            return (
              <Pressable
                key={idx}
                onPress={() => select(idx)}
                disabled={phase !== 'question'}
                style={[styles.option, { backgroundColor: bg, borderColor: borderC }]}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>
                  {String.fromCharCode(65 + idx)}. {opt}
                </Text>
                {showResult && isCorrect && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
                {showResult && isSelected && !isCorrect && <Ionicons name="close-circle" size={20} color={colors.error} />}
              </Pressable>
            );
          })}
        </View>

        {/* 다음 버튼 */}
        {phase === 'answered' && (
          <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={next}>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
              {currentIdx + 1 >= questions.length ? '결과 보기 →' : '다음 →'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ colors, onClose, title }: any) {
  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable onPress={onClose} hitSlop={10}>
        <Ionicons name="close" size={26} color={colors.text} />
      </Pressable>
      <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      <View style={{ width: 26 }} />
    </View>
  );
}

function scoreColor(score: number, colors: any): string {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.warning;
  return colors.error;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  progressTrack: { height: 4 },
  progressFill: { height: '100%' },

  card: { padding: 20, borderRadius: 14, borderWidth: 1, gap: 6 },
  cardTitle: { fontSize: 20, fontWeight: '800' },
  cardSub: { fontSize: 13, lineHeight: 19 },

  hint: { fontSize: 12, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 },
  questionText: { fontSize: 22, fontWeight: '700', textAlign: 'center', lineHeight: 30 },
  questionSub: { fontSize: 13, marginTop: 6 },
  listenBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },

  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, borderRadius: 10, borderWidth: 1.5, gap: 8,
  },
  optionText: { fontSize: 15, fontWeight: '600', flex: 1 },

  startBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  btn: { padding: 14, borderRadius: 10, alignItems: 'center' },
  scoreText: { fontSize: 56, fontWeight: '900', marginTop: 4 },
});
