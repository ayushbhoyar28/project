import { useEffect, useState } from 'react';
import GrowthProgress from '@/components/GrowthProgress';
import { getGrowthData } from '@/services/dataService';
import { mockGrowthBatch, growthStages } from '@/data/mockData';
import type { GrowthBatch } from '@/types';
import { Package, Sprout, Scale, TrendingUp, Calendar, Camera, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { deleteGrowthPhoto, getGrowthPhotos, saveMushroomCount, type GrowthPhoto } from '@/services/growthPhotoService';

export default function MushroomGrowthPage() {
  const [batch, setBatch] = useState<GrowthBatch>(mockGrowthBatch);
  const [photos, setPhotos] = useState<GrowthPhoto[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [countDrafts, setCountDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    getGrowthData().then(setBatch).catch(() => {});
    try {
      setPhotos(getGrowthPhotos());
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Could not load growth photos.');
    }
  }, []);

  const handleDeletePhoto = (photoId: string) => {
    try {
      setPhotos(deleteGrowthPhoto(photoId));
      setPhotoError('');
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Could not delete the growth photo.');
    }
  };

  const handleSaveCount = (photoId: string) => {
    const value = countDrafts[photoId] ?? '';
    const count = Number(value);
    if (value.trim() === '' || !Number.isInteger(count) || count < 0) {
      setPhotoError('Enter a whole number of visible mushroom caps (zero or more).');
      return;
    }

    try {
      setPhotos(saveMushroomCount(photoId, count));
      setPhotoError('');
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : 'Could not save the mushroom count.');
    }
  };

  const currentDay = Math.max(1, Math.ceil((Date.now() - new Date(batch.start_date).getTime()) / 86400000));
  const totalDays = Math.ceil((new Date(batch.expected_harvest_date).getTime() - new Date(batch.start_date).getTime()) / 86400000);

  const stats = [
    { icon: Package, label: 'Total Bags', value: batch.number_of_bags, color: 'bg-primary-100 text-primary-600' },
    { icon: Sprout, label: 'Active Bags', value: batch.active_bags, color: 'bg-accent-100 text-accent-600' },
    { icon: Scale, label: 'Estimated Yield', value: `${batch.estimated_yield} kg`, color: 'bg-info-100 text-info-600' },
    { icon: TrendingUp, label: 'Harvested', value: `${batch.actual_yield} kg`, color: 'bg-warning-100 text-warning-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">Mushroom Growth</h2>
        <p className="text-sm text-neutral-500 mt-1">Cultivation cycle tracking and growth progress</p>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                  <p className="text-lg font-bold text-neutral-800">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <GrowthProgress batch={batch} />
        </div>
        <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">Batch Information</h3>
          <div className="space-y-3">
            {[
              { label: 'Batch ID', value: batch.batch_id },
              { label: 'Mushroom', value: batch.mushroom_type },
              { label: 'Strain', value: batch.strain },
              { label: 'Start Date', value: formatDate(batch.start_date) },
              { label: 'Current Day', value: `Day ${currentDay} of ${totalDays}` },
              { label: 'Expected Harvest', value: formatDate(batch.expected_harvest_date) },
              { label: 'Current Stage', value: batch.current_stage },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-neutral-100 last:border-0">
                <span className="text-sm text-neutral-500">{item.label}</span>
                <span className="text-sm font-semibold text-neutral-700 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-800">Growth Timeline</h3>
        </div>
        <div className="space-y-3">
          {growthStages.map((stage, idx) => {
            const currentIdx = growthStages.indexOf(batch.current_stage as typeof stage);
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const stageDay = Math.round((totalDays / growthStages.length) * (idx + 1));
            return (
              <div
                key={stage}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isCurrent ? 'bg-primary-50 border border-primary-200' : 'bg-neutral-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isDone
                      ? 'bg-primary-500 text-white'
                      : isCurrent
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCurrent ? 'text-primary-700' : 'text-neutral-700'}`}>
                    {stage}
                  </p>
                  <p className="text-xs text-neutral-500">Approx. Day {Math.round((totalDays / growthStages.length) * idx + 1)}–{stageDay}</p>
                </div>
                {isCurrent && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-600 text-white">
                    In Progress
                  </span>
                )}
                {isDone && (
                  <span className="text-xs font-medium text-primary-600">Completed</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Camera aria-hidden="true" className="w-5 h-5 text-primary-600" />
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">Growth Photo Timeline</h3>
            <p className="mt-0.5 text-xs text-neutral-500">Compare dated photos and review the stage you recorded.</p>
          </div>
        </div>
        {photoError && (
          <p role="alert" className="mb-3 rounded-lg border border-error-200 bg-error-50 p-3 text-sm text-error-700">
            {photoError}
          </p>
        )}
        {photos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-200 px-4 py-8 text-center">
            <p className="text-sm font-medium text-neutral-600">No growth photos saved yet</p>
            <p className="mt-1 text-xs text-neutral-400">Capture a photo from the Camera page to start tracking changes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {photos.map((photo) => (
              <article key={photo.id} className="overflow-hidden rounded-xl border border-neutral-100">
                <img
                  src={photo.dataUrl}
                  alt={`Mushroom growth photo, stage ${photo.stage}, captured ${formatDate(photo.capturedAt)}`}
                  className="aspect-video w-full bg-neutral-100 object-cover"
                />
                <div className="flex items-start justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-800">{photo.stage}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{formatDate(photo.capturedAt)}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{new Date(photo.capturedAt).toLocaleTimeString()}</p>
                    <p className="mt-2 text-sm font-medium text-primary-700">
                      {photo.mushroomCount == null ? 'Mushrooms counted: not yet' : `Mushroom caps: ${photo.mushroomCount}`}
                    </p>
                    {photo.notes && <p className="mt-2 text-sm text-neutral-600">{photo.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      aria-label={`Delete ${photo.stage} photo from ${formatDate(photo.capturedAt)}`}
                      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-error-50 hover:text-error-600"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <fieldset className="space-y-2 px-3 pb-3">
                  <legend className="text-xs font-medium text-neutral-600">Counting method</legend>
                  <div className="flex gap-2">
                    <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700">
                      <input type="radio" name={`count-method-${photo.id}`} value="manual" defaultChecked className="accent-primary-600" />
                      Manual
                    </label>
                    <label className="flex flex-1 cursor-not-allowed items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400">
                      <input type="radio" name={`count-method-${photo.id}`} value="automatic" disabled className="accent-primary-600" />
                      Automatic
                    </label>
                  </div>
                  <p className="text-xs text-neutral-500">Automatic cap detection will be available after a mushroom-recognition model is connected.</p>
                </fieldset>
                <div className="flex items-end gap-2 px-3 pb-3">
                  <label className="flex-1 text-xs font-medium text-neutral-600">
                    Count visible caps
                    <input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={countDrafts[photo.id] ?? (photo.mushroomCount?.toString() ?? '')}
                      onChange={(event) => setCountDrafts((drafts) => ({ ...drafts, [photo.id]: event.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSaveCount(photo.id)}
                    className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Save count
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-neutral-400">
          Enter and save the visible mushroom cap count after reviewing each photo. Photos and counts are stored in this browser on this device; automatic AI counting is not enabled.
        </p>
      </section>
    </div>
  );
}
