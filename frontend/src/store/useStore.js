// store/useStore.js
import { create } from "zustand";

export const useStore = create((set) => ({
  gyms: [],
  selectedGym: null,
  occupancy: 0,
  revenue: 0,
  anomalies: [],
  events: [],

  setGyms: (gyms) => set({ gyms }),
  setSelectedGym: (gym) => set({ selectedGym: gym }),

  updateLive: (data) =>
    set((state) => ({
      occupancy: data.current_occupancy ?? state.occupancy,
      revenue: data.today_revenue ?? state.revenue,
    })),

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events.slice(0, 19)],
    })),

  addAnomaly: (a) =>
    set((state) => ({
      anomalies: [a, ...state.anomalies],
    })),
}));