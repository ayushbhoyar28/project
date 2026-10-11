import { Leaf, Cpu, Database, Camera, Thermometer, CircuitBoard, ArrowRight } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export default function AboutPage() {
  const architecture = [
    { icon: Thermometer, title: 'Sensors', desc: 'Temperature, humidity, and CO2 sensors collect real-time environmental data from the cultivation chamber.' },
    { icon: Cpu, title: 'Raspberry Pi', desc: 'Raspberry Pi serves as the main controller, reading sensors via GPIO and controlling devices through a relay module.' },
    { icon: CircuitBoard, title: 'Python Program', desc: 'A Python script on the Pi reads sensors, executes automatic control logic, and sends data to the cloud.' },
    { icon: Database, title: 'API / Supabase', desc: 'Sensor data, device status, and alerts are stored in Supabase for the web application to query.' },
    { icon: Leaf, title: 'Website', desc: 'This React dashboard visualizes data, sends device commands, and tracks mushroom growth — all in real time.' },
  ];

  const features = [
    'Real-time IoT sensor monitoring (temperature, humidity, CO2)',
    'Automatic device control based on configurable thresholds',
    'Manual device override with safety confirmation',
    'Historical data visualization with multiple time ranges',
    'CSV export for academic analysis',
    'Raspberry Pi camera integration ready',
    'Cultivation cycle tracking with growth stages',
    'Alert system with severity levels',
    'Responsive design for desktop, tablet, and mobile',
  ];

  const hardware = [
    'Raspberry Pi (main controller)',
    'DHT22 / BME280 temperature & humidity sensor',
    'MH-Z19 CO2 sensor',
    'Raspberry Pi Camera Module',
    '4-channel relay module',
    'Ultrasonic humidifier',
    'Exhaust fan & circulation fan',
    'Heater / cooling system',
    '16×2 LCD display',
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary-700 to-primary-800 rounded-xl p-6 sm:p-8 text-white shadow-card-elevated animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur">
            <Leaf className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">MushroomSense AI : Smart Growth Monitoring And Prediction</h2>
            <p className="text-primary-100 mt-1">Automated Oyster Mushroom Monitoring & Control System</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
        <h3 className="text-base font-semibold text-neutral-800 mb-3">Project Overview</h3>
        <p className="text-sm text-neutral-600 leading-relaxed">
          This project monitors and automates a physical oyster mushroom cultivation chamber using a Raspberry Pi.
          Sensors continuously measure temperature, humidity, and CO2 levels. Based on configurable thresholds,
          the system automatically controls a humidifier, exhaust fan, circulation fan, heater, and cooling system
          to maintain optimal growing conditions for Pleurotus ostreatus. The web dashboard provides real-time
          monitoring, historical analysis, device control, camera preview, and growth cycle tracking.
        </p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-neutral-800 mb-4">System Architecture</h3>
        <div className="space-y-3">
          {architecture.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx}>
                <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 flex items-start gap-4 animate-fade-in">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-neutral-800">{item.title}</h4>
                    <p className="text-sm text-neutral-600 mt-1">{item.desc}</p>
                  </div>
                  <div className="text-xs font-bold text-primary-600 shrink-0 hidden sm:block">Step {idx + 1}</div>
                </div>
                {idx < architecture.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowRight className="w-5 h-5 text-neutral-300 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">Key Features</h3>
          <ul className="space-y-2">
            {features.map((f, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">Hardware Components</h3>
          <ul className="space-y-2">
            {hardware.map((h, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                <Cpu className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`rounded-xl p-4 flex items-start gap-3 animate-fade-in ${
        isSupabaseConfigured
          ? 'bg-primary-50 border border-primary-200'
          : 'bg-warning-50 border border-warning-200'
      }`}>
        <Database className={`w-5 h-5 shrink-0 mt-0.5 ${isSupabaseConfigured ? 'text-primary-600' : 'text-warning-600'}`} />
        <div className="text-sm">
          <p className={`font-semibold ${isSupabaseConfigured ? 'text-primary-700' : 'text-warning-700'}`}>
            {isSupabaseConfigured ? 'Supabase Connected' : 'Running in Mock Data Mode'}
          </p>
          <p className={`mt-1 ${isSupabaseConfigured ? 'text-primary-600' : 'text-warning-600'}`}>
            {isSupabaseConfigured
              ? 'The app is using Supabase for data storage. Sensor data, devices, and alerts are live.'
              : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to connect the database. The app uses simulated data until then.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-neutral-100/80 p-4 sm:p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-800">Future Improvements</h3>
        </div>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li className="flex items-start gap-2"><span className="text-primary-500">→</span> AI-powered mushroom growth detection from camera images</li>
          <li className="flex items-start gap-2"><span className="text-primary-500">→</span> Mobile app with push notifications for critical alerts</li>
          <li className="flex items-start gap-2"><span className="text-primary-500">→</span> Multi-chamber support for parallel cultivation batches</li>
          <li className="flex items-start gap-2"><span className="text-primary-500">→</span> Yield prediction using machine learning on historical data</li>
          <li className="flex items-start gap-2"><span className="text-primary-500">→</span> Energy consumption tracking and optimization</li>
        </ul>
      </div>
    </div>
  );
}
