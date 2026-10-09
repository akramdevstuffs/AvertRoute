import React, { useState, useEffect, useCallback } from 'react';
import { LocationPoint, RainfallPreset, RerouteEvent, RoadSegment, RouteOption, WaterloggingReport } from './types/navigation';
import { SAMPLE_LOCATIONS } from './services/roadGraph';
import { apiClient } from './services/apiClient';

import { TopNav } from './components/TopNav';
import { RoutePlanner } from './components/RoutePlanner';
import { RainfallControl } from './components/RainfallControl';
import { RouteComparison } from './components/RouteComparison';
import { RouteImpactSummary } from './components/RouteImpactSummary';
import { RoadRiskInspector } from './components/RoadRiskInspector';
import { ReroutingNotification } from './components/ReroutingNotification';
import { InteractiveMap } from './components/InteractiveMap';
import { ReportWaterloggingModal } from './components/ReportWaterloggingModal';
import { RiskInsightsModal } from './components/RiskInsightsModal';
import { Layers } from 'lucide-react';

export function App() {
  const [origin, setOrigin] = useState<LocationPoint>(SAMPLE_LOCATIONS[0]); // NIT Rourkela
  const [destination, setDestination] = useState<LocationPoint>(SAMPLE_LOCATIONS[1]); // Railway Station
  const [rainfallPreset, setRainfallPreset] = useState<RainfallPreset>('normal');
  const [rainfallMmHr, setRainfallMmHr] = useState<number>(5);

  const [allSegments, setAllSegments] = useState<Map<string, RoadSegment>>(new Map());
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteType, setSelectedRouteType] = useState<RouteOption['type']>('balanced');
  const [selectedSegment, setSelectedSegment] = useState<RoadSegment | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rerouteEvent, setRerouteEvent] = useState<RerouteEvent | null>(null);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);

  // Recalculate routes & risks
  const calculateNavigation = useCallback(async (
    currentOrigin: LocationPoint,
    currentDest: LocationPoint,
    currentRainfall: number,
    prevRoutes?: RouteOption[]
  ) => {
    setIsLoading(true);

    const { routes: newRoutes, segments: newSegments } = await apiClient.getRoutes({
      originId: currentOrigin.id,
      destId: currentDest.id,
      rainfallMmHr: currentRainfall
    });

    setAllSegments(newSegments);
    setRoutes(newRoutes);

    // If selected segment exists, update its details with new risk calculations
    if (selectedSegment) {
      const updatedSeg = newSegments.get(selectedSegment.id);
      if (updatedSeg) {
        setSelectedSegment(updatedSeg);
      }
    }

    // Determine dynamic recommended route
    const newRecommended = newRoutes.find(r => r.isRecommended) || newRoutes[1];
    
    // Check if rainfall change caused recommended route to change
    if (prevRoutes && prevRoutes.length > 0) {
      const prevRecommended = prevRoutes.find(r => r.isRecommended) || prevRoutes[1];

      if (prevRecommended.type !== newRecommended.type) {
        // Find most dramatically impacted segment
        let worstAffectedName = 'Ambagan Causeway';
        let oldRisk = 22;
        let newRisk = 82;

        newSegments.forEach((seg) => {
          if (seg.riskScore >= 75) {
            worstAffectedName = seg.name;
            newRisk = seg.riskScore;
            oldRisk = Math.max(15, newRisk - 55);
          }
        });

        const fastest = newRoutes.find(r => r.type === 'fastest') || newRoutes[0];
        const timeDiff = newRecommended.totalTimeMinutes - fastest.totalTimeMinutes;
        const exposureSavings = Math.round(((fastest.totalExposureScore - newRecommended.totalExposureScore) / (fastest.totalExposureScore || 1)) * 100);

        setRerouteEvent({
          id: `reroute_${Date.now()}`,
          timestamp: new Date(),
          previousRecommendedType: prevRecommended.type,
          newRecommendedType: newRecommended.type,
          affectedSegmentName: worstAffectedName,
          oldSegmentRisk: oldRisk,
          newSegmentRisk: newRisk,
          timeDiffMinutes: timeDiff,
          exposureSavingsPercent: exposureSavings > 0 ? exposureSavings : 55
        });

        // Auto select newly recommended route
        setSelectedRouteType(newRecommended.type);
      }
    }

    setIsLoading(false);
  }, [selectedSegment]);

  // Initial Calculation
  useEffect(() => {
    calculateNavigation(origin, destination, rainfallMmHr);
  }, []);

  // Handle Preset Rainfall Change
  const handlePresetChange = (preset: RainfallPreset) => {
    let mmHr = 5;
    if (preset === 'heavy') mmHr = 35;
    if (preset === 'extreme') mmHr = 75;

    setRainfallPreset(preset);
    setRainfallMmHr(mmHr);
    calculateNavigation(origin, destination, mmHr, routes);
  };

  // Handle Slider Rainfall Change
  const handleSliderChange = (mmHr: number) => {
    setRainfallMmHr(mmHr);
    if (mmHr < 20) setRainfallPreset('normal');
    else if (mmHr < 60) setRainfallPreset('heavy');
    else setRainfallPreset('extreme');

    calculateNavigation(origin, destination, mmHr, routes);
  };

  // Location swapping
  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    calculateNavigation(destination, temp, rainfallMmHr);
  };

  // Selected route object
  const selectedRoute = routes.find(r => r.type === selectedRouteType) || routes[0] || {
    type: 'balanced',
    title: 'Balanced Route',
    description: '',
    totalDistanceKm: 4.8,
    totalTimeMinutes: 15,
    averageRiskScore: 35,
    totalExposureScore: 168,
    riskCategory: 'moderate',
    segments: [],
    isRecommended: true,
    color: '#0284c7',
    hoverColor: '#0369a1'
  };

  const fastestRoute = routes.find(r => r.type === 'fastest') || selectedRoute;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Navigation Bar */}
      <TopNav
        rainfallPreset={rainfallPreset}
        rainfallMmHr={rainfallMmHr}
        isDemoMode={apiClient.isDemoMode}
        onOpenInsights={() => setIsInsightsOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1920px] mx-auto w-full">
        {/* Left Sidebar Controls (3-4 columns ~ 340-390px equivalent) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4 flex flex-col justify-start">
          {/* Route Planner Panel */}
          <RoutePlanner
            origin={origin}
            destination={destination}
            onSelectOrigin={(loc) => {
              setOrigin(loc);
              calculateNavigation(loc, destination, rainfallMmHr);
            }}
            onSelectDestination={(loc) => {
              setDestination(loc);
              calculateNavigation(origin, loc, rainfallMmHr);
            }}
            onSwapLocations={handleSwapLocations}
            onCalculateRoutes={() => calculateNavigation(origin, destination, rainfallMmHr)}
            isLoading={isLoading}
          />

          {/* Rainfall Scenario Control */}
          <RainfallControl
            currentPreset={rainfallPreset}
            rainfallMmHr={rainfallMmHr}
            onPresetChange={handlePresetChange}
            onSliderChange={handleSliderChange}
          />

          {/* Road Risk Inspector Panel */}
          <RoadRiskInspector
            segment={selectedSegment}
            rainfallMmHr={rainfallMmHr}
            rainfallPreset={rainfallPreset}
            onClose={() => setSelectedSegment(null)}
          />
        </div>

        {/* Center/Right Main Map & Dashboard Area (8-9 columns) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4 flex flex-col">
          {/* Dynamic Rerouting Alert Toast if active */}
          {rerouteEvent && (
            <ReroutingNotification
              event={rerouteEvent}
              onDismiss={() => setRerouteEvent(null)}
            />
          )}

          {/* Interactive Map view */}
          <div className="flex-1 min-h-[440px] lg:min-h-[500px] relative">
            <InteractiveMap
              origin={origin}
              destination={destination}
              routes={routes}
              selectedRouteType={selectedRouteType}
              allSegments={allSegments}
              selectedSegmentId={selectedSegment?.id || null}
              onSelectRoute={(type) => setSelectedRouteType(type)}
              onSelectSegment={(segment) => setSelectedSegment(segment)}
            />
          </div>

          {/* Bottom Route Options & Impact Summary */}
          <div className="space-y-4 pt-1">
            <RouteComparison
              routes={routes}
              selectedRouteType={selectedRouteType}
              onSelectRoute={(type) => setSelectedRouteType(type)}
            />

            <RouteImpactSummary
              selectedRoute={selectedRoute}
              fastestRoute={fastestRoute}
              rainfallMmHr={rainfallMmHr}
            />
          </div>
        </div>
      </main>

      {/* Report Waterlogging Modal */}
      <ReportWaterloggingModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={(report) => {
          apiClient.submitReport(report);
        }}
      />

      {/* Risk Insights Modal */}
      <RiskInsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        rainfallMmHr={rainfallMmHr}
      />
    </div>
  );
}

export default App;
