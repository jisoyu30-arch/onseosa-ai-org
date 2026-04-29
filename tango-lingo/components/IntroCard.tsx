import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useTheme } from '../utils/useTheme';
import { useSpeech } from '../utils/useSpeech';
import { introContent } from '../data/intro';

export default function IntroCard() {
  const { colors } = useTheme();
  const mode = useSettingsStore((s) => s.learningMode);
  const { speak } = useSpeech();
  const intro = introContent[mode];

  return (
    <View style={{ gap: 12 }}>
      {/* 헤더 */}
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 32 }}>{intro.flag}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.smallLabel, { color: colors.primary }]}>오늘의 첫 강의</Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{intro.langName}</Text>
          </View>
        </View>
      </View>

      {/* 언어 특징 */}
      <Section title="📚 이 언어의 특징" colors={colors}>
        {intro.features.map((f, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.text }]}>{f}</Text>
          </View>
        ))}
      </Section>

      {/* 아르헨 특수 (스페인어만) */}
      {intro.argentinaSpecial && (
        <Section title="🇦🇷 아르헨티나 탱고 스페인어" colors={colors} accent>
          {intro.argentinaSpecial.map((f, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={[styles.bullet, { color: colors.warning }]}>•</Text>
              <Text style={[styles.bulletText, { color: colors.text }]}>{f}</Text>
            </View>
          ))}
        </Section>
      )}

      {/* 첫 인사 */}
      <Section title="👋 첫 인사" colors={colors} subtitle={intro.greetingsKo}>
        {intro.greetings.map((p, i) => (
          <PhraseRow key={i} phrase={p} mode={mode} colors={colors} onSpeak={() => speak(p.text, mode)} />
        ))}
      </Section>

      {/* 의문형 */}
      <Section title="❓ 질문하기" colors={colors} subtitle={intro.questionsKo}>
        {intro.questions.map((p, i) => (
          <PhraseRow key={i} phrase={p} mode={mode} colors={colors} onSpeak={() => speak(p.text, mode)} />
        ))}
      </Section>

      {/* 긍정/부정 */}
      <Section title="✅ 대답하기 (긍정/부정)" colors={colors} subtitle={intro.yesNoKo}>
        {intro.yesNo.map((p, i) => (
          <PhraseRow key={i} phrase={p} mode={mode} colors={colors} onSpeak={() => speak(p.text, mode)} />
        ))}
      </Section>
    </View>
  );
}

function Section({
  title,
  subtitle,
  colors,
  accent,
  children,
}: {
  title: string;
  subtitle?: string;
  colors: any;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: colors.surface,
          borderColor: accent ? colors.warning : colors.border,
          borderLeftWidth: accent ? 4 : 1,
        },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {subtitle && <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>{subtitle}</Text>}
      <View style={{ marginTop: 8, gap: 6 }}>{children}</View>
    </View>
  );
}

function PhraseRow({ phrase, mode, colors, onSpeak }: any) {
  return (
    <View style={[styles.phraseRow, { borderColor: colors.borderLight }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.phraseText, { color: colors.text }]}>{phrase.text}</Text>
        {phrase.pron && (
          <Text style={[styles.phrasePron, { color: colors.textSecondary }]}>{phrase.pron}</Text>
        )}
        <Text style={[styles.phraseKo, { color: colors.text }]}>🇰🇷 {phrase.ko}</Text>
      </View>
      <Pressable onPress={onSpeak} hitSlop={8} style={styles.speakBtn}>
        <Ionicons name="volume-high" size={20} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: { padding: 14, borderRadius: 14, borderWidth: 2 },
  smallLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  headerTitle: { fontSize: 18, fontWeight: '800', marginTop: 2 },

  section: {
    padding: 14, borderRadius: 14, borderWidth: 1, gap: 4,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  sectionSub: { fontSize: 12, marginTop: 2 },

  bulletRow: { flexDirection: 'row', gap: 8 },
  bullet: { fontSize: 14, fontWeight: '800' },
  bulletText: { fontSize: 13, flex: 1, lineHeight: 19 },

  phraseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderTopWidth: 1,
  },
  phraseText: { fontSize: 16, fontWeight: '700' },
  phrasePron: { fontSize: 12, fontStyle: 'italic', marginTop: 2 },
  phraseKo: { fontSize: 13, marginTop: 4 },
  speakBtn: { padding: 4 },
});
