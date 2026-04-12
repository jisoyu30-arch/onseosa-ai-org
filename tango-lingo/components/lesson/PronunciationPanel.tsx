import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  speak,
  stopSpeaking,
  requestMicPermission,
  startRecording,
  stopRecording,
  playRecordedAudio,
  stopPlayback,
} from '../../utils/audio';
import { generateFeedback } from '../../utils/pronunciation';
import { transcribeAudio } from '../../services/speech';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../constants/theme';
import type { RecordingState, PronunciationFeedback, PracticeLanguage, Sentence } from '../../types';

// 언어 선택 칩 설정
const LANG_OPTIONS: { key: PracticeLanguage; label: string; flag: string }[] = [
  { key: 'es', label: 'ES', flag: '🇦🇷' },
  { key: 'zh', label: '中', flag: '🇨🇳' },
  { key: 'ko', label: '한', flag: '🇰🇷' },
];

interface PronunciationPanelProps {
  sentence: Sentence;
}

/** 문장에서 현재 언어에 맞는 텍스트 추출 */
function getTextForLang(sentence: Sentence, lang: PracticeLanguage): string {
  switch (lang) {
    case 'es': return sentence.spanish;
    case 'zh': return sentence.chinese;
    case 'ko': return sentence.korean;
  }
}

export function PronunciationPanel({ sentence }: PronunciationPanelProps) {
  const [lang, setLang] = useState<PracticeLanguage>('es');
  const [recState, setRecState] = useState<RecordingState>('idle');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const targetText = getTextForLang(sentence, lang);

  // 언어 변경 시 결과 초기화
  const handleLangChange = useCallback((newLang: PracticeLanguage) => {
    stopSpeaking();
    stopPlayback();
    setLang(newLang);
    setRecState('idle');
    setRecordingUri(null);
    setTranscript(null);
    setFeedback(null);
  }, []);

  // === Listen ===
  const handleListen = useCallback(async (slow = false) => {
    try {
      setIsSpeaking(true);
      await speak(targetText, lang, slow);
    } catch (err) {
      console.warn('TTS error:', err);
    } finally {
      setIsSpeaking(false);
    }
  }, [targetText, lang]);

  // === Record ===
  const handleStartRecording = useCallback(async () => {
    const granted = await requestMicPermission();
    if (!granted) return;
    setTranscript(null);
    setFeedback(null);
    setRecordingUri(null);
    try {
      await startRecording();
      setRecState('recording');
    } catch (err) {
      console.warn('Recording start error:', err);
    }
  }, []);

  const handleStopRecording = useCallback(async () => {
    try {
      const uri = await stopRecording();
      setRecordingUri(uri);
      setRecState('recorded');
      if (uri) {
        setIsTranscribing(true);
        const result = await transcribeAudio(uri, targetText, lang);
        setTranscript(result.text);
        const fb = generateFeedback(targetText, result.text, lang);
        setFeedback(fb);
        setIsTranscribing(false);
      }
    } catch (err) {
      console.warn('Recording stop error:', err);
      setRecState('idle');
      setIsTranscribing(false);
    }
  }, [targetText, lang]);

  // === Playback ===
  const handlePlayback = useCallback(async () => {
    if (!recordingUri) return;
    try {
      setRecState('playing');
      await playRecordedAudio(recordingUri);
    } catch (err) {
      console.warn('Playback error:', err);
    } finally {
      setRecState('recorded');
    }
  }, [recordingUri]);

  // === Reset ===
  const handleReset = useCallback(() => {
    stopSpeaking();
    stopPlayback();
    setRecState('idle');
    setRecordingUri(null);
    setTranscript(null);
    setFeedback(null);
    setIsTranscribing(false);
  }, []);

  // === Feedback color ===
  const feedbackColor = feedback
    ? feedback.label === 'perfect' || feedback.label === 'great'
      ? colors.success
      : feedback.label === 'close' || feedback.label === 'missing_word'
      ? colors.accent
      : colors.error
    : colors.textSecondary;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />

      {/* 언어 선택 */}
      <View style={styles.langRow}>
        {LANG_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.langChip, lang === opt.key && styles.langChipActive]}
            onPress={() => handleLangChange(opt.key)}
          >
            <Text style={styles.langFlag}>{opt.flag}</Text>
            <Text style={[styles.langLabel, lang === opt.key && styles.langLabelActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 연습 대상 텍스트 표시 */}
      <Text style={styles.targetText}>{targetText}</Text>

      {/* 듣기 버튼 행 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconBtn, isSpeaking && styles.iconBtnActive]}
          onPress={() => handleListen(false)}
          disabled={isSpeaking}
        >
          <Ionicons name="volume-high" size={20} color={isSpeaking ? '#FFF' : colors.secondary} />
          <Text style={[styles.iconLabel, isSpeaking && styles.iconLabelActive]}>듣기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, isSpeaking && styles.iconBtnActive]}
          onPress={() => handleListen(true)}
          disabled={isSpeaking}
        >
          <Ionicons name="play-circle" size={20} color={isSpeaking ? '#FFF' : colors.secondaryLight} />
          <Text style={[styles.iconLabel, isSpeaking && styles.iconLabelActive]}>느리게</Text>
        </TouchableOpacity>
      </View>

      {/* 녹음 버튼 */}
      <View style={styles.row}>
        {recState === 'idle' && (
          <TouchableOpacity style={styles.recordBtn} onPress={handleStartRecording}>
            <Ionicons name="mic" size={24} color="#FFF" />
            <Text style={styles.recordLabel}>녹음</Text>
          </TouchableOpacity>
        )}

        {recState === 'recording' && (
          <TouchableOpacity style={styles.stopBtn} onPress={handleStopRecording}>
            <Ionicons name="stop" size={24} color="#FFF" />
            <Text style={styles.recordLabel}>중지</Text>
          </TouchableOpacity>
        )}

        {(recState === 'recorded' || recState === 'playing') && (
          <>
            <TouchableOpacity
              style={[styles.iconBtn, recState === 'playing' && styles.iconBtnActive]}
              onPress={handlePlayback}
              disabled={recState === 'playing'}
            >
              <Ionicons name="ear" size={20} color={recState === 'playing' ? '#FFF' : colors.secondary} />
              <Text style={[styles.iconLabel, recState === 'playing' && styles.iconLabelActive]}>
                내 목소리
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color={colors.textSecondary} />
              <Text style={styles.iconLabel}>다시</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 녹음 중 표시 */}
      {recState === 'recording' && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>녹음 중...</Text>
        </View>
      )}

      {/* Transcription 로딩 */}
      {isTranscribing && (
        <View style={styles.transcribing}>
          <ActivityIndicator size="small" color={colors.secondary} />
          <Text style={styles.transcribingText}>분석 중...</Text>
        </View>
      )}

      {/* 결과: 트랜스크립트 */}
      {transcript !== null && !isTranscribing && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>인식 결과</Text>
          <Text style={styles.resultText}>{transcript || '(인식 실패)'}</Text>
        </View>
      )}

      {/* 결과: 피드백 */}
      {feedback && !isTranscribing && (
        <View style={[styles.feedbackBox, { borderLeftColor: feedbackColor }]}>
          <Text style={[styles.feedbackText, { color: feedbackColor }]}>
            {feedback.message}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  // 언어 선택
  langRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  langChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  langFlag: {
    fontSize: 14,
  },
  langLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textSecondary,
  },
  langLabelActive: {
    color: '#FFF',
  },
  // 대상 텍스트
  targetText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  // 공통
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  iconBtnActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  iconLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  iconLabelActive: {
    color: '#FFF',
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error,
  },
  recordLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  recordingText: {
    fontSize: fontSize.sm,
    color: colors.error,
    fontWeight: fontWeight.medium,
  },
  transcribing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  transcribingText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  resultBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  resultLabel: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginBottom: 2,
  },
  resultText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontStyle: 'italic',
  },
  feedbackBox: {
    borderLeftWidth: 3,
    paddingLeft: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  feedbackText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
