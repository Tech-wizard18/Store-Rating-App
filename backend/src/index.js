require('dotenv').config(); // loaded
const express = require('express');
const cors = require('cors');
const initDb = require('./config/initDb');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');
const storeOwnerRoutes = require('./routes/storeOwner');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  });
