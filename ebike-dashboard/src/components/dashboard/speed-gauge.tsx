import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

const SIZE = 260;
const STROKE = 18;
const START_ANGLE = 135;
const SWEEP = 270;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

type Props = {
  speed: number;
  max: number;
  color: string;
  label: string;
  unit?: string;
};

export function SpeedGauge({ speed, max, color, label, unit = 'km/h' }: Props) {
  const theme = useTheme();
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = (SIZE - STROKE) / 2 - 6;

  const fraction = Math.max(0, Math.min(1, speed / max));
  const progressEnd = START_ANGLE + SWEEP * fraction;

  const ticks = useMemo(() => {
    const items = [];
    const count = 9;
    for (let i = 0; i <= count; i++) {
      const angle = START_ANGLE + (SWEEP * i) / count;
      const outer = polar(cx, cy, r + STROKE / 2 + 2, angle);
      const inner = polar(cx, cy, r - STROKE / 2 - 2, angle);
      items.push({ key: i, outer, inner, major: i % 3 === 0 });
    }
    return items;
  }, [cx, cy, r]);

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        <Path
          d={arcPath(cx, cy, r, START_ANGLE, START_ANGLE + SWEEP)}
          stroke={theme.backgroundSelected}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
        />
        {fraction > 0 && (
          <Path
            d={arcPath(cx, cy, r, START_ANGLE, progressEnd)}
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {ticks.map((t) => (
          <Line
            key={t.key}
            x1={t.inner.x}
            y1={t.inner.y}
            x2={t.outer.x}
            y2={t.outer.y}
            stroke={theme.textSecondary}
            strokeWidth={t.major ? 2.5 : 1}
            opacity={t.major ? 0.9 : 0.4}
          />
        ))}
        <Circle cx={cx} cy={cy} r={r - STROKE / 2 - 6} fill={theme.backgroundElement} />
      </Svg>

      <View style={styles.center}>
        <ThemedText style={styles.speed}>{Math.round(speed)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.unit}>
          {unit}
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <ThemedText style={styles.badgeText}>{label}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    pointerEvents: 'none',
  },
  speed: {
    fontSize: 72,
    lineHeight: 78,
    fontWeight: '700',
  },
  unit: {
    marginTop: -4,
  },
  badge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
