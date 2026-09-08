import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ASSIST_MODES } from '@/constants/ebike';
import { Spacing } from '@/constants/theme';

type Props = {
  assistIndex: number;
  onChange: (index: number) => void;
};

export function AssistSelector({ assistIndex, onChange }: Props) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        Pedal Assist
      </ThemedText>
      <View style={styles.row}>
        {ASSIST_MODES.map((mode, index) => {
          const selected = index === assistIndex;
          return (
            <Pressable
              key={mode.key}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(index)}
              style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
              <View
                style={[
                  styles.mode,
                  selected
                    ? { backgroundColor: mode.color, borderColor: mode.color }
                    : { borderColor: 'rgba(128,128,128,0.35)' },
                ]}>
                <ThemedText
                  type="smallBold"
                  style={[styles.modeText, selected ? styles.modeTextSelected : null]}>
                  {mode.label}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
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
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  mode: {
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderWidth: 2,
    alignItems: 'center',
  },
  modeText: {
    fontSize: 13,
  },
  modeTextSelected: {
    color: '#ffffff',
  },
});
