import type { AlertType, AlertStatusType } from '@/types';
import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface AlertItem {
  id: string;
  timestamp: string;
  type: AlertType;
  message: string;
  status: AlertStatusType;
}

interface AlertCardProps {
  alert: AlertItem;
  onMarkRead: (id: string) => void;
  onClear: (id: string) => void;
}

const typeConfig: Record<AlertType, { icon: typeof Info; bg: string; iconColor: string; borderColor: string }> = {
  WARNING: { icon: AlertTriangle, bg: 'bg-warning-50', iconColor: 'text-warning-600', borderColor: 'border-warning-200' },
  INFO: { icon: Info, bg: 'bg-info-50', iconColor: 'text-info-600', borderColor: 'border-info-200' },
  CRITICAL: { icon: AlertCircle, bg: 'bg-error-50', iconColor: 'text-error-600', borderColor: 'border-error-200' },
};

export default function AlertCard({ alert, onMarkRead, onClear }: AlertCardProps) {
  const config = typeConfig[alert.type];
  const Icon = config.icon;
  const isUnread = alert.status === 'unread';

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.borderColor} ${config.bg} ${
        isUnread ? 'ring-1 ring-offset-0 ring-current opacity-100' : 'opacity-75 hover:opacity-90'
      } transition-all animate-fade-in hover:shadow-card-hover`}
    >
      <div className={`shrink-0 ${config.iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-bold ${config.iconColor}`}>{alert.type}</span>
          {isUnread && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600">
              NEW
            </span>
          )}
          <span className="text-xs text-neutral-500">{formatDateTime(alert.timestamp)}</span>
        </div>
        <p className="text-sm text-neutral-700 mt-1">{alert.message}</p>
        <div className="flex items-center gap-3 mt-2">
          {alert.status !== 'read' && alert.status !== 'cleared' && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="text-xs font-medium text-neutral-500 hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Mark as read
            </button>
          )}
          {alert.status !== 'cleared' && (
            <button
              onClick={() => onClear(alert.id)}
              className="text-xs font-medium text-neutral-500 hover:text-error-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
