export interface SensorData {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  co2: number;
}

export type DeviceName =
  | 'humidifier'
  | 'exhaust_fan'
  | 'circulation_fan'
  | 'heater'
  | 'cooling_system'
  | 'grow_light';

export type DeviceMode = 'AUTO' | 'MANUAL';

export interface DeviceStatus {
  id: string;
  timestamp: string;
  device_name: DeviceName;
  status: boolean;
  mode: DeviceMode;
}

export type AlertType = 'WARNING' | 'INFO' | 'CRITICAL';
export type AlertStatusType = 'unread' | 'read' | 'cleared';

export interface Alert {
  id: string;
  timestamp: string;
  type: AlertType;
  message: string;
  status: AlertStatusType;
}

export type GrowthStage =
  | 'Substrate Preparation'
  | 'Inoculation'
  | 'Spawn Run'
  | 'Pinning'
  | 'Fruiting'
  | 'Harvest';

export interface GrowthBatch {
  id: string;
  batch_id: string;
  mushroom_type: string;
  strain: string;
  start_date: string;
  current_stage: GrowthStage;
  expected_harvest_date: string;
  number_of_bags: number;
  active_bags: number;
  estimated_yield: number;
  actual_yield: number;
}

export interface CameraEvent {
  id: string;
  timestamp: string;
  image_url: string;
  detection_result: string;
}

export interface EnvironmentalTargets {
  tempMin: number;
  tempMax: number;
  tempPreferredMin: number;
  tempPreferredMax: number;
  humidityMin: number;
  humidityMax: number;
  humidityPreferredMin: number;
  humidityPreferredMax: number;
  co2Min: number;
  co2Max: number;
  co2Threshold: number;
}

export interface ControlRule {
  id: string;
  condition: string;
  action: string;
  device: DeviceName;
  enabled: boolean;
}

export type SensorStatus = 'optimal' | 'warning' | 'critical' | 'normal';
export type AirQuality = 'Good' | 'Moderate' | 'Poor';

export interface LiveReading {
  temperature: number;
  humidity: number;
  co2: number;
  airQuality: AirQuality;
  timestamp: string;
}

export type CameraStatusType = 'online' | 'offline' | 'connecting' | 'error';

export interface CameraStatus {
  id: string;
  camera_name: string;
  status: CameraStatusType;
  last_heartbeat: string;
  stream_url: string | null;
  resolution: string;
  fps: number;
  last_seen: string;
}

export interface CameraEventLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'online' | 'offline';
}

export interface RaspberryPiStatus {
  online: boolean;
  ip: string;
  last_heartbeat: string;
  cpu: number;
  memory: number;
  temperature: number;
}

export interface SystemStatusSummary {
  website: boolean;
  raspberryPi: boolean;
  camera: CameraStatusType;
  database: boolean;
}

export interface AppSettings {
  cameraOfflineTimeout: number;
}
