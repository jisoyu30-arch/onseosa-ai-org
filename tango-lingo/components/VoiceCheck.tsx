import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform } from 'react-native';
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
            { backgroundColor: recording ? colors.error : colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name={recording ? 'stop' : 'mic'} size={16} color={recording ? '#fff' : colors.primary} />
        </Pressable>
        {result && (
          <View style={[styles.compactBadge, { backgroundColor: scoreColor(result.score, colors) }]}>
            <Text style={styles.compactScore}>{result.score}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <Pressable
          onPress={recording ? stop : start}
          style={[styles.mic, { backgroundColor: recording ? colors.error : colors.primary }]}
        >
          <Ionicons name={recording ? 'stop' : 'mic'} size={26} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {recording ? '듣고 있어요...' : result ? '결과' : '🎤 따라 말해보세요'}
          </Text>
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
  micCompact: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  compactBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6, minWidth: 26, alignItems: 'center' },
  compactScore: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
