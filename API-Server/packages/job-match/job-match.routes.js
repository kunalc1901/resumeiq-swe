const express = require('express');
const router = express.Router();
const jobMatchController = require('./job-match.controller');
const { verifyToken } = require('../../utils');

router.get('/', verifyToken, jobMatchController.getJobMatches);
router.get('/:id', verifyToken, jobMatchController.getJobMatchById);

module.exports = router;
