import { useState, useMemo } from "react";

export default function CrimePrediction({ records = [] }) {
  const [city, setCity] = useState("");
  const [crimeType, setCrimeType] = useState("");
  const [year, setYear] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const [showCityList, setShowCityList] = useState(false);
  const [showCrimeList, setShowCrimeList] = useState(false);
  const [showYearList, setShowYearList] = useState(false);

  /* =========================
     OPTIONS
  ========================= */
  const cityOptions = useMemo(() => {
    return [...new Set(records.map((r) => r.city).filter(Boolean))].sort();
  }, [records]);

  const crimeOptions = useMemo(() => {
    return [...new Set(records.map((r) => r.crimeDescription).filter(Boolean))].sort();
  }, [records]);


  const yearOptions = [
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025"
  ];


  /* =========================
     FILTERED SEARCH
  ========================= */
  const filteredCities = cityOptions.filter((item) =>
    item.toLowerCase().includes(city.toLowerCase())
  );

  const filteredCrimes = crimeOptions.filter((item) =>
    item.toLowerCase().includes(crimeType.toLowerCase())
  );

  const filteredYears = yearOptions.filter((item) =>
    item.toLowerCase().includes(year.toLowerCase())
  );

  /* =========================
     PREDICT
  ========================= */
  const handlePredict = () => {
    
    setError("");
    setPrediction(null);

    if (!city || !crimeType || !year) {
      setError("Please fill all fields");
      return;
    }

    fetch("http://127.0.0.1:8001/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city,
        crimeType,
        year: parseInt(year),
      }),
    })
      .then((res) => res.json())
      .then((data) => setPrediction(data))
      .catch(() => setError("Prediction failed"));
  };

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold mb-4">
        Crime Prediction
      </h3>

      {/* CITY */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          City
        </label>

        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setShowCityList(true);
          }}
          onFocus={() => setShowCityList(true)}
          style={{
            width: "280px",
            padding: "10px",
            borderRadius: "10px",
            color: "black"
          }}
        />

        {showCityList && city && (
          <div
            style={{
              position: "absolute",
              background: "#fff",
              width: "280px",
              maxHeight: "180px",
              overflowY: "auto",
              borderRadius: "10px",
              marginTop: "5px",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            {filteredCities.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setCity(item);
                  setShowCityList(false);
                }}
                style={{
                  padding: "10px",
                  cursor: "pointer"
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CRIME TYPE */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Crime Type
        </label>

        <input
          type="text"
          placeholder="Search crime type..."
          value={crimeType}
          onChange={(e) => {
            setCrimeType(e.target.value);
            setShowCrimeList(true);
          }}
          onFocus={() => setShowCrimeList(true)}
          style={{
            width: "280px",
            padding: "10px",
            borderRadius: "10px",
            color: "black"
          }}
        />

        {showCrimeList && crimeType && (
          <div
            style={{
              position: "absolute",
              background: "#fff",
              width: "280px",
              maxHeight: "180px",
              overflowY: "auto",
              borderRadius: "10px",
              marginTop: "5px",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            {filteredCrimes.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setCrimeType(item);
                  setShowCrimeList(false);
                }}
                style={{
                  padding: "10px",
                  cursor: "pointer"
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YEAR */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Year
        </label>

        <input
          type="text"
          placeholder="Search year..."
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setShowYearList(true);
          }}
          onFocus={() => setShowYearList(true)}
          style={{
            width: "280px",
            padding: "10px",
            borderRadius: "10px",
            background: "#8e9bc7",
            color: "black",
            border: "1px solid #4c5678",
            outline: "none"
          }}
        />

        {showYearList && year && (
          <div
            style={{
              position: "absolute",
              background: "#ffffff",
              width: "280px",
              maxHeight: "180px",
              overflowY: "auto",
              borderRadius: "10px",
              marginTop: "5px",
              zIndex: 1000,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
            }}
          >
            {filteredYears.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setYear(item);
                  setShowYearList(false);
                }}
                style={{
                  padding: "10px",
                  cursor: "pointer"
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BUTTON */}
      <button onClick={handlePredict}>Predict</button>

      {/* ERROR */}
      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>
          {error}
        </p>
      )}

      {/* RESULT */}
      {prediction && (
        <div className="prediction space-y-1">
          <p><b>Level:</b> {prediction.level}</p>
          <p><b>Estimated Crime Rate:</b> {prediction.estimated_rate}</p>
          <p><b>Cases:</b> {prediction.cases}</p>
          <p><b>Population:</b> {prediction.population}</p>
        </div>
      )}
    </div>
  );
}