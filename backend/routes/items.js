const express = require('express');
const router = express.Router();
const { getItems, addItemToInventory } = require('../controllers/itemController');
const { authenticate, authorize } = require('../middleware/auth');

// Récupérer tous les items
router.get('/', authenticate, getItems);

// Ajouter un item à l'inventaire
router.post('/inventory', authenticate, authorize(['player']), addItemToInventory);

module.exports = router;