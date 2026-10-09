import React, { useState } from 'react';
import { MapPin, Navigation, ArrowUpDown, Search, Sparkles, AlertCircle } from 'lucide-react';
import { LocationPoint } from '../types/navigation';
import { SAMPLE_LOCATIONS } from '../services/roadGraph';

interface RoutePlannerProps {
  origin: LocationPoint;
  destination: LocationPoint;
  onSelectOrigin: (loc: LocationPoint) => void;
  onSelectDestination: (loc: LocationPoint) => void;
  onSwapLocations: () => void;
  onCalculateRoutes: () => void;
  isLoading: boolean;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  onSwapLocations,
  onCalculateRoutes,
  isLoading,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);

  const handleSwap = () => {
    onSwapLocations();
    setErrorMsg(null);
  };

  const handleCalculate = () => {
    if (origin.id === destination.id) {
      setErrorMsg('Origin and destination cannot be identical. Please choose distinct locations.');
      return;
    }
    setErrorMsg(null);
    onCalculateRoutes();
  };

  return (
    <div className="p-4 space-y-4 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 rounded-xl shadow-md">
      <div>
        <div className="flex items-center space-x-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Navigation</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
          Plan a safer route
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Find routes with lower waterlogging exposure.
        </p>
      </div>

      {/* Preset Quick Location Pills */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Demo Preset Locations
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_LOCATIONS.map((loc) => {
            const isOrig = loc.id === origin.id;
            const isDest = loc.id === destination.id;
            return (
              <button
                key={loc.id}
                onClick={() => {
                  if (isOrig) return;
                  if (!isDest) {
                    onSelectDestination(loc);
                  } else {
                    onSelectOrigin(loc);
                  }
                  setErrorMsg(null);
                }}
                className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                  isOrig
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-semibold'
                    : isDest
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-semibold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {loc.shortName} {isOrig ? '(Origin)' : isDest ? '(Dest)' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Group */}
      <div className="space-y-3 relative pt-1">
        {/* Origin Selector */}
        <div className="relative">
          <label htmlFor="origin-input" className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              <span>Origin</span>
            </span>
            <span className="text-[10px] text-emerald-400/80 font-mono">START</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-400">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              id="origin-input"
              value={origin.id}
              onChange={(e) => {
                const selected = SAMPLE_LOCATIONS.find(l => l.id === e.target.value);
                if (selected) {
                  onSelectOrigin(selected);
                  setErrorMsg(null);
                }
              }}
              className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
            >
              {SAMPLE_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1.5 relative z-10">
          <button
            onClick={handleSwap}
            type="button"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-full shadow-md transition-all transform hover:rotate-180 duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Selector */}
        <div className="relative">
          <label htmlFor="destination-input" className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              <span>Destination</span>
            </span>
            <span className="text-[10px] text-rose-400/80 font-mono">END</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-rose-400">
              <Navigation className="w-4 h-4" />
            </div>
            <select
              id="destination-input"
              value={destination.id}
              onChange={(e) => {
                const selected = SAMPLE_LOCATIONS.find(l => l.id === e.target.value);
                if (selected) {
                  onSelectDestination(selected);
                  setErrorMsg(null);
                }
              }}
              className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all cursor-pointer"
            >
              {SAMPLE_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800/60 flex items-start space-x-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleCalculate}
        disabled={isLoading}
        className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-semibold text-sm shadow-md shadow-sky-950/50 transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
      >
        <Search className="w-4 h-4" />
        <span>{isLoading ? 'Recalculating...' : 'Find Waterlogging-Safe Routes'}</span>
      </button>
    </div>
  );
};
