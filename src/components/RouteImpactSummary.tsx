import React from 'react';
import { RouteOption } from '../types/navigation';
import { ShieldAlert, TrendingDown, Clock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface RouteImpactSummaryProps {
  selectedRoute: RouteOption;
  fastestRoute: RouteOption;
  rainfallMmHr: number;
}

export const RouteImpactSummary: React.FC<RouteImpactSummaryProps> = ({
  selectedRoute,
  fastestRoute,
  rainfallMmHr,
}) => {
  const timeDifference = selectedRoute.totalTimeMinutes - fastestRoute.totalTimeMinutes;

  // Exposure comparison vs fastest
  const fastestExposure = Math.max(1, fastestRoute.totalExposureScore);
  const selectedExposure = selectedRoute.totalExposureScore;

  let exposureReductionPercent = 0;
  if (fastestExposure > 0) {
    exposureReductionPercent = Math.round(((fastestExposure - selectedExposure) / fastestExposure) * 100);
  }

  const isFastestSelected = selectedRoute.type === 'fastest';

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Selected Route Impact Summary
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          Mode: <strong className="text-white capitalize">{selectedRoute.type}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Time Comparison */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Time vs. Fastest
            </span>
            <span className="text-sm font-bold text-white">
              {isFastestSelected ? (
                'Fastest available route'
              ) : timeDifference > 0 ? (
                <span className="text-amber-300">+{timeDifference} min extra</span>
              ) : timeDifference === 0 ? (
                'Same travel time'
              ) : (
                <span className="text-emerald-400">{Math.abs(timeDifference)} min faster</span>
              )}
            </span>
          </div>
        </div>

        {/* Exposure Comparison */}
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Exposure vs. Fastest
            </span>
            <span className="text-sm font-bold text-white">
              {isFastestSelected ? (
                <span className="text-amber-400">Baseline exposure</span>
              ) : exposureReductionPercent > 0 ? (
                <span className="text-emerald-400">{exposureReductionPercent}% lower exposure</span>
              ) : exposureReductionPercent < 0 ? (
                <span className="text-red-400">{Math.abs(exposureReductionPercent)}% higher exposure</span>
              ) : (
                'Equal exposure'
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimers & Info */}
      <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
        <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-snug">
          Exposure is an estimated metric calculated from terrain elevation, storm drainage capacity, and historical waterlogging data under {rainfallMmHr} mm/hr rainfall, not a guaranteed flood forecast.
        </p>
      </div>
    </div>
  );
};
