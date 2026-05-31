import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useTheme } from '../utils/useTheme';
import { matchPhrase, type MatchResult } from '../utils/voiceMatch';
import type { LearningMode } from '../types';

const LANG_CODES: Record<LearningMode, string> = {
  es: 'es-ES',
  en: 'en-US',
  zh: 'zh-CN',
};

interface Props {
  expected: string;        // 정답 (사용자가 따라 말해야 할 문장)
  mode: LearningMode;
  compact?: boolean;       // 작은 버전 (DialogueCard 안)
}

export default function VoiceCheck({ expected, mode, compact = false }: Props) {
  const { colors } = useTheme();
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [transcript, setTranscript] = useState('');
  const lastResult = useRef('');
  const lastConfidence = useRef<number | undefined>(undefined);

  // 펄스 애니메이션 (녹음 중)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (recording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.4, duration: 600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [recording, pulseAnim]);

  // 인식 이벤트
  useSpeechRecognitionEvent('result', (e) => {
    const text = e.results?.[0]?.transcript ?? '';
    if (text) {
      setTranscript(text);
      lastResult.current = text;
    }
  });

  useSpeechRecognitionEvent('end', () => {
    setRecording(false);
    if (lastResult.current) {
      const r = matchPhrase(expected, lastResult.current);
      setResult(r);
    }
  });

  useSpeechRecognitionEvent('error', (e) => {
    setRecording(false);
    Alert.alert('인식 오류', `${e.error ?? '알 수 없는 오류'}`);
  });

  const start = async () => {
    try {
      // 권한 요청
      const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('권한 필요', '마이크 권한을 허용해주세요.');
        return;
      }
      setResult(null);
      setTranscript('');
      lastResult.current = '';
      setRecording(true);
      ExpoSpeechRecognitionModule.start({
        lang: LANG_CODES[mode],
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
      });
    } catch (e: any) {
      setRecording(false);
      Alert.alert('시작 실패', e?.message ?? '');
    }
  };

  const stop = () => {
    try { ExpoSpeechRecognitionModule.stop(); } catch {}
    setRecording(false);
  };

  const reset = () => {
    setResult(null);
    setTranscript('');
  };

  if (compact) {
    return (
      <View style={styles.compactWrap}>
        <Pressable
          onPress={recording ? stop : start}
          style={[
            styles.micCompact,
            { backgroundColor: recording ? colors.error : colors.surface, borderColor: recording ? colors.error : colors.border },
          ]}
        >
          {recording && (
            <Animated.View
              style={[
                styles.pulseRing,
                { borderColor: colors.error, transform: [{ scale: pulseAnim }] },
              ]}
            />
          )}
          <Ionicons name={recording ? 'stop' : 'mic'} size={16} color={recording ? '#fff' : colors.primary} />
        </Pressable>
        {recording && (
          <View style={[styles.recBadge, { backgroundColor: colors.error }]}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
          </View>
        )}
        {result && !recording && (
          <View style={[styles.compactBadge, { backgroundColor: scoreColor(result.score, colors) }]}>
            <Text style={styles.compactScore}>{result.score}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[
      styles.wrap,
      {
        backgroundColor: recording ? colors.error + '11' : colors.surface,
        borderColor: recording ? colors.error : colors.border,
        borderWidth: recording ? 2 : 1,
      },
    ]}>
      <View style={styles.row}>
        <View style={{ position: 'relative' }}>
          {recording && (
            <Animated.View
              style={[
                styles.pulseRingBig,
                { borderColor: colors.error, transform: [{ scale: pulseAnim }] },
              ]}
            />
          )}
          <Pressable
            onPress={recording ? stop : start}
            style={[styles.mic, { backgroundColor: recording ? colors.error : colors.primary }]}
          >
            <Ionicons name={recording ? 'stop' : 'mic'} size={26} color="#fff" />
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {recording && (
              <View style={[styles.recBadge, { backgroundColor: colors.error }]}>
                <View style={styles.recDot} />
                <Text style={styles.recText}>REC</Text>
              </View>
            )}
            <Text style={[styles.label, { color: recording ? colors.error : colors.textSecondary }]}>
              {recording ? '듣고 있어요...' : result ? '결과' : '🎤 따라 말해보세요'}
            </Text>
          </View>
          {transcript && !result && (
            <Text style={[styles.transcript, { color: colors.textSecondary }]} numberOfLines={2}>
              "{transcript}"
            </Text>
          )}
          {result && (
            <View style={{ marginTop: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.score, { color: scoreColor(result.score, colors) }]}>
                  {result.score}점
                </Text>
                <Text style={[styles.feedback, { color: colors.text }]}>{result.feedback}</Text>
              </View>
              <Text style={[styles.heardLabel, { color: colors.textSecondary }]}>들은 것:</Text>
              <Text style={[styles.heard, { color: colors.text }]}>"{result.heard}"</Text>
              {/* 단어별 색깔 */}
              <View style={styles.wordRow}>
                {result.expectedWords.map((w, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.word,
                      {
                        backgroundColor: result.wordMatches[i] ? colors.successLight : colors.errorLight,
                        color: result.wordMatches[i] ? colors.success : colors.error,
                      },
                    ]}
                  >
                    {w}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
        {result && (
          <Pressable onPress={reset} hitSlop={8}>
            <Ionicons name="refresh" size={20} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function scoreColor(score: number, colors: any): string {
  if (score >= 75) return colors.success;
  if (score >= 50) return colors.warning;
  return colors.error;
}

const styles = StyleSheet.create({
  wrap: { padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mic: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 12, fontWeight: '700' },
  transcript: { fontSize: 13, fontStyle: 'italic', marginTop: 2 },
  score: { fontSize: 22, fontWeight: '900' },
  feedback: { fontSize: 13, fontWeight: '700' },
  heardLabel: { fontSize: 10, fontWeight: '700', marginTop: 6 },
  heard: { fontSize: 12, fontStyle: 'italic', marginBottom: 4 },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  word: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, fontSize: 12, fontWeight: '600' },

  compactWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  micCompact: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, position: 'relative' },
  pulseRing: {
    position: 'absolute', top: -2, left: -2, right: -2, bottom: -2,
    borderRadius: 16, borderWidth: 2,
  },
  pulseRingBig: {
    position: 'absolute', top: -4, left: -4, right: -4, bottom: -4,
    borderRadius: 28, borderWidth: 3,
  },
  recBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  recDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  recText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  compactBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6, minWidth: 26, alignItems: 'center' },
  compactScore: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
