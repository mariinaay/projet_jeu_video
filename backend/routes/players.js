const express = require('express');
const router = express.Router();
const { getPlayers, createPlayer } = require('../controllers/playerController');
const { authenticate, authorize } = require('../middleware/auth');

// Récupérer tous les joueurs
router.get('/', authenticate, authorize(['admin']), getPlayers);

// Créer un joueur
router.post('/', authenticate, authorize(['admin', 'player']), createPlayer);

module.exports = router;