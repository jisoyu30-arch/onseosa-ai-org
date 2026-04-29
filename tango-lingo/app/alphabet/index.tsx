import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { spanishAlphabet, argentinaRules, PronunciationVariant, AlphabetEntry } from '../../data/alphabet';
import { englishAlphabet, englishNotes } from '../../data/english-alphabet';
import { chinesePinyin, chineseNotes } from '../../data/chinese-pinyin';
import { speak, stopSpeaking } from '../../utils/audio';
import { useTheme } from '../../utils/useTheme';
import { useSettingsStore } from '../../stores/useSettingsStore';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import * as Speech from 'expo-speech';
import type { LearningMode, PracticeLanguage } from '../../types';

const HEARD_KEY_PREFIX = '@tangolingo_alphabet_heard_v2_';

interface NoteEntry { rule: string; description: string; example: string; }

const DATA: Record<LearningMode, {
  entries: AlphabetEntry[];
  notes: NoteEntry[];
  notesTitle: string;
  notesIcon: string;
  pageSub: string;
  ttsLang: PracticeLanguage;
}> = {
  es: {
    entries: spanishAlphabet,
    notes: argentinaRules,
    notesTitle: '아르헨티나 발음 특징',
    notesIcon: '🇦🇷',
    pageSub: '글자 탭 → 6개 언어 발음 비교',
    ttsLang: 'es',
  },
  en: {
    entries: englishAlphabet,
    notes: englishNotes,
    notesTitle: '영어 발음 특징',
    notesIcon: '🗣️',
    pageSub: '글자 탭 → 미국·영국 발음 비교',
    ttsLang: 'es', // 영어 예시는 그대로 expo-speech 사용
  },
  zh: {
    entries: chinesePinyin,
    notes: chineseNotes,
    notesTitle: '중국어 발음 핵심',
    notesIcon: '🀄',
    pageSub: '성모·운모·성조 — 탭하면 발음',
    ttsLang: 'zh',
  },
};

export default function AlphabetScreen() {
  const theme = useTheme();
  const { colors, spacing, borderRadius, fontSize, fontWeight } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const mode = useSettingsStore((s) => s.learningMode);
  const data = DATA[mode];

  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [heard, setHeard] = useState<string[]>([]);

  // 언어 바뀔 때마다 진도 다시 로드
  const heardKey = HEARD_KEY_PREFIX + mode;
  useEffect(() => {
    setExpandedLetter(null);
    setShowRules(false);
    AsyncStorage.getItem(heardKey)
      .then((raw) => {
        if (raw) { try { setHeard(JSON.parse(raw)); } catch { setHeard([]); } }
        else setHeard([]);
      })
      .catch(() => setHeard([]));
  }, [mode]);

  const markHeard = useCallback((letter: string) => {
    setHeard((prev) => {
      if (prev.includes(letter)) return prev;
      const next = [...prev, letter];
      AsyncStorage.setItem(heardKey, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [heardKey]);

  const handleSpeakVariant = useCallback(async (variant: PronunciationVariant, letter: string) => {
    stopSpeaking();
    const id = `${letter}_${variant.locale}`;
    if (playingId === id) { setPlayingId(null); return; }
    setPlayingId(id);
    markHeard(letter);
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
  }, [playingId, markHeard]);

  const handleSpeakExample = useCallback(async (word: string, letter: string) => {
    stopSpeaking();
    markHeard(letter);
    // 영어는 expo-speech 직접, 다른 언어는 기존 audio.speak
    if (mode === 'en') {
      Speech.speak(word, { language: 'en-US', rate: 0.85 });
    } else {
      await speak(word, data.ttsLang);
    }
  }, [markHeard, mode]);

  const progress = useMemo(() => {
    const total = data.entries.length;
    const done = heard.length;
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [heard, data.entries.length]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>알파벳 발음</Text>
        <Text style={styles.pageSub}>{data.pageSub}</Text>

        {/* 언어 스위처 */}
        <View style={{ marginVertical: 8 }}>
          <LanguageSwitcher />
        </View>

        {/* 진도 배지 */}
        <View style={styles.summaryCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryLabel}>발음 경험한 글자</Text>
            <Text style={styles.summaryValue}>
              {progress.done} / {progress.total}
              <Text style={styles.summaryPct}>  ({progress.pct}%)</Text>
            </Text>
          </View>
        </View>
        <View style={styles.summaryTrack}>
          <View style={[styles.summaryFill, { width: `${progress.pct}%` }]} />
        </View>

        {/* 언어별 노트 (펼치기) */}
        <TouchableOpacity style={styles.rulesToggle} onPress={() => setShowRules(!showRules)} activeOpacity={0.7}>
          <Text style={styles.rulesIcon}>{data.notesIcon}</Text>
          <Text style={styles.rulesText}>{data.notesTitle}</Text>
          <Ionicons name={showRules ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
        </TouchableOpacity>

        {showRules && (
          <View style={styles.rulesBox}>
            {data.notes.map((rule, i) => (
              <View key={i} style={[styles.ruleRow, i < data.notes.length - 1 && styles.ruleRowBorder]}>
                <Text style={styles.ruleName}>{rule.rule}</Text>
                <Text style={styles.ruleDesc}>{rule.description}</Text>
                <Text style={styles.ruleExample}>{rule.example}</Text>
              </View>
            ))}
          </View>
        )}

        {data.entries.map((entry) => {
          const isExpanded = expandedLetter === entry.letter;
          const isHeard = heard.includes(entry.letter);

          return (
            <View key={entry.letter} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpandedLetter(isExpanded ? null : entry.letter)}
                activeOpacity={0.7}
              >
                <View style={[styles.letterBox, isHeard && styles.letterBoxHeard]}>
                  <Text style={[styles.letterText, isHeard && styles.letterTextHeard]}>{entry.letter}</Text>
                </View>

                <View style={styles.cardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.nameEs}>{entry.name}</Text>
                    <Text style={styles.nameKo}>({entry.nameKo})</Text>
                    {isHeard && <Ionicons name="checkmark-circle" size={14} color={colors.success} />}
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

              {isExpanded && (
                <View style={styles.expanded}>
                  <Text style={styles.variantLabel}>발음 듣기</Text>
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
                          <Ionicons name={isPlaying ? 'volume-high' : 'play'} size={12} color={isPlaying ? '#FFF' : colors.textSecondary} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    style={styles.exampleBox}
                    onPress={() => handleSpeakExample(entry.example, entry.letter)}
                    activeOpacity={0.7}
                  >
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

function createStyles(t: ReturnType<typeof useTheme>) {
  const { colors, spacing, borderRadius, fontSize, fontWeight } = t;
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
    pageTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.text },
    pageSub: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },

    summaryCard: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.md,
      borderWidth: 1, borderColor: colors.border,
    },
    summaryLabel: { fontSize: fontSize.xs, color: colors.textSecondary, fontWeight: fontWeight.medium },
    summaryValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary, marginTop: 2 },
    summaryPct: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: fontWeight.medium },
    summaryTrack: { height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: colors.borderLight, marginTop: spacing.sm, marginBottom: spacing.md },
    summaryFill: { height: '100%', backgroundColor: colors.primary },

    rulesToggle: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
      backgroundColor: colors.surface, borderRadius: borderRadius.md,
      padding: spacing.md, marginBottom: spacing.sm,
      borderWidth: 1, borderColor: colors.border,
    },
    rulesIcon: { fontSize: 20 },
    rulesText: { flex: 1, fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.primary },
    rulesBox: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
    ruleRow: { paddingVertical: spacing.sm },
    ruleRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
    ruleName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.primary, marginBottom: 2 },
    ruleDesc: { fontSize: fontSize.sm, color: colors.text, marginBottom: 2 },
    ruleExample: { fontSize: fontSize.sm, color: colors.secondaryLight, fontStyle: 'italic' },

    card: { backgroundColor: colors.surface, borderRadius: borderRadius.md, marginBottom: spacing.xs, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
    cardHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, gap: spacing.sm },
    letterBox: { width: 44, height: 44, borderRadius: borderRadius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.primary },
    letterBoxHeard: { backgroundColor: colors.primary, borderColor: colors.primary },
    letterText: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
    letterTextHeard: { color: '#FFF' },
    cardInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
    nameEs: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
    nameKo: { fontSize: fontSize.sm, color: colors.textSecondary },
    soundDesc: { fontSize: fontSize.xs, color: colors.text },
    arNote: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 1 },
    arFlag: { fontSize: 10 },
    arText: { fontSize: fontSize.xs, color: colors.warning, fontWeight: fontWeight.medium },

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
}
