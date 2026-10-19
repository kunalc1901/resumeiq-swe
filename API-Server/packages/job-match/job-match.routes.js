const express = require('express');
const router = express.Router();
const jobMatchController = require('./job-match.controller');
// const { verifyToken } = require('../../utils/auth.middleware');

// TODO: re-enable token verification once the frontend derives the user id
// from the logged-in session instead of sending a hardcoded one.
// router.get('/', verifyToken, jobMatchController.getJobMatches);
// router.get('/:id', verifyToken, jobMatchController.getJobMatchById);
router.get('/', jobMatchController.getJobMatches);
router.get('/:id', jobMatchController.getJobMatchById);

module.exports = router;
