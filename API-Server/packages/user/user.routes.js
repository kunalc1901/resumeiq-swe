const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { verifyToken } = require('../../utils');

// Route to get users (authenticated)
router.get('/', verifyToken, userController.getUsers);

module.exports = router;
