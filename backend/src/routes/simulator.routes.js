// routes/simulator.routes.js
import express from "express";
import { setSimulatorRunning, setSimulatorSpeed, getSimulatorState } from "../jobs/simulator.js";

const router = express.Router();

router.post("/start", (req, res) => {
  setSimulatorRunning(true);
  res.json({ status: "running" });
});

router.post("/stop", (req, res) => {
  setSimulatorRunning(false);
  res.json({ status: "paused" });
});

router.post("/speed", (req, res) => {
  const { speed } = req.body;
  setSimulatorSpeed(speed);
  res.json({ speed: getSimulatorState().speed });
});

router.get("/state", (req, res) => {
  res.json(getSimulatorState());
});

export default router;