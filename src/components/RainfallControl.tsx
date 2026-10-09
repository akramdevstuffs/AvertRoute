import React from 'react';
import { CloudRain, Sun, CloudLightning, Droplets } from 'lucide-react';
import { RainfallPreset } from '../types/navigation';

interface RainfallControlProps {
  currentPreset: RainfallPreset;
  rainfallMmHr: number;
  onPresetChange: (preset: RainfallPreset) => void;
  onSliderChange: (mmHr: number) => void;
}

export const RainfallControl: React.FC<RainfallControlProps> = ({
  currentPreset,
  rainfallMmHr,
  onPresetChange,
  onSliderChange,
}) => {
  const presets: { id: RainfallPreset; label: string; mmHr: number; icon: React.ReactNode; colorClass: string }[] = [
    {
      id: 'normal',
      label: 'Normal',
      mmHr: 5,
      icon: <Sun className="w-4 h-4 text-emerald-400" />,
      colorClass: 'hover:border-emerald-500/60 active:bg-emerald-500/20'
    },
    {
      id: 'heavy',
      label: 'Heavy Rain',
      mmHr: 35,
      icon: <CloudRain className="w-4 h-4 text-amber-400" />,
      colorClass: 'hover:border-amber-500/60 active:bg-amber-500/20'
    },
    {
      id: 'extreme',
      label: 'Extreme Storm',
      mmHr: 75,
      icon: <CloudLightning className="w-4 h-4 text-red-400" />,
      colorClass: 'hover:border-red-500/60 active:bg-red-500/20'
    }
  ];

  return (
    <div className="p-4 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 rounded-xl space-y-3.5 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Rainfall Intensity Scenario
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-sky-400">
          {rainfallMmHr} mm/hr
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {presets.map((p) => {
          const isActive = currentPreset === p.id && Math.abs(rainfallMmHr - p.mmHr) < 10;
          return (
            <button
              key={p.id}
              onClick={() => onPresetChange(p.id)}
              className={`p-2 rounded-lg border text-left flex flex-col items-start justify-between space-y-1 transition-all ${
                isActive
                  ? p.id === 'normal'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50'
                    : p.id === 'heavy'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200 ring-1 ring-amber-500/50'
                    : 'bg-red-950/60 border-red-500 text-red-200 ring-1 ring-red-500/50 animate-pulse-glow'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {p.icon}
                <span className="text-[10px] font-mono text-slate-400">{p.mmHr} mm</span>
              </div>
              <span className="text-xs font-semibold">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Fine-tuning Slider */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>0 mm/hr (Clear)</span>
          <span>50 mm/hr</span>
          <span>100 mm/hr (Downpour)</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={rainfallMmHr}
          onChange={(e) => onSliderChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400 focus:outline-none border border-slate-800"
        />
      </div>
    </div>
  );
};
