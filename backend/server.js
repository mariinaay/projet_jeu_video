const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/players');
const characterRoutes = require('./routes/characters');
const itemRoutes = require('./routes/items');
const gameroomRoutes = require('./routes/gamerooms');
const leaderboardRoutes = require('./routes/leaderboard');
const chatRoutes = require('./routes/chat');
const achievementRoutes = require('./routes/achievements');

// Middleware d'erreurs
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes avec préfixe /api
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/gamerooms', gameroomRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/achievements', achievementRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API Komodo avec WebSockets !' });
});

// Middleware global pour gérer les erreurs
app.use(errorHandler);

// Démarrage du serveur (IMPORTANT : server.listen, pas app.listen)
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
  console.log(` WebSockets activés`);
})