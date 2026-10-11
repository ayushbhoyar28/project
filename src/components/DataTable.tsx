import type { SensorData } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';

interface DataTableProps {
  data: SensorData[];
  deviceInfo?: Record<string, boolean>;
}

type SortKey = 'timestamp' | 'temperature' | 'humidity' | 'co2';

export default function DataTable({ data }: DataTableProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let result = [...data];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.timestamp.toLowerCase().includes(q) ||
          String(d.temperature).includes(q) ||
          String(d.humidity).includes(q) ||
          String(d.co2).includes(q)
      );
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'timestamp') cmp = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      else cmp = a[sortKey] - b[sortKey];
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [data, search, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-neutral-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-neutral-700">Sensor Data Log</h3>
          <input
            type="text"
            placeholder="Search readings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 w-full sm:w-64"
          />
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-thin max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 sticky top-0 z-10">
            <tr className="text-left text-xs text-neutral-500">
              {[
                { key: 'timestamp' as SortKey, label: 'Timestamp' },
                { key: 'temperature' as SortKey, label: 'Temperature' },
                { key: 'humidity' as SortKey, label: 'Humidity' },
                { key: 'co2' as SortKey, label: 'CO2' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 font-medium cursor-pointer hover:text-primary-700 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Humidifier</th>
              <th className="px-4 py-3 font-medium">Exhaust Fan</th>
              <th className="px-4 py-3 font-medium">Circ. Fan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-neutral-400 text-sm">
                  No data found
                </td>
              </tr>
            ) : (
              filtered.slice(0, 200).map((row, i) => (
                <tr key={row.id} className={i % 2 === 0 ? 'bg-white hover:bg-neutral-50' : 'bg-neutral-50/50 hover:bg-neutral-50'}>
                  <td className="px-4 py-2.5 text-neutral-600 text-xs font-mono">{formatDateTime(row.timestamp)}</td>
                  <td className="px-4 py-2.5 text-neutral-700 font-medium">{row.temperature} °C</td>
                  <td className="px-4 py-2.5 text-neutral-700 font-medium">{row.humidity} %</td>
                  <td className="px-4 py-2.5 text-neutral-700 font-medium">{row.co2} ppm</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-medium ${row.humidity < 80 ? 'text-primary-700' : 'text-neutral-400'}`}>
                      {row.humidity < 80 ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs font-medium ${row.co2 > 1000 ? 'text-primary-700' : 'text-neutral-400'}`}>
                      {row.co2 > 1000 ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-medium text-primary-700">ON</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 border-t border-neutral-100 text-xs text-neutral-500">
        Showing {Math.min(filtered.length, 200)} of {filtered.length} records
      </div>
    </div>
  );
}
