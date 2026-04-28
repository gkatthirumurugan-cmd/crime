import detectiveImg from "../assets/detective.png";

import { useEffect, useState, useMemo } from "react";
import IndiaMap from "../components/IndiaMap";
import CrimeCharts from "../components/CrimeCharts";
import CrimeTable from "../components/CrimeTable";
import StatsCards from "../components/StatsCards";
import CrimePrediction from "../components/CrimePrediction";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "../styles/dashboard.css";

export default function Dashboard() {
  const API_BASE = "http://127.0.0.1:8001";

  const [crimes, setCrimes] = useState([]);
  const [stateSummaries, setStateSummaries] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
  let timer;

  const handleScroll = () => {
    setIsScrolling(true);

    clearTimeout(timer);

    timer = setTimeout(() => {
      setIsScrolling(false);
    }, 250);
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  // ✅ Load all dashboard data
  const loadDashboardData = async () => {
    try {
      const crimeRes = await fetch(`${API_BASE}/crimes`);
      const crimeData = await crimeRes.json();

      const normalized = crimeData.map((c) => ({
  reportNumber: c.Report_Number || c["Report Number"] || "",
  city: c.City || "",
  crimeDescription: c.Crime_Description || c["Crime Description"] || "Unknown",
  crimeDomain: c.Crime_Domain || c["Crime Domain"] || "Other Crime",
  weaponUsed: c.Weapon_Used || c["Weapon Used"] || "Other",
  victimAge: c.Victim_Age || c["Victim Age"] || "-",
  victimGender: c.Victim_Gender || c["Victim Gender"] || "-",
  caseClosed:
  String(c.Case_Closed || c["Case Closed"] || "No")
    .toLowerCase()
    .trim() === "yes",
  state: c.State || c.City || "Unknown"
}));

      setCrimes(normalized);

      const stateRes = await fetch(`${API_BASE}/state-crimes`);
      const stateData = await stateRes.json();

      setStateSummaries(stateData);
    } catch (error) {
      console.log(error);
      setCrimes([]);
      setStateSummaries([]);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // ✅ Filter by selected state
  const filteredRecords = useMemo(() => {
    if (!selectedState) return crimes;
    return crimes.filter((r) => r.state === selectedState);
  }, [crimes, selectedState]);

  const navigate = useNavigate();


  
  
  return (
    <div className="min-h-screen bg-background pb-50">
      {/* HEADER */}
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold text-foreground">
          India Crime Dashboard
        </h1>
        <p className="text-xs text-muted-foreground">
          {crimes.length.toLocaleString()} records across{" "}
          {stateSummaries.length} states
        </p>
      </header>

      <div className="anime-boy">
        <img
          src={detectiveImg}
          alt="detective"
          className={isScrolling ? "detective-img searching" : "detective-img"}
        />
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        <StatsCards
          records={filteredRecords}
          title={
            selectedState
              ? `${selectedState} Overview`
              : "National Overview"
          }
        />

        {/* Prediction */}
        <CrimePrediction records={crimes} />

        <div className="xl:col-span-2 glass-card p-4 mt-4">
          <button
            className="btn btn-success"
            onClick={() => navigate("/crime-manager")}
          >
            Add Data
          </button>
        </div>

        {/* Map + State Ranking */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-4">
          <div className="xl:col-span-3 mb-4">
            <IndiaMap
              stateSummaries={stateSummaries}
              selectedState={selectedState}
              onSelectState={setSelectedState}
            />
          </div>

          <div
            className="xl:col-span-2 glass-card p-4"
            style={{ marginBottom: "30px" }}
          >
            <h3 className="text-lg font-semibold mb-4">
              {selectedState
                ? `Cities in ${selectedState}`
                : "States by Crime Count"}
            </h3>

            {selectedState && (
              <button
                className="mt-2 mb-3 px-3 py-1 bg-gray-700 text-white rounded"
                onClick={() => setSelectedState(null)}
              >
                Back to India Map
              </button>
            )}

            {!selectedState ? (
              <div className="states-list">
                {stateSummaries
                  .sort((a, b) => b.totalCrimes - a.totalCrimes)
                  .map((s, i) => (
                    <div
                      key={s.state}
                      className="state-row cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedState(s.state)}
                    >
                      <span className="state-rank">{i + 1}</span>
                      <span className="state-name">{s.state}</span>
                      <span className="state-count">
                        {s.totalCrimes.toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{ paddingTop: "30px" }}>
                <CityList records={filteredRecords} />

                <div className="mt-4">
                  <CrimeCharts records={filteredRecords} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-4 max-h-[400px] overflow-y-auto">
          <CrimeTable records={filteredRecords} />
        </div>
      </main>

      <footer className="bg-lightskyblue text-black text-center py-3 mt-4">
        <p className="mb-1">© 2026 India Crime Dashboard</p>
        <small>Smart Crime Analytics System</small>
      </footer>
    </div>
  );
}

// CITY LIST
function CityList({ records }) {
  const map = new Map();

  records.forEach((r) =>
    map.set(r.city, (map.get(r.city) || 0) + 1)
  );

  const cities = Array.from(map, ([city, count]) => ({
    city,
    count,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="list-group animate__animated animate__fadeIn">
      {cities.map((c) => (
        <div key={c.city} className="flex justify-between py-1">
          <span>{c.city}</span>
          <span>{c.count}</span>
        </div>
      ))}
    </div>
  );
}

