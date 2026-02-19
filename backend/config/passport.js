require('dotenv').config(); // 👈 ajoute cette ligne tout en haut
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
const { v4: uuidv4 } = require('uuid');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existing = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [profile.emails[0].value]
    );

    if (existing.rows.length) {
      return done(null, existing.rows[0]);
    }

    const id = uuidv4();
    const result = await pool.query(
      'INSERT INTO users (id, username, email, password_hash, role, created_at) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *',
      [id, profile.displayName, profile.emails[0].value, null, 'player']
    );

    return done(null, result.rows[0]);

  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  done(null, result.rows[0]);
});

module.exports = passport;