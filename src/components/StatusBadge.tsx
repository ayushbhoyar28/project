import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatusBadgeProps {
  label: string;
  variant: 'optimal' | 'warning' | 'critical' | 'normal' | 'on' | 'off';
  icon?: LucideIcon;
}

const variants: Record<StatusBadgeProps['variant'], string> = {
  optimal: 'bg-primary-100 text-primary-700',
  warning: 'bg-warning-100 text-warning-700',
  critical: 'bg-error-100 text-error-700',
  normal: 'bg-primary-100 text-primary-700',
  on: 'bg-primary-100 text-primary-700',
  off: 'bg-neutral-100 text-neutral-500',
};

export default function StatusBadge({ label, variant, icon: Icon }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}

export function TrendIndicator({ value, unit }: { value: number; unit: string }) {
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const color = value > 0 ? 'text-warning-600' : value < 0 ? 'text-info-600' : 'text-neutral-400';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {value > 0 ? '+' : ''}{value.toFixed(1)} {unit}
    </span>
  );
}
