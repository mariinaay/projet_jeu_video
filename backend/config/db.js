// db.js (CommonJS)
const { Pool } = require('pg');

const pool = new Pool({
  host: '192.168.100.1',
  port: 5432,
  database: 'web-komodo',
  user: 'postgres',
  password: '1234'
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Connexion PostgreSQL réussie:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('Erreur de connexion:', err.message);
    return false;
  }
}

module.exports = pool;
module.exports.testConnection = testConnection;