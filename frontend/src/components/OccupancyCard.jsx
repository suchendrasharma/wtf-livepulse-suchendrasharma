// components/OccupancyCard.jsx
import { useStore } from "../store/useStore";

export default function OccupancyCard() {
  const occupancy = useStore((s) => s.occupancy);
  const selectedGym = useStore((s) => s.selectedGym);

  const percent = selectedGym
    ? (occupancy / selectedGym.capacity) * 100
    : 0;

  let color = "green";
  if (percent > 85) color = "red";
  else if (percent > 60) color = "yellow";

  return (
    <div className="bg-[#1A1A2E] p-4 rounded-xl shadow">
      <h2 className="text-gray-400">Occupancy</h2>
      <p className="text-4xl font-bold">{occupancy}</p>
      <p className={`text-${color}-400`}>
        {percent.toFixed(1)}%
      </p>
    </div>
  );
}