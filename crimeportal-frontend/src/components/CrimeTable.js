import { useState, useMemo } from "react";
import { Input } from "./ui/Input";
import { Search } from "lucide-react";

export default function CrimeTable({ records }) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // ✅ records already normalized in Dashboard.js
  const normalized = useMemo(
    () =>
      records.map((r) => ({
        reportNumber: r.reportNumber || "",
        crimeDescription: r.crimeDescription || "Unknown",
        city: r.city || "Unknown",
        crimeDomain: r.crimeDomain || "Other Crime",
        weaponUsed: r.weaponUsed || "Other",
        victimAge: r.victimAge || "-",
        victimGender: r.victimGender || "-",
        caseClosed: r.caseClosed || false,
      })),
    [records]
  );

  // ✅ Search
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return normalized.filter(
      (r) =>
        r.crimeDescription.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.crimeDomain.toLowerCase().includes(q) ||
        r.weaponUsed.toLowerCase().includes(q)
    );
  }, [normalized, search]);

  // ✅ Sort
  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];

      if (valA < valB)
        return sortConfig.direction === "asc" ? -1 : 1;

      if (valA > valB)
        return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });
  }, [filtered, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";

    if (
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const domainColor = (domain) => {
    switch (domain) {
      case "Violent Crime":
        return "badge badge-violent";

      case "Fire Accident":
        return "badge badge-fire";

      case "Traffic Fatality":
        return "badge badge-traffic";

      default:
        return "badge badge-other";
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="table-header">
        <h2 className="card-title">Crime Records</h2>

        <div className="search-bar">
          <Search className="search-icon" />

          <Input
            placeholder="Search crimes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => requestSort("crimeDescription")}>Crime</th>
              <th onClick={() => requestSort("city")}>City</th>
              <th onClick={() => requestSort("crimeDomain")}>Domain</th>
              <th onClick={() => requestSort("weaponUsed")}>Weapon</th>
              <th onClick={() => requestSort("victimAge")}>Victim</th>
              <th onClick={() => requestSort("caseClosed")}>Status</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.reportNumber || i}>
                <td>{i + 1}</td>
                <td>{r.crimeDescription}</td>
                <td>{r.city}</td>

                <td>
                  <span className={domainColor(r.crimeDomain)}>
                    {r.crimeDomain}
                  </span>
                </td>

                <td>{r.weaponUsed}</td>

                <td>
                  {r.victimAge}/{r.victimGender}
                </td>

                <td
                  className={
                    r.caseClosed
                      ? "status-closed"
                      : "status-open"
                  }
                >
                  {r.caseClosed ? "Closed" : "Open"}
                </td>
              </tr>
            ))}

            {sorted.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}   