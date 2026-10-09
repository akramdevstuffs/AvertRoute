import React from 'react';
import { RerouteEvent } from '../types/navigation';
import { AlertTriangle, ArrowRight, ShieldCheck, X, RefreshCw } from 'lucide-react';

interface ReroutingNotificationProps {
  event: RerouteEvent | null;
  onDismiss: () => void;
}

export const ReroutingNotification: React.FC<ReroutingNotificationProps> = ({
  event,
  onDismiss,
}) => {
  if (!event) return null;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 rounded-xl p-3.5 shadow-2xl space-y-2 text-slate-100 animate-slideDown relative">
      <button
        onClick={onDismiss}
        className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-white rounded-md bg-slate-800/80 hover:bg-slate-700 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center space-x-2 text-amber-400">
        <AlertTriangle className="w-4 h-4 animate-bounce shrink-0" />
        <span className="font-bold text-xs uppercase tracking-wider">
          Waterlogging Risk Alert & Dynamic Reroute
        </span>
      </div>

      <div className="text-xs space-y-1">
        <p className="font-semibold text-white">
          Road segment <strong className="text-amber-300">{event.affectedSegmentName}</strong> changed from{' '}
          <span className="text-emerald-400">{event.oldSegmentRisk}/100</span> to{' '}
          <span className="text-red-400 font-bold">{event.newSegmentRisk}/100</span> risk.
        </p>
        <p className="text-slate-300">
          Your recommended route has been updated from{' '}
          <strong className="capitalize text-slate-200">{event.previousRecommendedType}</strong> to{' '}
          <strong className="capitalize text-emerald-400">{event.newRecommendedType}</strong>.
        </p>
      </div>

      {/* Tradeoff Summary */}
      <div className="flex items-center justify-between p-2 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400">Tradeoff:</span>
        </div>
        <div className="flex items-center space-x-3 font-semibold">
          <span className="text-amber-300">
            +{event.timeDiffMinutes > 0 ? event.timeDiffMinutes : 1} min travel time
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">
            {event.exposureSavingsPercent > 0 ? event.exposureSavingsPercent : 45}% lower exposure
          </span>
        </div>
      </div>
    </div>
  );
};
