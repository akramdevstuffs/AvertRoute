import { GRAPH_NODES } from './roadGraph';
import { GraphNode, RoadSegment, RouteOption, RouteType } from '../types/navigation';

interface PriorityQueueItem {
  nodeId: string;
  cost: number;
}

export function findNearestNode(lat: number, lng: number): GraphNode {
  let nearestNode = GRAPH_NODES[0];
  let minDistance = Infinity;

  for (const node of GRAPH_NODES) {
    const dist = Math.hypot(node.lat - lat, node.lng - lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestNode = node;
    }
  }

  return nearestNode;
}

export function calculateEdgeCost(segment: RoadSegment, routeType: RouteType): number {
  const normalizedRisk = segment.riskScore / 100;

  if (routeType === 'fastest') {
    // Pure time minimization with minimal risk awareness
    return segment.currentTravelTimeMinutes;
  }

  if (routeType === 'balanced') {
    // Balances time with moderate risk penalty
    const riskPenalty = 1 + (1.8 * normalizedRisk);
    return segment.currentTravelTimeMinutes * riskPenalty;
  }

  // Safest: High exponential penalty for risky segments
  let severePenalty = 1 + (5.0 * Math.pow(normalizedRisk, 2));
  if (segment.riskScore >= 65) {
    severePenalty += 15.0; // Avoid heavily flooded segments whenever possible
  }
  return segment.currentTravelTimeMinutes * severePenalty;
}

export function findRoute(
  startNodeId: string,
  endNodeId: string,
  segmentsMap: Map<string, RoadSegment>,
  routeType: RouteType
): RoadSegment[] {
  // Build adjacency list
  const adjList = new Map<string, { targetNodeId: string; segment: RoadSegment }[]>();
  
  for (const node of GRAPH_NODES) {
    adjList.set(node.id, []);
  }

  for (const segment of segmentsMap.values()) {
    const forwardList = adjList.get(segment.startNodeId) || [];
    forwardList.push({ targetNodeId: segment.endNodeId, segment });
    adjList.set(segment.startNodeId, forwardList);

    // Bidirectional roads
    const reverseList = adjList.get(segment.endNodeId) || [];
    reverseList.push({ targetNodeId: segment.startNodeId, segment });
    adjList.set(segment.endNodeId, reverseList);
  }

  // Dijkstra search
  const distances = new Map<string, number>();
  const previous = new Map<string, { nodeId: string; segment: RoadSegment } | null>();
  const pq: PriorityQueueItem[] = [];

  for (const node of GRAPH_NODES) {
    distances.set(node.id, Infinity);
    previous.set(node.id, null);
  }

  distances.set(startNodeId, 0);
  pq.push({ nodeId: startNodeId, cost: 0 });

  while (pq.length > 0) {
    // Sort ascending by cost
    pq.sort((a, b) => a.cost - b.cost);
    const current = pq.shift()!;

    if (current.nodeId === endNodeId) {
      break;
    }

    if (current.cost > (distances.get(current.nodeId) || Infinity)) {
      continue;
    }

    const neighbors = adjList.get(current.nodeId) || [];
    for (const neighbor of neighbors) {
      const edgeCost = calculateEdgeCost(neighbor.segment, routeType);
      const newDist = current.cost + edgeCost;

      if (newDist < (distances.get(neighbor.targetNodeId) || Infinity)) {
        distances.set(neighbor.targetNodeId, newDist);
        previous.set(neighbor.targetNodeId, { nodeId: current.nodeId, segment: neighbor.segment });
        pq.push({ nodeId: neighbor.targetNodeId, cost: newDist });
      }
    }
  }

  // Reconstruct path
  const pathSegments: RoadSegment[] = [];
  let curr = endNodeId;

  while (curr !== startNodeId) {
    const prevEntry = previous.get(curr);
    if (!prevEntry) {
      break; // No path found
    }
    pathSegments.unshift(prevEntry.segment);
    curr = prevEntry.nodeId;
  }

  return pathSegments;
}

export function generateAllRoutes(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  segmentsMap: Map<string, RoadSegment>
): RouteOption[] {
  const startNode = findNearestNode(startLat, startLng);
  const endNode = findNearestNode(endLat, endLng);

  const startId = startNode.id;
  let endId = endNode.id;

  // Handle same origin and destination node gracefully
  if (startId === endId) {
    const fallbackNode = GRAPH_NODES.find(n => n.id !== startId) || GRAPH_NODES[1];
    endId = fallbackNode.id;
  }

  const types: { type: RouteType; title: string; desc: string; color: string; hoverColor: string }[] = [
    {
      type: 'fastest',
      title: 'Fastest Route',
      desc: 'Minimizes travel duration regardless of waterlogging risk.',
      color: '#f59e0b', // Amber/Orange accent
      hoverColor: '#d97706'
    },
    {
      type: 'balanced',
      title: 'Balanced Route',
      desc: 'Optimizes travel time while bypassing high-risk flooded roads.',
      color: '#0284c7', // Sky Blue / Navy accent
      hoverColor: '#0369a1'
    },
    {
      type: 'safest',
      title: 'Safest Route',
      desc: 'Prioritizes maximum flood safety via elevated ridge corridors.',
      color: '#10b981', // Emerald Teal accent
      hoverColor: '#059669'
    }
  ];

  const rawRoutes = types.map(t => {
    let segments = findRoute(startId, endId, segmentsMap, t.type);

    // Fallback if graph path search returned empty
    if (segments.length === 0) {
      segments = Array.from(segmentsMap.values()).slice(0, 3);
    }

    const totalDistanceKm = Number(
      segments.reduce((acc, s) => acc + s.distanceKm, 0).toFixed(1)
    );

    const totalTimeMinutes = Math.round(
      segments.reduce((acc, s) => acc + s.currentTravelTimeMinutes, 0)
    );

    const avgRiskScore = Math.round(
      segments.reduce((acc, s) => acc + s.riskScore, 0) / (segments.length || 1)
    );

    const totalExposureScore = Math.round(
      segments.reduce((acc, s) => acc + (s.riskScore * s.distanceKm), 0)
    );

    let riskCategory: 'low' | 'moderate' | 'high' | 'extreme';
    if (avgRiskScore < 30) riskCategory = 'low';
    else if (avgRiskScore < 55) riskCategory = 'moderate';
    else if (avgRiskScore < 75) riskCategory = 'high';
    else riskCategory = 'extreme';

    return {
      type: t.type,
      title: t.title,
      description: t.desc,
      totalDistanceKm,
      totalTimeMinutes,
      averageRiskScore: avgRiskScore,
      totalExposureScore,
      riskCategory,
      segments,
      isRecommended: false,
      color: t.color,
      hoverColor: t.hoverColor
    };
  });

  // Calculate dynamic recommendation:
  // We evaluate utility: Cost = TotalTime + (ExposureWeight * TotalExposureScore)
  let bestRouteType: RouteType = 'balanced';
  let minUtilityCost = Infinity;

  for (const r of rawRoutes) {
    // Utility score balancing time (minutes) and exposure risk
    const utility = r.totalTimeMinutes + (r.averageRiskScore * 0.45);
    if (utility < minUtilityCost) {
      minUtilityCost = utility;
      bestRouteType = r.type;
    }
  }

  return rawRoutes.map(r => ({
    ...r,
    isRecommended: r.type === bestRouteType
  }));
}
