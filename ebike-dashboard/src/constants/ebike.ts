/**
 * Domain constants for the e-bike dashboard: pedal-assist modes and the
 * accent palette used across gauges and controls.
 */

export type AssistMode = {
  key: string;
  label: string;
  /** Short tag shown in the gauge center. */
  short: string;
  /** Cruise speed the simulation trends toward, km/h. */
  cruiseKmh: number;
  /** Peak motor output for this mode, watts. */
  peakWatts: number;
  /** Relative battery drain multiplier. */
  drain: number;
  /** Accent color for this mode. */
  color: string;
};

export const ASSIST_MODES: AssistMode[] = [
  { key: 'eco', label: 'Eco', short: 'ECO', cruiseKmh: 18, peakWatts: 180, drain: 0.55, color: '#2ecc71' },
  { key: 'tour', label: 'Tour', short: 'TOUR', cruiseKmh: 24, peakWatts: 300, drain: 0.9, color: '#3c87f7' },
  { key: 'sport', label: 'Sport', short: 'SPORT', cruiseKmh: 30, peakWatts: 420, drain: 1.4, color: '#f5a623' },
  { key: 'turbo', label: 'Turbo', short: 'TURBO', cruiseKmh: 36, peakWatts: 560, drain: 2.1, color: '#ff4d4f' },
];

/** Top speed shown on the gauge dial, km/h. */
export const MAX_SPEED_KMH = 45;

/** Nominal battery energy used to derive remaining range, watt-hours. */
export const BATTERY_WH = 500;

/** Assumed average energy use while riding, watt-hours per km. */
export const WH_PER_KM = 12;

export function batteryColor(pct: number): string {
  if (pct <= 15) return '#ff4d4f';
  if (pct <= 35) return '#f5a623';
  return '#2ecc71';
}

/** Estimated remaining range in km for a given battery percentage. */
export function estimateRangeKm(batteryPct: number): number {
  const remainingWh = (batteryPct / 100) * BATTERY_WH;
  return remainingWh / WH_PER_KM;
}
