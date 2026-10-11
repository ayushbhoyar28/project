import type {
  DeviceStatus,
  Alert,
  GrowthBatch,
  ControlRule,
  EnvironmentalTargets,
  DeviceName,
} from '@/types';

export const defaultTargets: EnvironmentalTargets = {
  tempMin: 20,
  tempMax: 30,
  tempPreferredMin: 23,
  tempPreferredMax: 25,
  humidityMin: 80,
  humidityMax: 90,
  humidityPreferredMin: 80,
  humidityPreferredMax: 85,
  co2Min: 400,
  co2Max: 1000,
  co2Threshold: 1000,
};

export const deviceLabels: Record<DeviceName, string> = {
  humidifier: 'Humidifier',
  exhaust_fan: 'Exhaust Fan',
  circulation_fan: 'Circulation Fan',
  heater: 'Heater',
  cooling_system: 'Cooling System',
  grow_light: 'Grow Light',
};

export const mockDevices: DeviceStatus[] = [
  { id: '1', timestamp: new Date().toISOString(), device_name: 'humidifier', status: true, mode: 'AUTO' },
  { id: '2', timestamp: new Date().toISOString(), device_name: 'exhaust_fan', status: false, mode: 'AUTO' },
  { id: '3', timestamp: new Date().toISOString(), device_name: 'circulation_fan', status: true, mode: 'AUTO' },
  { id: '4', timestamp: new Date().toISOString(), device_name: 'heater', status: false, mode: 'AUTO' },
  { id: '5', timestamp: new Date().toISOString(), device_name: 'cooling_system', status: false, mode: 'AUTO' },
  { id: '6', timestamp: new Date().toISOString(), device_name: 'grow_light', status: true, mode: 'AUTO' },
];

const alertMessages: Array<{ type: Alert['type']; message: string }> = [
  { type: 'INFO', message: 'System connected successfully' },
  { type: 'INFO', message: 'Humidifier activated automatically' },
  { type: 'WARNING', message: 'Humidity below recommended range' },
  { type: 'WARNING', message: 'CO2 level high' },
  { type: 'CRITICAL', message: 'Temperature too high' },
  { type: 'INFO', message: 'Exhaust fan turned ON to reduce CO2' },
  { type: 'WARNING', message: 'Temperature approaching upper limit' },
  { type: 'INFO', message: 'Circulation fan activated for airflow' },
];

function generateAlerts(count: number): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const msg = alertMessages[i % alertMessages.length];
    alerts.push({
      id: `alert-${i}`,
      timestamp: new Date(now - i * 3600000 * 3).toISOString(),
      type: msg.type,
      message: msg.message,
      status: i < 2 ? 'unread' : 'read',
    });
  }
  return alerts;
}

export const mockAlerts: Alert[] = generateAlerts(8);

export const mockGrowthBatch: GrowthBatch = {
  id: '1',
  batch_id: 'SMG-2026-001',
  mushroom_type: 'Oyster Mushroom',
  strain: 'Pleurotus ostreatus',
  start_date: '2026-09-15',
  current_stage: 'Fruiting',
  expected_harvest_date: '2026-10-20',
  number_of_bags: 50,
  active_bags: 48,
  estimated_yield: 120,
  actual_yield: 0,
};

export const growthStages = [
  'Substrate Preparation',
  'Inoculation',
  'Spawn Run',
  'Pinning',
  'Fruiting',
  'Harvest',
] as const;

export const mockControlRules: ControlRule[] = [
  {
    id: 'rule-1',
    condition: 'IF humidity < 80%',
    action: 'Turn Humidifier ON',
    device: 'humidifier',
    enabled: true,
  },
  {
    id: 'rule-2',
    condition: 'IF humidity >= 85%',
    action: 'Turn Humidifier OFF',
    device: 'humidifier',
    enabled: true,
  },
  {
    id: 'rule-3',
    condition: 'IF CO2 > threshold (1000 ppm)',
    action: 'Turn Exhaust Fan ON',
    device: 'exhaust_fan',
    enabled: true,
  },
  {
    id: 'rule-4',
    condition: 'IF CO2 returns to normal',
    action: 'Turn Exhaust Fan OFF',
    device: 'exhaust_fan',
    enabled: true,
  },
  {
    id: 'rule-5',
    condition: 'IF temperature < min threshold',
    action: 'Turn Heater ON',
    device: 'heater',
    enabled: true,
  },
  {
    id: 'rule-6',
    condition: 'IF temperature > max threshold',
    action: 'Turn Cooling System ON',
    device: 'cooling_system',
    enabled: true,
  },
];

export const mockCameraEvents = [
  { id: '1', timestamp: new Date(Date.now() - 3600000).toISOString(), image_url: '', detection_result: 'Healthy mycelium growth detected' },
  { id: '2', timestamp: new Date(Date.now() - 7200000).toISOString(), image_url: '', detection_result: 'Pinning stage confirmed' },
  { id: '3', timestamp: new Date(Date.now() - 10800000).toISOString(), image_url: '', detection_result: 'No anomalies detected' },
];

export const mockControlLog = [
  { id: '1', timestamp: new Date(Date.now() - 600000).toISOString(), message: 'Humidifier automatically turned ON because humidity dropped below 80%.' },
  { id: '2', timestamp: new Date(Date.now() - 1800000).toISOString(), message: 'Exhaust fan activated due to CO2 exceeding 1000 ppm threshold.' },
  { id: '3', timestamp: new Date(Date.now() - 3600000).toISOString(), message: 'Circulation fan turned ON for routine airflow maintenance.' },
  { id: '4', timestamp: new Date(Date.now() - 7200000).toISOString(), message: 'All sensors within optimal range. No action needed.' },
];

export const mockCameraStatus = {
  id: 'cam-1',
  camera_name: 'Raspberry Pi Camera',
  status: 'online' as const,
  last_heartbeat: new Date().toISOString(),
  stream_url: null,
  resolution: '1920 × 1080',
  fps: 30,
  last_seen: new Date().toISOString(),
};

export const mockCameraEventLog = [
  { id: 'ce-1', timestamp: new Date(Date.now() - 300000).toISOString(), event: 'Camera heartbeat received', status: 'online' as const },
  { id: 'ce-2', timestamp: new Date(Date.now() - 600000).toISOString(), event: 'Camera heartbeat received', status: 'online' as const },
  { id: 'ce-3', timestamp: new Date(Date.now() - 900000).toISOString(), event: 'Camera connected', status: 'online' as const },
  { id: 'ce-4', timestamp: new Date(Date.now() - 1200000).toISOString(), event: 'Camera heartbeat received', status: 'online' as const },
  { id: 'ce-5', timestamp: new Date(Date.now() - 1800000).toISOString(), event: 'Camera disconnected', status: 'offline' as const },
  { id: 'ce-6', timestamp: new Date(Date.now() - 2100000).toISOString(), event: 'Camera connected', status: 'online' as const },
  { id: 'ce-7', timestamp: new Date(Date.now() - 2700000).toISOString(), event: 'Camera disconnected', status: 'offline' as const },
];

export const mockRaspberryPiStatus = {
  online: true,
  ip: '192.168.1.105',
  last_heartbeat: new Date(Date.now() - 15000).toISOString(),
  cpu: 32,
  memory: 48,
  temperature: 45,
};

export const mockRecentAlerts = [
  { id: 'ra-1', timestamp: new Date(Date.now() - 120000).toISOString(), type: 'INFO' as const, message: 'Humidity returned to optimal range', status: 'read' as const },
  { id: 'ra-2', timestamp: new Date(Date.now() - 600000).toISOString(), type: 'WARNING' as const, message: 'CO2 slightly elevated', status: 'read' as const },
  { id: 'ra-3', timestamp: new Date(Date.now() - 1500000).toISOString(), type: 'CRITICAL' as const, message: 'Camera disconnected', status: 'read' as const },
];
