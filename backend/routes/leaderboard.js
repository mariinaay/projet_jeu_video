// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');
const { authenticate } = require('../middleware/auth');

// Récupérer le leaderboard – accessible à tous les connectés
router.get('/', authenticate, getLeaderboard);

module.exports = router;