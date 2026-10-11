import { NavLink } from 'react-router-dom';
import {
  House,
  Activity,
  BarChart3,
  Camera,
  ToggleLeft,
  Bell,
  Sprout,
  Settings,
  BookOpen,
  X,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: House },
  { to: '/live', label: 'Live Monitoring', icon: Activity },
  { to: '/growth', label: 'Mushroom Stages', icon: Sprout },
  { to: '/history', label: 'Historical Data', icon: BarChart3 },
  { to: '/camera', label: 'Camera', icon: Camera },
  { to: '/control', label: 'Device Control', icon: ToggleLeft },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/ebook', label: 'E-Book', icon: BookOpen },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-neutral-900/40"
          onClick={onClose}
        />
      )}
      <aside
        aria-label="Main navigation"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-primary-800 text-white transition-all duration-300 ${
          open ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-primary-700/60 min-h-[60px]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0 shadow-md">
              <span className="text-lg">🍄</span>
            </div>
            <div>
              <h1 className="text-[18px] font-bold leading-tight tracking-wide">Explore</h1>
          
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation menu"
            className="text-primary-200 hover:text-white shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-primary-100/80 hover:bg-primary-700/60 hover:text-white'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-3 border-t border-primary-700/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse-soft" />
            <span className="text-[11px] text-primary-200">MushroomSense AI · 2026</span>
          </div>
        </div>
      </aside>
    </>
  );
}
