import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { writingPrompts, WritingPrompt } from '../../data/writing-prompts';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SCORING_PROMPT = `You are a Spanish language teacher for Korean tango dancers.
The student will write a Spanish sentence based on a situation prompt.
Score their answer in 3 categories (1-5 stars each):
- correctness: 의미가 상황에 맞는지
- grammar: 문법과 철자가 정확한지
- naturalness: 원어민이 자연스럽게 쓸 표현인지

Respond ONLY in this exact JSON format (no markdown):
{
  "correctness": <1-5>,
  "grammar": <1-5>,
  "naturalness": <1-5>,
  "corrected": "<corrected Spanish sentence or empty if perfect>",
  "feedback": "<1-2 sentence feedback in Korean>"
}`;

interface ScoreResult {
  correctness: number;
  grammar: number;
  naturalness: number;
  corrected: string;
  feedback: string;
}

function getRandomPrompt(exclude?: string): WritingPrompt {
  const pool = exclude ? writingPrompts.filter((p) => p.id !== exclude) : writingPrompts;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function scoreWriting(situation: string, answer: string): Promise<ScoreResult | null> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SCORING_PROMPT }] },
        contents: [
          {
            role: 'user',
            parts: [{ text: `상황: ${situation}\n학생 답변: ${answer}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return JSON.parse(text) as ScoreResult;
  } catch {
    return null;
  }
}

function Stars({ count }: { count: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= count ? 'star' : 'star-outline'}
          size={18}
          color={i <= count ? colors.xpGold : colors.border}
        />
      ))}
    </View>
  );
}

export default function WritingScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState<WritingPrompt>(getRandomPrompt());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    const score = await scoreWriting(prompt.situationKo, input.trim());
    if (score) {
      setResult(score);
    } else {
      setResult({
        correctness: 0,
        grammar: 0,
        naturalness: 0,
        corrected: '',
        feedback: 'API 키가 없거나 네트워크 오류입니다. 나중에 다시 시도해주세요.',
      });
    }
    setLoading(false);
  };

  const handleNext = () => {
    setPrompt(getRandomPrompt(prompt.id));
    setInput('');
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>작문 연습</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 레벨 표시 */}
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {prompt.level}</Text>
        </View>

        {/* 상황 프롬프트 */}
        <View style={styles.promptCard}>
          <Ionicons name="chatbox-ellipses" size={24} color={colors.secondary} />
          <Text style={styles.promptText}>{prompt.situationKo}</Text>
          {prompt.hintEs && (
            <Text style={styles.hintText}>힌트: {prompt.hintEs}</Text>
          )}
        </View>

        {/* 입력 영역 */}
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="스페인어로 작성하세요..."
          placeholderTextColor={colors.textLight}
          multiline
          maxLength={300}
          editable={!result}
          autoCapitalize="sentences"
        />

        {/* 제출/다음 버튼 */}
        {!result ? (
          <TouchableOpacity
            style={[styles.submitBtn, (!input.trim() || loading) && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!input.trim() || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.submitText}>채점하기</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextText}>다음 문제</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
          </TouchableOpacity>
        )}

        {/* 결과 */}
        {result && result.correctness > 0 && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>채점 결과</Text>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>정확성</Text>
              <Stars count={result.correctness} />
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>문법</Text>
              <Stars count={result.grammar} />
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>자연스러움</Text>
              <Stars count={result.naturalness} />
            </View>

            {result.corrected ? (
              <View style={styles.correctedBox}>
                <Text style={styles.correctedLabel}>교정된 문장</Text>
                <Text style={styles.correctedText}>{result.corrected}</Text>
              </View>
            ) : null}

            <Text style={styles.feedbackText}>{result.feedback}</Text>
          </View>
        )}

        {/* API 없는 경우 */}
        {result && result.correctness === 0 && (
          <View style={styles.errorCard}>
            <Ionicons name="warning" size={20} color={colors.warning} />
            <Text style={styles.errorText}>{result.feedback}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.text },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },

  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondaryLight,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  levelText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: '#FFF' },

  promptCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  promptText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    lineHeight: 26,
  },
  hintText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  submitBtnDisabled: { backgroundColor: colors.border },
  submitText: { color: '#FFF', fontSize: fontSize.md, fontWeight: fontWeight.bold },

  nextBtn: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  nextText: { color: '#FFF', fontSize: fontSize.md, fontWeight: fontWeight.bold },

  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.sm,
  },
  resultTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: { fontSize: fontSize.md, color: colors.text },
  starsRow: { flexDirection: 'row', gap: 2 },

  correctedBox: {
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  correctedLabel: { fontSize: fontSize.xs, color: colors.success, fontWeight: fontWeight.bold, marginBottom: 2 },
  correctedText: { fontSize: fontSize.md, color: colors.text, fontStyle: 'italic' },

  feedbackText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  errorCard: {
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorText: { fontSize: fontSize.sm, color: colors.text, flex: 1 },
});
