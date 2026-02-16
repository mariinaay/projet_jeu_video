const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Récupérer tous les achievements
exports.getAchievements = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM achievements');
    if (!rows.length) {
      const err = new Error("Aucun achievement trouvé");
      err.status = 404;
      throw err;
    }
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// Débloquer un achievement
exports.unlockAchievement = async (req, res, next) => {
  try {
    const { player_id, achievement_id } = req.body;

    if (!player_id || !achievement_id) {
      const err = new Error("Champs manquants");
      err.status = 400;
      throw err;
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO players_achievements (id, player_id, achievement_id, unlocked_at) VALUES ($1,$2,$3,NOW())',
      [id, player_id, achievement_id]
    );

    res.status(201).json({ message: 'Achievement débloqué', id });
  } catch (err) {
    next(err);
  }
};