// hooks/useGymData.js
import { useEffect } from "react";
import axios from "axios";
import { useStore } from "../store/useStore";

export const useGymData = () => {
  const setGyms = useStore((s) => s.setGyms);
  const setSelectedGym = useStore((s) => s.setSelectedGym);

  useEffect(() => {
    axios.get("http://localhost:3001/api/gyms")
      .then(res => {
        setGyms(res.data);
        if (res.data.length > 0) {
          setSelectedGym(res.data[0]);
        }
      });
  }, []);
};