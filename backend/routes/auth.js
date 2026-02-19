const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerRules, loginRules, validate } = require('../middleware/validators');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');

// Register
router.post('/register', authLimiter, registerRules, validate, authController.register);

// Login
router.post('/login', authLimiter, loginRules, validate, authController.login);

// Google OAuth - redirection vers Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth - callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, role: req.user.role },
      secret,
      { expiresIn }
    );
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

module.exports = router;