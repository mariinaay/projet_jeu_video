const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesByRoom } = require('../controllers/chatController');
const { authenticate, authorize } = require('../middleware/auth');

// Envoyer un message
router.post('/', authenticate, authorize(['player']), sendMessage);

// Récupérer les messages d'une salle
router.get('/:room_id', authenticate, authorize(['player', 'admin']), getMessagesByRoom);

module.exports = router;