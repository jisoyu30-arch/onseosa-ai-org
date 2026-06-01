// 단어 일러스트 — Pollinations.ai 로 AI 생성, 로딩/에러시 이모지 fallback
import { useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { getWordImageUrl } from '../utils/wordImage';
import { getWordEmoji } from '../data/vocab/word-emoji';
import { CATEGORY_INFO } from '../data/vocab/categories';
import type { LearningMode } from '../types';
import type { VocabCategory } from '../data/vocab/categories';

interface Props {
  word: string;
  mode: LearningMode;
  ko?: string | null;
  category: VocabCategory;
  size?: number;
}

export default function WordImage({ word, mode, ko, category, size = 200 }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageUrl = getWordImageUrl(word, mode, ko, size * 2);
  const fallbackEmoji = getWordEmoji(word) ?? CATEGORY_INFO[category]?.emoji ?? '📦';

  if (error) {
    return (
      <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={{ fontSize: size * 0.55 }}>{fallbackEmoji}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
        resizeMode="cover"
      />
      {loading && (
        <View style={[styles.loadingOverlay, { borderRadius: size / 2 }]}>
          <Text style={{ fontSize: size * 0.45 }}>{fallbackEmoji}</Text>
          <ActivityIndicator size="small" color="#9CA3AF" style={{ position: 'absolute', bottom: 16 }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { position: 'absolute' },
  fallback: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
