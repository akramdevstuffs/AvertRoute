import { BASE_ROAD_SEGMENTS } from './roadGraph';
import { RoadSegment } from '../types/navigation';

export interface RiskModelWeights {
  rainfallWeight: number;
  terrainWeight: number;
  drainageWeight: number;
  historicalWeight: number;
}

export const DEFAULT_WEIGHTS: RiskModelWeights = {
  rainfallWeight: 0.40,
  terrainWeight: 0.25,
  drainageWeight: 0.20,
  historicalWeight: 0.15
};

export function calculateSegmentRisk(
  baseSegment: typeof BASE_ROAD_SEGMENTS[0],
  rainfallMmHr: number,
  weights: RiskModelWeights = DEFAULT_WEIGHTS
): RoadSegment {
  const { terrainSusceptibility, drainageSusceptibility, historicalSusceptibility } = baseSegment.factors;

  // Normalized rainfall factor (0 at 0 mm/hr, 1.0 at 80+ mm/hr)
  const rainfallFactor = Math.min(1.0, Math.max(0, rainfallMmHr / 80));

  // High susceptibility segments amplify rainfall response
  const susceptibilityCombined = 
    (terrainSusceptibility * weights.terrainWeight) +
    (drainageSusceptibility * weights.drainageWeight) +
    (historicalSusceptibility * weights.historicalWeight);

  const baseSusceptibility = susceptibilityCombined / (weights.terrainWeight + weights.drainageWeight + weights.historicalWeight);

  // Nonlinear amplification: heavy rainfall severely penalizes low terrain & poor drainage
  const rainfallImpactMultiplier = 0.15 + (rainfallFactor * 1.85);

  let rawScore = baseSusceptibility * rainfallImpactMultiplier * 100;
  
  // High terrain/drainage penalty boost during extreme rain
  if (rainfallMmHr > 40 && terrainSusceptibility > 0.7) {
    rawScore += (rainfallMmHr - 40) * 0.4;
  }

  const riskScore = Math.min(99, Math.max(5, Math.round(rawScore)));

  let riskCategory: 'low' | 'moderate' | 'high' | 'extreme';
  if (riskScore < 30) {
    riskCategory = 'low';
  } else if (riskScore < 55) {
    riskCategory = 'moderate';
  } else if (riskScore < 75) {
    riskCategory = 'high';
  } else {
    riskCategory = 'extreme';
  }

  // Calculate dynamic travel time based on waterlogging delay penalty
  let delayMultiplier = 1.0;
  if (riskCategory === 'moderate') {
    delayMultiplier = 1.25;
  } else if (riskCategory === 'high') {
    delayMultiplier = 1.85;
  } else if (riskCategory === 'extreme') {
    delayMultiplier = 3.2; // 320% base travel time due to deep water crawling/avoidance
  }

  const currentTravelTimeMinutes = Number((baseSegment.baseTravelTimeMinutes * delayMultiplier).toFixed(1));

  return {
    ...baseSegment,
    riskScore,
    riskCategory,
    currentTravelTimeMinutes
  };
}

export function computeAllSegmentRisks(
  rainfallMmHr: number,
  weights: RiskModelWeights = DEFAULT_WEIGHTS
): Map<string, RoadSegment> {
  const map = new Map<string, RoadSegment>();
  for (const baseSeg of BASE_ROAD_SEGMENTS) {
    const calculated = calculateSegmentRisk(baseSeg, rainfallMmHr, weights);
    map.set(calculated.id, calculated);
  }
  return map;
}
