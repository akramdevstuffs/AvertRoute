import { RoadSegment, RouteOption, WaterloggingReport } from '../types/navigation';
import { computeAllSegmentRisks } from './riskModel';
import { generateAllRoutes } from './routing';
import { SAMPLE_LOCATIONS } from './roadGraph';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface FetchRoutesParams {
  originId: string;
  destId: string;
  rainfallMmHr: number;
}

export const apiClient = {
  isDemoMode: !API_BASE_URL,

  async getRoutes(params: FetchRoutesParams): Promise<{ routes: RouteOption[]; segments: Map<string, RoadSegment> }> {
    if (API_BASE_URL) {
      try {
        const query = new URLSearchParams({
          origin: params.originId,
          destination: params.destId,
          rainfall: params.rainfallMmHr.toString()
        });
        const res = await fetch(`${API_BASE_URL}/api/routes?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const segmentsMap = new Map<string, RoadSegment>(data.segments);
          return { routes: data.routes, segments: segmentsMap };
        }
      } catch (err) {
        console.warn('Backend API request failed, falling back to local simulation:', err);
      }
    }

    // Local Mock / Demo Service
    const originLoc = SAMPLE_LOCATIONS.find(l => l.id === params.originId) || SAMPLE_LOCATIONS[0];
    const destLoc = SAMPLE_LOCATIONS.find(l => l.id === params.destId) || SAMPLE_LOCATIONS[1];

    const segmentsMap = computeAllSegmentRisks(params.rainfallMmHr);
    const routes = generateAllRoutes(
      originLoc.lat,
      originLoc.lng,
      destLoc.lat,
      destLoc.lng,
      segmentsMap
    );

    return { routes, segments: segmentsMap };
  },

  async getSegmentById(segmentId: string, rainfallMmHr: number): Promise<RoadSegment | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/segments/${segmentId}?rainfall=${rainfallMmHr}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Backend API segment fetch failed, using local mock:', err);
      }
    }

    const segmentsMap = computeAllSegmentRisks(rainfallMmHr);
    return segmentsMap.get(segmentId) || null;
  },

  async submitReport(report: Omit<WaterloggingReport, 'id' | 'timestamp'>): Promise<{ success: boolean; report: WaterloggingReport }> {
    const fullReport: WaterloggingReport = {
      ...report,
      id: `report_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullReport)
        });
        if (res.ok) {
          const data = await res.json();
          return { success: true, report: data };
        }
      } catch (err) {
        console.warn('Backend API report submission failed, using local storage:', err);
      }
    }

    return { success: true, report: fullReport };
  }
};
