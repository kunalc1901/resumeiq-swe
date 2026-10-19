const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const { verifyToken } = require('../../utils');

router.get('/', verifyToken, dashboardController.getDashboard);

module.exports = router;
