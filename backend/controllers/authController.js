const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');
const { v4: uuidv4 } = require('uuid');

// Inscription
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      const err = new Error("Champs manquants");
      err.status = 400;
      throw err;
    }

    const existing = await pool.query(
      'SELECT * FROM users WHERE email=$1 OR username=$2',
      [email, username]
    );

    if (existing.rows.length) {
      const err = new Error("Utilisateur déjà existant");
      err.status = 409; // Conflict
      throw err;
    }

    const hash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await pool.query(
      'INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES ($1,$2,$3,$4,$5,NOW())',
      [id, username, email, hash, 'player']
    );

    res.status(201).json({ message: 'Utilisateur créé', userId: id });

  } catch (err) {
    next(err);
  }
};

// Connexion
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Champs manquants");
      err.status = 400;
      throw err;
    }

    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);

    if (!result.rows.length) {
      const err = new Error("Utilisateur non trouvé");
      err.status = 404;
      throw err;
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      const err = new Error("Mot de passe incorrect");
      err.status = 401;
      throw err;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn });

    res.status(200).json({ token, userId: user.id, role: user.role });

  } catch (err) {
    next(err);
  }
};