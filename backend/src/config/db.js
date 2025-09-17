const path = require('path');
// Explicitly point to the .env file in the 'backend' directory
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error al conectar con PostgreSQL', err.stack);
  } else {
    console.log('✅ Conectado a PostgreSQL exitosamente.');
  }
});

module.exports = pool;