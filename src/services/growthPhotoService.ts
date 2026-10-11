import type { GrowthStage } from '@/types';

export interface GrowthPhoto {
  id: string;
  capturedAt: string;
  dataUrl: string;
  stage: GrowthStage;
  notes: string;
  mushroomCount?: number | null;
}

const STORAGE_KEY = 'smg-growth-photos';
const MAX_PHOTOS = 20;

export function getGrowthPhotos(): GrowthPhoto[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];

  const photos: unknown = JSON.parse(saved);
  if (!Array.isArray(photos) || !photos.every(isGrowthPhoto)) {
    throw new Error('Saved growth photos have an invalid format. Clear the saved photos to continue.');
  }
  return photos;
}

export function saveGrowthPhoto(photo: GrowthPhoto): GrowthPhoto[] {
  const photos = [photo, ...getGrowthPhotos()].slice(0, MAX_PHOTOS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Browser photo storage is full. Delete older growth photos and try again.');
    }
    throw error;
  }
  return photos;
}

export function deleteGrowthPhoto(photoId: string): GrowthPhoto[] {
  const photos = getGrowthPhotos().filter((photo) => photo.id !== photoId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  return photos;
}

export function saveMushroomCount(photoId: string, mushroomCount: number): GrowthPhoto[] {
  if (!Number.isInteger(mushroomCount) || mushroomCount < 0) {
    throw new Error('Enter a whole number of zero or more.');
  }

  const photos = getGrowthPhotos().map((photo) => (
    photo.id === photoId ? { ...photo, mushroomCount } : photo
  ));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  return photos;
}

function isGrowthPhoto(value: unknown): value is GrowthPhoto {
  if (typeof value !== 'object' || value === null) return false;
  const photo = value as Record<string, unknown>;
  return typeof photo.id === 'string'
    && typeof photo.capturedAt === 'string'
    && typeof photo.dataUrl === 'string'
    && typeof photo.stage === 'string'
    && typeof photo.notes === 'string'
    && (photo.mushroomCount === undefined
      || photo.mushroomCount === null
      || (typeof photo.mushroomCount === 'number' && Number.isInteger(photo.mushroomCount) && photo.mushroomCount >= 0));
}
