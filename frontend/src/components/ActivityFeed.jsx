// components/ActivityFeed.jsx
import { useStore } from "../store/useStore";

export default function ActivityFeed() {
  const events = useStore((s) => s.events);

  return (
    <div className="mt-6 bg-[#1A1A2E] p-4 rounded-xl">
      <h2 className="mb-2">Live Activity</h2>

      {events.map((e, i) => (
        <div key={i} className="text-sm border-b py-1">
          {e.type} — {e.timestamp}
        </div>
      ))}
    </div>
  );
}