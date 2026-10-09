import React, { useState } from 'react';
import { RoadSegment, WaterloggingReport } from '../types/navigation';
import { ShieldAlert, X, Send, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { BASE_ROAD_SEGMENTS } from '../services/roadGraph';

interface ReportWaterloggingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: Omit<WaterloggingReport, 'id' | 'timestamp'>) => void;
}

export const ReportWaterloggingModal: React.FC<ReportWaterloggingModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState(BASE_ROAD_SEGMENTS[0].id);
  const [severity, setSeverity] = useState<WaterloggingReport['severity']>('minor');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const seg = BASE_ROAD_SEGMENTS.find(s => s.id === selectedSegmentId) || BASE_ROAD_SEGMENTS[0];
    const centerCoord = seg.coordinates[Math.floor(seg.coordinates.length / 2)];

    onSubmitReport({
      segmentId: selectedSegmentId,
      severity,
      notes,
      lat: centerCoord[0],
      lng: centerCoord[1]
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-amber-400">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Report Waterlogging Spot
          </h3>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Report Logged Successfully</h4>
            <p className="text-xs text-slate-400">
              Thank you! Your crowd-sourced report has been added to local demo state.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Road Segment Selection */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-300">
                Select Road Segment
              </label>
              <select
                value={selectedSegmentId}
                onChange={(e) => setSelectedSegmentId(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {BASE_ROAD_SEGMENTS.map((seg) => (
                  <option key={seg.id} value={seg.id}>
                    {seg.name} ({seg.distanceKm} km)
                  </option>
                ))}
              </select>
            </div>

            {/* Severity Radio Options */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-300">
                Observed Severity
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'clear', label: 'Road Appears Clear', color: 'border-emerald-500/50 hover:bg-emerald-950/40' },
                  { id: 'minor', label: 'Minor Waterlogging', color: 'border-amber-500/50 hover:bg-amber-950/40' },
                  { id: 'significant', label: 'Significant Waterlogging', color: 'border-orange-500/50 hover:bg-orange-950/40' },
                  { id: 'impassable', label: 'Road Impassable', color: 'border-red-500/50 hover:bg-red-950/40' }
                ].map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSeverity(s.id as WaterloggingReport['severity'])}
                    className={`p-2 rounded-lg border text-left font-medium transition-all ${s.color} ${
                      severity === s.id
                        ? 'bg-slate-800 border-amber-500 text-white ring-2 ring-amber-500/40'
                        : 'bg-slate-950/60 text-slate-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-300">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., Clogged drain near underpass..."
                rows={2}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Demo mode disclaimer */}
            <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg text-[11px] text-amber-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Demo Mode Notice: Reports are saved in local browser state for testing and are not dispatched to municipal emergency services.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Local Waterlogging Report</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
