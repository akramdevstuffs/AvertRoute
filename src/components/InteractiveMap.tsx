import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocationPoint, RoadSegment, RouteOption } from '../types/navigation';
import { Layers, ShieldAlert, Eye, Compass, Info } from 'lucide-react';

interface InteractiveMapProps {
  origin: LocationPoint;
  destination: LocationPoint;
  routes: RouteOption[];
  selectedRouteType: RouteOption['type'];
  allSegments: Map<string, RoadSegment>;
  selectedSegmentId: string | null;
  onSelectRoute: (type: RouteOption['type']) => void;
  onSelectSegment: (segment: RoadSegment) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  origin,
  destination,
  routes,
  selectedRouteType,
  allSegments,
  selectedSegmentId,
  onSelectRoute,
  onSelectSegment,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const routeLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const segmentLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Helper for risk colors
  const getRiskColor = (riskCategory: RoadSegment['riskCategory']) => {
    switch (riskCategory) {
      case 'low': return '#10b981';      // emerald-500
      case 'moderate': return '#f59e0b'; // amber-500
      case 'high': return '#f97316';     // orange-500
      case 'extreme': return '#ef4444';  // red-500
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || leafletMapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [(origin.lat + destination.lat) / 2, (origin.lng + destination.lng) / 2],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap dark/carto tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    routeLayersGroupRef.current = L.layerGroup().addTo(map);
    segmentLayersGroupRef.current = L.layerGroup().addTo(map);
    markerGroupRef.current = L.layerGroup().addTo(map);

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update Layers & Fit Bounds when data changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !routeLayersGroupRef.current || !segmentLayersGroupRef.current || !markerGroupRef.current) return;

    // Clear previous layers
    routeLayersGroupRef.current.clearLayers();
    segmentLayersGroupRef.current.clearLayers();
    markerGroupRef.current.clearLayers();

    // 1. Render all background Road Segments with risk coloring
    allSegments.forEach((segment) => {
      const isSegmentSelected = segment.id === selectedSegmentId;
      const color = getRiskColor(segment.riskCategory);

      const polyline = L.polyline(segment.coordinates, {
        color: color,
        weight: isSegmentSelected ? 9 : 5,
        opacity: isSegmentSelected ? 1.0 : 0.65,
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectSegment(segment);
      });

      // Tooltip hover
      polyline.bindTooltip(
        `<div class="text-xs font-semibold p-1">
          <div class="text-white">${segment.name}</div>
          <div class="text-[10px] text-slate-300">Risk Score: <strong style="color: ${color}">${segment.riskScore}/100 (${segment.riskCategory.toUpperCase()})</strong></div>
        </div>`,
        { sticky: true, className: 'custom-map-tooltip' }
      );

      segmentLayersGroupRef.current?.addLayer(polyline);
    });

    // 2. Render Routes
    const bounds = L.latLngBounds([]);

    // Sort routes so selected route renders on top
    const sortedRoutes = [...routes].sort((a, b) => (a.type === selectedRouteType ? 1 : -1));

    sortedRoutes.forEach((route) => {
      const isSelected = route.type === selectedRouteType;

      // Extract coordinates from route segments
      const routeCoords: [number, number][] = [];
      route.segments.forEach((seg) => {
        seg.coordinates.forEach((coord) => routeCoords.push(coord));
      });

      if (routeCoords.length === 0) return;

      if (isSelected) {
        routeCoords.forEach((c) => bounds.extend(c));
      }

      // Outer glow polyline for selected route
      if (isSelected) {
        const glowPolyline = L.polyline(routeCoords, {
          color: route.color,
          weight: 12,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round',
        });
        routeLayersGroupRef.current?.addLayer(glowPolyline);
      }

      // Main route polyline
      const routePolyline = L.polyline(routeCoords, {
        color: route.color,
        weight: isSelected ? 6 : 3.5,
        opacity: isSelected ? 0.95 : 0.4,
        dashArray: isSelected ? undefined : '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      });

      routePolyline.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectRoute(route.type);
      });

      routeLayersGroupRef.current?.addLayer(routePolyline);
    });

    // 3. Render Origin & Destination Markers
    const createCustomIcon = (label: string, isOrigin: boolean) => {
      const bg = isOrigin ? 'bg-emerald-500' : 'bg-rose-500';
      const border = isOrigin ? 'border-emerald-300' : 'border-rose-300';
      return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full ${bg} text-white font-bold text-xs shadow-lg border-2 ${border} whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2">
                <span>${isOrigin ? 'A' : 'B'}</span>
                <span class="text-[11px] font-medium opacity-90">${label}</span>
              </div>`,
        iconSize: [0, 0],
      });
    };

    const originMarker = L.marker([origin.lat, origin.lng], {
      icon: createCustomIcon(origin.shortName, true),
      zIndexOffset: 1000,
    }).bindPopup(`<b className="text-sm">${origin.name}</b><br/><span className="text-xs text-slate-300">Origin Point</span>`);

    const destMarker = L.marker([destination.lat, destination.lng], {
      icon: createCustomIcon(destination.shortName, false),
      zIndexOffset: 1000,
    }).bindPopup(`<b className="text-sm">${destination.name}</b><br/><span className="text-xs text-slate-300">Destination Point</span>`);

    markerGroupRef.current.addLayer(originMarker);
    markerGroupRef.current.addLayer(destMarker);

    bounds.extend([origin.lat, origin.lng]);
    bounds.extend([destination.lat, destination.lng]);

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [origin, destination, routes, selectedRouteType, allSegments, selectedSegmentId]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 p-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-xl shadow-xl space-y-2 text-xs">
        <div className="flex items-center space-x-1.5 font-bold text-slate-200 uppercase text-[10px] tracking-wider">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>Waterlogging Risk Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-medium text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-slate-300">Low (&lt;30)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
            <span className="text-slate-300">Moderate (30-55)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
            <span className="text-slate-300">High (55-75)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm animate-pulse" />
            <span className="text-slate-300">Extreme (&gt;75)</span>
          </div>
        </div>
      </div>

      {/* Recenter & Reset Map View Button */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => {
            const map = leafletMapRef.current;
            if (map) {
              const bounds = L.latLngBounds([[origin.lat, origin.lng], [destination.lat, destination.lng]]);
              map.fitBounds(bounds, { padding: [60, 60], animate: true });
            }
          }}
          className="p-2 bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-white rounded-lg shadow-lg backdrop-blur-md transition-all flex items-center space-x-1.5 text-xs font-semibold hover:bg-slate-800"
          title="Recenter Map View"
        >
          <Compass className="w-4 h-4 text-sky-400" />
          <span>Fit Bounds</span>
        </button>
      </div>
    </div>
  );
};
