// components/SimulatorControls.jsx
import { useState, useEffect } from "react";
import axios from "axios";

export default function SimulatorControls() {
  const [state, setState] = useState({ running: false, speed: 1 });

  const fetchState = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/simulator/state");
      setState(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const start = async () => {
    await axios.post("http://localhost:3001/api/simulator/start");
    fetchState();
  };

  const stop = async () => {
    await axios.post("http://localhost:3001/api/simulator/stop");
    fetchState();
  };

  const setSpeed = async (speed) => {
    await axios.post("http://localhost:3001/api/simulator/speed", { speed });
    fetchState();
  };

  return (
    <div className="bg-[#1A1A2E] p-4 rounded-xl">
      <h2>Simulator Controls</h2>
      <div className="flex gap-2 mt-2">
        <button onClick={start} className="bg-green-600 px-4 py-2 rounded">Start</button>
        <button onClick={stop} className="bg-red-600 px-4 py-2 rounded">Stop</button>
      </div>
      <div className="mt-4">
        <label>Speed: {state.speed}x</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={state.speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}