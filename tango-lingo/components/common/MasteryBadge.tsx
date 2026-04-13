import { View, Text, StyleSheet } from 'react-native';
import { fontSize, fontWeight } from '../../constants/theme';

export type MasteryLevel = 'new' | 'learning' | 'familiar' | 'mastered';

const MASTERY_CONFIG: Record<MasteryLevel, { label: string; color: string; ringColor: string }> = {
  new:       { label: '새것',   color: '#9E9E9E', ringColor: '#E0E0E0' },
  learning:  { label: '학습중', color: '#F9A825', ringColor: '#FFF176' },
  familiar:  { label: '익숙함', color: '#1E88E5', ringColor: '#64B5F6' },
  mastered:  { label: '마스터', color: '#43A047', ringColor: '#81C784' },
};

/**
 * 간격(interval)으로 마스터리 레벨을 결정한다.
 * 0 = new, 1-3 = learning, 7-14 = familiar, 30+ = mastered
 */
export function getMasteryLevel(interval: number): MasteryLevel {
  if (interval <= 0) return 'new';
  if (interval <= 3) return 'learning';
  if (interval <= 14) return 'familiar';
  return 'mastered';
}

interface MasteryBadgeProps {
  level: MasteryLevel;
  size?: number;
}

export function MasteryBadge({ level, size = 28 }: MasteryBadgeProps) {
  const config = MASTERY_CONFIG[level];
  const borderWidth = Math.max(2, size * 0.12);

  return (
    <View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth,
          borderColor: config.ringColor,
          backgroundColor: config.color + '22',
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { fontSize: Math.max(8, size * 0.3), color: config.color },
        ]}
        numberOfLines={1}
      >
        {config.label.charAt(0)}
      </Text>
    </View>
  );
}

export { MASTERY_CONFIG };

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
});
