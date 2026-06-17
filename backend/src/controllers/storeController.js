const pool = require('../config/db');

exports.getStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'asc' } = req.query;
    const allowed = ['name', 'address', 'avg_rating'];
    const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.address, s.email,
             ROUND(AVG(r.rating), 2) AS avg_rating,
             COUNT(r.id) AS total_ratings,
             ur.rating AS user_rating, ur.review AS user_review
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
      WHERE 1=1
    `;
    const params = [req.user.id];

    if (name) { query += ` AND s.name LIKE ?`; params.push(`%${name}%`); }
    if (address) { query += ` AND s.address LIKE ?`; params.push(`%${address}%`); }

    query += ` GROUP BY s.id ORDER BY ${sortCol === 'avg_rating' ? 'avg_rating' : `s.${sortCol}`} ${sortOrder}`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.id, s.name, s.address, s.email,
              ROUND(AVG(r.rating), 2) AS avg_rating,
              COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = ?
       GROUP BY s.id`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Store not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.submitRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const storeId = req.params.id;
    const userId = req.user.id;

    const [stores] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (stores.length === 0) return res.status(404).json({ message: 'Store not found.' });

    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating, review) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?, review = ?, updated_at = CURRENT_TIMESTAMP`,
      [userId, storeId, rating, review || null, rating, review || null]
    );

    const [[{ avg_rating, total_ratings }]] = await pool.query(
      `SELECT ROUND(AVG(rating), 2) AS avg_rating, COUNT(*) AS total_ratings
       FROM ratings WHERE store_id = ?`,
      [storeId]
    );

    res.json({ message: 'Rating submitted successfully.', avg_rating, total_ratings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
