import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { scenarios, continueConversation, ConvMessage, ScenarioType } from '../../services/conversation';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ConversationScreen() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>();
  const router = useRouter();
  const scenario = scenarios.find((s) => s.id === scenarioId);

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // AI가 먼저 대화 시작
  useEffect(() => {
    if (!scenario) return;
    startConversation();
  }, []);

  const startConversation = async () => {
    if (!scenario) return;
    setLoading(true);
    const aiResponse = await continueConversation(scenario, []);
    setMessages([{ id: 'a_0', role: 'assistant', content: aiResponse }]);
    setLoading(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || !scenario) return;

    const userMsg: DisplayMessage = { id: `u_${Date.now()}`, role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const history: ConvMessage[] = newMessages.map((m) => ({ role: m.role, content: m.content }));
    const aiResponse = await continueConversation(scenario, history);

    const aiMsg: DisplayMessage = { id: `a_${Date.now()}`, role: 'assistant', content: aiResponse };
    setMessages([...newMessages, aiMsg]);
    setLoading(false);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!scenario) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>시나리오를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  const renderMessage = ({ item }: { item: DisplayMessage }) => (
    <View style={[styles.msgRow, item.role === 'user' ? styles.userRow : styles.aiRow]}>
      {item.role === 'assistant' && (
        <View style={styles.aiAvatar}><Text style={styles.avatarText}>{scenario.emoji}</Text></View>
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
          <Text style={styles.headerTitle}>{scenario.titleKo}</Text>
          <Text style={styles.headerSub}>{scenario.title}</Text>
        </View>
        <TouchableOpacity onPress={startConversation} hitSlop={12}>
          <Ionicons name="refresh" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 힌트 */}
      <View style={styles.hint}>
        <Ionicons name="information-circle" size={16} color={colors.secondaryLight} />
        <Text style={styles.hintText}>스페인어로 대화해보세요. 모르면 한국어도 OK!</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.secondary} />
            <Text style={styles.loadingText}>상대가 말하는 중...</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="스페인어로 대답하세요..."
            placeholderTextColor={colors.textLight}
            multiline
            maxLength={300}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={handleSend}
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
  headerSub: { fontSize: fontSize.xs, color: colors.primary, fontStyle: 'italic' },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, backgroundColor: colors.accentLight },
  hintText: { fontSize: fontSize.xs, color: colors.text },
  content: { flex: 1 },
  msgList: { padding: spacing.md, paddingBottom: spacing.lg },
  msgRow: { flexDirection: 'row', marginBottom: spacing.sm, maxWidth: '85%' as any },
  userRow: { alignSelf: 'flex-end' },
  aiRow: { alignSelf: 'flex-start' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.accentLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.xs },
  avatarText: { fontSize: 16 },
  bubble: { padding: spacing.sm + 2, borderRadius: borderRadius.lg },
  userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, ...shadow.sm },
  msgText: { fontSize: fontSize.md, lineHeight: 22 },
  userText: { color: '#FFF' },
  aiText: { color: colors.text },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  loadingText: { fontSize: fontSize.sm, color: colors.textSecondary },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight, backgroundColor: colors.surface },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.md, color: colors.text, maxHeight: 100, marginRight: spacing.xs },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: colors.border },
  errorText: { fontSize: fontSize.lg, color: colors.error, textAlign: 'center', marginTop: 100 },
});
