import type { GrowthBatch, GrowthStage } from '@/types';
import { growthStages } from '@/data/mockData';
import { formatDate } from '@/lib/utils';
import { Check } from 'lucide-react';

interface GrowthProgressProps {
  batch: GrowthBatch;
}

export default function GrowthProgress({ batch }: GrowthProgressProps) {
  const currentIdx = growthStages.indexOf(batch.current_stage as GrowthStage);
  const progress = ((currentIdx + 1) / growthStages.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-neutral-800">Cultivation Timeline</h3>
          <p className="text-sm text-neutral-500 mt-0.5">Batch {batch.batch_id}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-700">{Math.round(progress)}%</div>
          <p className="text-xs text-neutral-500">Complete</p>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="absolute top-5 left-5 right-5 h-1 bg-neutral-200 rounded-full" />
        <div
          className="absolute top-5 left-5 h-1 bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `calc((100% - 2.5rem) * ${progress / 100})` }}
        />
        <div className="relative flex justify-between">
          {growthStages.map((stage, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={stage} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                    isDone
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : isCurrent
                      ? 'bg-primary-50 border-primary-500 text-primary-600 animate-pulse-soft'
                      : 'bg-white border-neutral-300 text-neutral-400'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs text-center font-medium ${
                    isCurrent ? 'text-primary-700' : isDone ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
        <div>
          <p className="text-xs text-neutral-500 mb-1">Start Date</p>
          <p className="text-sm font-semibold text-neutral-700">{formatDate(batch.start_date)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1">Current Day</p>
          <p className="text-sm font-semibold text-neutral-700">
            Day {Math.max(1, Math.ceil((Date.now() - new Date(batch.start_date).getTime()) / 86400000))}
          </p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1">Expected Harvest</p>
          <p className="text-sm font-semibold text-neutral-700">{formatDate(batch.expected_harvest_date)}</p>
        </div>
        <div>
          <p className="text-xs text-neutral-500 mb-1">Current Stage</p>
          <p className="text-sm font-semibold text-primary-700">{batch.current_stage}</p>
        </div>
      </div>
    </div>
  );
}
