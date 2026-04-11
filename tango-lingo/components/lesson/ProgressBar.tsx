import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? current / total : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(progress * 100, 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
});
