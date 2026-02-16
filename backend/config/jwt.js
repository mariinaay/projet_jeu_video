require('dotenv').config();

if (!process.env.JWT_SECRET) {
  throw new Error(' JWT_SECRET manquant ! Créez un fichier .env avec JWT_SECRET=votre_secret');
}

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h'
};