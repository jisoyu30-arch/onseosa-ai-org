import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useTheme } from '../utils/useTheme';
import type { LearningMode } from '../types';

const LANGS: { code: LearningMode; flag: string; label: string }[] = [
  { code: 'es', flag: '🇪🇸', label: '스페인어' },
  { code: 'en', flag: '🇬🇧', label: '영어' },
  { code: 'zh', flag: '🇨🇳', label: '중국어' },
];

export default function LanguageSwitcher() {
  const { colors } = useTheme();
  const mode = useSettingsStore((s) => s.learningMode);
  const update = useSettingsStore((s) => s.update);

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {LANGS.map((l) => {
        const active = mode === l.code;
        return (
          <Pressable
            key={l.code}
            onPress={() => update({ learningMode: l.code })}
            style={[styles.btn, active && { backgroundColor: colors.primary }]}
          >
            <Text style={styles.flag}>{l.flag}</Text>
            <Text style={[styles.label, { color: active ? '#fff' : colors.text }]}>{l.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, gap: 4 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  flag: { fontSize: 18 },
  label: { fontSize: 13, fontWeight: '600' },
});
