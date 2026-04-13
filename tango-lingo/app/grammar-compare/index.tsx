import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { grammarComparisons } from '../../data/grammar-comparison';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

const LANG_CONFIG = {
  ko: { color: '#4CAF50', flag: '🇰🇷', label: '한국어' },
  es: { color: '#E63946', flag: '🇦🇷', label: '스페인어' },
  en: { color: '#1D3557', flag: '🇺🇸', label: '영어' },
  zh: { color: '#F4A261', flag: '🇨🇳', label: '중국어' },
} as const;

type LangKey = keyof typeof LANG_CONFIG;

export default function GrammarCompareScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>문법 비교</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>4개 언어 문법을 나란히 비교해보세요</Text>

        {grammarComparisons.map((gc) => {
          const isExpanded = expanded === gc.id;
          return (
            <View key={gc.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpanded(isExpanded ? null : gc.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardTitle}>{gc.topicKo}</Text>
                <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textLight} />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expanded}>
                  {/* 4개 언어 비교 */}
                  {(['ko', 'es', 'en', 'zh'] as LangKey[]).map((lang) => {
                    const config = LANG_CONFIG[lang];
                    const data = gc.languages[lang];
                    return (
                      <View key={lang} style={[styles.langBox, { borderLeftColor: config.color }]}>
                        <View style={styles.langHeader}>
                          <Text style={styles.langFlag}>{config.flag}</Text>
                          <Text style={[styles.langLabel, { color: config.color }]}>{config.label}</Text>
                        </View>
                        <Text style={styles.rule}>문법: {data.rule}</Text>
                        <Text style={styles.usage}>어법: {data.usage}</Text>
                        <Text style={styles.example}>예: {data.example}</Text>
                      </View>
                    );
                  })}

                  {/* 💡 팁 */}
                  <View style={styles.tipBox}>
                    <Text style={styles.tipEmoji}>💡</Text>
                    <Text style={styles.tipText}>{gc.tip}</Text>
                  </View>
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
  subtitle: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },

  card: { backgroundColor: colors.surface, borderRadius: borderRadius.md, marginBottom: spacing.sm, ...shadow.sm, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  cardTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },

  expanded: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
  langBox: { borderLeftWidth: 3, paddingLeft: spacing.sm, paddingVertical: spacing.xs },
  langHeader: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  langFlag: { fontSize: 14 },
  langLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  rule: { fontSize: fontSize.sm, color: colors.text, marginBottom: 1 },
  usage: { fontSize: fontSize.xs, color: colors.secondaryLight, fontStyle: 'italic', marginBottom: 1 },
  example: { fontSize: fontSize.sm, color: colors.text, fontWeight: fontWeight.medium },

  tipBox: { flexDirection: 'row', gap: spacing.xs, backgroundColor: colors.accentLight, borderRadius: borderRadius.sm, padding: spacing.sm, marginTop: spacing.xs },
  tipEmoji: { fontSize: 16 },
  tipText: { flex: 1, fontSize: fontSize.sm, color: colors.text, fontWeight: fontWeight.semibold, lineHeight: 20 },
});
