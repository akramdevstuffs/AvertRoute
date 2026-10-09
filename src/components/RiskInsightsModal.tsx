import React from 'react';
import { X, ShieldAlert, BarChart3, CloudRain, Mountain, Wrench, History, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface RiskInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rainfallMmHr: number;
}

export const RiskInsightsModal: React.FC<RiskInsightsModalProps> = ({
  isOpen,
  onClose,
  rainfallMmHr,
}) => {
  if (!isOpen) return null;

  const sampleData = [
    { name: 'Rainfall Intensity', weight: 40, value: Math.min(100, rainfallMmHr * 1.2), color: '#38bdf8' },
    { name: 'Terrain Elevation', weight: 25, value: 65, color: '#f59e0b' },
    { name: 'Drainage Culvert', weight: 20, value: 75, color: '#f97316' },
    { name: 'Historical Flood', weight: 15, value: 80, color: '#ef4444' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-sky-400">
          <BarChart3 className="w-5 h-5" />
          <h3 className="text-lg font-bold text-white tracking-tight">
            AvertRoute Risk Model Insights
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          AvertRoute combines deterministic hydro-meteorological models with terrain elevation rasters to compute real-time road segment vulnerability before you encounter waterlogging.
        </p>

        {/* Formula breakdown */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
          <span className="text-slate-400 uppercase text-[10px] font-bold block">
            Core Scoring Formula
          </span>
          <div className="text-sky-300 font-semibold leading-relaxed">
            Risk = (0.40 × Rainfall) + (0.25 × Terrain) + (0.20 × Drainage) + (0.15 × Historical)
          </div>
        </div>

        {/* Factors list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-sky-400">
              <CloudRain className="w-4 h-4" />
              <span>Rainfall Rate (40%)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live precipitation in mm/hr driving immediate runoff volume.
            </p>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-amber-400">
              <Mountain className="w-4 h-4" />
              <span>Terrain Slope (25%)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Elevation depressions and river basin proximity.
            </p>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-orange-400">
              <Wrench className="w-4 h-4" />
              <span>Drainage Capacity (20%)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Culvert diameter and storm sewer maintenance history.
            </p>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-red-400">
              <History className="w-4 h-4" />
              <span>Historical Floods (15%)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Empirical monsoon inundation frequencies over past 5 years.
            </p>
          </div>
        </div>

        {/* Recharts chart */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Factor Weight Distribution & Active Intensity
          </span>
          <div className="h-44 w-full bg-slate-950/80 rounded-xl p-2 border border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {sampleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
};
