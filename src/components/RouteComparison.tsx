import React from 'react';
import { RouteOption } from '../types/navigation';
import { Zap, Scale, ShieldCheck, Clock, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RouteComparisonProps {
  routes: RouteOption[];
  selectedRouteType: RouteOption['type'];
  onSelectRoute: (type: RouteOption['type']) => void;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({
  routes,
  selectedRouteType,
  onSelectRoute,
}) => {
  const getRouteIcon = (type: RouteOption['type']) => {
    switch (type) {
      case 'fastest':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'balanced':
        return <Scale className="w-4 h-4 text-sky-400" />;
      case 'safest':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getRiskBadge = (category: RouteOption['riskCategory']) => {
    switch (category) {
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">Low Exposure</span>;
      case 'moderate':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">Moderate Risk</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded">High Risk</span>;
      case 'extreme':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/30 rounded">Extreme Risk</span>;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Route Options & Exposure Comparison
        </h3>
        <span className="text-[11px] text-slate-400">Click card to select</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {routes.map((route) => {
          const isSelected = route.type === selectedRouteType;
          return (
            <div
              key={route.type}
              onClick={() => onSelectRoute(route.type)}
              className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-sky-500 shadow-lg shadow-sky-950/50 ring-2 ring-sky-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900/90 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5 font-bold text-sm text-white">
                    {getRouteIcon(route.type)}
                    <span>{route.title}</span>
                  </div>
                  {route.isRecommended && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-full flex items-center space-x-1 uppercase tracking-wider shadow-sm">
                      <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                      <span>Recommended</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {route.description}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Est. Time</span>
                  </span>
                  <span className="text-base font-extrabold text-white">
                    {route.totalTimeMinutes} <span className="text-xs font-normal text-slate-400">min</span>
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Distance</span>
                  </span>
                  <span className="text-base font-extrabold text-white">
                    {route.totalDistanceKm} <span className="text-xs font-normal text-slate-400">km</span>
                  </span>
                </div>
              </div>

              {/* Exposure Badge & Score */}
              <div className="flex items-center justify-between pt-1">
                {getRiskBadge(route.riskCategory)}
                <span className="text-[11px] font-mono text-slate-400">
                  Risk Score: <strong className="text-slate-200">{route.averageRiskScore}/100</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
