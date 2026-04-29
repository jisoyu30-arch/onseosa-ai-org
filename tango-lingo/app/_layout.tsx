import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgressStore } from '../stores/useProgressStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useGoalStore } from '../stores/useGoalStore';
import { useDialogueProgress } from '../stores/useDialogueProgress';
import { useCurriculumStore } from '../stores/useCurriculumStore';
import { useTestStore } from '../stores/useTestStore';
import { useTheme } from '../utils/useTheme';
import OnboardingScreen from './onboarding';

const ONBOARDING_KEY = '@tangolingo_onboarding_done';

function AppContent() {
  const { colors, isDark } = useTheme();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  const loadProgress = useProgressStore((s) => s.load);
  const loadSettings = useSettingsStore((s) => s.load);
  const loadTheme = useThemeStore((s) => s.load);
  const loadGoal = useGoalStore((s) => s.load);
  const loadDialogueProgress = useDialogueProgress((s) => s.load);
  const loadCurriculum = useCurriculumStore((s) => s.load);
  const loadTest = useTestStore((s) => s.load);

  useEffect(() => {
    loadProgress();
    loadSettings();
    loadTheme();
    loadGoal();
    loadDialogueProgress();
    loadCurriculum();
    loadTest();

    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((val) => setOnboardingDone(val === 'true'))
      .catch(() => setOnboardingDone(false));
  }, []);

  if (onboardingDone === null) return null;

  if (!onboardingDone) {
    return (
      <>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <OnboardingScreen onComplete={() => setOnboardingDone(true)} />
      </>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return <AppContent />;
}
