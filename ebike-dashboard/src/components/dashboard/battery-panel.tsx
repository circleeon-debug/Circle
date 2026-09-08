import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { batteryColor, estimateRangeKm } from '@/constants/ebike';
import { Spacing } from '@/constants/theme';

const SEGMENTS = 12;

type Props = {
  battery: number;
};

export function BatteryPanel({ battery }: Props) {
  const color = batteryColor(battery);
  const range = estimateRangeKm(battery);
  const filled = Math.round((battery / 100) * SEGMENTS);

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.batteryIcon}>
            <View style={[styles.batteryFill, { width: `${battery}%`, backgroundColor: color }]} />
          </View>
          <ThemedText type="smallBold">Battery</ThemedText>
        </View>
        <ThemedText style={[styles.pct, { color }]}>{Math.round(battery)}%</ThemedText>
      </View>

      <View style={styles.segments}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { backgroundColor: i < filled ? color : 'rgba(128,128,128,0.25)' },
            ]}
          />
        ))}
      </View>

      <View style={styles.rangeRow}>
        <ThemedText type="small" themeColor="textSecondary">
          Estimated range
        </ThemedText>
        <ThemedText type="smallBold">{range.toFixed(1)} km</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  batteryIcon: {
    width: 34,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(128,128,128,0.6)',
    padding: 2,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 1,
  },
  pct: {
    fontSize: 22,
    fontWeight: '700',
  },
  segments: {
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 14,
    borderRadius: 3,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
});
