// jobs/anomalyDetector.js
import { pool } from "../db/pool.js";
import { broadcast } from "../websocket/wsServer.js";

const detectZeroCheckins = async () => {
  return pool.query(`
    SELECT g.id AS gym_id, g.name
    FROM gyms g
    WHERE NOT EXISTS (
      SELECT 1 FROM checkins c
      WHERE c.gym_id = g.id AND c.checked_in >= NOW() - INTERVAL '15 minutes'
    )
  `);
};

const detectCapacityBreach = async () => {
  return pool.query(`
    SELECT g.id AS gym_id, g.name
    FROM gyms g
    WHERE (
      SELECT COUNT(*) FROM checkins c
      WHERE c.gym_id = g.id AND c.checked_out IS NULL
    ) >= g.capacity
  `);
};

const detectRevenueDrop = async () => {
  return pool.query(`
    SELECT g.id AS gym_id, g.name
    FROM gyms g
    WHERE (
      COALESCE((
        SELECT SUM(amount) FROM payments p
        WHERE p.gym_id = g.id AND p.paid_at::date = CURRENT_DATE
      ), 0)
      <
      COALESCE((
        SELECT AVG(total) FROM (
          SELECT SUM(amount) AS total
          FROM payments p
          WHERE p.gym_id = g.id AND p.paid_at::date BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE - INTERVAL '1 day'
          GROUP BY p.paid_at::date
        ) x
      ), 0) * 0.5
    )
    AND EXISTS (
      SELECT 1 FROM payments p
      WHERE p.gym_id = g.id AND p.paid_at::date BETWEEN CURRENT_DATE - INTERVAL '7 days' AND CURRENT_DATE - INTERVAL '1 day'
    )
  `);
};

export const startAnomalyJob = () => {
  setInterval(async () => {
    try {
      const zero = await detectZeroCheckins();
      const capacity = await detectCapacityBreach();
      const revenue = await detectRevenueDrop();

      const all = [
        ...zero.rows.map(g => ({ gym_id: g.gym_id, name: g.name, type: "zero_checkins", severity: "warning" })),
        ...capacity.rows.map(g => ({ gym_id: g.gym_id, name: g.name, type: "capacity_breach", severity: "critical" })),
        ...revenue.rows.map(g => ({ gym_id: g.gym_id, name: g.name, type: "revenue_drop", severity: "warning" }))
      ];

      for (const a of all) {
        await pool.query(`
          INSERT INTO anomalies (gym_id, type, severity, message)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (gym_id, type, resolved) DO NOTHING
        `, [
          a.gym_id,
          a.type,
          a.severity,
          `${a.type} detected`
        ]);

        broadcast({
          type: "ANOMALY_DETECTED",
          ...a
        });
      }
    } catch (err) {
      console.error("Anomaly job failed", err);
    }
  }, 30000);
};