import { useState, useEffect } from 'react';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const unreadCount = 3;

  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="flex min-h-14 items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="shrink-0 text-neutral-600 transition-colors hover:text-primary-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="min-w-0 text-lg font-bold leading-tight text-neutral-800 sm:text-xl lg:text-2xl">
            MushroomSense AI : Smart Growth Monitoring And Prediction
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-soft" />
            <span className="text-xs font-medium text-primary-700">System Online</span>
          </div>

          <div className="hidden md:block text-xs text-neutral-500 font-mono tabular-nums">
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            {' · '}
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <button className="relative text-neutral-500 hover:text-primary-700 transition-colors">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-error-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
}
