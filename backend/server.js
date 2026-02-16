const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
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
const server = http.createServer(app);

// Configuration Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Accepte toutes les origines (pour le dev)
    methods: ["GET", "POST"]
  }
});

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

// WEBSOCKETS 

io.on('connection', (socket) => {
  console.log(' Utilisateur connecté:', socket.id);

  // Rejoindre une salle de chat
  socket.on('join_room', (room_id) => {
    socket.join(room_id);
    console.log(`Utilisateur ${socket.id} a rejoint la salle ${room_id}`);
  });

  // Recevoir et diffuser un message
  socket.on('send_message', (data) => {
    console.log('Message reçu:', data);
    // Envoyer le message à tous dans la salle
    io.to(data.room_id).emit('receive_message', {
      sender_id: data.sender_id,
      message_text: data.message_text,
      created_at: new Date()
    });
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log(' Utilisateur déconnecté:', socket.id);
  });
});


// Démarrage du serveur (IMPORTANT : server.listen, pas app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
  console.log(` WebSockets activés`);
});