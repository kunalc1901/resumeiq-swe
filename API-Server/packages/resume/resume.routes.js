const express = require('express');
const router = express.Router();
const resumeController = require('./resume.controller');
const { verifyToken } = require('../../utils');

router.get('/', verifyToken, resumeController.getResumes);

module.exports = router;
