import { useState, useEffect, useRef, useCallback } from 'react';
import type { LiveReading, AirQuality } from '@/types';
import type { EnvironmentalTargets } from '@/types';
import { getTargets } from '@/services/dataService';
import { checkCameraConnection } from '@/services/cameraService';

function getAirQuality(co2: number): AirQuality {
  if (co2 < 800) return 'Good';
  if (co2 < 1200) return 'Moderate';
  return 'Poor';
}

/**
 * Hook that produces a slowly-drifting live sensor reading.
 * Replace the internal generator with a WebSocket/SSE or polling
 * call to the Raspberry Pi API to go live.
 */
export function useLiveSensorData(intervalMs = 3000) {
  const [reading, setReading] = useState<LiveReading>({
    temperature: 24.5,
    humidity: 83,
    co2: 820,
    airQuality: 'Good',
    timestamp: new Date().toISOString(),
  });
  const [history, setHistory] = useState<LiveReading[]>([]);
  const tempRef = useRef(24.5);
  const humRef = useRef(83);
  const co2Ref = useRef(820);
  const maxHistory = 30;

  useEffect(() => {
    const tick = () => {
      tempRef.current += (Math.random() - 0.5) * 0.3;
      tempRef.current = Math.max(22, Math.min(27, tempRef.current));
      humRef.current += (Math.random() - 0.5) * 0.5;
      humRef.current = Math.max(78, Math.min(88, humRef.current));
      co2Ref.current += (Math.random() - 0.5) * 20;
      co2Ref.current = Math.max(500, Math.min(1500, co2Ref.current));

      const newReading: LiveReading = {
        temperature: Math.round(tempRef.current * 10) / 10,
        humidity: Math.round(humRef.current),
        co2: Math.round(co2Ref.current),
        airQuality: getAirQuality(co2Ref.current),
        timestamp: new Date().toISOString(),
      };
      setReading(newReading);
      setHistory((prev) => [...prev.slice(-(maxHistory - 1)), newReading]);
    };
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { reading, history };
}

/**
 * Hook for environmental targets (configurable from Settings).
 */
export function useTargets() {
  const [targets, setTargets] = useState<EnvironmentalTargets>(getTargets());

  const refresh = useCallback(() => {
    setTargets(getTargets());
  }, []);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    window.addEventListener('smg-targets-changed', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('smg-targets-changed', handler);
    };
  }, [refresh]);

  return { targets, refresh };
}

/**
 * Returns a status string for a sensor value vs. its target range.
 */
export function getSensorStatus(
  value: number,
  preferredMin: number,
  preferredMax: number,
  absoluteMin: number,
  absoluteMax: number
): 'optimal' | 'warning' | 'critical' {
  if (value >= preferredMin && value <= preferredMax) return 'optimal';
  if (value >= absoluteMin && value <= absoluteMax) return 'warning';
  return 'critical';
}

/**
 * Hook for camera status with heartbeat-based online/offline detection.
 * Replace the mock heartbeat with a real polling/Supabase subscription
 * to the camera_status table when the Raspberry Pi is connected.
 */
export function useCameraStatus() {
  const [status, setStatus] = useState<import('@/types').CameraStatus>({
    id: 'cam-1',
    camera_name: 'Raspberry Pi Camera',
    status: 'online',
    last_heartbeat: new Date().toISOString(),
    stream_url: null,
    resolution: '1920 × 1080',
    fps: 30,
    last_seen: new Date().toISOString(),
  });
  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ success: boolean; message: string } | null>(null);

  const checkConnection = async () => {
    setChecking(true);
    setCheckResult(null);
    try {
      const result = await checkCameraConnection();
      setStatus(result.status);
      setCheckResult({ success: result.success, message: result.message });
      setTimeout(() => setCheckResult(null), 4000);
      return result;
    } finally {
      setChecking(false);
    }
  };

  const setCameraOnline = (online: boolean) => {
    const now = new Date().toISOString();
    setStatus((prev) => ({
      ...prev,
      status: online ? 'online' : 'offline',
      last_heartbeat: online ? now : prev.last_heartbeat,
      last_seen: online ? now : prev.last_seen,
    }));
  };

  return { status, checking, checkResult, checkConnection, setCameraOnline, setStatus };
}

/**
 * Hook for Raspberry Pi status (mock data — replace with real
 * polling/Supabase subscription when Pi is connected).
 */
export function useRaspberryPiStatus() {
  const [piStatus] = useState<import('@/types').RaspberryPiStatus>({
    online: true,
    ip: '192.168.1.105',
    last_heartbeat: new Date(Date.now() - 15000).toISOString(),
    cpu: 32,
    memory: 48,
    temperature: 45,
  });

  return { piStatus };
}

/**
 * Hook for overall system status — separates website, Pi, camera,
 * and database status as four independent indicators.
 */
export function useSystemStatus(
  cameraStatus: import('@/types').CameraStatusType,
  dbConnected: boolean
) {
  return {
    website: true,
    raspberryPi: true,
    camera: cameraStatus,
    database: dbConnected,
  };
}
