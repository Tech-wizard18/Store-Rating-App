const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getDashboard = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query(
      `SELECT COUNT(*) AS totalUsers FROM users WHERE role != 'admin'`
    );
    const [[{ totalStores }]] = await pool.query(`SELECT COUNT(*) AS totalStores FROM stores`);
    const [[{ totalRatings }]] = await pool.query(`SELECT COUNT(*) AS totalRatings FROM ratings`);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', order = 'asc' } = req.query;
    const allowed = ['name', 'email', 'address', 'role', 'created_at'];
    const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    let query = `SELECT id, name, email, address, role FROM users WHERE 1=1`;
    const params = [];

    if (name) { query += ` AND name LIKE ?`; params.push(`%${name}%`); }
    if (email) { query += ` AND email LIKE ?`; params.push(`%${email}%`); }
    if (address) { query += ` AND address LIKE ?`; params.push(`%${address}%`); }
    if (role) { query += ` AND role = ?`; params.push(role); }

    query += ` ORDER BY ${sortCol} ${sortOrder}`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, address, role FROM users WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    const user = rows[0];

    // If store owner, attach their store's avg rating
    if (user.role === 'store_owner') {
      const [storeRows] = await pool.query(
        `SELECT s.id, s.name AS store_name, ROUND(AVG(r.rating), 2) AS avg_rating
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = ?
         GROUP BY s.id`,
        [user.id]
      );
      user.stores = storeRows;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashed, address || null, role]
    );
    res.status(201).json({ message: 'User created successfully.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;
    const allowed = ['name', 'email', 'address', 'avg_rating'];
    const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.email, s.address,
             ROUND(AVG(r.rating), 2) AS avg_rating,
             COUNT(r.id) AS total_ratings
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (name) { query += ` AND s.name LIKE ?`; params.push(`%${name}%`); }
    if (email) { query += ` AND s.email LIKE ?`; params.push(`%${email}%`); }
    if (address) { query += ` AND s.address LIKE ?`; params.push(`%${address}%`); }

    query += ` GROUP BY s.id ORDER BY ${sortCol === 'avg_rating' ? 'avg_rating' : `s.${sortCol}`} ${sortOrder}`;

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const [existing] = await pool.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Store email already in use.' });
    }

    // Validate owner if provided
    if (owner_id) {
      const [ownerRows] = await pool.query(
        `SELECT id FROM users WHERE id = ? AND role = 'store_owner'`,
        [owner_id]
      );
      if (ownerRows.length === 0) {
        return res.status(400).json({ message: 'Owner must be a user with store_owner role.' });
      }
    }

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address || null, owner_id || null]
    );
    res.status(201).json({ message: 'Store created successfully.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
