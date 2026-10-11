import { useState } from 'react';
import DeviceControl from '@/components/DeviceControl';
import { mockDevices, mockControlRules, mockControlLog } from '@/data/mockData';
import { sendDeviceCommand } from '@/services/dataService';
import { deviceLabels } from '@/data/mockData';
import { AlertTriangle, Cpu, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { DeviceStatus, DeviceName, DeviceMode } from '@/types';
import { Droplet, Wind, Fan, Flame, Snowflake, Lightbulb } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const deviceIcons: Record<DeviceName, LucideIcon> = {
  humidifier: Droplet,
  exhaust_fan: Wind,
  circulation_fan: Fan,
  heater: Flame,
  cooling_system: Snowflake,
  grow_light: Lightbulb,
};

export default function DeviceControlPage() {
  const [devices, setDevices] = useState<DeviceStatus[]>(mockDevices);
  const [log, setLog] = useState(mockControlLog);

  const handleToggle = async (device: DeviceName, status: boolean) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.device_name === device
          ? { ...d, status, timestamp: new Date().toISOString() }
          : d
      )
    );
    await sendDeviceCommand(device, status, 'MANUAL');
    setLog((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `${deviceLabels[device]} manually turned ${status ? 'ON' : 'OFF'}.`,
      },
      ...prev,
    ]);
  };

  const handleModeChange = async (device: DeviceName, mode: DeviceMode) => {
    setDevices((prev) =>
      prev.map((d) => (d.device_name === device ? { ...d, mode } : d))
    );
    const dev = devices.find((d) => d.device_name === device);
    if (dev) await sendDeviceCommand(device, dev.status, mode);
    setLog((prev) => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `${deviceLabels[device]} switched to ${mode} mode.`,
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">Device Control</h2>
        <p className="text-sm text-neutral-500 mt-1">Manual and automatic control of chamber devices</p>
      </div>

      <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
        <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
        <p className="text-sm text-warning-700">
          <span className="font-semibold">Warning:</span> Manual control can affect chamber environmental conditions.
          Switching a device to MANUAL mode overrides automatic sensor-based control.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <DeviceControl
            key={device.id}
            icon={deviceIcons[device.device_name]}
            device={device}
            onToggle={handleToggle}
            onModeChange={handleModeChange}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-semibold text-neutral-800">Automatic Control Logic</h3>
          </div>
          <div className="space-y-2.5">
            {mockControlRules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  rule.enabled ? 'bg-primary-50/50 border-primary-100' : 'bg-neutral-50 border-neutral-100 opacity-60'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-neutral-700">{rule.condition}</p>
                  <p className="text-xs text-primary-600 mt-0.5">→ {rule.action}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    rule.enabled ? 'bg-primary-100 text-primary-700' : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {rule.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-semibold text-neutral-800">Control Decision Log</h3>
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto scrollbar-thin">
            {log.map((entry) => (
              <div key={entry.id} className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <p className="text-sm text-neutral-700">{entry.message}</p>
                <p className="text-xs text-neutral-400 mt-1">{formatDateTime(entry.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
