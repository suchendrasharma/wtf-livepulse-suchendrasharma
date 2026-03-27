// hooks/useWebSocket.js
import { useEffect } from "react";
import { useStore } from "../store/useStore";

export const useWebSocket = () => {
  const addEvent = useStore((s) => s.addEvent);
  const addAnomaly = useStore((s) => s.addAnomaly);
  const updateLive = useStore((s) => s.updateLive);
  const selectedGym = useStore((s) => s.selectedGym);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "CHECKIN_EVENT" || data.type === "CHECKOUT_EVENT" || data.type === "PAYMENT_EVENT") {
        addEvent(data);
      }

      if (data.type === "ANOMALY_DETECTED") {
        addAnomaly(data);
      }

      if (data.type === "GYM_METRICS_UPDATE" && selectedGym && data.gym_id === selectedGym.id) {
        updateLive(data);
      }
    };

    return () => ws.close();
  }, [selectedGym]);
};