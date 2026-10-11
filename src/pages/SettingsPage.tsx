import { useState } from 'react';
import { Save, RotateCcw, Sliders, Thermometer, Droplets, Wind } from 'lucide-react';
import { getTargets, saveTargets } from '@/services/dataService';
import type { EnvironmentalTargets } from '@/types';
import { defaultTargets } from '@/data/mockData';

export default function SettingsPage() {
  const [targets, setTargets] = useState<EnvironmentalTargets>(getTargets());
  const [saved, setSaved] = useState(false);

  const update = (key: keyof EnvironmentalTargets, value: number) => {
    setTargets((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveTargets(targets);
    setSaved(true);
    window.dispatchEvent(new Event('smg-targets-changed'));
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setTargets(defaultTargets);
    saveTargets(defaultTargets);
    window.dispatchEvent(new Event('smg-targets-changed'));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">Settings</h2>
          <p className="text-sm text-neutral-500 mt-1">Configure environmental targets and thresholds</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SettingsCard icon={Thermometer} title="Temperature" color="bg-warning-100 text-warning-600">
          <Field label="Absolute Minimum (°C)" value={targets.tempMin} onChange={(v) => update('tempMin', v)} />
          <Field label="Preferred Minimum (°C)" value={targets.tempPreferredMin} onChange={(v) => update('tempPreferredMin', v)} />
          <Field label="Preferred Maximum (°C)" value={targets.tempPreferredMax} onChange={(v) => update('tempPreferredMax', v)} />
          <Field label="Absolute Maximum (°C)" value={targets.tempMax} onChange={(v) => update('tempMax', v)} />
        </SettingsCard>

        <SettingsCard icon={Droplets} title="Humidity" color="bg-info-100 text-info-600">
          <Field label="Absolute Minimum (%)" value={targets.humidityMin} onChange={(v) => update('humidityMin', v)} />
          <Field label="Preferred Minimum (%)" value={targets.humidityPreferredMin} onChange={(v) => update('humidityPreferredMin', v)} />
          <Field label="Preferred Maximum (%)" value={targets.humidityPreferredMax} onChange={(v) => update('humidityPreferredMax', v)} />
          <Field label="Absolute Maximum (%)" value={targets.humidityMax} onChange={(v) => update('humidityMax', v)} />
        </SettingsCard>

        <SettingsCard icon={Wind} title="CO2" color="bg-neutral-200 text-neutral-600">
          <Field label="Normal Minimum (ppm)" value={targets.co2Min} onChange={(v) => update('co2Min', v)} />
          <Field label="Normal Maximum (ppm)" value={targets.co2Max} onChange={(v) => update('co2Max', v)} />
          <Field label="Exhaust Fan Threshold (ppm)" value={targets.co2Threshold} onChange={(v) => update('co2Threshold', v)} />
        </SettingsCard>
      </div>

      <div className="bg-info-50 border border-info-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
        <Sliders className="w-5 h-5 text-info-600 shrink-0 mt-0.5" />
        <div className="text-sm text-info-700">
          <p className="font-semibold">Automatic Control Thresholds</p>
          <p className="mt-1">
            These values control the automatic logic: humidifier activates below preferred humidity min,
            exhaust fan triggers when CO2 exceeds the threshold, and heater/cooling respond to temperature limits.
          </p>
        </div>
      </div>
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

function SettingsCard({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: LucideIcon;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-neutral-500 block mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
      />
    </div>
  );
}
