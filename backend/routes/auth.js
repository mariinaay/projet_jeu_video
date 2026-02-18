const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

module.exports = router;