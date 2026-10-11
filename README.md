# SMART MUSHROOM GROWTH

**Automated Oyster Mushroom Monitoring & Control System**

An MSc project for monitoring and automating an oyster mushroom cultivation chamber using Raspberry Pi, environmental sensors, and a web dashboard.

---

## 1. Project Overview

This web application provides real-time monitoring and control of a physical oyster mushroom cultivation chamber. The system uses a Raspberry Pi as the main controller, connected to temperature, humidity, and CO2 sensors, plus a relay module that controls a humidifier, exhaust fan, circulation fan, heater, cooling system, and grow light.

The dashboard visualizes sensor data, allows manual and automatic device control, tracks the cultivation cycle, displays camera feeds, and logs alerts — all designed for an academic MSc demonstration.

Currently runs on **simulated/mock data**. The architecture is ready to connect to a real Raspberry Pi and Supabase database.

## 2. Features

- **Dashboard** — System status, sensor cards (temperature, humidity, CO2, air quality), environmental target comparison, device status overview
- **Live Monitoring** — Real-time sensor values with auto-updating charts (temperature, humidity, CO2 vs time)
- **Historical Data** — Charts and searchable data table with selectable time ranges (1h, 6h, 24h, 7d, 30d), CSV export
- **Camera** — Raspberry Pi camera preview area with Start/Stop/Capture/Fullscreen controls
- **Device Control** — Manual ON/OFF toggles with AUTO/MANUAL mode switching, safety confirmation for important devices, automatic control logic display
- **Alerts** — Warning/Info/Critical alerts with mark-as-read and clear functionality, filtering by type
- **Mushroom Growth** — Cultivation batch tracking with 6-stage growth timeline, progress bar, yield estimates
- **Settings** — Configurable environmental targets (temperature, humidity, CO2 thresholds)
- **About Project** — System architecture diagram, hardware list, feature overview

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Recharts | Data visualization |
| React Router | Navigation |
| Supabase | Database (ready, optional) |

## 4. Installation

```bash
npm install
```

## 5. Running the Website

```bash
npm run dev
```

The dev server starts automatically. Open the URL shown in your browser.

To build for production:

```bash
npm run build
```

## 6. Previewing and Sharing the Website

To preview the production build on your computer:

```bash
npm run build
npm run preview
```

Open the local URL printed in the terminal. This preview is only accessible from your computer.

To publish the site on Netlify:

1. Push this project to a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project** and connect the repository.
3. Set the base directory to the repository root. Netlify uses `netlify.toml` to run `npm run build` and publish the `dist` folder.
4. Choose **Deploy site**. Netlify will provide a public URL you can share.

The site currently uses simulated sensor/device data. Publishing it online does not connect it to a Raspberry Pi or a live database.

## 7. How Mock Data Works

The application uses a **service layer** (`src/services/dataService.ts`) that checks whether Supabase is configured. If not, it returns realistic simulated data:

- **Sensor readings** drift slowly within realistic ranges (temp: 22–27°C, humidity: 78–88%, CO2: 500–1500 ppm) instead of jumping randomly
- **Live data** updates every 3 seconds via the `useLiveSensorData` hook in `src/hooks/useSensorData.ts`
- **Historical data** is generated based on the selected time range
- **Devices, alerts, and growth batches** use predefined mock data from `src/data/mockData.ts`

All mock data generators are isolated in the service layer, so replacing them with real API calls requires no component changes.

## 8. Connecting Supabase

### Step 1: Add credentials

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Create tables

Create these tables in your Supabase project:

```sql
-- Sensor data
CREATE TABLE sensor_data (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  temperature NUMERIC,
  humidity NUMERIC,
  co2 INTEGER
);

-- Device status
CREATE TABLE device_status (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  device_name TEXT,
  status BOOLEAN,
  mode TEXT
);

-- Alerts
CREATE TABLE alerts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  type TEXT,
  message TEXT,
  status TEXT
);

-- Growth batches
CREATE TABLE growth_batches (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  batch_id TEXT,
  mushroom_type TEXT,
  strain TEXT,
  start_date DATE,
  current_stage TEXT,
  expected_harvest_date DATE,
  number_of_bags INTEGER,
  active_bags INTEGER,
  estimated_yield NUMERIC,
  actual_yield NUMERIC
);

-- Camera events
CREATE TABLE camera_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  image_url TEXT,
  detection_result TEXT
);
```

Enable Row Level Security and add appropriate policies for each table.

### Step 3: Automatic switch

Once credentials are set, the service layer automatically queries Supabase instead of returning mock data. No code changes needed.

The Supabase client is in `src/lib/supabaseClient.ts`.

## 9. Raspberry Pi Integration

### Data flow (sensors → website):

```
Sensors → Raspberry Pi → Python program → API/Supabase → Website
```

### Control flow (website → devices):

```
Website → API/Supabase → Raspberry Pi → GPIO → Relay → Device
```

### Where to add integration:

- **`src/services/dataService.ts`** — Replace mock data generators with real Supabase queries (already structured for this)
- **`src/hooks/useSensorData.ts`** — Replace the simulated tick with a WebSocket/SSE connection or polling to the Raspberry Pi API
- **`src/pages/CameraPage.tsx`** — Replace the simulated camera preview with an MJPEG or WebRTC stream URL from the Raspberry Pi camera
- **`src/lib/supabaseClient.ts`** — Supabase client configuration

### Raspberry Pi side (Python):

The Python program on the Raspberry Pi should:
1. Read sensors (DHT22/BME280 for temp/humidity, MH-Z19 for CO2)
2. Execute automatic control logic (relay switching)
3. Write sensor readings to Supabase `sensor_data` table
4. Write device status changes to `device_status` table
5. Generate alerts and write to `alerts` table
6. Poll `device_status` for manual commands from the website
7. Capture camera images and upload to Supabase Storage

## 10. Future Improvements

- AI-powered mushroom growth detection from camera images
- Mobile app with push notifications
- Multi-chamber support for parallel cultivation
- Yield prediction using machine learning
- Energy consumption tracking and optimization

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── charts/         # Chart components (Recharts)
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SensorCard.tsx
│   ├── DeviceCard.tsx
│   ├── DeviceControl.tsx
│   ├── AlertCard.tsx
│   ├── StatusBadge.tsx
│   ├── GrowthProgress.tsx
│   └── DataTable.tsx
├── pages/              # Page components (one per route, including CameraPage.tsx)
├── services/           # Data service layer (Supabase/mock)
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces
├── data/               # Mock data
├── lib/                # Utilities (Supabase client, formatters)
├── App.tsx
├── main.tsx
└── index.css
```

---

© 2026 SMART MUSHROOM GROWTH — MSc Project
