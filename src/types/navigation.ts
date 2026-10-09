export type RainfallPreset = 'normal' | 'heavy' | 'extreme';

export interface LocationPoint {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  address: string;
}

export interface RiskFactors {
  terrainSusceptibility: number;   // 0 to 1 (0 = elevated, 1 = low-lying depression)
  drainageSusceptibility: number; // 0 to 1 (0 = excellent storm drains, 1 = clogged/poor)
  historicalSusceptibility: number; // 0 to 1 (0 = rarely floods, 1 = frequent waterlogging)
}

export interface RoadSegment {
  id: string;
  name: string;
  startNodeId: string;
  endNodeId: string;
  distanceKm: number;          // in km
  baseTravelTimeMinutes: number; // base time under clear conditions
  coordinates: [number, number][]; // lat, lng polyline
  factors: RiskFactors;
  
  // Computed dynamic fields
  riskScore: number;           // 0 to 100
  riskCategory: 'low' | 'moderate' | 'high' | 'extreme';
  currentTravelTimeMinutes: number; // delay penalty added if waterlogged
}

export interface GraphNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export type RouteType = 'fastest' | 'balanced' | 'safest';

export interface RouteOption {
  type: RouteType;
  title: string;
  description: string;
  totalDistanceKm: number;
  totalTimeMinutes: number;
  averageRiskScore: number;
  totalExposureScore: number; // distance-weighted risk
  riskCategory: 'low' | 'moderate' | 'high' | 'extreme';
  segments: RoadSegment[];
  isRecommended: boolean;
  color: string;
  hoverColor: string;
}

export interface RerouteEvent {
  id: string;
  timestamp: Date;
  previousRecommendedType: RouteType;
  newRecommendedType: RouteType;
  affectedSegmentName: string;
  oldSegmentRisk: number;
  newSegmentRisk: number;
  timeDiffMinutes: number;
  exposureSavingsPercent: number;
}

export interface WaterloggingReport {
  id: string;
  segmentId: string;
  severity: 'clear' | 'minor' | 'significant' | 'impassable';
  notes?: string;
  timestamp: string;
  lat: number;
  lng: number;
}
