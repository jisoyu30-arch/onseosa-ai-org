import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { lessons } from '../../data/lessons';
import { sentences } from '../../data/sentences';
import { ShadowingCard } from '../../components/lesson/ShadowingCard';
import {
  speak,
  stopSpeaking,
  requestMicPermission,
  startRecording,
  stopRecording,
  playRecordedAudio,
  stopPlayback,
} from '../../utils/audio';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';
import type { Sentence } from '../../types';

type Phase = 'select' | 'practice';
type ShadowingPhase = 'idle' | 'listening' | 'recording' | 'comparing';

export default function ShadowingScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shadowPhase, setShadowPhase] = useState<ShadowingPhase>('idle');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  // 녹음 상태 ref (비동기 콜백에서 최신값 참조)
  const shadowPhaseRef = useRef<ShadowingPhase>('idle');
  const setShadowPhaseSync = useCallback((p: ShadowingPhase) => {
    shadowPhaseRef.current = p;
    setShadowPhase(p);
  }, []);

  // 선택한 레슨의 문장 목록
  const selectedLesson = lessons.find((l) => l.id === selectedLessonId);
  const lessonSentences: Sentence[] = selectedLesson
    ? selectedLesson.sentenceIds
        .map((sid) => sentences[sid])
        .filter((s): s is Sentence => !!s)
    : [];
  const currentSentence = lessonSentences[currentIndex] ?? null;
  const totalCount = lessonSentences.length;

  // === 레슨 선택 ===
  const handleSelectLesson = useCallback((lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentIndex(0);
    setRecordingUri(null);
    setShadowPhaseSync('idle');
    setPhase('practice');
  }, [setShadowPhaseSync]);

  // === 쉐도잉 시작: TTS → 녹음 ===
  const handleStart = useCallback(async () => {
    if (!currentSentence) return;
    stopSpeaking();
    await stopPlayback();
    setRecordingUri(null);

    // 1) TTS 재생
    setShadowPhaseSync('listening');
    await speak(currentSentence.spanish, 'es', false);

    // TTS 끝 → 자동 녹음 시작
    if (shadowPhaseRef.current !== 'listening') return; // 중간에 상태 바뀌면 중단
    const granted = await requestMicPermission();
    if (!granted) {
      setShadowPhaseSync('idle');
      return;
    }

    try {
      await startRecording();
      setShadowPhaseSync('recording');
    } catch {
      setShadowPhaseSync('idle');
    }
  }, [currentSentence, setShadowPhaseSync]);

  // === 녹음 중지 ===
  const handleStopRecording = useCallback(async () => {
    try {
      const uri = await stopRecording();
      setRecordingUri(uri);
      setShadowPhaseSync('comparing');
    } catch {
      setShadowPhaseSync('idle');
    }
  }, [setShadowPhaseSync]);

  // === 원본 재생 ===
  const handlePlayOriginal = useCallback(async () => {
    if (!currentSentence) return;
    setShadowPhaseSync('comparing');
    await speak(currentSentence.spanish, 'es', false);
    setShadowPhaseSync('comparing');
  }, [currentSentence, setShadowPhaseSync]);

  // === 내 녹음 재생 ===
  const handlePlayMine = useCallback(async () => {
    if (!recordingUri) return;
    setShadowPhaseSync('comparing');
    try {
      await playRecordedAudio(recordingUri);
    } catch {
      // ignore playback error
    }
    setShadowPhaseSync('comparing');
  }, [recordingUri, setShadowPhaseSync]);

  // === 다시 (retry) ===
  const handleRetry = useCallback(() => {
    stopSpeaking();
    stopPlayback();
    setRecordingUri(null);
    setShadowPhaseSync('idle');
  }, [setShadowPhaseSync]);

  // === 다음 문장 ===
  const handleNext = useCallback(() => {
    stopSpeaking();
    stopPlayback();
    setRecordingUri(null);
    setShadowPhaseSync('idle');
    if (currentIndex < totalCount - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 마지막 문장 → 선택 화면으로
      setPhase('select');
      setSelectedLessonId(null);
    }
  }, [currentIndex, totalCount, setShadowPhaseSync]);

  // === 뒤로가기 ===
  const handleBack = useCallback(() => {
    stopSpeaking();
    stopPlayback();
    if (phase === 'practice') {
      setPhase('select');
      setSelectedLessonId(null);
      setShadowPhaseSync('idle');
      setRecordingUri(null);
    } else {
      router.back();
    }
  }, [phase, router, setShadowPhaseSync]);

  // ========== 레슨 선택 화면 ==========
  if (phase === 'select') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>쉐도잉 연습</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.selectHint}>따라 읽을 레슨을 선택하세요</Text>

        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.lessonItem}
              onPress={() => handleSelectLesson(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.lessonItemLeft}>
                <Text style={styles.lessonItemTitle}>{item.title}</Text>
                <Text style={styles.lessonItemKo}>{item.titleKo}</Text>
                <Text style={styles.lessonItemCount}>
                  {item.sentenceIds.length}문장
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }

  // ========== 쉐도잉 연습 화면 ==========
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentIndex + 1}/{totalCount} 문장
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 진행도 바 */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentIndex + 1) / totalCount) * 100}%` },
          ]}
        />
      </View>

      {/* 쉐도잉 카드 */}
      <View style={styles.cardArea}>
        {currentSentence && (
          <ShadowingCard
            spanish={currentSentence.spanish}
            korean={currentSentence.korean}
            phase={shadowPhase}
            hasRecording={!!recordingUri}
            onPlayOriginal={handlePlayOriginal}
            onPlayMine={handlePlayMine}
            onStopRecording={handleStopRecording}
          />
        )}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomRow}>
        {shadowPhase === 'idle' && (
          <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.7}>
            <Ionicons name="play" size={20} color="#FFF" />
            <Text style={styles.startBtnText}>시작</Text>
          </TouchableOpacity>
        )}

        {(shadowPhase === 'comparing' || (shadowPhase === 'idle' && !!recordingUri)) && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRetry} activeOpacity={0.7}>
              <Ionicons name="refresh" size={18} color={colors.primary} />
              <Text style={styles.retryBtnText}>다시</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.7}>
              <Text style={styles.nextBtnText}>
                {currentIndex < totalCount - 1 ? '다음' : '완료'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
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
  // 진행도
  progressBar: {
    height: 4,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
    borderRadius: 2,
    marginBottom: spacing.md,
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  // 레슨 선택
  selectHint: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  lessonItemLeft: {
    flex: 1,
  },
  lessonItemTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  lessonItemKo: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  lessonItemCount: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  // 카드 영역
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  // 하단
  bottomRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadow.sm,
  },
  startBtnText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  retryBtnText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
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
});
