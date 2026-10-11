import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardPage from '@/pages/DashboardPage';
import LiveMonitoringPage from '@/pages/LiveMonitoringPage';
import HistoricalDataPage from '@/pages/HistoricalDataPage';
import CameraPage from '@/pages/CameraPage';
import DeviceControlPage from '@/pages/DeviceControlPage';
import AlertsPage from '@/pages/AlertsPage';
import MushroomGrowthPage from '@/pages/MushroomGrowthPage';
import SettingsPage from '@/pages/SettingsPage';
import AboutPage from '@/pages/AboutPage';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <HashRouter>
      <div className="flex min-h-screen" style={{ backgroundColor: '#F5F9F6' }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/live" element={<LiveMonitoringPage />} />
              <Route path="/history" element={<HistoricalDataPage />} />
              <Route path="/camera" element={<CameraPage />} />
              <Route path="/control" element={<DeviceControlPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/growth" element={<MushroomGrowthPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/ebook" element={<AboutPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </HashRouter>
  );
}
