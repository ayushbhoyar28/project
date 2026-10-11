import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, Download, ImagePlus, Square, Trash2, Video } from 'lucide-react';
import { growthStages } from '@/data/mockData';
import { formatDateTime } from '@/lib/utils';
import { deleteGrowthPhoto, getGrowthPhotos, saveGrowthPhoto, type GrowthPhoto } from '@/services/growthPhotoService';
import type { GrowthStage } from '@/types';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [stage, setStage] = useState<GrowthStage>('Fruiting');
  const [photos, setPhotos] = useState<GrowthPhoto[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      setPhotos(getGrowthPhotos());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load saved growth photos.');
    }

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startCamera = async () => {
    setError('');
    setMessage('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is unavailable. Open this site on localhost or HTTPS in a browser that supports webcam access.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreaming(true);
    } catch (cameraError) {
      const name = cameraError instanceof DOMException ? cameraError.name : '';
      if (name === 'NotAllowedError' || name === 'SecurityError') {
        setError('Camera permission was denied. Allow camera access for this site in your browser settings, then try again.');
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setError('No camera was found. Connect or enable a camera, then try again.');
      } else {
        setError(cameraError instanceof Error ? `Could not start the camera: ${cameraError.message}` : 'Could not start the camera.');
      }
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreaming(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError('The camera is not ready yet. Wait for the live preview, then capture again.');
      return;
    }

    const maxWidth = 960;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext('2d');
    if (!context) {
      setError('Could not prepare the image for saving. Please try again.');
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo: GrowthPhoto = {
      id: crypto.randomUUID(),
      capturedAt: new Date().toISOString(),
      dataUrl: canvas.toDataURL('image/jpeg', 0.72),
      stage,
      notes: '',
      mushroomCount: null,
    };

    try {
      setPhotos(saveGrowthPhoto(photo));
      setMessage('Photo saved to the mushroom growth timeline on this device.');
      setError('');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save the photo.');
    }
  };

  const downloadPhoto = (photo: GrowthPhoto) => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `mushroom-${photo.stage.toLowerCase().replace(/ /g, '-')}-${photo.capturedAt.slice(0, 10)}.jpg`;
    link.click();
  };

  const removePhoto = (photoId: string) => {
    try {
      setPhotos(deleteGrowthPhoto(photoId));
      setMessage('Photo deleted from this device.');
      setError('');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete the photo.');
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-neutral-100/80 bg-white p-4 shadow-card sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <Video aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-800">Camera &amp; Growth Photos</h2>
            <p className="text-xs text-neutral-500">Use your laptop camera to capture cultivation progress</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-100/80 bg-white p-4 shadow-card sm:p-5">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-950">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Live laptop camera preview"
            className={`h-full w-full object-contain ${streaming ? '' : 'hidden'}`}
          />
          {streaming && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="mb-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                Align the mushroom cap inside the guide
              </div>
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-white shadow-[0_0_0_999px_rgba(0,0,0,0.12)] sm:h-56 sm:w-56">
                <span className="h-2 w-2 rounded-full bg-white/90 shadow" />
              </div>
            </div>
          )}
          {!streaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
              <Camera aria-hidden="true" className="mb-3 h-12 w-12 text-neutral-500" />
              <p className="font-medium text-neutral-200">Laptop camera is stopped</p>
              <p className="mt-1 text-sm text-neutral-400">Start the camera and allow browser permission to see the preview.</p>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block text-sm font-medium text-neutral-700">
            Growth stage for this photo
            <select
              value={stage}
              onChange={(event) => setStage(event.target.value as GrowthStage)}
              className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              {growthStages.map((growthStage) => (
                <option key={growthStage} value={growthStage}>{growthStage}</option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            {!streaming ? (
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:flex-none"
              >
                <Video aria-hidden="true" className="h-4 w-4" />
                Start camera
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:flex-none"
                >
                  <ImagePlus aria-hidden="true" className="h-4 w-4" />
                  Capture photo
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
                >
                  <Square aria-hidden="true" className="h-4 w-4" />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-info-200 bg-info-50 p-3 text-sm text-info-700">
          Photos are saved in this browser for manual review. Mushroom recognition and automatic growth-stage detection are not connected.
        </div>
        {error && (
          <div role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-error-200 bg-error-50 p-3 text-sm text-error-700">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        {message && <p role="status" className="mt-3 text-sm text-primary-700">{message}</p>}
      </section>

      <section className="rounded-xl border border-neutral-100/80 bg-white p-4 shadow-card sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-neutral-800">Recent growth photos</h2>
            <p className="mt-1 text-sm text-neutral-500">Newest captures first · stored on this device</p>
          </div>
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">{photos.length} / 20</span>
        </div>
        {photos.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-200 px-4 py-10 text-center">
            <ImagePlus aria-hidden="true" className="mx-auto h-8 w-8 text-neutral-300" />
            <p className="mt-2 text-sm font-medium text-neutral-600">No growth photos yet</p>
            <p className="mt-1 text-xs text-neutral-400">Start the camera and capture your first photo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {photos.slice(0, 6).map((photo) => (
              <article key={photo.id} className="overflow-hidden rounded-xl border border-neutral-100">
                <img src={photo.dataUrl} alt={`Mushroom growth at ${photo.stage}`} className="aspect-video w-full bg-neutral-100 object-cover" />
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-800">{photo.stage}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{formatDateTime(photo.capturedAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => downloadPhoto(photo)}
                      aria-label={`Download photo from ${formatDateTime(photo.capturedAt)}`}
                      className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-primary-700"
                    >
                      <Download aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      aria-label={`Delete photo from ${formatDateTime(photo.capturedAt)}`}
                      className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-error-50 hover:text-error-600"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
