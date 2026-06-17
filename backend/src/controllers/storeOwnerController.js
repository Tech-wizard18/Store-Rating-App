const pool = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get the store owned by this user
    const [storeRows] = await pool.query(
      `SELECT s.id, s.name, s.address,
              ROUND(AVG(r.rating), 2) AS avg_rating,
              COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [ownerId]
    );

    if (storeRows.length === 0) {
      return res.json({ store: null, raters: [] });
    }

    const store = storeRows[0];

    // Get users who submitted ratings for this store
    const [raters] = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.review, r.updated_at AS rated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({ store, raters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
