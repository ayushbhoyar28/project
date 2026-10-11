import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-white">
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 text-sm text-primary-700">
          <Leaf className="w-4 h-4 text-primary-600" />
          <span className="font-semibold">Sense better, Predict Earlier and Grow Smarter</span>
      
        </div>
        <div className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
          © 2026 MushroomSense AI
        </div>
      </div>
    </footer>
  );
}
