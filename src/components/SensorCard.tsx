import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type StatusColor = 'optimal' | 'warning' | 'critical' | 'normal' | 'online' | 'offline';

interface SensorCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  unit: string;
  status: StatusColor;
  statusLabel: string;
  trend?: number;
  iconColor: string;
  trendUnit?: string;
}

const statusColors: Record<StatusColor, { bg: string; text: string; dot: string }> = {
  optimal: { bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500' },
  online: { bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500' },
  normal: { bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-700', dot: 'bg-warning-500' },
  critical: { bg: 'bg-error-50', text: 'text-error-700', dot: 'bg-error-500' },
  offline: { bg: 'bg-neutral-100', text: 'text-neutral-500', dot: 'bg-neutral-400' },
};

export default function SensorCard({
  icon: Icon,
  title,
  value,
  unit,
  status,
  statusLabel,
  trend = 0,
  iconColor,
  trendUnit = '',
}: SensorCardProps) {
  const colors = statusColors[status];
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'text-warning-600' : trend < 0 ? 'text-info-600' : 'text-neutral-400';
  const showTrend = trendUnit !== '';

  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 hover:shadow-card-hover hover:border-neutral-200 transition-all duration-200 animate-fade-in">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-neutral-500">{title}</span>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${colors.bg} ${colors.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${status === 'optimal' || status === 'normal' || status === 'online' ? 'animate-pulse-soft' : ''}`} />
          {statusLabel}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-neutral-800 tabular-nums leading-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-neutral-400">{unit}</span>}
      </div>
      {showTrend && (
        <div className={`flex items-center gap-1 mt-1.5 text-[11px] font-medium ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)} {trendUnit}</span>
        </div>
      )}
      {!showTrend && (
        <div className="mt-1.5 text-[11px] text-neutral-400">—</div>
      )}
    </div>
  );
}
