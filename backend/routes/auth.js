const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authenticate, authorize } = require('../middlewares/auth');

// Inscription
router.post('/register', authController.register);

// Connexion
router.post('/login', authController.login);

module.exports = router;