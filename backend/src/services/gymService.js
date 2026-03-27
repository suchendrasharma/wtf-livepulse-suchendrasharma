// services/gymService.js
import { pool } from "../db/pool.js";

const gymMetricQuery = `
  SELECT
    g.id,
    g.name,
    g.capacity,
    COALESCE((
      SELECT COUNT(*)
      FROM checkins c
      WHERE c.gym_id = g.id AND c.checked_out IS NULL
    ), 0) AS current_occupancy,
    COALESCE((
      SELECT SUM(amount)
      FROM payments p
      WHERE p.gym_id = g.id AND p.paid_at::date = CURRENT_DATE
    ), 0) AS today_revenue
  FROM gyms g
`;

export const getAllGymsLiveData = async () => {
  const result = await pool.query(gymMetricQuery);
  return result.rows;
};

export const getGymLiveData = async (gymId) => {
  const result = await pool.query(`${gymMetricQuery} WHERE g.id = $1`, [gymId]);
  return result.rows[0];
};