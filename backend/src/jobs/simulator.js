// jobs/simulator.js
import { pool } from "../db/pool.js";
import { broadcast } from "../websocket/wsServer.js";

let interval;
let running = true;
let speed = 1;

const performSimulationStep = async () => {
  if (!running) return;

  const member = await pool.query(`
    SELECT id, gym_id FROM members
    ORDER BY random()
    LIMIT 1
  `);

  if (!member.rows.length) return;

  const m = member.rows[0];

  const checkin = await pool.query(`
    INSERT INTO checkins (member_id, gym_id)
    VALUES ($1, $2)
    RETURNING *
  `, [m.id, m.gym_id]);

  broadcast({
    type: "CHECKIN_EVENT",
    gym_id: m.gym_id,
    timestamp: checkin.rows[0].checked_in
  });

  const checkout = await pool.query(`
    UPDATE checkins
    SET checked_out = NOW()
    WHERE id IN (
      SELECT id FROM checkins
      WHERE checked_out IS NULL
      ORDER BY random()
      LIMIT 1
    )
    RETURNING gym_id, checked_out
  `);

  if (checkout.rows.length) {
    broadcast({
      type: "CHECKOUT_EVENT",
      gym_id: checkout.rows[0].gym_id,
      timestamp: checkout.rows[0].checked_out
    });
  }

  if (Math.random() > 0.7) {
    const payment = await pool.query(`
      INSERT INTO payments (member_id, gym_id, amount, plan_type, paid_at)
      SELECT id, gym_id, 1499, 'monthly', NOW()
      FROM members
      ORDER BY random()
      LIMIT 1
      RETURNING gym_id, amount
    `);

    if (payment.rows.length) {
      broadcast({
        type: "PAYMENT_EVENT",
        gym_id: payment.rows[0].gym_id,
        amount: payment.rows[0].amount,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Broadcast the up-to-date gym metrics for the gym where an event occurred.
  await broadcastGymMetrics(m.gym_id);
};

const broadcastGymMetrics = async (gymId) => {
  const metrics = await pool.query(`
    SELECT
      g.id AS gym_id,
      g.name,
      g.capacity,
      COALESCE((SELECT COUNT(*) FROM checkins c WHERE c.gym_id=g.id AND c.checked_out IS NULL), 0) AS current_occupancy,
      COALESCE((SELECT SUM(amount) FROM payments p WHERE p.gym_id=g.id AND p.paid_at::date=CURRENT_DATE), 0) AS today_revenue
    FROM gyms g
    WHERE g.id = $1
  `, [gymId]);
  if (!metrics.rows.length) return;

  broadcast({
    type: "GYM_METRICS_UPDATE",
    ...metrics.rows[0]
  });
};

const restartInterval = () => {
  if (interval) clearInterval(interval);
  interval = setInterval(performSimulationStep, Math.max(200, Math.round(2000 / speed)));
};

export const startSimulator = () => {
  if (!interval) {
    restartInterval();
  }
};

export const setSimulatorRunning = (value) => {
  running = value;
};

export const setSimulatorSpeed = (value) => {
  speed = Math.max(0.1, Number(value) || 1);
  restartInterval();
};

export const getSimulatorState = () => ({ running, speed });