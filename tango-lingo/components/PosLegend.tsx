import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { POS_COLORS, POS_ORDER } from '../constants/partOfSpeech';

export default function PosLegend() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {POS_ORDER.map((pos) => {
          const c = POS_COLORS[pos];
          return (
            <View key={pos} style={[styles.chip, { backgroundColor: c.bg }]}>
              <Text style={[styles.label, { color: c.fg }]}>{c.label}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, paddingVertical: 4 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  label: { fontSize: 11, fontWeight: '700' },
});
