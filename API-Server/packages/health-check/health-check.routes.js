const express = require('express');
const router = express.Router();

// Liveness check — confirms the process is running
router.get('/', (req, res) => {
  res
    .status(200)
    .json({ status: 'healthy', timestamp: new Date().toISOString() });
});

module.exports = router;