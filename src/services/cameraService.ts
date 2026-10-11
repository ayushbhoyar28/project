import type { CameraStatus, CameraEventLog } from '@/types';
import { mockCameraStatus, mockCameraEventLog } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

/**
 * Camera Service
 * ----------------------------------------------------------------
 * Provides camera status, connection checking, stream URL, and
 * image capture functionality. Uses mock data when Supabase is
 * not configured. Designed to be replaced with real Raspberry Pi
 * camera API calls.
 *
 * Future architecture:
 *   Raspberry Pi Camera → Raspberry Pi → Camera API/Stream → Website
 *
 * Heartbeat: The Raspberry Pi should POST to /api/camera/heartbeat
 * every 10–30 seconds. If no heartbeat is received within the
 * configured timeout (default 60s), the camera is considered offline.
 * ----------------------------------------------------------------
 */

export const CAMERA_OFFLINE_TIMEOUT = 60;

export async function getCameraStatus(): Promise<CameraStatus> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('camera_status')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    if (error) throw error;
    return data as CameraStatus;
  }
  return { ...mockCameraStatus, last_heartbeat: new Date().toISOString() };
}

export async function checkCameraConnection(): Promise<{
  success: boolean;
  message: string;
  status: CameraStatus;
}> {
  // Simulate connection check latency
  await new Promise((r) => setTimeout(r, 1200));

  if (isSupabaseConfigured && supabase) {
    // In production, ping the Raspberry Pi camera API endpoint
    // For now, query the latest camera_status row
    try {
      const status = await getCameraStatus();
      const isOnline = isHeartbeatRecent(status.last_heartbeat);
      return {
        success: isOnline,
        message: isOnline ? 'Camera connected successfully' : 'Camera connection failed',
        status: { ...status, status: isOnline ? 'online' : 'offline' },
      };
    } catch {
      return {
        success: false,
        message: 'Camera connection failed',
        status: { ...mockCameraStatus, status: 'offline' },
      };
    }
  }

  // Mock mode: 80% chance of success
  const success = Math.random() > 0.2;
  const newStatus: CameraStatus = {
    ...mockCameraStatus,
    status: success ? 'online' : 'offline',
    last_heartbeat: success ? new Date().toISOString() : new Date(Date.now() - 120000).toISOString(),
    last_seen: success ? new Date().toISOString() : new Date(Date.now() - 120000).toISOString(),
  };
  return {
    success,
    message: success ? 'Camera connected successfully' : 'Camera connection failed',
    status: newStatus,
  };
}

export async function getCameraStream(): Promise<string | null> {
  if (isSupabaseConfigured && supabase) {
    // In production, return the stream URL from the camera_status table
    const status = await getCameraStatus();
    return status.stream_url;
  }
  return null;
}

export async function captureImage(): Promise<{
  success: boolean;
  message: string;
}> {
  if (isSupabaseConfigured && supabase) {
    // In production, send a capture command to the Raspberry Pi
    // and store the result in camera_events
    const { error } = await supabase.from('camera_events').insert({
      timestamp: new Date().toISOString(),
      image_url: '',
      detection_result: 'Image captured',
    });
    if (error) throw error;
    return { success: true, message: 'Image captured and saved' };
  }
  await new Promise((r) => setTimeout(r, 500));
  return { success: true, message: 'Image captured (simulated — connect Raspberry Pi to save)' };
}

export async function getCameraEventLog(): Promise<CameraEventLog[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('camera_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data as CameraEventLog[];
  }
  return mockCameraEventLog;
}

export function isHeartbeatRecent(lastHeartbeat: string, timeoutSeconds = CAMERA_OFFLINE_TIMEOUT): boolean {
  const elapsed = (Date.now() - new Date(lastHeartbeat).getTime()) / 1000;
  return elapsed < timeoutSeconds;
}
