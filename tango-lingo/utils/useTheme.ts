import { useMemo } from 'react';
import { colors as lightColors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../constants/theme';
import { darkColors } from '../constants/darkTheme';
import { useThemeStore } from '../stores/useThemeStore';

/**
 * 현재 테마에 맞는 색상을 반환하는 훅.
 * 점진적 마이그레이션을 위해 colors만 테마에 따라 바뀌고,
 * spacing/borderRadius/fontSize/fontWeight/shadow는 그대로 re-export.
 */
export function useTheme() {
  const mode = useThemeStore((s) => s.mode);

  const currentColors = useMemo(
    () => (mode === 'dark' ? darkColors : lightColors),
    [mode],
  );

  return {
    colors: currentColors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
    shadow,
    isDark: mode === 'dark',
  };
}
