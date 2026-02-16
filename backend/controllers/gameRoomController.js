const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Récupérer toutes les salles
exports.getGameRooms = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM game_rooms');
    if (!rows.length) {
      const err = new Error("Aucune salle trouvée");
      err.status = 404;
      throw err;
    }
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// Créer une salle
exports.createGameRoom = async (req, res, next) => {
  try {
    const { name, max_players, game_mode, difficulty, owner_id } = req.body;

    if (!name || !max_players || !owner_id) {
      const err = new Error("Champs manquants");
      err.status = 400;
      throw err;
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO game_rooms (id, name, max_players, current_players, game_mode, difficulty, owner_id, status, created_at) VALUES ($1,$2,$3,0,$4,$5,$6,$7,NOW())',
      [id, name, max_players, game_mode, difficulty, owner_id, 'waiting']
    );

    res.status(201).json({ message: 'Salle créée', id });
  } catch (err) {
    next(err);
  }
};