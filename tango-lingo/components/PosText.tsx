import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { POS_COLORS, type PosToken } from '../constants/partOfSpeech';

interface Props {
  tokens?: PosToken[];     // 품사 태그된 토큰 (있으면 색 적용)
  fallback?: string;       // 태그 없으면 이 텍스트를 평문으로
  fontSize?: number;
  fontWeight?: '600' | '700' | '800';
  color?: string;
}

/**
 * 품사 색 코딩 렌더러.
 * tokens가 있으면 각 토큰에 배경색/글자색 적용 + 탭시 한국어 뜻 표시.
 * 없으면 fallback을 평문 렌더.
 */
export default function PosText({
  tokens,
  fallback = '',
  fontSize = 22,
  fontWeight = '700',
  color = '#2B2D42',
}: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!tokens || tokens.length === 0) {
    return <Text style={{ fontSize, fontWeight, color, lineHeight: fontSize * 1.4 }}>{fallback}</Text>;
  }

  return (
    <View>
      <View style={styles.row}>
        {tokens.map((tok, i) => {
          const c = POS_COLORS[tok.pos];
          const isNone = tok.pos === 'none';
          return (
            <Pressable
              key={i}
              onPress={() => setActiveIdx(activeIdx === i ? null : i)}
              style={[
                styles.token,
                !isNone && { backgroundColor: c.bg },
              ]}
            >
              <Text
                style={{
                  fontSize,
                  fontWeight,
                  color: isNone ? color : c.fg,
                  lineHeight: fontSize * 1.4,
                }}
              >
                {tok.text}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeIdx !== null && tokens[activeIdx] && (
        <View style={[styles.popup, { backgroundColor: POS_COLORS[tokens[activeIdx].pos].bg }]}>
          <Text style={[styles.popupLabel, { color: POS_COLORS[tokens[activeIdx].pos].fg }]}>
            {POS_COLORS[tokens[activeIdx].pos].label}
          </Text>
          {tokens[activeIdx].ko && (
            <Text style={[styles.popupMean, { color: POS_COLORS[tokens[activeIdx].pos].fg }]}>
              {tokens[activeIdx].ko}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  token: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  popup: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    gap: 2,
  },
  popupLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  popupMean: { fontSize: 14, fontWeight: '600' },
});
