// 다중 음성 발음 버튼 (미국 남/여, 영국 남/여 등)
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSpeech, VOICE_PRESETS } from '../utils/useSpeech';
import { useTheme } from '../utils/useTheme';
import type { LearningMode } from '../types';

interface Props {
  text: string;
  mode: LearningMode;
  compact?: boolean;
}

export default function VoiceButtons({ text, mode, compact = false }: Props) {
  const { colors } = useTheme();
  const { speakWith } = useSpeech();
  const presets = VOICE_PRESETS[mode] ?? [];

  if (compact) {
    // 컴팩트: 첫 번째 voice만 (기본 듣기)
    return (
      <Pressable
        onPress={() => presets[0] && speakWith(text, presets[0])}
        style={[styles.compactBtn, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
        hitSlop={8}
      >
        <Ionicons name="volume-high" size={22} color={colors.primary} />
      </Pressable>
    );
  }

  return (
    <View style={styles.row}>
      {presets.map((p) => {
        const isFemale = p.gender === 'female';
        return (
          <Pressable
            key={p.id}
            onPress={() => speakWith(text, p)}
            style={[
              styles.btn,
              {
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderColor: isFemale ? '#EC4899' : '#3B82F6',
              },
            ]}
          >
            <Text style={styles.flag}>{p.flag}</Text>
            <Text style={styles.gender}>{isFemale ? '♀' : '♂'}</Text>
            <Text style={[styles.label, { color: '#374151' }]}>{p.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1.5,
  },
  flag: { fontSize: 14 },
  gender: { fontSize: 13, fontWeight: '800' },
  label: { fontSize: 11, fontWeight: '700' },
  compactBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
});
