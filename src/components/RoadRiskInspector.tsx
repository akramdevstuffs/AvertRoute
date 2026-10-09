import React from 'react';
import { RoadSegment, RainfallPreset } from '../types/navigation';
import { ShieldAlert, AlertTriangle, CheckCircle2, Layers, CloudRain, X, Info } from 'lucide-react';

interface RoadRiskInspectorProps {
  segment: RoadSegment | null;
  rainfallMmHr: number;
  rainfallPreset: RainfallPreset;
  onClose: () => void;
}

export const RoadRiskInspector: React.FC<RoadRiskInspectorProps> = ({
  segment,
  rainfallMmHr,
  rainfallPreset,
  onClose,
}) => {
  if (!segment) {
    return (
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-center text-slate-400 text-xs shadow-md">
        <Layers className="w-8 h-8 text-slate-600 mx-auto" />
        <p className="font-medium text-slate-300">No Road Segment Selected</p>
        <p className="text-[11px] text-slate-400">
          Click any colored road segment on the interactive map to inspect detailed waterlogging risk factors.
        </p>
      </div>
    );
  }

  const getCategoryBadge = (cat: RoadSegment['riskCategory']) => {
    switch (cat) {
      case 'low':
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md">Low Risk</span>;
      case 'moderate':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-md">Moderate Risk</span>;
      case 'high':
        return <span className="px-2.5 py-1 text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-md">High Risk</span>;
      case 'extreme':
        return <span className="px-2.5 py-1 text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 rounded-md animate-pulse">Extreme Risk</span>;
    }
  };

  const terrainLabel = segment.factors.terrainSusceptibility > 0.7 ? 'Low-Lying Basin (High Risk)' : segment.factors.terrainSusceptibility > 0.3 ? 'Moderate Elevation' : 'Elevated Ridge (Safe)';
  const drainageLabel = segment.factors.drainageSusceptibility > 0.7 ? 'Poor Culvert/Clogged' : segment.factors.drainageSusceptibility > 0.3 ? 'Standard Storm Drain' : 'High-Capacity Drainage';
  const historyLabel = segment.factors.historicalSusceptibility > 0.7 ? 'Frequent Waterlogging Spot' : segment.factors.historicalSusceptibility > 0.3 ? 'Occasional Puddling' : 'Rarely Floods';

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3.5 shadow-xl relative animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
              SEGMENT INSPECTOR
            </span>
            <span className="text-[10px] text-slate-400 font-mono">ID: {segment.id}</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight mt-1">
            {segment.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Score & Classification */}
      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Estimated Risk Score
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-2xl font-extrabold text-white font-mono">{segment.riskScore}</span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
        </div>
        <div>
          {getCategoryBadge(segment.riskCategory)}
        </div>
      </div>

      {/* Contributing Factors Breakdown */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
          Risk Factors & Terrain Breakdown
        </span>

        <div className="space-y-2 text-xs">
          {/* Rainfall scenario */}
          <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span>Rainfall Scenario</span>
            </span>
            <span className="font-semibold text-slate-200 capitalize">
              {rainfallPreset} ({rainfallMmHr} mm/hr)
            </span>
          </div>

          {/* Terrain factor */}
          <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Terrain Elevation</span>
            <span className="font-semibold text-slate-200">
              {terrainLabel} ({Math.round(segment.factors.terrainSusceptibility * 100)}%)
            </span>
          </div>

          {/* Drainage factor */}
          <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Drainage Susceptibility</span>
            <span className="font-semibold text-slate-200">
              {drainageLabel} ({Math.round(segment.factors.drainageSusceptibility * 100)}%)
            </span>
          </div>

          {/* Historical factor */}
          <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Historical Susceptibility</span>
            <span className="font-semibold text-slate-200">
              {historyLabel} ({Math.round(segment.factors.historicalSusceptibility * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Confidence & Demo Label */}
      <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-900/50 flex items-start space-x-2 text-[11px] text-sky-300">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block">Confidence Level: Limited</span>
          <span className="text-sky-300/80">
            Values are simulated estimates for demo purposes. Connect real-time municipal depth sensors for live operational monitoring.
          </span>
        </div>
      </div>
    </div>
  );
};
