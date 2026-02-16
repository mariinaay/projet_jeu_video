const express = require('express');
const router = express.Router();
const { getAchievements, unlockAchievement } = require('../controllers/achievementController');
const { authenticate, authorize } = require('../middleware/auth');

// Récupérer tous les achievements
router.get('/', authenticate, getAchievements);

// Débloquer un achievement
router.post('/unlock', authenticate, authorize(['player']), unlockAchievement);

module.exports = router;