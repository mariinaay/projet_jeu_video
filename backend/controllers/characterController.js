const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Récupérer tous les personnages d'un joueur
exports.getCharactersByPlayer = async (req, res, next) => {
  try {
    const { player_id } = req.params;

    if (!player_id) {
      const err = new Error("ID joueur manquant");
      err.status = 400;
      throw err;
    }

    const { rows } = await pool.query(
      'SELECT * FROM "Characters" WHERE player_id=$1', 
      [player_id]
    );

    if (!rows.length) {
      const err = new Error("Aucun personnage trouvé");
      err.status = 404;
      throw err;
    }

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

// Créer un personnage
exports.createCharacter = async (req, res, next) => {
  try {
    const { player_id, name, classType } = req.body;

    if (!player_id || !name || !classType) {
      const err = new Error("Champs manquants");
      err.status = 400;
      throw err;
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO "Characters"(id, player_id, name, class, level, health, mana, created_at) VALUES($1,$2,$3,$4,1,100,100,NOW())',
      [id, player_id, name, classType]
    );

    res.status(201).json({ message: 'Personnage créé', characterId: id });
  } catch (err) {
    next(err);
  }
};