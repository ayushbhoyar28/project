import { useState } from 'react';
import AlertCard from '@/components/AlertCard';
import { Bell, CheckCheck, Trash2, Filter } from 'lucide-react';
import type { Alert, AlertType } from '@/types';
import { mockAlerts } from '@/data/mockData';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | AlertType>('all');

  const filtered = alerts.filter((a) => {
    if (a.status === 'cleared') return false;
    if (filter === 'all') return true;
    if (filter === 'unread') return a.status === 'unread';
    return a.type === filter;
  });

  const unreadCount = alerts.filter((a) => a.status === 'unread').length;

  const markRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'read' } : a)));
  };

  const clearAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cleared' } : a)));
  };

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => (a.status === 'unread' ? { ...a, status: 'read' } : a)));
  };

  const clearAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, status: 'cleared' as const })));
  };

  const filterButtons: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'WARNING', label: 'Warnings' },
    { key: 'CRITICAL', label: 'Critical' },
    { key: 'INFO', label: 'Info' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">Alerts</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All alerts read'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-error-600 bg-white border border-neutral-200 rounded-lg hover:bg-error-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-neutral-400" />
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filter === btn.key
                ? 'bg-primary-600 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-12 text-center">
            <Bell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">No alerts to display</p>
          </div>
        ) : (
          filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onMarkRead={markRead} onClear={clearAlert} />
          ))
        )}
      </div>
    </div>
  );
}
