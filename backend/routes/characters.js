const express = require('express');
const router = express.Router();
const { getCharactersByPlayer, createCharacter } = require('../controllers/characterController');
const { authenticate, authorize } = require('../middleware/auth');

// Récupérer les personnages d'un joueur
router.get('/:player_id', authenticate, authorize(['admin', 'player']), getCharactersByPlayer);

// Créer un personnage
router.post('/', authenticate, authorize(['admin', 'player']), createCharacter);

module.exports = router;