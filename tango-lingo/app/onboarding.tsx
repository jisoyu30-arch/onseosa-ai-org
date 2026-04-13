import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_KEY = '@tangolingo_onboarding_done';
const USERNAME_KEY = '@tangolingo_username';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const goToPage = (page: number) => {
    scrollRef.current?.scrollTo({ x: page * SCREEN_WIDTH, animated: true });
  };

  const handleStart = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await AsyncStorage.setItem(USERNAME_KEY, trimmed);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {/* 페이지 1: 환영 */}
        <View style={styles.page}>
          <Text style={styles.emoji}>💃</Text>
          <Text style={styles.title}>TangoLingo에{'\n'}오신 걸 환영해요</Text>
          <Text style={styles.description}>
            탱고를 배우며 스페인어도 함께 배워요.{'\n'}
            수업에서 바로 쓰는 실전 표현을{'\n'}
            재미있게 익힐 수 있어요.
          </Text>
          <TouchableOpacity style={styles.nextBtn} onPress={() => goToPage(1)}>
            <Text style={styles.nextBtnText}>다음</Text>
          </TouchableOpacity>
        </View>

        {/* 페이지 2: 학습 방법 */}
        <View style={styles.page}>
          <Text style={styles.emoji}>⏱️</Text>
          <Text style={styles.title}>매일 5분,{'\n'}탱고 스페인어</Text>
          <Text style={styles.description}>
            짧은 레슨으로 핵심 표현을 배우고,{'\n'}
            퀴즈와 역할극으로 확실히 기억해요.{'\n'}
            커플이 함께하면 더 재밌어요!
          </Text>
          <TouchableOpacity style={styles.nextBtn} onPress={() => goToPage(2)}>
            <Text style={styles.nextBtnText}>다음</Text>
          </TouchableOpacity>
        </View>

        {/* 페이지 3: 이름 입력 */}
        <KeyboardAvoidingView
          style={styles.page}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Text style={styles.emoji}>✍️</Text>
          <Text style={styles.title}>이름을 알려주세요</Text>
          <Text style={styles.description}>
            학습 화면에서 이름으로 인사할게요.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력하세요"
            placeholderTextColor={colors.textLight}
            value={name}
            onChangeText={setName}
            maxLength={20}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />
          <TouchableOpacity
            style={[styles.startBtn, !name.trim() && styles.startBtnDisabled]}
            onPress={handleStart}
            disabled={!name.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.startBtnText}>시작하기</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>

      {/* 페이지 인디케이터 */}
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[styles.dot, currentPage === i && styles.dotActive]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emoji: {
    fontSize: 72,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 44,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  nextBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl + spacing.md,
    borderRadius: borderRadius.full,
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.lg,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  startBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.xl + spacing.md,
    borderRadius: borderRadius.full,
  },
  startBtnDisabled: {
    opacity: 0.4,
  },
  startBtnText: {
    color: '#FFF',
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
});
