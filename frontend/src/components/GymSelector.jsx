// components/GymSelector.jsx
import { useStore } from "../store/useStore";

export default function GymSelector() {
  const gyms = useStore((s) => s.gyms);
  const selectedGym = useStore((s) => s.selectedGym);
  const setSelectedGym = useStore((s) => s.setSelectedGym);

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-2">WTF LivePulse Dashboard</h1>
      <select
        value={selectedGym?.id || ""}
        onChange={(e) => {
          const gym = gyms.find(g => g.id == e.target.value);
          setSelectedGym(gym);
        }}
        className="bg-[#1A1A2E] text-white p-2 rounded"
      >
        <option value="">Select a Gym</option>
        {gyms.map(gym => (
          <option key={gym.id} value={gym.id}>
            {gym.name}
          </option>
        ))}
      </select>
    </div>
  );
}