const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { verifyToken } = require('../../utils/auth.middleware');

// Route to get users (protected)
router.get('/', verifyToken, userController.getUsers);

// Route to login
router.post('/login', userController.login);

// Route to signup
router.post('/signup', userController.signup);

module.exports = router;