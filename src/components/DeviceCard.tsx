import type { LucideIcon } from 'lucide-react';
import type { DeviceStatus, DeviceMode } from '@/types';
import { deviceLabels } from '@/data/mockData';
import { timeAgo } from '@/lib/utils';

interface DeviceCardProps {
  icon: LucideIcon;
  device: DeviceStatus;
}

export default function DeviceCard({ icon: Icon, device }: DeviceCardProps) {
  const isOn = device.status;
  const label = deviceLabels[device.device_name];

  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-3.5 hover:shadow-card-hover hover:border-neutral-200 transition-all duration-200 flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          isOn ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-400'
        }`}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-neutral-800 truncate leading-tight">{label}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
              isOn ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500'
            }`}
          >
            {isOn ? 'ON' : 'OFF'}
          </span>
          <span className="text-[11px] text-neutral-400">
            {device.mode as DeviceMode} · {timeAgo(device.timestamp)}
          </span>
        </div>
      </div>
      <div
        className={`w-2 h-2 rounded-full shrink-0 ${
          isOn ? 'bg-primary-500 animate-pulse-soft' : 'bg-neutral-300'
        }`}
      />
    </div>
  );
}
