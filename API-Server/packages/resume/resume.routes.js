const express = require('express');
const router = express.Router();
const resumeController = require('./resume.controller');
// const { verifyToken } = require('../../utils/auth.middleware');

// TODO: re-enable token verification once the frontend derives the user id
// from the logged-in session instead of sending a hardcoded one.
// router.get('/', verifyToken, resumeController.getResumes);
router.get('/', resumeController.getResumes);

module.exports = router;
