const pool = require('./db');
const bcrypt = require('bcryptjs');

async function initDb() {
  const conn = await pool.getConnection();
  try {
    // Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400),
        role ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Stores table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(400),
        owner_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Ratings table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review VARCHAR(500) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_store (user_id, store_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
      )
    `);

    // Seed default admin if not exists
    const [admins] = await conn.query(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`);
    if (admins.length === 0) {
      const hashed = await bcrypt.hash('Admin@12345', 10);
      await conn.query(
        `INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'admin')`,
        ['System Administrator Account', 'admin@storerating.com', hashed, '123 Admin Street, City']
      );
      console.log('Default admin created: admin@storerating.com / Admin@12345');
    }

    console.log('Database initialized successfully');
  } finally {
    conn.release();
  }
}

module.exports = initDb;
