import { Shield, AlertTriangle, CheckCircle, Users } from "lucide-react";

export default function StatsCards({ records, title }) {
  const totalCrimes = records.length;
  const closedCases = records.filter(r => r.caseClosed).length;
  const violentCrimes = records.filter(r => r.crimeDomain === "Violent Crime").length;
  const closureRate = totalCrimes > 0 ? ((closedCases / totalCrimes) * 100).toFixed(1) : "0";

  const stats = [
    { label: "Total Crimes", value: totalCrimes.toLocaleString(), icon: Shield, color: "text-primary" },
    { label: "Violent Crimes", value: violentCrimes.toLocaleString(), icon: AlertTriangle, color: "text-destructive" },
    { label: "Cases Closed", value: closedCases.toLocaleString(), icon: CheckCircle, color: "text-accent" },
    { label: "Closure Rate", value: `${closureRate}%`, icon: Users, color: "text-chart-4" },
  ];

    return (
    <div className="stats-row">
      {stats.map((s, i) => (
        <div key={i} className="stat-card">
          <s.icon className={`stat-icon ${s.color}`} />
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}