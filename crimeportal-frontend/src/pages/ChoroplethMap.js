import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function ChoroplethMap({ stateData, onSelectState }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(leafletMap.current);

      fetch("/india_states.geojson")
        .then(res => res.json())
        .then(geojson => {
          L.geoJSON(geojson, {
            style: feature => {
              const stateName = feature.properties.NAME_1;
              const crime = stateData.find(s => s.State === stateName);
              const intensity = crime ? crime.Total : 0;
              return {
                fillColor: intensity > 1000 ? "#ff0000" : "#4caf50",
                weight: 1,
                color: "#333",
                fillOpacity: 0.6
              };
            },
            onEachFeature: (feature, layer) => {
              const stateName = feature.properties.NAME_1;
              const crime = stateData.find(s => s.State === stateName);
              layer.bindTooltip(
                crime
                  ? `${stateName}<br>Total: ${crime.Total}<br>Violent: ${crime.Violent}`
                  : `${stateName}<br>No data`
              );
              layer.on("click", () => {
                if (crime) onSelectState(crime);
              });
            }
          }).addTo(leafletMap.current);
        });
    }
  }, [stateData, onSelectState]);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
}

export default ChoroplethMap;