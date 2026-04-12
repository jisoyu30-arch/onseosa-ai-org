import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { askTangoAI, ChatMessage } from '../../services/chat';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Abrazo가 뭐야?',
  'Voseo가 뭐야?',
  '밀롱가 에티켓 알려줘',
  '카베세오는 어떻게 해?',
  '탄다와 코르티나 차이',
  'Ocho는 왜 8이야?',
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (text?: string) => {
    const question = (text || input).trim();
    if (!question || loading) return;

    const userMsg: DisplayMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: question,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // ChatMessage history for context
    const history: ChatMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const answer = await askTangoAI(question, history);

    const assistantMsg: DisplayMessage = {
      id: `a_${Date.now()}`,
      role: 'assistant',
      content: answer,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: DisplayMessage }) => (
    <View style={[styles.msgRow, item.role === 'user' ? styles.userRow : styles.aiRow]}>
      {item.role === 'assistant' && (
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>🎵</Text>
        </View>
      )}
      <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.msgText, item.role === 'user' ? styles.userText : styles.aiText]}>
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>탱고 AI 선생님</Text>
          <Text style={styles.headerSub}>탱고 문화 · 스페인어 질문</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Messages or Empty */}
        {messages.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎓</Text>
            <Text style={styles.emptyTitle}>탱고에 대해 물어보세요!</Text>
            <Text style={styles.emptyDesc}>탱고 용어, 밀롱가 에티켓, 스페인어 문법{'\n'}뭐든 물어보세요.</Text>

            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.sugChip}
                  onPress={() => handleSend(s)}
                >
                  <Text style={styles.sugText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.msgList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.secondary} />
            <Text style={styles.loadingText}>생각 중...</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="탱고에 대해 질문하세요..."
            placeholderTextColor={colors.textLight}
            multiline
            maxLength={500}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.text },
  headerSub: { fontSize: fontSize.xs, color: colors.textSecondary },
  content: { flex: 1 },

  // Empty state
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.text, marginBottom: spacing.xs },
  emptyDesc: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg, lineHeight: 20 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'center' },
  sugChip: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: colors.surface },
  sugText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },

  // Messages
  msgList: { padding: spacing.md, paddingBottom: spacing.lg },
  msgRow: { flexDirection: 'row', marginBottom: spacing.sm, maxWidth: '85%' as any },
  userRow: { alignSelf: 'flex-end' },
  aiRow: { alignSelf: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.xs, marginTop: 2 },
  aiAvatarText: { fontSize: 14 },
  bubble: { padding: spacing.sm + 2, borderRadius: borderRadius.lg, maxWidth: '100%' as any },
  userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, ...shadow.sm },
  msgText: { fontSize: fontSize.md, lineHeight: 22 },
  userText: { color: '#FFF' },
  aiText: { color: colors.text },

  // Loading
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  loadingText: { fontSize: fontSize.sm, color: colors.textSecondary },

  // Input
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight, backgroundColor: colors.surface },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.md, color: colors.text, maxHeight: 100, marginRight: spacing.xs },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: colors.border },
});
