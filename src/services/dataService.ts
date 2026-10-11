import type {
  SensorData,
  DeviceStatus,
  Alert,
  GrowthBatch,
  CameraEvent,
  DeviceName,
  DeviceMode,
  EnvironmentalTargets,
} from '@/types';
import {
  mockDevices,
  mockAlerts,
  mockGrowthBatch,
  mockCameraEvents,
  defaultTargets,
} from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

/**
 * Data Service Layer
 * ----------------------------------------------------------------
 * Each function first checks if Supabase is configured. If so, it
 * queries the database. If not, it returns mock data.
 *
 * To go live: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY,
 * create the tables (see README), and the functions will
 * automatically use Supabase instead of mock data.
 * ----------------------------------------------------------------
 */

// --- Sensor Data ---

export async function getSensorData(limit = 100): Promise<SensorData[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as SensorData[];
  }
  return generateMockSensorData(limit);
}

export async function getHistoricalData(
  range: '1h' | '6h' | '24h' | '7d' | '30d'
): Promise<SensorData[]> {
  if (isSupabaseConfigured && supabase) {
    const now = new Date();
    const ranges: Record<string, number> = {
      '1h': 3600000,
      '6h': 21600000,
      '24h': 86400000,
      '7d': 604800000,
      '30d': 2592000000,
    };
    const from = new Date(now.getTime() - ranges[range]).toISOString();
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .gte('timestamp', from)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data as SensorData[];
  }
  return generateMockHistoricalData(range);
}

// --- Device Status ---

export async function getDeviceStatus(): Promise<DeviceStatus[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('device_status')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data as DeviceStatus[];
  }
  return mockDevices;
}

export async function sendDeviceCommand(
  device: DeviceName,
  status: boolean,
  mode: DeviceMode
): Promise<{ success: boolean; message: string }> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('device_status').insert({
      device_name: device,
      status,
      mode,
      timestamp: new Date().toISOString(),
    });
    if (error) throw error;
    return { success: true, message: `Command sent to ${device}` };
  }
  // Mock: simulate success
  await new Promise((r) => setTimeout(r, 300));
  return { success: true, message: `Command sent to ${device} (simulated)` };
}

// --- Alerts ---

export async function getAlerts(): Promise<Alert[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data as Alert[];
  }
  return mockAlerts;
}

// --- Growth Data ---

export async function getGrowthData(): Promise<GrowthBatch> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('growth_batches')
      .select('*')
      .order('start_date', { ascending: false })
      .limit(1)
      .single();
    if (error) throw error;
    return data as GrowthBatch;
  }
  return mockGrowthBatch;
}

// --- Camera Events ---

export async function getCameraEvents(): Promise<CameraEvent[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('camera_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data as CameraEvent[];
  }
  return mockCameraEvents;
}

// --- Environmental Targets ---

export function getTargets(): EnvironmentalTargets {
  // In production, these could be stored in a Supabase settings table
  const stored = localStorage.getItem('smg-targets');
  if (stored) {
    try {
      return { ...defaultTargets, ...JSON.parse(stored) };
    } catch {
      return defaultTargets;
    }
  }
  return defaultTargets;
}

export function saveTargets(targets: EnvironmentalTargets): void {
  localStorage.setItem('smg-targets', JSON.stringify(targets));
}

// --- Mock Data Generators ---

function generateMockSensorData(limit: number): SensorData[] {
  const data: SensorData[] = [];
  const now = Date.now();
  let temp = 24.5;
  let hum = 83;
  let co2 = 820;
  for (let i = 0; i < limit; i++) {
    temp += (Math.random() - 0.5) * 0.3;
    temp = Math.max(22, Math.min(27, temp));
    hum += (Math.random() - 0.5) * 0.5;
    hum = Math.max(78, Math.min(88, hum));
    co2 += (Math.random() - 0.5) * 20;
    co2 = Math.max(500, Math.min(1500, co2));
    data.push({
      id: `s-${i}`,
      timestamp: new Date(now - i * 5000).toISOString(),
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(hum),
      co2: Math.round(co2),
    });
  }
  return data.reverse();
}

function generateMockHistoricalData(range: '1h' | '6h' | '24h' | '7d' | '30d'): SensorData[] {
  const data: SensorData[] = [];
  const ranges: Record<string, number> = {
    '1h': 3600000,
    '6h': 21600000,
    '24h': 86400000,
    '7d': 604800000,
    '30d': 2592000000,
  };
  const interval = range === '30d' ? 3600000 : range === '7d' ? 1800000 : range === '24h' ? 300000 : 60000;
  const now = Date.now();
  const span = ranges[range];
  const points = Math.floor(span / interval);
  let temp = 24.5;
  let hum = 83;
  let co2 = 820;
  for (let i = points; i >= 0; i--) {
    temp += (Math.random() - 0.5) * 0.5;
    temp = Math.max(22, Math.min(27, temp));
    hum += (Math.random() - 0.5) * 0.8;
    hum = Math.max(78, Math.min(88, hum));
    co2 += (Math.random() - 0.5) * 40;
    co2 = Math.max(500, Math.min(1500, co2));
    data.push({
      id: `h-${i}`,
      timestamp: new Date(now - i * interval).toISOString(),
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(hum),
      co2: Math.round(co2),
    });
  }
  return data;
}
