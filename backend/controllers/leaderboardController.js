const pool = require('../config/db');

exports.getLeaderboard = async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM leaderboard ORDER BY total_score DESC');
    if (!rows.length) {
      const err = new Error("Classement vide");
      err.status = 404;
      throw err;
    }
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};