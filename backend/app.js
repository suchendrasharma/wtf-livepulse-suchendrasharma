import express from "express";
import cors from "cors";

import gymRoutes from "./src/routes/gym.routes.js";
// import analyticsRoutes from "./src/routes/analytics.routes.js";
import anomaliesRoutes from "./src/routes/anomalies.routes.js";
import simulatorRoutes from "./src/routes/simulator.routes.js";

import { initWebSocket } from "./src/websocket/wsServer.js";
import { startAnomalyJob } from "./src/jobs/anomalyDetector.js";
import { startSimulator } from "./src/jobs/simulator.js";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Routes
app.use("/api/gyms", gymRoutes);
// app.use("/api/analytics", analyticsRoutes);
app.use("/api/anomalies", anomaliesRoutes);
app.use("/api/simulator", simulatorRoutes);

const server = app.listen(process.env.PORT || 3001, () => {
  console.log("🚀 Backend running");
});

// WebSocket
initWebSocket(server);

// Background jobs
startAnomalyJob();
startSimulator();