import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { LiveReading } from '@/types';

interface CompactChartProps {
  data: LiveReading[];
  dataKey: 'temperature' | 'humidity' | 'co2';
  color: string;
  unit: string;
  title: string;
}

const axisTickStyle = { fontSize: 10, fill: '#94a3b8' };

export default function CompactChart({ data, dataKey, color, unit, title }: CompactChartProps) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    [dataKey]: d[dataKey],
  }));

  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 hover:shadow-card-hover transition-all duration-200 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-neutral-600">{title}</h4>
        <span className="text-[10px] text-neutral-400">Last 1 hour</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={chartData} margin={{ top: 2, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-compact-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" tick={axisTickStyle} interval="preserveStartEnd" tickCount={4} axisLine={false} tickLine={false} />
          <YAxis tick={axisTickStyle} domain={['dataMin - 1', 'dataMax + 1']} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '11px',
              padding: '6px 10px',
            }}
            formatter={(val) => [`${val} ${unit}`, title]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={1.8}
            fill={`url(#grad-compact-${dataKey})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
