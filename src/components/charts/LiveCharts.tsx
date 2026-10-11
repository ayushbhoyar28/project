import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from 'recharts';
import type { LiveReading, EnvironmentalTargets } from '@/types';

interface LiveChartProps {
  data: LiveReading[];
  dataKey: 'temperature' | 'humidity' | 'co2';
  color: string;
  unit: string;
  targets: EnvironmentalTargets;
}

const axisTickStyle = { fontSize: 11, fill: '#94a3b8' };

export function TemperatureChart({ data, targets }: { data: LiveReading[]; targets: EnvironmentalTargets }) {
  return <LiveChart data={data} dataKey="temperature" color="#f59e0b" unit="°C" targets={targets} />;
}

export function HumidityChart({ data, targets }: { data: LiveReading[]; targets: EnvironmentalTargets }) {
  return <LiveChart data={data} dataKey="humidity" color="#2563eb" unit="%" targets={targets} />;
}

export function CO2Chart({ data, targets }: { data: LiveReading[]; targets: EnvironmentalTargets }) {
  return <LiveChart data={data} dataKey="co2" color="#16a34a" unit="ppm" targets={targets} />;
}

function LiveChart({ data, dataKey, color, unit, targets }: LiveChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    [dataKey]: d[dataKey],
  }));

  let refArea: { y1: number; y2: number; fill: string } | null = null;
  if (dataKey === 'temperature') {
    refArea = { y1: targets.tempPreferredMin, y2: targets.tempPreferredMax, fill: 'rgba(34,197,94,0.08)' };
  } else if (dataKey === 'humidity') {
    refArea = { y1: targets.humidityPreferredMin, y2: targets.humidityPreferredMax, fill: 'rgba(34,197,94,0.08)' };
  } else if (dataKey === 'co2') {
    refArea = { y1: targets.co2Min, y2: targets.co2Max, fill: 'rgba(34,197,94,0.08)' };
  }

  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4 capitalize">
        {dataKey === 'co2' ? 'CO2' : dataKey} vs Time
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="time" tick={axisTickStyle} interval="preserveStartEnd" tickCount={6} />
          <YAxis tick={axisTickStyle} domain={['dataMin - 2', 'dataMax + 2']} />
          {refArea && (
            <ReferenceArea y1={refArea.y1} y2={refArea.y2} fill={refArea.fill} />
          )}
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
            }}
            formatter={(val) => [`${val} ${unit}`, dataKey === 'co2' ? 'CO2' : dataKey]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${dataKey})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
