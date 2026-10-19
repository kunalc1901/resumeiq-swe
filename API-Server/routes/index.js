const express = require('express');
const router = express.Router();
const userRoute = require('../packages/user/user.routes');
const resumeRoute = require('../packages/resume/resume.routes');
const dashboardRoute = require('../packages/dashboard/dashboard.routes');
const jobMatchRoute = require('../packages/job-match/job-match.routes');

router.use('/user', userRoute);
router.use('/resume', resumeRoute);
router.use('/dashboard', dashboardRoute);
router.use('/job-match', jobMatchRoute);

module.exports = router;