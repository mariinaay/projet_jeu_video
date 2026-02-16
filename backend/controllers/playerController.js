const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Récupérer tous les joueurs
exports.getPlayers = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM players');
    if (!rows.length) {
      const err = new Error("Aucun joueur trouvé");
      err.status = 404;
      throw err;
    }
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// Créer un joueur
exports.createPlayer = async (req, res, next) => {
  try {
    const { user_id, display_name } = req.body;

    if (!user_id || !display_name) {
      const err = new Error("Champs manquants");
      err.status = 400;
      throw err;
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO players (id, user_id, display_name, level, experience_points, created_at) VALUES ($1,$2,$3,1,0,NOW())',
      [id, user_id, display_name]
    );

    res.status(201).json({ message: 'Player créé', id });
  } catch (err) {
    next(err);
  }
};