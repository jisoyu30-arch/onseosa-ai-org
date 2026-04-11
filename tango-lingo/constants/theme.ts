export const colors = {
  primary: '#E63946',      // 탱고 레드
  primaryLight: '#FF6B6B',
  primaryDark: '#C62828',
  secondary: '#1D3557',    // 딥 네이비
  secondaryLight: '#457B9D',
  accent: '#F4A261',       // 따뜻한 골드
  accentLight: '#FFD19A',

  background: '#FFF8F0',   // 웜 화이트
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  text: '#2B2D42',
  textSecondary: '#8D99AE',
  textLight: '#B0B8C8',

  success: '#2ECC71',
  successLight: '#D4EFDF',
  error: '#E74C3C',
  errorLight: '#FADBD8',
  warning: '#F39C12',

  border: '#E8E8E8',
  borderLight: '#F0F0F0',

  xpGold: '#FFB800',
  streakOrange: '#FF8C00',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};
