import { GraphNode, LocationPoint, RoadSegment } from '../types/navigation';

// Sample locations in Rourkela area
export const SAMPLE_LOCATIONS: LocationPoint[] = [
  {
    id: 'nit_rourkela',
    name: 'NIT Rourkela Main Campus',
    shortName: 'NIT Rourkela',
    lat: 22.2530,
    lng: 84.9010,
    address: 'Sector 1, Rourkela, Odisha 769008'
  },
  {
    id: 'rourkela_station',
    name: 'Rourkela Junction Railway Station',
    shortName: 'Railway Station',
    lat: 22.2312,
    lng: 84.8515,
    address: 'Railway Colony, Rourkela, Odisha 769001'
  },
  {
    id: 'sector_2_market',
    name: 'Sector 2 Commercial Market',
    shortName: 'Sector 2 Market',
    lat: 22.2475,
    lng: 84.8780,
    address: 'Sector 2, Rourkela, Odisha 769006'
  },
  {
    id: 'chhend_colony',
    name: 'Chhend Housing Colony',
    shortName: 'Chhend Colony',
    lat: 22.2380,
    lng: 84.8320,
    address: 'Chhend, Rourkela, Odisha 769015'
  },
  {
    id: 'planetarium',
    name: 'Dr. A.P.J. Abdul Kalam Planetarium',
    shortName: 'Planetarium',
    lat: 22.2590,
    lng: 84.8910,
    address: 'Biju Patnaik Sector, Rourkela, Odisha 769008'
  },
  {
    id: 'panposh_square',
    name: 'Panposh Bridge & Chowk',
    shortName: 'Panposh Chowk',
    lat: 22.2190,
    lng: 84.8210,
    address: 'Panposh, Rourkela, Odisha 769004'
  }
];

export const GRAPH_NODES: GraphNode[] = [
  { id: 'N_NIT', name: 'NIT Gate Junction', lat: 22.2530, lng: 84.9010 },
  { id: 'N_PLANET', name: 'Planetarium Square', lat: 22.2590, lng: 84.8910 },
  { id: 'N_SEC1', name: 'Sector 1 Ring Road North', lat: 22.2560, lng: 84.8950 },
  { id: 'N_SEC2', name: 'Sector 2 Central Hub', lat: 22.2475, lng: 84.8780 },
  { id: 'N_RING_E', name: 'Ring Road East Underpass', lat: 22.2420, lng: 84.8890 },
  { id: 'N_AMBAGAN', name: 'Ambagan Chowk (Low Terrain)', lat: 22.2395, lng: 84.8650 },
  { id: 'N_STATION', name: 'Rourkela Station Plaza', lat: 22.2312, lng: 84.8515 },
  { id: 'N_MAIN_RD', name: 'Main Road Flyover North', lat: 22.2360, lng: 84.8570 },
  { id: 'N_CHHEND', name: 'Chhend Bypass Junction', lat: 22.2380, lng: 84.8320 },
  { id: 'N_PANPOSH', name: 'Panposh River Basin Chowk', lat: 22.2190, lng: 84.8210 },
  { id: 'N_HILL_RIDGE', name: 'Beldih Ridge Elevated Highway', lat: 22.2510, lng: 84.8610 },
  { id: 'N_SECTOR_5', name: 'Sector 5 North Corridor', lat: 22.2610, lng: 84.8720 },
];

export const BASE_ROAD_SEGMENTS: Omit<RoadSegment, 'riskScore' | 'riskCategory' | 'currentTravelTimeMinutes'>[] = [
  {
    id: 'seg_1',
    name: 'Sector 1 Main Arterial',
    startNodeId: 'N_NIT',
    endNodeId: 'N_SEC1',
    distanceKm: 0.9,
    baseTravelTimeMinutes: 2.0,
    coordinates: [
      [22.2530, 84.9010],
      [22.2545, 84.8985],
      [22.2560, 84.8950]
    ],
    factors: {
      terrainSusceptibility: 0.2,   // Higher ground
      drainageSusceptibility: 0.25, // Good drains
      historicalSusceptibility: 0.15
    }
  },
  {
    id: 'seg_2',
    name: 'Ring Road East Low Causeway',
    startNodeId: 'N_NIT',
    endNodeId: 'N_RING_E',
    distanceKm: 1.8,
    baseTravelTimeMinutes: 3.5,
    coordinates: [
      [22.2530, 84.9010],
      [22.2480, 84.8980],
      [22.2450, 84.8930],
      [22.2420, 84.8890]
    ],
    factors: {
      terrainSusceptibility: 0.85,  // Low terrain depression!
      drainageSusceptibility: 0.80, // Poor drainage culvert
      historicalSusceptibility: 0.90 // Historically heavily flooded during monsoons
    }
  },
  {
    id: 'seg_3',
    name: 'Planetarium Bypass Road',
    startNodeId: 'N_NIT',
    endNodeId: 'N_PLANET',
    distanceKm: 1.2,
    baseTravelTimeMinutes: 2.5,
    coordinates: [
      [22.2530, 84.9010],
      [22.2560, 84.8980],
      [22.2590, 84.8910]
    ],
    factors: {
      terrainSusceptibility: 0.3,
      drainageSusceptibility: 0.3,
      historicalSusceptibility: 0.2
    }
  },
  {
    id: 'seg_4',
    name: 'Sector 2 Commercial Link',
    startNodeId: 'N_SEC1',
    endNodeId: 'N_SEC2',
    distanceKm: 2.1,
    baseTravelTimeMinutes: 4.0,
    coordinates: [
      [22.2560, 84.8950],
      [22.2520, 84.8870],
      [22.2475, 84.8780]
    ],
    factors: {
      terrainSusceptibility: 0.45,
      drainageSusceptibility: 0.50,
      historicalSusceptibility: 0.40
    }
  },
  {
    id: 'seg_5',
    name: 'Beldih Ridge Elevated Highway',
    startNodeId: 'N_PLANET',
    endNodeId: 'N_HILL_RIDGE',
    distanceKm: 3.2,
    baseTravelTimeMinutes: 4.5,
    coordinates: [
      [22.2590, 84.8910],
      [22.2580, 84.8790],
      [22.2550, 84.8690],
      [22.2510, 84.8610]
    ],
    factors: {
      terrainSusceptibility: 0.05, // High ridge, zero flood prone!
      drainageSusceptibility: 0.10,
      historicalSusceptibility: 0.05
    }
  },
  {
    id: 'seg_6',
    name: 'Ambagan Low Dip Boulevard',
    startNodeId: 'N_SEC2',
    endNodeId: 'N_AMBAGAN',
    distanceKm: 1.6,
    baseTravelTimeMinutes: 3.0,
    coordinates: [
      [22.2475, 84.8780],
      [22.2435, 84.8710],
      [22.2395, 84.8650]
    ],
    factors: {
      terrainSusceptibility: 0.95, // Extreme depression!
      drainageSusceptibility: 0.88, // Underpowered storm drain
      historicalSusceptibility: 0.92 // High flood risk under heavy rain
    }
  },
  {
    id: 'seg_7',
    name: 'Ring East to Ambagan Connector',
    startNodeId: 'N_RING_E',
    endNodeId: 'N_AMBAGAN',
    distanceKm: 2.6,
    baseTravelTimeMinutes: 4.8,
    coordinates: [
      [22.2420, 84.8890],
      [22.2400, 84.8770],
      [22.2395, 84.8650]
    ],
    factors: {
      terrainSusceptibility: 0.70,
      drainageSusceptibility: 0.75,
      historicalSusceptibility: 0.65
    }
  },
  {
    id: 'seg_8',
    name: 'Station Approach Flyover',
    startNodeId: 'N_AMBAGAN',
    endNodeId: 'N_MAIN_RD',
    distanceKm: 0.9,
    baseTravelTimeMinutes: 2.0,
    coordinates: [
      [22.2395, 84.8650],
      [22.2375, 84.8610],
      [22.2360, 84.8570]
    ],
    factors: {
      terrainSusceptibility: 0.60,
      drainageSusceptibility: 0.55,
      historicalSusceptibility: 0.50
    }
  },
  {
    id: 'seg_9',
    name: 'Station Plaza South Access',
    startNodeId: 'N_MAIN_RD',
    endNodeId: 'N_STATION',
    distanceKm: 0.7,
    baseTravelTimeMinutes: 1.5,
    coordinates: [
      [22.2360, 84.8570],
      [22.2335, 84.8540],
      [22.2312, 84.8515]
    ],
    factors: {
      terrainSusceptibility: 0.40,
      drainageSusceptibility: 0.35,
      historicalSusceptibility: 0.30
    }
  },
  {
    id: 'seg_10',
    name: 'Hill Ridge West Link to Station',
    startNodeId: 'N_HILL_RIDGE',
    endNodeId: 'N_MAIN_RD',
    distanceKm: 1.9,
    baseTravelTimeMinutes: 3.2,
    coordinates: [
      [22.2510, 84.8610],
      [22.2440, 84.8590],
      [22.2360, 84.8570]
    ],
    factors: {
      terrainSusceptibility: 0.15, // Elevated hill road, very safe
      drainageSusceptibility: 0.20,
      historicalSusceptibility: 0.10
    }
  },
  {
    id: 'seg_11',
    name: 'Chhend High Corridor',
    startNodeId: 'N_HILL_RIDGE',
    endNodeId: 'N_CHHEND',
    distanceKm: 3.3,
    baseTravelTimeMinutes: 5.0,
    coordinates: [
      [22.2510, 84.8610],
      [22.2460, 84.8450],
      [22.2380, 84.8320]
    ],
    factors: {
      terrainSusceptibility: 0.10,
      drainageSusceptibility: 0.15,
      historicalSusceptibility: 0.10
    }
  },
  {
    id: 'seg_12',
    name: 'Chhend to Station Link',
    startNodeId: 'N_CHHEND',
    endNodeId: 'N_STATION',
    distanceKm: 2.3,
    baseTravelTimeMinutes: 3.8,
    coordinates: [
      [22.2380, 84.8320],
      [22.2340, 84.8420],
      [22.2312, 84.8515]
    ],
    factors: {
      terrainSusceptibility: 0.30,
      drainageSusceptibility: 0.35,
      historicalSusceptibility: 0.25
    }
  },
  {
    id: 'seg_13',
    name: 'Panposh Low Riverbed Parkway',
    startNodeId: 'N_CHHEND',
    endNodeId: 'N_PANPOSH',
    distanceKm: 2.4,
    baseTravelTimeMinutes: 3.6,
    coordinates: [
      [22.2380, 84.8320],
      [22.2280, 84.8260],
      [22.2190, 84.8210]
    ],
    factors: {
      terrainSusceptibility: 0.90, // River floodplain!
      drainageSusceptibility: 0.85,
      historicalSusceptibility: 0.95
    }
  },
  {
    id: 'seg_14',
    name: 'Sector 5 Ridge Expressway',
    startNodeId: 'N_SEC1',
    endNodeId: 'N_SECTOR_5',
    distanceKm: 2.5,
    baseTravelTimeMinutes: 3.5,
    coordinates: [
      [22.2560, 84.8950],
      [22.2590, 84.8830],
      [22.2610, 84.8720]
    ],
    factors: {
      terrainSusceptibility: 0.10,
      drainageSusceptibility: 0.15,
      historicalSusceptibility: 0.05
    }
  },
  {
    id: 'seg_15',
    name: 'Sector 5 to Hill Ridge Link',
    startNodeId: 'N_SECTOR_5',
    endNodeId: 'N_HILL_RIDGE',
    distanceKm: 1.6,
    baseTravelTimeMinutes: 2.4,
    coordinates: [
      [22.2610, 84.8720],
      [22.2560, 84.8660],
      [22.2510, 84.8610]
    ],
    factors: {
      terrainSusceptibility: 0.15,
      drainageSusceptibility: 0.20,
      historicalSusceptibility: 0.10
    }
  }
];
