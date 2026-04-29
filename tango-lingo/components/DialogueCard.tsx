import { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useTheme } from '../utils/useTheme';
import { useSpeech } from '../utils/useSpeech';
import { tagText } from '../utils/pos-tagger';
import { getCached, getTranslation } from '../utils/translator';
import PosText from './PosText';
import VoiceCheck from './VoiceCheck';
import type { EnrichedLine } from '../utils/dialogueHelper';

interface Props {
  line: EnrichedLine;
}

export default function DialogueCard({ line }: Props) {
  const { colors } = useTheme();
  const mode = useSettingsStore((s) => s.learningMode);
  const { speak } = useSpeech();

  // 1) 사전 매칭된 번역 먼저 (sentences에서 가져온 것)
  // 2) 없으면 캐시
  // 3) 없으면 Gemini fetch (백그라운드)
  const presetText =
    mode === 'es' ? line.spanish :
    mode === 'en' ? line.english :
    line.chinese;

  const [dynText, setDynText] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'es') { setDynText(null); return; }
    if (presetText) { setDynText(null); return; }   // 사전 번역 있으면 fetch 불필요

    // 캐시 즉시 확인
    const cached = getCached(line.spanish);
    if (cached) {
      setDynText(mode === 'en' ? cached.en : cached.zh);
      return;
    }

    // 비동기 fetch
    setDynText(null);
    let canceled = false;
    getTranslation(line.spanish).then((res) => {
      if (canceled) return;
      setDynText(mode === 'en' ? res.en : res.zh);
    });
    return () => { canceled = true; };
  }, [line.spanish, mode, presetText]);

  const targetText = mode === 'es' ? line.spanish : (presetText ?? dynText ?? '...');
  const isLoading = mode !== 'es' && !presetText && dynText === null;

  const pronunciation =
    mode === 'es' ? line.pronunciation :
    mode === 'en' ? line.pronunciationEn :
    line.pronunciationZh;

  const tokens = useMemo(
    () => tagText(targetText, mode),
    [targetText, mode],
  );

  const speakerLower = line.speaker.toLowerCase();
  const isLeft = speakerLower.includes('a') || speakerLower.includes('profesor') || speakerLower.includes('선생');

  return (
    <View style={[styles.wrap, isLeft ? styles.leftAlign : styles.rightAlign]}>
      <Text style={[styles.speaker, { color: colors.textSecondary }]}>{line.speaker}</Text>

      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isLeft ? colors.surface : colors.primaryLight + '22',
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            {isLoading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>번역 중...</Text>
              </View>
            ) : (
              <PosText tokens={tokens} fallback={targetText} fontSize={18} color={colors.text} />
            )}
          </View>
          {!isLoading && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Pressable onPress={() => speak(targetText, mode)} style={styles.speakBtn} hitSlop={8}>
                <Ionicons name="volume-high" size={22} color={colors.primary} />
              </Pressable>
              <VoiceCheck expected={targetText} mode={mode} compact />
            </View>
          )}
        </View>

        {pronunciation && (
          <Text style={[styles.pron, { color: colors.textSecondary }]}>{pronunciation}</Text>
        )}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.korean, { color: colors.text }]}>🇰🇷 {line.korean}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 4, maxWidth: '92%' },
  leftAlign: { alignSelf: 'flex-start' },
  rightAlign: { alignSelf: 'flex-end' },
  speaker: { fontSize: 11, fontWeight: '700', marginBottom: 2, paddingHorizontal: 4 },
  bubble: { padding: 12, borderRadius: 14, borderWidth: 1, gap: 8 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  speakBtn: { padding: 4 },
  pron: { fontSize: 12, fontStyle: 'italic' },
  divider: { height: 1, marginVertical: 2 },
  korean: { fontSize: 14, fontWeight: '500' },
});
