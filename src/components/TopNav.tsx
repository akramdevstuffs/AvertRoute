import React from 'react';
import { CloudRain, Navigation, ShieldCheck, Activity, Info } from 'lucide-react';
import { RainfallPreset } from '../types/navigation';

interface TopNavProps {
  rainfallPreset: RainfallPreset;
  rainfallMmHr: number;
  isDemoMode: boolean;
  onOpenInsights: () => void;
  onOpenReportModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  rainfallPreset,
  rainfallMmHr,
  isDemoMode,
  onOpenInsights,
  onOpenReportModal,
}) => {
  const getPresetBadgeColor = () => {
    switch (rainfallPreset) {
      case 'normal':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'heavy':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'extreme':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-100 shadow-lg">
      {/* Brand Section */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-0.5 shadow-md shadow-sky-900/30">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Navigation className="w-5 h-5 text-cyan-400 transform -rotate-45" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
              AvertRoute
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-sky-950/80 text-sky-400 border border-sky-700/50 rounded-full">
                Demo Mode
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            Waterlogging-aware navigation
          </p>
        </div>
      </div>

      {/* Middle Status / Indicators */}
      <div className="hidden md:flex items-center space-x-3">
        {/* Rainfall status indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${getPresetBadgeColor()}`}>
          <CloudRain className="w-4 h-4 animate-bounce" />
          <span>Rainfall: <strong className="font-bold">{rainfallMmHr} mm/hr</strong></span>
          <span className="capitalize text-[11px] opacity-80">({rainfallPreset})</span>
        </div>

        {/* Engine status */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Risk Engine Active</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenReportModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          title="Report waterlogged road"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Report Flood</span>
        </button>

        <button
          onClick={onOpenInsights}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white border border-sky-400/30 transition-all shadow-sm shadow-sky-900/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Risk Insights</span>
        </button>
      </div>
    </header>
  );
};
