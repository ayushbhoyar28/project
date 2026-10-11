import type { DeviceStatus, DeviceName, DeviceMode } from '@/types';
import { deviceLabels } from '@/data/mockData';
import type { LucideIcon } from 'lucide-react';
import { Power, Settings2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface DeviceControlProps {
  icon: LucideIcon;
  device: DeviceStatus;
  onToggle: (device: DeviceName, status: boolean) => void;
  onModeChange: (device: DeviceName, mode: DeviceMode) => void;
}

export default function DeviceControl({ icon: Icon, device, onToggle, onModeChange }: DeviceControlProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const label = deviceLabels[device.device_name];
  const isImportant = ['heater', 'cooling_system', 'humidifier'].includes(device.device_name);

  const handleToggle = () => {
    if (device.mode === 'AUTO') return;
    if (isImportant && !showConfirm) {
      setShowConfirm(true);
      return;
    }
    onToggle(device.device_name, !device.status);
    setShowConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 animate-fade-in hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            device.status ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-400'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-neutral-800">{label}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                device.status ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {device.status ? 'ON' : 'OFF'}
            </span>
            <span className="text-xs text-neutral-500">Mode: {device.mode}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => onModeChange(device.device_name, 'AUTO')}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                device.mode === 'AUTO'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" /> AUTO
            </button>
            <button
              onClick={() => onModeChange(device.device_name, 'MANUAL')}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                device.mode === 'MANUAL'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Power className="w-3.5 h-3.5" /> MANUAL
            </button>
          </div>
        </div>

        {device.mode === 'MANUAL' && (
          <button
            onClick={handleToggle}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
              device.status
                ? 'bg-error-500 text-white hover:bg-error-600'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {device.status ? 'Turn OFF' : 'Turn ON'}
          </button>
        )}

        {device.mode === 'AUTO' && (
          <div className="text-xs text-neutral-400 text-center py-2 bg-neutral-50 rounded-lg">
            Automatic mode — device is controlled by sensor thresholds
          </div>
        )}

        {showConfirm && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 animate-slide-in">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-warning-700 font-medium">
                  Confirm: {device.status ? 'turn OFF' : 'turn ON'} {label}?
                </p>
                <p className="text-xs text-warning-600 mt-0.5">Manual control can affect chamber environmental conditions.</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleToggle}
                    className="px-3 py-1 text-xs font-medium bg-warning-600 text-white rounded-md hover:bg-warning-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-1 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
