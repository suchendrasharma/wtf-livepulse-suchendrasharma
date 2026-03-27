// services/analyticsService.js
export const getAnalytics = async (gymId) => {

  const heatmap = await pool.query(`
    SELECT * FROM gym_hourly_stats
    WHERE gym_id = $1
  `, [gymId]);

  const revenueBreakdown = await pool.query(`
    SELECT plan_type, SUM(amount) as total
    FROM payments
    WHERE gym_id = $1
      AND paid_at >= NOW() - INTERVAL '30 days'
    GROUP BY plan_type
  `, [gymId]);

  const churn = await pool.query(`
    SELECT id, name, last_checkin_at,
      CASE 
        WHEN last_checkin_at < NOW() - INTERVAL '60 days' THEN 'CRITICAL'
        WHEN last_checkin_at < NOW() - INTERVAL '45 days' THEN 'HIGH'
      END as risk
    FROM members
    WHERE gym_id = $1
      AND status = 'active'
      AND last_checkin_at < NOW() - INTERVAL '45 days'
  `, [gymId]);

  const newVsRenewal = await pool.query(`
    SELECT member_type, COUNT(*) 
    FROM payments
    WHERE gym_id = $1
      AND paid_at >= NOW() - INTERVAL '30 days'
    GROUP BY member_type
  `, [gymId]);

  return {
    heatmap: heatmap.rows,
    revenueBreakdown: revenueBreakdown.rows,
    churn: churn.rows,
    newVsRenewal: newVsRenewal.rows
  };
};

// services/analyticsService.js
export const getCrossGymRevenue = async () => {
  return pool.query(`
    SELECT gym_id, SUM(amount) as revenue
    FROM payments
    WHERE paid_at >= NOW() - INTERVAL '30 days'
    GROUP BY gym_id
    ORDER BY revenue DESC
  `);
};