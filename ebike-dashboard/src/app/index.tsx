import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AssistSelector } from '@/components/dashboard/assist-selector';
import { BatteryPanel } from '@/components/dashboard/battery-panel';
import { RideControls } from '@/components/dashboard/ride-controls';
import { SpeedGauge } from '@/components/dashboard/speed-gauge';
import { StatCard } from '@/components/dashboard/stat-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ASSIST_MODES, MAX_SPEED_KMH } from '@/constants/ebike';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRideSimulation } from '@/hooks/use-ride-simulation';

function formatDuration(totalSeconds: number): string {
  const s = Math.floor(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export default function DashboardScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { telemetry, start, pause, reset, setAssist } = useRideSimulation();

  const mode = ASSIST_MODES[telemetry.assistIndex];
  const avgSpeed = telemetry.seconds > 0 ? telemetry.distance / (telemetry.seconds / 3600) : 0;

  const topPad = Platform.select({ web: Spacing.six, default: insets.top + Spacing.three }) ?? Spacing.three;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad, paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
      ]}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View>
            <ThemedText type="subtitle">Ride Dashboard</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {telemetry.status === 'riding'
                ? 'Riding now'
                : telemetry.status === 'paused'
                  ? 'Paused'
                  : 'Ready to ride'}
            </ThemedText>
          </View>
          <View style={[styles.statusDot, { backgroundColor: telemetry.status === 'riding' ? mode.color : theme.textSecondary }]} />
        </View>

        <View style={styles.gaugeWrap}>
          <SpeedGauge speed={telemetry.speed} max={MAX_SPEED_KMH} color={mode.color} label={mode.short} />
        </View>

        <BatteryPanel battery={telemetry.battery} />

        <View style={styles.statsGrid}>
          <StatCard label="Trip" value={telemetry.distance.toFixed(2)} unit="km" />
          <StatCard label="Time" value={formatDuration(telemetry.seconds)} />
          <StatCard label="Avg speed" value={avgSpeed.toFixed(1)} unit="km/h" />
          <StatCard label="Motor" value={`${telemetry.power}`} unit="W" accent={mode.color} />
          <StatCard label="Cadence" value={`${telemetry.cadence}`} unit="rpm" />
          <StatCard label="Top mode" value={mode.label} />
        </View>

        <AssistSelector assistIndex={telemetry.assistIndex} onChange={setAssist} />

        <RideControls
          status={telemetry.status}
          batteryEmpty={telemetry.battery <= 0}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />
      </ThemedView>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  gaugeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
