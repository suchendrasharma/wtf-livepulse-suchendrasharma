// pages/Dashboard.jsx
import { useStore } from "../store/useStore";
import { useWebSocket } from "../hooks/useWebSocket";
import { useGymData } from "../hooks/useGymData";

import GymSelector from "../components/GymSelector";
import OccupancyCard from "../components/OccupancyCard";
import RevenueCard from "../components/RevenueCard";
import ActivityFeed from "../components/ActivityFeed";
import AnomalyTable from "../components/AnomalyTable";
import SimulatorControls from "../components/SimulatorControls";

export default function Dashboard() {
  useWebSocket();
  useGymData();

  return (
    <div className="p-4 bg-[#0D0D1A] min-h-screen text-white">
      <GymSelector />
      <div className="grid grid-cols-3 gap-4 mt-4">
        <OccupancyCard />
        <RevenueCard />
        <SimulatorControls />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <ActivityFeed />
        <AnomalyTable />
      </div>
    </div>
  );
}