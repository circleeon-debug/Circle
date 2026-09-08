import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ASSIST_MODES } from '@/constants/ebike';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Trip = {
  id: string;
  route: string;
  date: string;
  distanceKm: number;
  durationMin: number;
  avgKmh: number;
  batteryUsed: number;
  mode: string;
};

const TRIPS: Trip[] = [
  { id: '1', route: 'Riverside Loop', date: 'Today · 08:12', distanceKm: 14.2, durationMin: 41, avgKmh: 20.8, batteryUsed: 22, mode: 'tour' },
  { id: '2', route: 'Hillside Climb', date: 'Yesterday · 17:40', distanceKm: 9.6, durationMin: 34, avgKmh: 16.9, batteryUsed: 31, mode: 'turbo' },
  { id: '3', route: 'Commute → Office', date: 'Mon · 07:55', distanceKm: 7.8, durationMin: 22, avgKmh: 21.3, batteryUsed: 14, mode: 'sport' },
  { id: '4', route: 'Coastal Cruise', date: 'Sun · 10:05', distanceKm: 26.4, durationMin: 78, avgKmh: 20.3, batteryUsed: 38, mode: 'eco' },
];

function modeColor(key: string): string {
  return ASSIST_MODES.find((m) => m.key === key)?.color ?? '#3c87f7';
}

function modeLabel(key: string): string {
  return ASSIST_MODES.find((m) => m.key === key)?.label ?? key;
}

export default function TripsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const totalKm = TRIPS.reduce((sum, t) => sum + t.distanceKm, 0);
  const totalMin = TRIPS.reduce((sum, t) => sum + t.durationMin, 0);
  const topPad = Platform.select({ web: Spacing.six, default: insets.top + Spacing.three }) ?? Spacing.three;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad, paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
      ]}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Trips</ThemedText>

        <ThemedView type="backgroundElement" style={styles.summary}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryValue}>{totalKm.toFixed(1)}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              km this week
            </ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryValue}>{TRIPS.length}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              rides
            </ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryValue}>{Math.round(totalMin)}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              minutes
            </ThemedText>
          </View>
        </ThemedView>

        <View style={styles.list}>
          {TRIPS.map((trip) => (
            <ThemedView key={trip.id} type="backgroundElement" style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitle}>
                  <ThemedText type="smallBold" style={styles.route}>
                    {trip.route}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {trip.date}
                  </ThemedText>
                </View>
                <View style={[styles.badge, { backgroundColor: modeColor(trip.mode) }]}>
                  <ThemedText style={styles.badgeText}>{modeLabel(trip.mode)}</ThemedText>
                </View>
              </View>

              <View style={styles.metrics}>
                <Metric value={`${trip.distanceKm.toFixed(1)}`} unit="km" label="Distance" />
                <Metric value={`${trip.durationMin}`} unit="min" label="Time" />
                <Metric value={`${trip.avgKmh.toFixed(1)}`} unit="km/h" label="Avg" />
                <Metric value={`${trip.batteryUsed}`} unit="%" label="Battery" />
              </View>
            </ThemedView>
          ))}
        </View>
      </ThemedView>
    </ScrollView>
  );
}

function Metric({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricValueRow}>
        <ThemedText style={styles.metricValue}>{value}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.metricUnit}>
          {unit}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.metricLabel}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(128,128,128,0.3)',
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    gap: 2,
    flexShrink: 1,
  },
  route: {
    fontSize: 16,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    gap: 2,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  metricUnit: {
    fontSize: 12,
  },
  metricLabel: {
    fontSize: 12,
  },
});
