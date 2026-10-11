import {
  BookOpen,
  Droplets,
  Fan,
  Flame,
  Flower2,
  Lightbulb,
  Sprout,
  Snowflake,
  Thermometer,
  Wind,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDevices, deviceLabels } from '@/data/mockData';
import { timeAgo } from '@/lib/utils';
import { getSensorStatus, useLiveSensorData, useTargets } from '@/hooks/useSensorData';
import type { DeviceName, DeviceStatus } from '@/types';

const deviceIcons: Record<DeviceName, LucideIcon> = {
  humidifier: Droplets,
  exhaust_fan: Wind,
  circulation_fan: Fan,
  heater: Flame,
  cooling_system: Snowflake,
  grow_light: Lightbulb,
};

interface ReadingCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  iconClassName: string;
}

function ReadingCard({ icon: Icon, label, value, unit, iconClassName }: ReadingCardProps) {
  return (
    <section className="rounded-xl border border-black bg-white p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName}`}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <h2 className="text-sm font-medium text-neutral-500">{label}</h2>
      </div>
      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tabular-nums text-neutral-800">{value}</span>
        {unit && <span className="text-sm font-medium text-neutral-400">{unit}</span>}
      </p>
    </section>
  );
}

export default function DashboardPage() {
  const { reading } = useLiveSensorData(3000);
  const { targets } = useTargets();
  const temperatureStatus = getSensorStatus(
    reading.temperature,
    targets.tempPreferredMin,
    targets.tempPreferredMax,
    targets.tempMin,
    targets.tempMax,
  );
  const humidityStatus = getSensorStatus(
    reading.humidity,
    targets.humidityPreferredMin,
    targets.humidityPreferredMax,
    targets.humidityMin,
    targets.humidityMax,
  );
  const co2Status = reading.co2 <= targets.co2Max
    ? 'normal'
    : reading.co2 <= targets.co2Max + 300
      ? 'warning'
      : 'critical';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReadingCard
          icon={Thermometer}
          label="Temperature"
          value={reading.temperature.toFixed(1)}
          unit="°C"
          iconClassName="bg-warning-100 text-warning-600"
        />
        <ReadingCard
          icon={Droplets}
          label="Humidity"
          value={String(reading.humidity)}
          unit="%"
          iconClassName="bg-info-100 text-info-600"
        />
        <ReadingCard
          icon={Wind}
          label="CO₂"
          value={String(reading.co2)}
          unit="ppm"
          iconClassName="bg-primary-100 text-primary-600"
        />
        <ReadingCard
          icon={Wind}
          label="Air Quality"
          value={reading.airQuality}
          iconClassName="bg-accent-100 text-accent-600"
        />
      </div>

      <section className="rounded-xl border border-neutral-100/80 bg-white p-5 shadow-card">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-neutral-800">Environmental Targets</h2>
          <p className="mt-1 text-sm text-neutral-500">Recommended conditions for oyster mushrooms</p>
        </div>
        <div className="divide-y divide-neutral-100">
          <TargetRow
            label="Temperature"
            value={`${reading.temperature.toFixed(1)} °C`}
            target={`Recommended: ${targets.tempPreferredMin}–${targets.tempPreferredMax} °C`}
            acceptable={`Acceptable: ${targets.tempMin}–${targets.tempMax} °C`}
            status={temperatureStatus}
          />
          <TargetRow
            label="Humidity"
            value={`${reading.humidity} %`}
            target={`Recommended: ${targets.humidityPreferredMin}–${targets.humidityPreferredMax} %`}
            acceptable={`Acceptable: ${targets.humidityMin}–${targets.humidityMax} %`}
            status={humidityStatus}
          />
          <TargetRow
            label="CO₂"
            value={`${reading.co2} ppm`}
            target={`Recommended: below ${targets.co2Max} ppm`}
            acceptable={`Threshold: ${targets.co2Threshold} ppm`}
            status={co2Status}
          />
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-base font-semibold text-neutral-800">Device Status</h2>
          <p className="mt-1 text-sm text-neutral-500">Current chamber equipment</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {mockDevices.map((device) => (
            <DeviceStatusCard key={device.id} device={device} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-accent-50 p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <Flower2 aria-hidden="true" className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Mushroom facts</p>
            <h2 className="mt-1 text-lg font-semibold text-neutral-800">About Oyster Mushroom</h2>
            <p className="mt-2 max-w-3xl text-justify text-sm leading-6 text-neutral-600">
              Oyster mushrooms (Pleurotus ostreatus) are edible fungi that grow in clusters on
              wood-like materials. Their growth depends on fresh air, steady humidity, and
              suitable temperature—conditions this chamber monitors for each cultivation batch.
            </p>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3">
            <Fact icon={Sprout} label="Growth" value="Cluster-forming" />
            <Fact icon={Droplets} label="Needs" value="Moist air" />
            <Fact icon={BookOpen} label="Scientific name" value="P. ostreatus" />
          </div>
        </div>
        <div className="mt-5 border-t border-primary-100 pt-4">
          <Link
            to="/ebook"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900"
          >
            <BookOpen aria-hidden="true" className="h-4 w-4" />
            Learn more in the E-Book
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/80 bg-white/80 p-3">
      <Icon aria-hidden="true" className="h-4 w-4 text-primary-600" />
      <p className="mt-2 text-[11px] text-neutral-500">{label}</p>
      <p className="mt-0.5 text-xs font-semibold text-neutral-700">{value}</p>
    </div>
  );
}

function TargetRow({
  label,
  value,
  target,
  acceptable,
  status,
}: {
  label: string;
  value: string;
  target: string;
  acceptable: string;
  status: 'optimal' | 'warning' | 'critical' | 'normal';
}) {
  const statusStyles = {
    optimal: 'bg-primary-50 text-primary-700',
    normal: 'bg-primary-50 text-primary-700',
    warning: 'bg-warning-50 text-warning-700',
    critical: 'bg-error-50 text-error-700',
  };
  const statusLabel = status === 'optimal' ? 'Optimal' : status === 'normal' ? 'Normal' : status === 'warning' ? 'Warning' : 'Critical';

  return (
    <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="w-24 text-sm font-medium text-neutral-700">{label}</span>
        <span className="font-mono text-sm text-neutral-800">{value}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <span className="text-xs text-neutral-500">{target}</span>
        <span className="hidden text-neutral-300 sm:inline">·</span>
        <span className="text-xs text-neutral-400">{acceptable}</span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>{statusLabel}</span>
      </div>
    </div>
  );
}

function DeviceStatusCard({ device }: { device: DeviceStatus }) {
  const Icon = deviceIcons[device.device_name];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-100/80 bg-white p-4 shadow-card">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
        device.status ? 'bg-primary-50 text-primary-600' : 'bg-neutral-100 text-neutral-400'
      }`}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-neutral-800">{deviceLabels[device.device_name]}</h3>
        <p className="mt-1 text-xs text-neutral-500">{device.mode} · {timeAgo(device.timestamp)}</p>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        device.status ? 'bg-primary-50 text-primary-700' : 'bg-neutral-100 text-neutral-500'
      }`}>
        {device.status ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}
