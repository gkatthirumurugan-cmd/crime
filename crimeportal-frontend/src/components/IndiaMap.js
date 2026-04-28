import { useEffect, useState, useMemo, useCallback } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { feature } from "topojson-client";

// Merge districts into states
function mergeDistrictsToStates(topo) {
  const districts = feature(topo, topo.objects.districts);
  const stateMap = new Map();

  districts.features.forEach(f => {
    const stateName = f.properties?.st_nm || "Unknown";
    if (!stateMap.has(stateName)) stateMap.set(stateName, []);
    stateMap.get(stateName).push(f);
  });

  const stateFeatures = [];
  stateMap.forEach((features, stateName) => {
    const polygons = [];
    features.forEach(f => {
      if (f.geometry.type === "Polygon") polygons.push(f.geometry.coordinates);
      else if (f.geometry.type === "MultiPolygon") f.geometry.coordinates.forEach(c => polygons.push(c));
    });
    stateFeatures.push({
      type: "Feature",
      properties: { st_nm: stateName, st_code: features[0].properties?.st_code },
      geometry: { type: "MultiPolygon", coordinates: polygons },
    });
  });

  return { type: "FeatureCollection", features: stateFeatures };
}

function getStateDistrictGeo(topo, stateName) {
  const districts = feature(topo, topo.objects.districts);
  return {
    type: "FeatureCollection",
    features: districts.features.filter(f => f.properties?.st_nm === stateName),
  };
}

export default function IndiaMap({ stateSummaries, onSelectState, selectedState }) {
  const [topoData, setTopoData] = useState(null);
  const [center, setCenter] = useState([78.9629, 22.5937]);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetch("/data/india_topo.json")
      .then(r => r.json())
      .then(data => setTopoData(data));
  }, []);

  const stateGeo = useMemo(() => topoData ? mergeDistrictsToStates(topoData) : null, [topoData]);
  const districtGeo = useMemo(() => (topoData && selectedState) ? getStateDistrictGeo(topoData, selectedState) : null, [topoData, selectedState]);

  const maxCrimes = useMemo(() => Math.max(...stateSummaries.map(s => s.totalCrimes), 1), [stateSummaries]);

  const getStateColor = useCallback(stateName => {
    const summary = stateSummaries.find(s => s.state === stateName);
    if (!summary) return "hsl(220, 14%, 18%)";
    const intensity = summary.totalCrimes / maxCrimes;
    const lightness = 20 + intensity * 35;
    const saturation = 30 + intensity * 42;
    return `hsl(162, ${saturation}%, ${lightness}%)`;
  }, [stateSummaries, maxCrimes]);

  const handleStateClick = useCallback(geo => {
    const stateName = geo.properties?.st_nm;
    if (!stateName) return;
    if (selectedState === stateName) {
      onSelectState(null);
      setCenter([78.9629, 22.5937]);
      setZoom(1);
    } else {
      onSelectState(stateName);
      const bounds = getBounds(geo);
      setCenter(bounds.center);
      setZoom(bounds.zoom);
    }
  }, [selectedState, onSelectState]);

  if (!topoData || !stateGeo) {
    return <div className="glass-card p-8 flex items-center justify-center h-[500px]">Loading map...</div>;
  }

  const geoToRender = selectedState && districtGeo ? districtGeo : stateGeo;

  return (
    <div className="glass-card p-4">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1000, center: [78.9629, 22.5937] }} style={{ width: "100%", height: "500px" }}>
        <ZoomableGroup center={center} zoom={zoom} minZoom={1} maxZoom={12}>
          <Geographies geography={geoToRender}>
            {({ geographies }) =>
              geographies.map(geo => {
                const name = geo.properties?.st_nm || geo.properties?.district || "";
                const isState = !selectedState;
                const summary = isState ? stateSummaries.find(s => s.state === name) : null;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => isState && handleStateClick(geo)}
                    style={{
                      default: { fill: isState ? getStateColor(name) : "hsl(162, 40%, 28%)", stroke: "hsl(220, 14%, 12%)", strokeWidth: selectedState ? 0.3 : 0.5 },
                      hover: { fill: "hsl(162, 72%, 55%)", stroke: "hsl(162, 72%, 46%)", strokeWidth: 1 },
                      pressed: { fill: "hsl(162, 72%, 40%)" },
                    }}
                  >
                    <title>{isState ? `${name}: ${summary?.totalCrimes || 0} crimes` : `${name} District`}</title>
                  </Geography>
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

function getBounds(geo) {
  const coords = [];
  const extractCoords = c => (typeof c[0] === "number" ? coords.push(c) : c.forEach(extractCoords));
  extractCoords(geo.geometry.coordinates);
  if (!coords.length) return { center: [78.9629, 22.5937], zoom: 1 };
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
  coords.forEach(([lng, lat]) => { minLng = Math.min(minLng, lng); maxLng = Math.max(maxLng, lng); minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat); });
  const centerLng = (minLng + maxLng) / 2, centerLat = (minLat + maxLat) / 2;
  const maxSpan = Math.max(maxLng - minLng, maxLat - minLat);
  let zoom = maxSpan < 2 ? 6 : maxSpan < 4 ? 4.5 : maxSpan < 6 ? 3.5 : maxSpan < 10 ? 2.5 : 2;
  return { center: [centerLng, centerLat], zoom };
}
