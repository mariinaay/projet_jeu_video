const rateLimit = require('express-rate-limit');

// Limiteur pour login et register
const authLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,               // max 5 tentatives
  message: { error: "Trop de tentatives, réessaie dans 1 minute" },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter };