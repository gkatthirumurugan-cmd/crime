import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function CrimeMap({ crimes, onFilter }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map only once
    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
      }).addTo(leafletMap.current);
    }

    // Clear old markers before adding new ones
    leafletMap.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        leafletMap.current.removeLayer(layer);
      }
    });

    // Add markers if lat/lon exist
    crimes.forEach(c => {
      if (c.lat && c.lon) {
        L.marker([c.lat, c.lon])
          .addTo(leafletMap.current)
          .bindPopup(`${c.City}: ${c.Crime_Description}`);
      }
    });
  }, [crimes]);

  // ✅ This is where your GeoJSON useEffect goes
  useEffect(() => {
    if (!leafletMap.current) return;

    fetch("/india_states.geojson")
      .then(res => res.json())
      .then(geojson => {
        L.geoJSON(geojson, {
          onEachFeature: (feature, layer) => {
            layer.on("click", () => {
              const stateName = feature.properties.NAME_1; // depends on your GeoJSON
              const filtered = crimes.filter(c => c.State === stateName);
              console.log("Crimes in", stateName, filtered);

              // Pass filtered crimes back to parent (Dashboard)
              if (onFilter) {
                onFilter(filtered, stateName);
              }
            });
          },
          style: {
            color: "#333",
            weight: 1,
            fillColor: "#4caf50",
            fillOpacity: 0.4
          }
        }).addTo(leafletMap.current);
      });
  }, [crimes, onFilter]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
}

export default CrimeMap;