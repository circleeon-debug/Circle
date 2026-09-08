import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type Props = {
  label: string;
  value: string;
  unit?: string;
  accent?: string;
};

export function StatCard({ label, value, unit, accent }: Props) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedView type="backgroundElement" style={styles.valueRow}>
        <ThemedText style={[styles.value, accent ? { color: accent } : null]}>{value}</ThemedText>
        {unit ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.unit}>
            {unit}
          </ThemedText>
        ) : null}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: 140,
    minWidth: 140,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  unit: {
    fontSize: 13,
  },
});
