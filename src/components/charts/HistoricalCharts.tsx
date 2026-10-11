import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';
import type { SensorData, EnvironmentalTargets } from '@/types';

interface HistoricalChartProps {
  data: SensorData[];
  targets: EnvironmentalTargets;
}

const axisTickStyle = { fontSize: 11, fill: '#94a3b8' };

function formatXLabel(iso: string, range: string) {
  const d = new Date(iso);
  if (range === '30d' || range === '7d') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function TemperatureHistoryChart({ data, targets }: HistoricalChartProps) {
  const chartData = data.map((d) => ({
    time: d.timestamp,
    temperature: d.temperature,
  }));
  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">Temperature History</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" tickFormatter={(v) => formatXLabel(v, '24h')} tick={axisTickStyle} interval="preserveStartEnd" />
          <YAxis tick={axisTickStyle} unit="°C" />
          <ReferenceArea y1={targets.tempPreferredMin} y2={targets.tempPreferredMax} fill="rgba(34,197,94,0.08)" />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            labelFormatter={(v) => new Date(String(v)).toLocaleString()}
            formatter={(val) => [`${val} °C`, 'Temperature']}
          />
          <Line type="monotone" dataKey="temperature" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HumidityHistoryChart({ data, targets }: HistoricalChartProps) {
  const chartData = data.map((d) => ({
    time: d.timestamp,
    humidity: d.humidity,
  }));
  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">Humidity History</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" tickFormatter={(v) => formatXLabel(v, '24h')} tick={axisTickStyle} interval="preserveStartEnd" />
          <YAxis tick={axisTickStyle} unit="%" />
          <ReferenceArea y1={targets.humidityPreferredMin} y2={targets.humidityPreferredMax} fill="rgba(34,197,94,0.08)" />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            labelFormatter={(v) => new Date(String(v)).toLocaleString()}
            formatter={(val) => [`${val} %`, 'Humidity']}
          />
          <Line type="monotone" dataKey="humidity" stroke="#2563eb" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CO2HistoryChart({ data, targets }: HistoricalChartProps) {
  const chartData = data.map((d) => ({
    time: d.timestamp,
    co2: d.co2,
  }));
  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">CO2 History</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" tickFormatter={(v) => formatXLabel(v, '24h')} tick={axisTickStyle} interval="preserveStartEnd" />
          <YAxis tick={axisTickStyle} unit="ppm" />
          <ReferenceArea y1={targets.co2Min} y2={targets.co2Max} fill="rgba(34,197,94,0.08)" />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            labelFormatter={(v) => new Date(String(v)).toLocaleString()}
            formatter={(val) => [`${val} ppm`, 'CO2']}
          />
          <Line type="monotone" dataKey="co2" stroke="#16a34a" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
