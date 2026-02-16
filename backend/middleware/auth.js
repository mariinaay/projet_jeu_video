const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');

// Vérifier si l'utilisateur est connecté
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const parts = authHeader.split(" ");
  
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Format de token invalide" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
};

// Vérifier le rôle (admin, player, etc.)
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès interdit" });
    }
    next();
  };
};

module.exports = { authenticate, authorize };