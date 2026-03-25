const express = require('express');
const router = express.Router();
const { getSystemStats } = require('../services/monitorService');

/**
 * GET /stats 
 * Returns system metrics (CPU, memory, disk, uptime) as JSON.
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await getSystemStats();
    res.json(stats);
  } catch (error) {
    console.error(`Error fetching system stats: ${error.message}`);
    res.status(500).json({ 
      error: 'Failed to retrieve system metrics',
      message: error.message 
    });
  }
});

/**
 * GET /health
 * Returns the status of the API.
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
