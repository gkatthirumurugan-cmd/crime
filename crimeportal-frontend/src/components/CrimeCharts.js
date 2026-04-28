import { useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";
import { PieChart as PieIcon, BarChart2 } from "lucide-react";

const COLORS = [
  "hsl(162, 72%, 46%)", // green
  "hsl(38, 92%, 50%)",  // orange
  "hsl(280, 65%, 60%)", // purple
  "hsl(200, 80%, 55%)", // blue
  "hsl(0, 72%, 51%)",   // red
  "hsl(162, 40%, 30%)", // dark green
  "hsl(38, 60%, 35%)",  // brownish
];

export default function CrimeCharts({ records }) {
  // ✅ Aggregate domains
  const domainData = useMemo(() => {
  const map = new Map();

  records.forEach(r => {
    const domain = (r.crimeDomain || "Other Crime").trim();

    map.set(domain, (map.get(domain) || 0) + 1);
  });

  return Array.from(map, ([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

}, [records]);

  // ✅ Top 8 crime types
  const topCrimes = useMemo(() => {
    const map = new Map();
    records.forEach(r =>
      map.set(r.crimeDescription, (map.get(r.crimeDescription) || 0) + 1)
    );
    return Array.from(map, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [records]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 🥧 Pie chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <PieIcon className="w-5 h-5 text-accent-green" />
          <h2 className="card-title">Crime Domains</h2>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={domainData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {domainData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          {domainData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-sm text-secondary">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              {d.name}
            </div>
          ))}
        </div>
      </div>

      {/* 📊 Bar chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 className="w-5 h-5 text-accent-green" />
          <h2 className="card-title">Top Crime Types</h2>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={topCrimes}
            layout="vertical"
            margin={{ left: 100 }}
          >
            <XAxis type="number" domain={[0, "dataMax"]} />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tick={{ fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="hsl(162, 72%, 46%)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}