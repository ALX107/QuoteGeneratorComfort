const pool = require('../config/db');

const getAeropuertos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "aeropuertos"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAeropuertos,
};
