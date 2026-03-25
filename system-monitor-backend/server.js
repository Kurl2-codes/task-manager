const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for dashboard integration
app.use(morgan('dev')); // Standard dev logging
app.use(logger); // Custom logging middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/', statsRoutes);

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` System Monitor Backend is running!`);
  console.log(` PORT: ${PORT}`);
  console.log(` HEALTH: http://localhost:${PORT}/health`);
  console.log(` STATS:  http://localhost:${PORT}/stats`);
  console.log(`=========================================`);
});
