const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/players');
const characterRoutes = require('./routes/characters');
const itemRoutes = require('./routes/items');
const gameroomRoutes = require('./routes/gamerooms');
const leaderboardRoutes = require('./routes/leaderboard');
const chatRoutes = require('./routes/chat');
const achievementRoutes = require('./routes/achievements');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/gamerooms', gameroomRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/achievements', achievementRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Komodo avec WebSockets !' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});