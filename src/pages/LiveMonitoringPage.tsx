import { Thermometer, Droplets, Wind } from 'lucide-react';
import { useLiveSensorData, useTargets } from '@/hooks/useSensorData';
import { TemperatureChart, HumidityChart, CO2Chart } from '@/components/charts/LiveCharts';

export default function LiveMonitoringPage() {
  const { reading, history } = useLiveSensorData(3000);
  const { targets } = useTargets();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">Live Monitoring</h2>
        <p className="text-sm text-neutral-500 mt-1">Real-time sensor data from the cultivation chamber</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <LiveCard
          icon={Thermometer}
          title="Temperature"
          value={reading.temperature.toFixed(1)}
          unit="°C"
          color="bg-warning-100 text-warning-600"
          range={`${targets.tempPreferredMin}–${targets.tempPreferredMax} °C`}
        />
        <LiveCard
          icon={Droplets}
          title="Humidity"
          value={String(reading.humidity)}
          unit="%"
          color="bg-info-100 text-info-600"
          range={`${targets.humidityPreferredMin}–${targets.humidityPreferredMax} %`}
        />
        <LiveCard
          icon={Wind}
          title="CO2"
          value={String(reading.co2)}
          unit="ppm"
          color="bg-neutral-200 text-neutral-600"
          range={`< ${targets.co2Max} ppm`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TemperatureChart data={history} targets={targets} />
        <HumidityChart data={history} targets={targets} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <CO2Chart data={history} targets={targets} />
      </div>
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

function LiveCard({
  icon: Icon,
  title,
  value,
  unit,
  color,
  range,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  unit: string;
  color: string;
  range: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-medium text-neutral-600">{title}</h3>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-bold text-neutral-800 tabular-nums">{value}</span>
        <span className="text-base font-medium text-neutral-400">{unit}</span>
      </div>
      <p className="text-xs text-neutral-500 mt-2">Target: {range}</p>
    </div>
  );
}
