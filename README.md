# AvertRoute — Waterlogging-Aware Navigation Platform

> **"Anticipate waterlogging. Navigate smarter."**

AvertRoute is a climate-tech geospatial navigation dashboard that estimates real-time waterlogging risk for road segments and dynamically calculates routes balancing travel time against exposure to flooded roads.

---

## 🌟 Key Features

### 1. **Route Planner (Left Sidebar)**
- **Searchable Location Input:** Select origin & destination points (e.g. *NIT Rourkela*, *Rourkela Railway Station*, *Chhend Colony*, *Planetarium*, etc.).
- **Quick Preset Locations:** 1-click selectable sample location pills for rapid hackathon testing.
- **Location Swap & Validation:** Instant location swapping with inline error handling.

### 2. **Dynamic Rainfall Scenario Control**
- **Presets & Fine Slider:** Select *Normal (5 mm/hr)*, *Heavy (35 mm/hr)*, or *Extreme Storm (75 mm/hr)* presets or use the 0-100 mm/hr slider.
- **Dynamic Recalculation:** Adjusting rainfall instantly recalculates:
  - Road segment risk scores (0–100 scale)
  - Travel time penalties for flooded segments
  - Polyline risk colors on the map
  - Exposure metrics across all routes
  - **Dynamic Route Recommendation**

### 3. **Interactive Geospatial Map (Leaflet)**
- **Dark Carto Tiles:** Premium dark mode styling for climate tech applications.
- **Risk-Colored Road Segments:** Green (*Low*), Yellow (*Moderate*), Orange (*High*), Red (*Extreme*).
- **Route Polyline Rendering:** Highlighted polyline paths for **Fastest**, **Balanced**, and **Safest** routes.
- **Interactive Inspection:** Click any road segment to open the **Road Risk Inspector**.
- **Bounds Fitting & Recenter:** Fits view smoothly to active route or markers.

### 4. **Route Comparison Panel**
- **3 Dynamic Cards:**
  - **FASTEST:** Minimizes travel time.
  - **BALANCED:** Optimizes travel time while bypassing high-risk flooded roads.
  - **SAFEST:** Prioritizes elevated ridge corridors for maximum flood safety.
- **Dynamic Recommendation Badge:** Recomputed based on a travel time + risk exposure utility function.

### 5. **Road Risk Inspector**
- Inspect individual road segments for:
  - **Terrain Elevation Factor** (Basin vs. Ridge)
  - **Drainage Capacity Factor** (Culverts & Storm drains)
  - **Historical Flood Frequency**
  - **Rainfall Intensity Contribution**
  - **Confidence Level:** Clear labeling of simulated demo estimates vs. live sensor data.

### 6. **Live Scenario & Rerouting Toast Notification**
- Triggered automatically when rainfall changes alter the recommended route (e.g., when a low-lying bypass floods from 22/100 to 82/100 risk).
- Displays clear **Before-and-After tradeoff metrics** (e.g., `+2 min travel time | 55% lower exposure`).

### 7. **Route Impact Summary**
- Displays travel time difference & relative exposure reduction percentages versus the fastest route.

### 8. **Optional User Flood Report & Risk Insights**
- **Report Flood Modal:** Allows users to log crowd-sourced flood observations locally.
- **Risk Insights Modal:** Interactive model formula breakdown and Recharts factor distribution.

---

## 🚀 Installation & Running

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 18, TypeScript, Vite 5, Tailwind CSS
- **Geospatial Mapping:** Leaflet 1.9, Carto Voyager Dark Basemap
- **Icons & Visuals:** Lucide React, Recharts
- **Graph & Risk Engine:**
  - `src/services/roadGraph.ts`: Adjacency network representation of city roads & coordinates.
  - `src/services/riskModel.ts`: Deterministic hydro-meteorological risk model.
  - `src/services/routing.ts`: Dijkstra algorithm computing Fastest, Balanced, and Safest paths.
  - `src/services/apiClient.ts`: API client with local mock fallback and backend readiness via `VITE_API_BASE_URL`.

---

## 📝 Demo Mode & Backend Integration

By default, AvertRoute runs in **Demo Mode** using a deterministic local risk simulation engine.
To connect a real backend service, create a `.env` file from `.env.example`:

```env
VITE_API_BASE_URL=https://your-avert-route-backend.com
```

The application expects the following backend API endpoints:
- `GET /api/routes?origin=:id&destination=:id&rainfall=:mmHr`
- `GET /api/segments/:id?rainfall=:mmHr`
- `POST /api/reports`
