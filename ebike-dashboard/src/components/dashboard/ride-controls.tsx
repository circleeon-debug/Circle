import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { RideStatus } from '@/hooks/use-ride-simulation';

type Props = {
  status: RideStatus;
  batteryEmpty: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export function RideControls({ status, batteryEmpty, onStart, onPause, onReset }: Props) {
  const riding = status === 'riding';
  const primaryLabel = riding ? 'Pause' : batteryEmpty ? 'Battery Empty' : status === 'paused' ? 'Resume' : 'Start Ride';
  const primaryColor = riding ? '#f5a623' : '#2ecc71';

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        disabled={!riding && batteryEmpty}
        onPress={riding ? onPause : onStart}
        style={({ pressed }) => [
          styles.primary,
          { backgroundColor: primaryColor },
          (!riding && batteryEmpty) && styles.disabled,
          pressed && styles.pressed,
        ]}>
        <ThemedText style={styles.primaryText}>{primaryLabel}</ThemedText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onReset}
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
        <ThemedText type="smallBold" style={styles.secondaryText}>
          Reset
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  primary: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  secondary: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: 'rgba(128,128,128,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    fontSize: 15,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
