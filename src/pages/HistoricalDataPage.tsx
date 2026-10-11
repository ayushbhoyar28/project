import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { getHistoricalData } from '@/services/dataService';
import { useTargets } from '@/hooks/useSensorData';
import { exportToCsv, formatDateTime } from '@/lib/utils';
import {
  TemperatureHistoryChart,
  HumidityHistoryChart,
  CO2HistoryChart,
} from '@/components/charts/HistoricalCharts';
import DataTable from '@/components/DataTable';
import type { SensorData } from '@/types';

type Range = '1h' | '6h' | '24h' | '7d' | '30d';

const ranges: { key: Range; label: string }[] = [
  { key: '1h', label: 'Last 1 hour' },
  { key: '6h', label: 'Last 6 hours' },
  { key: '24h', label: 'Last 24 hours' },
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
];

export default function HistoricalDataPage() {
  const [range, setRange] = useState<Range>('24h');
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const { targets } = useTargets();

  useEffect(() => {
    setLoading(true);
    getHistoricalData(range)
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

  const handleExport = () => {
    const csvData = data.map((d) => ({
      Timestamp: formatDateTime(d.timestamp),
      Temperature: d.temperature,
      Humidity: d.humidity,
      CO2: d.co2,
      Humidifier: d.humidity < 80 ? 'ON' : 'OFF',
      ExhaustFan: d.co2 > 1000 ? 'ON' : 'OFF',
      CirculationFan: 'ON',
    }));
    exportToCsv(`sensor_data_${range}_${new Date().toISOString().slice(0, 10)}.csv`, csvData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">Historical Data</h2>
          <p className="text-sm text-neutral-500 mt-1">Sensor readings over time</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            {ranges.map((r) => (
              <option key={r.key} value={r.key}>{r.label}</option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-12 text-center text-neutral-400">
          Loading historical data...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TemperatureHistoryChart data={data} targets={targets} />
            <HumidityHistoryChart data={data} targets={targets} />
          </div>
          <CO2HistoryChart data={data} targets={targets} />
          <DataTable data={data} />
        </>
      )}
    </div>
  );
}
