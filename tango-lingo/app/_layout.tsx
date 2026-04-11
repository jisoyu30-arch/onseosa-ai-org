import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useProgressStore } from '../stores/useProgressStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { colors } from '../constants/theme';

export default function RootLayout() {
  const loadProgress = useProgressStore((s) => s.load);
  const loadSettings = useSettingsStore((s) => s.load);

  useEffect(() => {
    loadProgress();
    loadSettings();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
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
