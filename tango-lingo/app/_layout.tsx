import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgressStore } from '../stores/useProgressStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useTheme } from '../utils/useTheme';
import OnboardingScreen from './onboarding';

const ONBOARDING_KEY = '@tangolingo_onboarding_done';

function AppContent() {
  const { colors, isDark } = useTheme();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  const loadProgress = useProgressStore((s) => s.load);
  const loadSettings = useSettingsStore((s) => s.load);
  const loadTheme = useThemeStore((s) => s.load);

  useEffect(() => {
    loadProgress();
    loadSettings();
    loadTheme();

    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((val) => setOnboardingDone(val === 'true'))
      .catch(() => setOnboardingDone(false));
  }, []);

  // 로딩 중 (null) — 아무것도 안 그림
  if (onboardingDone === null) return null;

  // 온보딩 미완료
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
