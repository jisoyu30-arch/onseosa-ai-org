import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useTheme } from '../../utils/useTheme';
import { useSpeech } from '../../utils/useSpeech';
import { tagText } from '../../utils/pos-tagger';
import { chatWithMila, type ChatMessage, type MilaContext } from '../../utils/mila';
import PosText from '../../components/PosText';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const SITUATIONS = [
  { key: 'tanda_invite', emoji: '💃', ko: '탄다 초대' },
  { key: 'cabeceo', emoji: '👀', ko: '카베세오' },
  { key: 'thanks', emoji: '🌹', ko: '감사 인사' },
  { key: 'apology', emoji: '🙏', ko: '실수 사과' },
  { key: 'compliment', emoji: '✨', ko: '칭찬' },
  { key: 'milonga_chat', emoji: '🍷', ko: '밀롱가 잡담' },
];

interface MilaCorrection { wrong: string; right: string; why: string; }
type UiMessage =
  | { from: 'user'; text: string }
  | { from: 'mila'; text: string; ko: string; correction?: MilaCorrection; better?: MilaCorrection };

export default function AiRoleplay() {
  const router = useRouter();
  const params = useLocalSearchParams<{ situation?: string }>();
  const { colors, spacing } = useTheme();
  const mode = useSettingsStore((s) => s.learningMode);
  const { speak } = useSpeech();
  const scrollRef = useRef<ScrollView>(null);

  const [situation, setSituation] = useState<string | null>(params.situation ?? null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (situation && messages.length === 0) {
      // 첫 인사는 Mila가 먼저
      sendToMila([]);
    }
  }, [situation]);

  const sendToMila = async (history: ChatMessage[]) => {
    if (!situation) return;
    setLoading(true);
    try {
      const ctx: MilaContext = { mode, situation, userLevel: 'A2' };
      const res = await chatWithMila(history, ctx);
      setMessages((prev) => [
        ...prev,
        { from: 'mila', text: res.reply, ko: res.ko, correction: res.correction as any, better: (res as any).better },
      ]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      Alert.alert('오류', e.message ?? '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    const newUiMsgs: UiMessage[] = [...messages, { from: 'user', text }];
    setMessages(newUiMsgs);
    setInput('');

    const history: ChatMessage[] = newUiMsgs.map((m) =>
      m.from === 'user' ? { role: 'user', text: m.text } : { role: 'model', text: m.text }
    );
    sendToMila(history);
  };

  // 상황 선택 화면
  if (!situation) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={26} color={colors.text} />
          </Pressable>
          <Text style={[styles.topTitle, { color: colors.text }]}>AI 롤플레이</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
          <Text style={[styles.intro, { color: colors.textSecondary }]}>
            Mila와 탱고 상황을 연기해봐요. 언어는 상단 스위처로 선택.
          </Text>
          <LanguageSwitcher />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>상황 고르기</Text>
          {SITUATIONS.map((s) => (
            <Pressable
              key={s.key}
              onPress={() => setSituation(s.key)}
              style={[styles.sitCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={{ fontSize: 26 }}>{s.emoji}</Text>
              <Text style={[styles.sitLabel, { color: colors.text }]}>{s.ko}</Text>
              <View style={{ flex: 1 }} />
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 채팅 화면
  const sitInfo = SITUATIONS.find((s) => s.key === situation);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => setSituation(null)} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>
          {sitInfo?.emoji} {sitInfo?.ko}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: spacing.md, gap: 10 }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m, i) => {
            if (m.from === 'user') {
              return (
                <View key={i} style={[styles.bubble, styles.userBubble, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: '#fff', fontSize: 15 }}>{m.text}</Text>
                </View>
              );
            }
            // Mila
            const tokens = tagText(m.text, mode);
            return (
              <View key={i} style={[styles.bubble, styles.milaBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={{ fontSize: 15 }}>🌹</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 11, fontWeight: '700' }}>Mila</Text>
                  <View style={{ flex: 1 }} />
                  <Pressable onPress={() => speak(m.text, mode)} hitSlop={8}>
                    <Ionicons name="volume-high" size={18} color={colors.primary} />
                  </Pressable>
                </View>
                <PosText tokens={tokens} fallback={m.text} fontSize={16} color={colors.text} />
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={{ color: colors.text, fontSize: 13 }}>🇰🇷 {m.ko}</Text>
                {m.correction && (
                  <View style={[styles.correctionBox, { backgroundColor: colors.error + '15', borderLeftColor: colors.error }]}>
                    <Text style={{ color: colors.error, fontSize: 11, fontWeight: '800' }}>❌ 교정</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 4, gap: 4 }}>
                      <Text style={{ color: colors.error, fontSize: 13, fontWeight: '700', textDecorationLine: 'line-through' }}>
                        {m.correction.wrong}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>→</Text>
                      <Text style={{ color: colors.success, fontSize: 13, fontWeight: '800' }}>
                        {m.correction.right}
                      </Text>
                    </View>
                    <Text style={{ color: colors.text, fontSize: 12, marginTop: 4 }}>{m.correction.why}</Text>
                  </View>
                )}
                {m.better && (
                  <View style={[styles.correctionBox, { backgroundColor: colors.warning + '15', borderLeftColor: colors.warning }]}>
                    <Text style={{ color: colors.warning, fontSize: 11, fontWeight: '800' }}>💡 더 자연스럽게</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 4, gap: 4 }}>
                      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{m.better.wrong}</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 13 }}>→</Text>
                      <Text style={{ color: colors.success, fontSize: 13, fontWeight: '800' }}>{m.better.right}</Text>
                    </View>
                    <Text style={{ color: colors.text, fontSize: 12, marginTop: 4 }}>{m.better.why}</Text>
                  </View>
                )}
              </View>
            );
          })}
          {loading && (
            <View style={[styles.bubble, styles.milaBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ActivityIndicator color={colors.primary} />
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={
              mode === 'es' ? '스페인어로 답하기 (또는 한국어로 "어떻게 말해?")' :
              mode === 'en' ? '영어로 답하기 (또는 한국어로 "어떻게 말해?")' :
              '중국어로 답하기 (또는 한국어로 "어떻게 말해?")'
            }
            placeholderTextColor={colors.textLight}
            style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
            multiline
          />
          <Pressable
            onPress={handleSend}
            disabled={loading || !input.trim()}
            style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: loading || !input.trim() ? 0.4 : 1 }]}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 12,
  },
  topTitle: { fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' },
  intro: { fontSize: 13, lineHeight: 18 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  sitCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12, borderWidth: 1,
  },
  sitLabel: { fontSize: 16, fontWeight: '700' },
  bubble: { padding: 12, borderRadius: 14, maxWidth: '88%' },
  userBubble: { alignSelf: 'flex-end' },
  milaBubble: { alignSelf: 'flex-start', borderWidth: 1, gap: 6 },
  divider: { height: 1, marginVertical: 4 },
  correctionBox: { padding: 10, borderRadius: 8, marginTop: 6, borderLeftWidth: 3 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 10, gap: 8, borderTopWidth: 1,
  },
  input: {
    flex: 1, padding: 10, borderRadius: 10,
    fontSize: 14, maxHeight: 100,
  },
  sendBtn: { padding: 11, borderRadius: 10 },
});
