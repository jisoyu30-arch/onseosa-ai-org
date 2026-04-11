import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { levels, units, lessons } from '../../data/lessons';
import { useProgressStore } from '../../stores/useProgressStore';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';

export default function LearnScreen() {
  const router = useRouter();
  const completedLessons = useProgressStore((s) => s.completedLessons);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>학습</Text>

        {levels.map((level) => {
          const levelUnits = units.filter((u) => level.unitIds.includes(u.id));
          return (
            <View key={level.id} style={styles.levelSection}>
              <View style={styles.levelHeader}>
                <Text style={styles.levelTitle}>{level.title}</Text>
                <Text style={styles.levelTitleKo}>{level.titleKo}</Text>
              </View>

              {levelUnits.map((unit) => {
                const unitLessons = lessons.filter((l) => unit.lessonIds.includes(l.id));
                const doneCount = unitLessons.filter((l) => completedLessons.includes(l.id)).length;

                return (
                  <View key={unit.id} style={styles.unitCard}>
                    <View style={styles.unitHeader}>
                      <Text style={styles.unitTitle}>{unit.titleKo}</Text>
                      <Text style={styles.unitProgress}>{doneCount}/{unitLessons.length}</Text>
                    </View>

                    {unitLessons.map((lesson) => {
                      const done = completedLessons.includes(lesson.id);
                      return (
                        <TouchableOpacity
                          key={lesson.id}
                          style={[styles.lessonRow, done && styles.lessonDone]}
                          onPress={() => router.push(`/lesson/${lesson.id}`)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.lessonDot, done && styles.dotDone]}>
                            {done ? (
                              <Ionicons name="checkmark" size={14} color="#FFF" />
                            ) : (
                              <View style={styles.dotEmpty} />
                            )}
                          </View>
                          <View style={styles.lessonInfo}>
                            <Text style={styles.lessonTitle}>{lesson.titleKo}</Text>
                            <Text style={styles.lessonSituation}>{lesson.situation}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  pageTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  levelSection: {
    marginBottom: spacing.lg,
  },
  levelHeader: {
    marginBottom: spacing.sm,
  },
  levelTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.secondary,
  },
  levelTitleKo: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  unitCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadow.sm,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  unitTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  unitProgress: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  lessonDone: {
    opacity: 0.7,
  },
  lessonDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  dotEmpty: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  lessonSituation: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
