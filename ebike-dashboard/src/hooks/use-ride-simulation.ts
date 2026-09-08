import { useCallback, useEffect, useRef, useState } from 'react';

import { ASSIST_MODES, MAX_SPEED_KMH } from '@/constants/ebike';

export type RideStatus = 'idle' | 'riding' | 'paused';

export type RideTelemetry = {
  status: RideStatus;
  /** Current speed, km/h. */
  speed: number;
  /** Battery charge remaining, 0-100. */
  battery: number;
  /** Instantaneous motor output, watts. */
  power: number;
  /** Pedal cadence, rpm. */
  cadence: number;
  /** Distance covered this ride, km. */
  distance: number;
  /** Elapsed ride time, seconds. */
  seconds: number;
  /** Index into ASSIST_MODES. */
  assistIndex: number;
};

const TICK_MS = 400;
const INITIAL: RideTelemetry = {
  status: 'idle',
  speed: 0,
  battery: 92,
  power: 0,
  cadence: 0,
  distance: 0,
  seconds: 0,
  assistIndex: 1,
};

/**
 * Drives a lightweight, self-contained e-bike ride simulation. Speed trends
 * toward the selected assist mode's cruise speed with a little noise; distance,
 * ride time, and battery drain follow from that. Nothing here talks to real
 * hardware — it exists to make the dashboard feel live and interactive.
 */
export function useRideSimulation() {
  const [telemetry, setTelemetry] = useState<RideTelemetry>(INITIAL);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setTelemetry((prev) => {
      if (prev.status !== 'riding') return prev;

      const dt = TICK_MS / 1000;
      const mode = ASSIST_MODES[prev.assistIndex];

      // Target cruise speed wanders a little so the needle never sits still.
      const wander = (Math.random() - 0.45) * 6;
      const target = Math.max(0, Math.min(MAX_SPEED_KMH, mode.cruiseKmh + wander));
      const nextSpeed = prev.speed + (target - prev.speed) * 0.25;

      const accelerating = nextSpeed > prev.speed;
      const load = nextSpeed / MAX_SPEED_KMH;
      const power = Math.round(mode.peakWatts * (accelerating ? 0.75 : 0.4) * (0.4 + load));
      const cadence = Math.round(nextSpeed * 2.6 + (Math.random() - 0.5) * 6);

      const distance = prev.distance + (nextSpeed / 3600) * dt;
      const drainPerHour = mode.drain * (0.5 + load) * 3.2;
      const battery = Math.max(0, prev.battery - (drainPerHour / 3600) * dt * 100);
      const seconds = prev.seconds + dt;

      if (battery <= 0) {
        return { ...prev, status: 'paused', speed: 0, power: 0, cadence: 0, battery: 0, distance, seconds };
      }

      return {
        ...prev,
        speed: nextSpeed,
        power: Math.max(0, power),
        cadence: Math.max(0, cadence),
        distance,
        battery,
        seconds,
      };
    });
  }, []);

  useEffect(() => {
    if (telemetry.status === 'riding') {
      if (intervalRef.current === null) {
        intervalRef.current = setInterval(tick, TICK_MS);
      }
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [telemetry.status, tick, clearTimer]);

  const start = useCallback(() => {
    setTelemetry((prev) =>
      prev.battery <= 0 ? prev : { ...prev, status: 'riding' },
    );
  }, []);

  const pause = useCallback(() => {
    setTelemetry((prev) =>
      prev.status === 'riding' ? { ...prev, status: 'paused', speed: 0, power: 0, cadence: 0 } : prev,
    );
  }, []);

  const reset = useCallback(() => {
    setTelemetry((prev) => ({ ...INITIAL, battery: prev.battery, assistIndex: prev.assistIndex }));
  }, []);

  const setAssist = useCallback((assistIndex: number) => {
    setTelemetry((prev) => ({ ...prev, assistIndex }));
  }, []);

  return { telemetry, start, pause, reset, setAssist };
}
