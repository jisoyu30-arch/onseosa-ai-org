import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useVocabStore } from '../../stores/useVocabStore';
import { getReviewWords, getWeeklySummary } from '../../stores/useReviewStore';
import { useTheme } from '../../utils/useTheme';
import { useSpeech } from '../../utils/useSpeech';
import VoiceButtons from '../../components/VoiceButtons';
import WordImage from '../../components/WordImage';
import { CATEGORY_INFO } from '../../data/vocab/categories';
import { getWordEmoji } from '../../data/vocab/word-emoji';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function WeeklyReview() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const mode = useSettingsStore((s) => s.learningMode);
  const markKnown = useVocabStore((s) => s.markKnown);
  const markLearning = useVocabStore((s) => s.markLearning);
  const { speak } = useSpeech();

  const summary = useMemo(() => getWeeklySummary(mode), [mode]);
  const reviewWords = useMemo(() => getReviewWords(mode, 20), [mode]);

  const [phase, setPhase] = useState<'overview' | 'cards' | 'done'>('overview');
  const [idx, setIdx] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);

  const handleAction = (action: 'known' | 'learning') => {
    const w = reviewWords[idx];
    if (!w) return;
    if (action === 'known') {
      markKnown(mode, w.word);
      setKnownCount((c) => c + 1);
    } else {
      markLearning(mode, w.word);
      setLearnCount((c) => c + 1);
    }
    if (idx + 1 >= reviewWords.length) {
      setPhase('done');
    } else {
      setIdx(idx + 1);
    }
  };

  // ============== 개요 ==============
  if (phase === 'overview') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Header colors={colors} onClose={() => router.back()} title="이번 주 복습" />
        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
          <LanguageSwitcher />

          <View style={[styles.bigCard, { backgroundColor: colors.primary }]}>
            <Text style={{ fontSize: 48 }}>📅</Text>
            <Text style={[styles.bigTitle]}>이번 주 학습 요약</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <Stat label="활동 일수" value={`${summary.daysActive}일`} />
              <Stat label="단어 학습" value={`${summary.vocabTotal}개`} />
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <Stat label="안다" value={`${summary.vocabKnown}`} color="#A7F3D0" />
              <Stat label="다시" value={`${summary.vocabLearning}`} color="#FCA5A5" />
            </View>
          </View>

          {reviewWords.length > 0 ? (
            <Pressable
              onPress={() => setPhase('cards')}
              style={[styles.btn, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>
                ↻ 복습 시작 ({reviewWords.length}개)
              </Text>
            </Pressable>
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={{ fontSize: 32 }}>✨</Text>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 8 }}>
                복습할 단어가 없어요
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
                Word Rush로 단어를 더 학습해보세요
              </Text>
              <Pressable
                onPress={() => router.push('/word-rush')}
                style={[styles.btn, { backgroundColor: colors.secondary, marginTop: 12 }]}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Word Rush 시작 →</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============== 결과 ==============
  if (phase === 'done') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Header colors={colors} onClose={() => router.back()} title="복습 완료" />
        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md, alignItems: 'center' }}>
          <View style={[styles.bigCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: 'center' }]}>
            <Text style={{ fontSize: 64 }}>🎉</Text>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '900' }}>주간 복습 완료</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <View style={[styles.miniStat, { backgroundColor: colors.successLight }]}>
                <Text style={{ color: colors.success, fontSize: 22, fontWeight: '900' }}>{knownCount}</Text>
                <Text style={{ color: colors.success, fontSize: 10, fontWeight: '700' }}>✓ 안다</Text>
              </View>
              <View style={[styles.miniStat, { backgroundColor: colors.errorLight }]}>
                <Text style={{ color: colors.error, fontSize: 22, fontWeight: '900' }}>{learnCount}</Text>
                <Text style={{ color: colors.error, fontSize: 10, fontWeight: '700' }}>↻ 다시</Text>
              </View>
            </View>
          </View>
          <Pressable onPress={() => router.back()} style={[styles.btn, { backgroundColor: colors.primary, width: '100%' }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>완료</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============== 카드 ==============
  const w = reviewWords[idx];
  if (!w) return null;
  const cat = CATEGORY_INFO[w.category];
  const progress = ((idx) / reviewWords.length) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header colors={colors} onClose={() => router.back()} title={`${idx + 1} / ${reviewWords.length}`} />
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
      </View>

      <View style={{ flex: 1, padding: spacing.md, justifyContent: 'center' }}>
        <View style={[styles.reviewCard, { backgroundColor: cat.bg }]}>
          <WordImage word={w.word} mode={mode} ko={w.ko} category={w.category} size={180} />
          <Text style={styles.reviewWord}>{w.word}</Text>
          {w.ipa && <Text style={styles.reviewIpa}>{w.ipa}</Text>}
          {w.pron_ko && <Text style={styles.reviewPron}>{w.pron_ko}</Text>}
          <View style={styles.reviewKoBox}>
            <Text style={styles.reviewKo}>🇰🇷 {w.ko}</Text>
          </View>
          {w.example && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.exampleText}>{w.example}</Text>
              {w.example_ko && <Text style={styles.exampleKo}>{w.example_ko}</Text>}
            </View>
          )}
        </View>
        <View style={{ marginTop: 12 }}>
          <VoiceButtons text={w.word} mode={mode} />
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
          <Pressable onPress={() => handleAction('learning')} style={[styles.action, { backgroundColor: colors.errorLight }]}>
            <Text style={{ fontSize: 28 }}>↻</Text>
            <Text style={{ color: colors.error, fontWeight: '800', fontSize: 12 }}>아직 모름</Text>
          </Pressable>
          <Pressable onPress={() => handleAction('known')} style={[styles.action, { backgroundColor: colors.successLight }]}>
            <Text style={{ fontSize: 28 }}>✓</Text>
            <Text style={{ color: colors.success, fontWeight: '800', fontSize: 12 }}>이제 안다</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value, color }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: color || 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 10 }}>
      <Text style={{ color: '#fff', fontSize: 11, opacity: 0.9, fontWeight: '700' }}>{label}</Text>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function Header({ colors, onClose, title }: any) {
  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Pressable onPress={onClose} hitSlop={10}>
        <Ionicons name="close" size={26} color={colors.text} />
      </Pressable>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{title}</Text>
      <View style={{ width: 26 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  progressTrack: { height: 4 },
  progressFill: { height: '100%' },
  bigCard: { padding: 20, borderRadius: 16, gap: 8, alignItems: 'flex-start' },
  bigTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  miniStat: { padding: 14, borderRadius: 10, alignItems: 'center', minWidth: 70 },
  emptyCard: { padding: 32, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  btn: { padding: 16, borderRadius: 12, alignItems: 'center' },

  reviewCard: { padding: 24, borderRadius: 20, alignItems: 'center', gap: 6, position: 'relative' },
  reviewWord: { fontSize: 36, fontWeight: '900', color: '#1F2937', marginTop: 12 },
  reviewIpa: { fontSize: 14, color: '#6B7280', fontStyle: 'italic' },
  reviewPron: { fontSize: 16, color: '#374151', fontWeight: '600' },
  reviewKoBox: { backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginTop: 6 },
  reviewKo: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  exampleText: { fontSize: 15, color: '#1F2937', textAlign: 'center', fontWeight: '600' },
  exampleKo: { fontSize: 13, color: '#4B5563', textAlign: 'center', marginTop: 2 },
  speakBtn: { position: 'absolute', top: 16, right: 16, padding: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.7)' },

  action: { flex: 1, padding: 18, borderRadius: 14, alignItems: 'center', gap: 4 },
});
