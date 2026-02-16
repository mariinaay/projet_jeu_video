const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Récupérer tous les items
exports.getItems = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items');
    if (!rows.length) {
      const err = new Error("Aucun item trouvé");
      err.status = 404;
      throw err;
    }
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// Ajouter un item à l’inventaire
exports.addItemToInventory = async (req, res, next) => {
  try {
    const { inventory_id, item_id, quantity } = req.body;

    if (!inventory_id || !item_id || !quantity) {
      const err = new Error("Champs manquants");
      err.status = 400;
      throw err;
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO inventory_items (id, inventory_id, item_id, quantity, slot_position, is_equipped, created_at) VALUES ($1,$2,$3,$4,0,false,NOW())',
      [id, inventory_id, item_id, quantity]
    );

    res.status(201).json({ message: 'Item ajouté', id });
  } catch (err) {
    next(err);
  }
};