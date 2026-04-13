import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { spanishAlphabet, argentinaRules, PronunciationVariant } from '../../data/alphabet';
import { speak, stopSpeaking } from '../../utils/audio';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';
import * as Speech from 'expo-speech';

export default function AlphabetScreen() {
  const router = useRouter();
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  const handleSpeakVariant = useCallback(async (variant: PronunciationVariant, letterId: string) => {
    stopSpeaking();
    const id = `${letterId}_${variant.locale}`;
    if (playingId === id) {
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    try {
      await new Promise<void>((resolve) => {
        Speech.speak(variant.text, {
          language: variant.locale,
          rate: 0.8,
          onDone: resolve,
          onError: () => resolve(),
        });
      });
    } catch {}
    setPlayingId(null);
  }, [playingId]);

  const handleSpeakExample = useCallback(async (word: string) => {
    stopSpeaking();
    await speak(word, 'es');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알파벳 발음</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>글자를 탭하면 6개 언어 발음을 비교할 수 있어요</Text>

        {/* 아르헨티나 규칙 */}
        <TouchableOpacity style={styles.rulesToggle} onPress={() => setShowRules(!showRules)} activeOpacity={0.7}>
          <Text style={styles.rulesIcon}>🇦🇷</Text>
          <Text style={styles.rulesText}>아르헨티나 발음 특징</Text>
          <Ionicons name={showRules ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
        </TouchableOpacity>

        {showRules && (
          <View style={styles.rulesBox}>
            {argentinaRules.map((rule, i) => (
              <View key={i} style={[styles.ruleRow, i < argentinaRules.length - 1 && styles.ruleRowBorder]}>
                <Text style={styles.ruleName}>{rule.rule}</Text>
                <Text style={styles.ruleDesc}>{rule.description}</Text>
                <Text style={styles.ruleExample}>{rule.example}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 알파벳 목록 */}
        {spanishAlphabet.map((entry) => {
          const isExpanded = expandedLetter === entry.letter;

          return (
            <View key={entry.letter} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpandedLetter(isExpanded ? null : entry.letter)}
                activeOpacity={0.7}
              >
                <View style={styles.letterBox}>
                  <Text style={styles.letterText}>{entry.letter}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameEs}>{entry.name}</Text>
                    <Text style={styles.nameKo}>({entry.nameKo})</Text>
                  </View>
                  <Text style={styles.soundDesc}>{entry.sound}</Text>
                  {entry.argentinaNote && (
                    <View style={styles.arNote}>
                      <Text style={styles.arFlag}>🇦🇷</Text>
                      <Text style={styles.arText}>{entry.argentinaNote}</Text>
                    </View>
                  )}
                </View>

                <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textLight} />
              </TouchableOpacity>

              {/* 확장: 6개 발음 + 예시 */}
              {isExpanded && (
                <View style={styles.expanded}>
                  {/* 6개 발음 버튼 */}
                  <Text style={styles.variantLabel}>발음 비교</Text>
                  <View style={styles.variantGrid}>
                    {entry.variants.map((v) => {
                      const id = `${entry.letter}_${v.locale}`;
                      const isPlaying = playingId === id;
                      return (
                        <TouchableOpacity
                          key={v.locale}
                          style={[styles.variantBtn, isPlaying && styles.variantBtnActive]}
                          onPress={() => handleSpeakVariant(v, entry.letter)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.variantFlag}>{v.flag}</Text>
                          <Text style={[styles.variantName, isPlaying && styles.variantNameActive]}>{v.label}</Text>
                          <Ionicons
                            name={isPlaying ? 'volume-high' : 'play'}
                            size={12}
                            color={isPlaying ? '#FFF' : colors.textSecondary}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* 탱고 예시 단어 */}
                  <TouchableOpacity style={styles.exampleBox} onPress={() => handleSpeakExample(entry.example)} activeOpacity={0.7}>
                    <Ionicons name="volume-medium" size={16} color={colors.secondaryLight} />
                    <Text style={styles.exampleWord}>{entry.example}</Text>
                    <Text style={styles.exampleKo}>({entry.exampleKo})</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },

  // 규칙
  rulesToggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, ...shadow.sm },
  rulesIcon: { fontSize: 20 },
  rulesText: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.primary },
  rulesBox: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.lg, ...shadow.sm },
  ruleRow: { paddingVertical: spacing.sm },
  ruleRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  ruleName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.primary, marginBottom: 2 },
  ruleDesc: { fontSize: fontSize.sm, color: colors.text, marginBottom: 2 },
  ruleExample: { fontSize: fontSize.sm, color: colors.secondaryLight, fontStyle: 'italic' },

  // 카드
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.md, marginBottom: spacing.xs, ...shadow.sm, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, gap: spacing.sm },
  letterBox: { width: 44, height: 44, borderRadius: borderRadius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.primary },
  letterText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  nameEs: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  nameKo: { fontSize: fontSize.sm, color: colors.textSecondary },
  soundDesc: { fontSize: fontSize.xs, color: colors.text },
  arNote: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 1 },
  arFlag: { fontSize: 10 },
  arText: { fontSize: fontSize.xs, color: '#E65100', fontWeight: fontWeight.medium },

  // 확장
  expanded: { paddingHorizontal: spacing.sm, paddingBottom: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight },
  variantLabel: { fontSize: fontSize.xs, color: colors.textLight, marginTop: spacing.sm, marginBottom: spacing.xs, textTransform: 'uppercase', fontWeight: fontWeight.bold },
  variantGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  variantBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  variantBtnActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  variantFlag: { fontSize: 12 },
  variantName: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: fontWeight.medium },
  variantNameActive: { color: '#FFF' },
  exampleBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, backgroundColor: colors.accentLight, borderRadius: borderRadius.sm, alignSelf: 'flex-start' },
  exampleWord: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: colors.text, fontStyle: 'italic' },
  exampleKo: { fontSize: fontSize.xs, color: colors.textSecondary },
});
