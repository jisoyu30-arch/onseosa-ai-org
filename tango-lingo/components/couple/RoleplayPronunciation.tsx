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
import type { RecordingState, PronunciationFeedback } from '../../types';

interface RoleplayPronunciationProps {
  spanish: string;
  isMyTurn: boolean;
}

export function RoleplayPronunciation({ spanish, isMyTurn }: RoleplayPronunciationProps) {
  const [recState, setRecState] = useState<RecordingState>('idle');
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleListen = useCallback(async (slow = false) => {
    try {
      setIsSpeaking(true);
      await speak(spanish, 'es', slow);
    } catch {} finally {
      setIsSpeaking(false);
    }
  }, [spanish]);

  const handleStartRecording = useCallback(async () => {
    const granted = await requestMicPermission();
    if (!granted) return;
    setTranscript(null);
    setFeedback(null);
    setRecordingUri(null);
    try {
      await startRecording();
      setRecState('recording');
    } catch {}
  }, []);

  const handleStopRecording = useCallback(async () => {
    try {
      const uri = await stopRecording();
      setRecordingUri(uri);
      setRecState('recorded');
      if (uri) {
        setIsTranscribing(true);
        const result = await transcribeAudio(uri, spanish, 'es');
        setTranscript(result.text);
        setFeedback(generateFeedback(spanish, result.text, 'es'));
        setIsTranscribing(false);
      }
    } catch {
      setRecState('idle');
      setIsTranscribing(false);
    }
  }, [spanish]);

  const handlePlayback = useCallback(async () => {
    if (!recordingUri) return;
    try {
      setRecState('playing');
      await playRecordedAudio(recordingUri);
    } catch {} finally {
      setRecState('recorded');
    }
  }, [recordingUri]);

  const handleReset = useCallback(() => {
    stopSpeaking();
    stopPlayback();
    setRecState('idle');
    setRecordingUri(null);
    setTranscript(null);
    setFeedback(null);
  }, []);

  const feedbackColor = feedback
    ? feedback.label === 'perfect' || feedback.label === 'great' ? colors.success
    : feedback.label === 'close' || feedback.label === 'missing_word' ? colors.accent
    : colors.error
    : colors.textSecondary;

  return (
    <View style={styles.container}>
      {/* 듣기 */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, isSpeaking && styles.btnActive]}
          onPress={() => handleListen(false)}
          disabled={isSpeaking}
        >
          <Ionicons name="volume-high" size={18} color={isSpeaking ? '#FFF' : colors.secondary} />
          <Text style={[styles.btnLabel, isSpeaking && styles.btnLabelActive]}>듣기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, isSpeaking && styles.btnActive]}
          onPress={() => handleListen(true)}
          disabled={isSpeaking}
        >
          <Ionicons name="play-circle" size={18} color={isSpeaking ? '#FFF' : colors.secondaryLight} />
          <Text style={[styles.btnLabel, isSpeaking && styles.btnLabelActive]}>느리게</Text>
        </TouchableOpacity>
      </View>

      {/* 내 차례일 때만 녹음 */}
      {isMyTurn && (
        <View style={styles.row}>
          {recState === 'idle' && (
            <TouchableOpacity style={styles.recordBtn} onPress={handleStartRecording}>
              <Ionicons name="mic" size={20} color="#FFF" />
              <Text style={styles.recordLabel}>녹음</Text>
            </TouchableOpacity>
          )}

          {recState === 'recording' && (
            <TouchableOpacity style={styles.stopBtn} onPress={handleStopRecording}>
              <Ionicons name="stop" size={20} color="#FFF" />
              <Text style={styles.recordLabel}>중지</Text>
            </TouchableOpacity>
          )}

          {(recState === 'recorded' || recState === 'playing') && (
            <>
              <TouchableOpacity
                style={[styles.btn, recState === 'playing' && styles.btnActive]}
                onPress={handlePlayback}
                disabled={recState === 'playing'}
              >
                <Ionicons name="ear" size={18} color={recState === 'playing' ? '#FFF' : colors.secondary} />
                <Text style={[styles.btnLabel, recState === 'playing' && styles.btnLabelActive]}>내 목소리</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btn} onPress={handleReset}>
                <Ionicons name="refresh" size={18} color={colors.textSecondary} />
                <Text style={styles.btnLabel}>다시</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* 녹음 중 */}
      {recState === 'recording' && (
        <View style={styles.indicator}>
          <View style={styles.dot} />
          <Text style={styles.indicatorText}>녹음 중...</Text>
        </View>
      )}

      {/* 분석 중 */}
      {isTranscribing && (
        <View style={styles.indicator}>
          <ActivityIndicator size="small" color={colors.secondary} />
          <Text style={styles.indicatorText}>분석 중...</Text>
        </View>
      )}

      {/* 결과 */}
      {transcript !== null && !isTranscribing && (
        <Text style={styles.transcript}>{transcript || '(인식 실패)'}</Text>
      )}

      {feedback && !isTranscribing && (
        <Text style={[styles.feedbackText, { color: feedbackColor }]}>{feedback.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  btn: {
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
  btnActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  btnLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  btnLabelActive: {
    color: '#FFF',
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error,
  },
  recordLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
  },
  indicatorText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  transcript: {
    fontSize: fontSize.sm,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  feedbackText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
});
