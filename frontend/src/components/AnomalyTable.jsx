// components/AnomalyTable.jsx
import { useStore } from "../store/useStore";

export default function AnomalyTable() {
  const anomalies = useStore((s) => s.anomalies);

  return (
    <div className="bg-[#1A1A2E] p-4 rounded-xl">
      <h2>Anomalies</h2>

      {anomalies.map((a, i) => (
        <div key={i} className="border-b py-2">
          <p>{a.anomaly_type}</p>
          <p className="text-xs text-gray-400">{a.gym_name}</p>
        </div>
      ))}
    </div>
  );
}