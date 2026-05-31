import { useState, useMemo, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useVocabStore } from '../../stores/useVocabStore';
import { useTheme } from '../../utils/useTheme';
import { useSpeech } from '../../utils/useSpeech';
import { getStudyableVocab, getVocabByFrequency, type VocabWord } from '../../data/vocab';
import { CATEGORY_INFO } from '../../data/vocab/categories';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

export default function WordRush() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const mode = useSettingsStore((s) => s.learningMode);
  const markKnown = useVocabStore((s) => s.markKnown);
  const markLearning = useVocabStore((s) => s.markLearning);

  const [phase, setPhase] = useState<'intro' | 'card' | 'result'>('intro');
  const [batchSize, setBatchSize] = useState(20);
  const [deck, setDeck] = useState<VocabWord[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [known, setKnown] = useState<VocabWord[]>([]);
  const [learning, setLearning] = useState<VocabWord[]>([]);

  // 진도가 없는 단어를 빈도 순으로 가져옴
  const available = useMemo(() => getVocabByFrequency(mode, 500), [mode]);
  const studyable = available.length;

  const start = () => {
    const pick = available.slice(0, batchSize);
    setDeck(pick);
    setCurrentIdx(0);
    setKnown([]);
    setLearning([]);
    setPhase('card');
  };

  const swipe = (direction: 'left' | 'right') => {
    const current = deck[currentIdx];
    if (!current) return;
    if (direction === 'left') {
      setKnown((k) => [...k, current]);
      markKnown(mode, current.word);
    } else {
      setLearning((l) => [...l, current]);
      markLearning(mode, current.word);
    }
    if (currentIdx + 1 >= deck.length) {
      setPhase('result');
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  // ============== 인트로 ==============
  if (phase === 'intro') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Header colors={colors} onClose={() => router.back()} title="Word Rush" />
        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
          <LanguageSwitcher />

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>⚡</Text>
            <Text style={[styles.title, { color: colors.text }]}>26초 단어 학습</Text>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>
              아는 단어는 ← 왼쪽으로{'\n'}모르는 단어는 → 오른쪽으로
            </Text>
            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 28 }}>
                {studyable}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>학습 가능 단어</Text>
            </View>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>한 번에 몇 개?</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[10, 20, 30, 50].map((n) => (
              <Pressable
                key={n}
                onPress={() => setBatchSize(n)}
                style={[
                  styles.batchBtn,
                  {
                    backgroundColor: batchSize === n ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ color: batchSize === n ? '#fff' : colors.text, fontWeight: '700' }}>{n}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={start}
            style={[styles.startBtn, { backgroundColor: colors.primary }]}
            disabled={studyable === 0}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>시작 →</Text>
          </Pressable>

          {studyable === 0 && (
            <Text style={{ color: colors.warning, fontSize: 12, textAlign: 'center' }}>
              ⚠️ 이 언어 학습 가능 단어 없음. 한국어 뜻 보강이 필요해요.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============== 결과 ==============
  if (phase === 'result') {
    const total = known.length + learning.length;
    const pct = total > 0 ? Math.round((known.length / total) * 100) : 0;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <Header colors={colors} onClose={() => router.back()} title="결과" />
        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, alignItems: 'center' }]}>
            <Text style={{ fontSize: 56 }}>{pct >= 80 ? '🏆' : pct >= 50 ? '🎉' : '💪'}</Text>
            <Text style={[styles.title, { color: colors.primary, fontSize: 36 }]}>
              {known.length} / {total}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>안다고 한 단어</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={[styles.statBox, { backgroundColor: colors.successLight, flex: 1 }]}>
              <Text style={{ color: colors.success, fontSize: 22, fontWeight: '900' }}>{known.length}</Text>
              <Text style={{ color: colors.success, fontSize: 11, fontWeight: '700' }}>✓ 안다</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.errorLight, flex: 1 }]}>
              <Text style={{ color: colors.error, fontSize: 22, fontWeight: '900' }}>{learning.length}</Text>
              <Text style={{ color: colors.error, fontSize: 11, fontWeight: '700' }}>↻ 다시</Text>
            </View>
          </View>

          {learning.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.text, marginBottom: 8 }]}>↻ 더 학습할 단어</Text>
              {learning.slice(0, 10).map((w) => (
                <View key={w.word} style={styles.learnRow}>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', flex: 1 }}>{w.word}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{w.ko}</Text>
                </View>
              ))}
              {learning.length > 10 && (
                <Text style={{ color: colors.textLight, fontSize: 11, marginTop: 6, textAlign: 'center' }}>
                  ... 외 {learning.length - 10}개
                </Text>
              )}
            </View>
          )}

          <Pressable onPress={() => { setLearning([]); setKnown([]); start(); }} style={[styles.startBtn, { backgroundColor: colors.secondary }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>↻ 다시 학습</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={[styles.startBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>완료</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============== 카드 ==============
  const current = deck[currentIdx];
  const progress = ((currentIdx) / deck.length) * 100;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header colors={colors} onClose={() => router.back()} title={`${currentIdx + 1} / ${deck.length}`} />
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: colors.primary }]} />
      </View>

      <View style={{ flex: 1, padding: spacing.md }}>
        {current && <SwipeCard key={current.id} word={current} onSwipe={swipe} colors={colors} mode={mode} />}

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 'auto' }}>
          <Pressable onPress={() => swipe('right')} style={[styles.actionBtn, { backgroundColor: colors.errorLight }]}>
            <Text style={{ fontSize: 24 }}>↻</Text>
            <Text style={{ color: colors.error, fontSize: 12, fontWeight: '800' }}>모른다</Text>
          </Pressable>
          <Pressable onPress={() => swipe('left')} style={[styles.actionBtn, { backgroundColor: colors.successLight }]}>
            <Text style={{ fontSize: 24 }}>✓</Text>
            <Text style={{ color: colors.success, fontSize: 12, fontWeight: '800' }}>안다</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SwipeCard({ word, onSwipe, colors, mode }: any) {
  const pan = useRef(new Animated.ValueXY()).current;
  const { speak } = useSpeech();
  const cat = CATEGORY_INFO[word.category];

  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          Animated.timing(pan, { toValue: { x: SCREEN_W, y: g.dy }, duration: 200, useNativeDriver: false }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            onSwipe('right');
          });
        } else if (g.dx < -SWIPE_THRESHOLD) {
          Animated.timing(pan, { toValue: { x: -SCREEN_W, y: g.dy }, duration: 200, useNativeDriver: false }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            onSwipe('left');
          });
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    }),
  ).current;

  const rotate = pan.x.interpolate({ inputRange: [-SCREEN_W, 0, SCREEN_W], outputRange: ['-10deg', '0deg', '10deg'] });
  const knownOpacity = pan.x.interpolate({ inputRange: [-SCREEN_W/2, -50, 0], outputRange: [1, 0.3, 0], extrapolate: 'clamp' });
  const learnOpacity = pan.x.interpolate({ inputRange: [0, 50, SCREEN_W/2], outputRange: [0, 0.3, 1], extrapolate: 'clamp' });

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.swipeCard,
        {
          backgroundColor: cat.bg,
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
        },
      ]}
    >
      {/* 스와이프 표시 */}
      <Animated.View style={[styles.swipeTag, styles.knownTag, { opacity: knownOpacity }]}>
        <Text style={styles.swipeTagText}>✓ 안다</Text>
      </Animated.View>
      <Animated.View style={[styles.swipeTag, styles.learnTag, { opacity: learnOpacity }]}>
        <Text style={styles.swipeTagText}>↻ 다시</Text>
      </Animated.View>

      {/* 큰 이모지 */}
      <View style={styles.emojiBox}>
        <Text style={styles.bigEmoji}>{cat.emoji}</Text>
      </View>

      {/* 단어 + 발음 */}
      <View style={{ alignItems: 'center', gap: 4, marginTop: 8 }}>
        <Text style={styles.wordText}>{word.word}</Text>
        {word.ipa && <Text style={styles.ipaText}>{word.ipa}</Text>}
        {word.pron_ko && <Text style={styles.pronKoText}>{word.pron_ko}</Text>}
      </View>

      {/* 한국어 뜻 */}
      <View style={styles.koBox}>
        <Text style={styles.koText}>🇰🇷 {word.ko}</Text>
      </View>

      {/* 예문 */}
      {word.example && (
        <View style={styles.exampleBox}>
          <Text style={styles.exampleText}>{word.example}</Text>
          {word.example_ko && <Text style={styles.exampleKo}>{word.example_ko}</Text>}
        </View>
      )}

      {/* 듣기 버튼 */}
      <Pressable onPress={() => speak(word.word, mode)} style={styles.speakBtn}>
        <Ionicons name="volume-high" size={24} color={colors.primary} />
      </Pressable>

      {/* 카테고리 + 레벨 뱃지 */}
      <View style={styles.bottomBadges}>
        <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
          <Text style={{ fontSize: 10, fontWeight: '700' }}>{cat.ko}</Text>
        </View>
        {word.level && (
          <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
            <Text style={{ fontSize: 10, fontWeight: '700' }}>{word.level}</Text>
          </View>
        )}
      </View>
    </Animated.View>
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

  card: { padding: 20, borderRadius: 14, borderWidth: 1, gap: 6 },
  title: { fontSize: 22, fontWeight: '800' },
  sub: { fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 4 },
  label: { fontSize: 13, fontWeight: '700', marginTop: 4 },

  batchBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  startBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },

  swipeCard: {
    flex: 1, borderRadius: 24, padding: 24, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4,
  },
  swipeTag: {
    position: 'absolute', top: 30, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8,
    borderWidth: 3, transform: [{ rotate: '-10deg' }],
  },
  knownTag: { left: 24, borderColor: '#2ECC71' },
  learnTag: { right: 24, borderColor: '#E74C3C', transform: [{ rotate: '10deg' }] },
  swipeTagText: { fontSize: 22, fontWeight: '900' },

  emojiBox: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  bigEmoji: { fontSize: 80 },

  wordText: { fontSize: 32, fontWeight: '900', color: '#1F2937' },
  ipaText: { fontSize: 14, color: '#6B7280', fontStyle: 'italic' },
  pronKoText: { fontSize: 16, color: '#374151', fontWeight: '600' },

  koBox: { backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, marginTop: 4 },
  koText: { fontSize: 18, fontWeight: '700', color: '#1F2937' },

  exampleBox: { marginTop: 12, paddingHorizontal: 12, alignItems: 'center', gap: 4 },
  exampleText: { fontSize: 15, color: '#1F2937', textAlign: 'center', fontWeight: '600' },
  exampleKo: { fontSize: 13, color: '#4B5563', textAlign: 'center' },

  speakBtn: { position: 'absolute', top: 20, right: 20, padding: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.7)' },
  bottomBadges: { position: 'absolute', bottom: 20, flexDirection: 'row', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },

  actionBtn: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center', gap: 2 },

  statBox: { padding: 16, borderRadius: 12, alignItems: 'center' },
  learnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
});
