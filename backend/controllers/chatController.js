const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Envoyer un message
exports.sendMessage = async (req, res, next) => {
  try {
    const { sender_id, room_id, message_text } = req.body;

    if (!sender_id || !room_id || !message_text) {
      const err = new Error("Champs manquants");
      err.status = 400;
      throw err;
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO chat_messages (id, sender_id, room_id, message_text, created_at, is_read) VALUES ($1,$2,$3,$4,NOW(),false)',
      [id, sender_id, room_id, message_text]
    );

    res.status(201).json({ message: 'Message envoyé', id });
  } catch (err) {
    next(err);
  }
};

// Récupérer les messages d’une salle
exports.getMessagesByRoom = async (req, res, next) => {
  try {
    const { room_id } = req.params;

    if (!room_id) {
      const err = new Error("ID de salle manquant");
      err.status = 400;
      throw err;
    }

    const { rows } = await pool.query(
      'SELECT * FROM chat_messages WHERE room_id=$1 ORDER BY created_at ASC',
      [room_id]
    );

    if (!rows.length) {
      const err = new Error("Aucun message trouvé");
      err.status = 404;
      throw err;
    }

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};