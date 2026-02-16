const express = require('express');
const router = express.Router();
const { getGameRooms, createGameRoom } = require('../controllers/gameRoomController');
const { authenticate, authorize } = require('../middleware/auth');

// Récupérer toutes les salles
router.get('/', authenticate, authorize(['player', 'admin']), getGameRooms);

// Créer une salle
router.post('/', authenticate, authorize(['player']), createGameRoom);

module.exports = router;