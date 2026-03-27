// src/routes/gym.routes.js
import express from "express";
import { getAllGymsLiveData, getGymLiveData } from "../services/gymService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const gyms = await getAllGymsLiveData();
    res.json(gyms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const gym = await getGymLiveData(id);
    if (!gym) return res.status(404).json({ error: "Gym not found" });
    res.json(gym);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;