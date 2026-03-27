// services/anomalyService.js

// ZERO CHECKINS
export const detectZeroCheckins = async () => {
  return pool.query(`
    SELECT g.id, g.name
    FROM gyms g
    WHERE g.status = 'active'
    AND NOT EXISTS (
      SELECT 1 FROM checkins c
      WHERE c.gym_id = g.id
      AND c.checked_in >= NOW() - INTERVAL '2 hours'
    )
  `);
};

// CAPACITY BREACH
export const detectCapacityBreach = async () => {
  return pool.query(`
    SELECT g.id, g.name, g.capacity,
      COUNT(c.id) as occupancy
    FROM gyms g
    JOIN checkins c 
      ON g.id = c.gym_id
    WHERE c.checked_out IS NULL
    GROUP BY g.id
    HAVING COUNT(c.id) > g.capacity * 0.9
  `);
};

// REVENUE DROP
export const detectRevenueDrop = async () => {
  return pool.query(`
    WITH today AS (
      SELECT gym_id, SUM(amount) as total
      FROM payments
      WHERE paid_at >= CURRENT_DATE
      GROUP BY gym_id
    ),
    last_week AS (
      SELECT gym_id, SUM(amount) as total
      FROM payments
      WHERE paid_at >= CURRENT_DATE - INTERVAL '7 days'
        AND paid_at < CURRENT_DATE - INTERVAL '6 days'
      GROUP BY gym_id
    )
    SELECT t.gym_id, t.total as today, lw.total as last_week
    FROM today t
    JOIN last_week lw ON t.gym_id = lw.gym_id
    WHERE t.total < lw.total * 0.7
  `);
};