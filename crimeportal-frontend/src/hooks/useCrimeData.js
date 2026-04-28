import { useCrimeData } from "@/hooks/useCrimeData";
import { getStateForCity } from "@/lib/cityStateMapping";

export default function Dashboard() {
  const { records, loading, stateSummaries } = useCrimeData();
  const [selectedState, setSelectedState] = useState(null);

  if (loading) {
    return <div>Loading crime data...</div>;
  }

  const filteredRecords = selectedState
    ? records.filter(r => r.state === selectedState)
    : records;

  return (
    <div className="dashboard">
      <StatsCards records={filteredRecords} title="National Overview" />
      
      <CrimeCharts records={filteredRecords} />
      <IndiaMap
        stateSummaries={stateSummaries}
        selectedState={selectedState}
        onSelectState={setSelectedState}
      />
      <CrimeTable records={filteredRecords} />
    </div>
  );
}
