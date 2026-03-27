// routes/anomalies.routes.js
import express from "express";
import { pool } from "../db/pool.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM anomalies
      WHERE resolved = false
      ORDER BY detected_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/resolve", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      UPDATE anomalies
      SET resolved = TRUE, resolved_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (!result.rows.length) {
      return res.status(404).json({ error: "Anomaly not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;