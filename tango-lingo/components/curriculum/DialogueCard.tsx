import { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadow } from '../../constants/theme';
import { speak, stopSpeaking } from '../../utils/audio';

interface DialogueLine {
  speaker: string;
  spanish: string;
  korean: string;
}

interface DialogueCardProps {
  situation: string;
  lines: DialogueLine[];
}

export function DialogueCard({ situation, lines }: DialogueCardProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [playingAll, setPlayingAll] = useState(false);
  const stopRef = useRef(false);

  const handleSpeak = useCallback(async (text: string, index: number) => {
    stopSpeaking();
    if (playingIndex === index) {
      setPlayingIndex(null);
      return;
    }
    setPlayingIndex(index);
    await speak(text, 'es');
    setPlayingIndex(null);
  }, [playingIndex]);

  const handleSpeakAll = useCallback(async () => {
    if (playingAll) {
      stopRef.current = true;
      stopSpeaking();
      setPlayingAll(false);
      setPlayingIndex(null);
      return;
    }
    stopRef.current = false;
    setPlayingAll(true);
    for (let i = 0; i < lines.length; i++) {
      if (stopRef.current) break;
      setPlayingIndex(i);
      await speak(lines[i].spanish, 'es');
      if (stopRef.current) break;
    }
    setPlayingAll(false);
    setPlayingIndex(null);
  }, [playingAll, lines]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>실전 대화</Text>
      </View>

      <Text style={styles.situation}>{situation}</Text>

      <TouchableOpacity
        style={styles.playAllButton}
        onPress={handleSpeakAll}
        activeOpacity={0.7}
      >
        <Ionicons
          name={playingAll ? 'stop-circle' : 'play-circle'}
          size={18}
          color={colors.secondaryLight}
        />
        <Text style={styles.playAllText}>
          {playingAll ? '멈추기' : '전체 듣기'}
        </Text>
      </TouchableOpacity>

      <View style={styles.dialogueBox}>
        {lines.map((line, i) => (
          <View key={i} style={styles.lineRow}>
            <View style={styles.speakerBadge}>
              <Text style={styles.speakerText}>{line.speaker}</Text>
            </View>
            <View style={styles.lineContent}>
              <Text style={styles.spanish}>{line.spanish}</Text>
              <Text style={styles.korean}>{line.korean}</Text>
            </View>
            <TouchableOpacity
              style={styles.speakButton}
              onPress={() => handleSpeak(line.spanish, i)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={playingIndex === i ? 'volume-high' : 'volume-medium-outline'}
                size={18}
                color={playingIndex === i ? colors.secondaryLight : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badge: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.secondaryLight,
    backgroundColor: '#E3F2FD',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
  situation: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  playAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginBottom: spacing.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: '#E3F2FD',
  },
  playAllText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryLight,
  },
  dialogueBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  lineRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  speakerBadge: {
    backgroundColor: colors.secondaryLight,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  speakerText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#FFF',
  },
  lineContent: {
    flex: 1,
  },
  spanish: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: 1,
  },
  korean: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  speakButton: {
    padding: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
