import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { roleplays } from '../../data/roleplays';
import { ProgressBar } from '../../components/lesson/ProgressBar';
import { Button } from '../../components/common/Button';
import { RoleplayPronunciation } from '../../components/couple/RoleplayPronunciation';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

export default function RoleplayScreen() {
  const { dialogId } = useLocalSearchParams<{ dialogId: string }>();
  const router = useRouter();
  const dialog = roleplays[dialogId!];

  const [currentLine, setCurrentLine] = useState(0);
  const [myRole, setMyRole] = useState<'A' | 'B' | null>(null);
  const [finished, setFinished] = useState(false);

  if (!dialog) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>역할극을 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  // 역할 선택 화면
  if (!myRole) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.roleSelect}>
          <Text style={styles.roleTitle}>역할을 선택하세요</Text>
          <Text style={styles.roleSubtitle}>{dialog.titleKo}</Text>
          <Text style={styles.roleSituation}>{dialog.situation}</Text>

          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[styles.roleBtn, { borderColor: colors.primary }]}
              onPress={() => setMyRole('A')}
            >
              <Text style={[styles.roleBtnLabel, { color: colors.primary }]}>A</Text>
              <Text style={styles.roleBtnName}>
                {dialog.lines.find((l) => l.role === 'A')?.roleLabel || 'Role A'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleBtn, { borderColor: colors.secondary }]}
              onPress={() => setMyRole('B')}
            >
              <Text style={[styles.roleBtnLabel, { color: colors.secondary }]}>B</Text>
              <Text style={styles.roleBtnName}>
                {dialog.lines.find((l) => l.role === 'B')?.roleLabel || 'Role B'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 완료 화면
  if (finished) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.completeBox}>
          <Text style={styles.completeEmoji}>🎭</Text>
          <Text style={styles.completeTitle}>¡Muy bien!</Text>
          <Text style={styles.completeSubtitle}>역할극 완료!</Text>
          <Button title="홈으로" onPress={() => router.replace('/(tabs)')} size="lg" style={{ marginTop: spacing.xl }} />
        </View>
      </SafeAreaView>
    );
  }

  // 대사 진행
  const line = dialog.lines[currentLine];
  const isMyTurn = line.role === myRole;

  const handleNext = () => {
    if (currentLine < dialog.lines.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={28} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: spacing.sm }}>
          <ProgressBar current={currentLine + 1} total={dialog.lines.length} />
        </View>
      </View>

      {/* 턴 표시 */}
      <View style={styles.turnBanner}>
        <Text style={[styles.turnText, isMyTurn ? styles.myTurn : styles.partnerTurn]}>
          {isMyTurn ? '🎤 내 차례' : '👂 상대 차례'}
        </Text>
      </View>

      {/* 대사 카드 + 발음 */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.lineCard}>
          <View style={[styles.roleTag, { backgroundColor: line.role === 'A' ? colors.primary : colors.secondary }]}>
            <Text style={styles.roleTagText}>{line.roleLabel}</Text>
          </View>
          <Text style={styles.lineSpanish}>{line.spanish}</Text>
          <Text style={styles.lineKorean}>{line.korean}</Text>
        </View>

        {/* 발음 연습 */}
        <RoleplayPronunciation
          key={`${dialog.id}-${currentLine}`}
          spanish={line.spanish}
          isMyTurn={isMyTurn}
        />
      </ScrollView>

      {/* 다음 버튼 */}
      <View style={styles.bottomAction}>
        <Button
          title={currentLine < dialog.lines.length - 1 ? '다음 대사' : '완료'}
          onPress={handleNext}
          size="lg"
          style={{ alignSelf: 'stretch' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginTop: 100,
  },
  // 역할 선택
  roleSelect: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  roleTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  roleSubtitle: {
    fontSize: fontSize.lg,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  roleSituation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  roleBtn: {
    width: 130,
    height: 130,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    ...shadow.md,
  },
  roleBtnLabel: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
  },
  roleBtnName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  // 턴 표시
  turnBanner: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  turnText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  myTurn: {
    backgroundColor: colors.accentLight,
    color: colors.text,
  },
  partnerTurn: {
    backgroundColor: colors.borderLight,
    color: colors.textSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  // 대사 카드
  lineCard: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  roleTag: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  roleTagText: {
    color: '#FFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  lineSpanish: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  lineKorean: {
    fontSize: fontSize.lg,
    color: colors.secondary,
    textAlign: 'center',
  },
  // 하단 버튼
  bottomAction: {
    padding: spacing.lg,
  },
  // 완료
  completeBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  completeEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  completeTitle: {
    fontSize: fontSize.hero,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  completeSubtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
});
