const pool = require('../config/db');

const getClientesAeronaves = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "clientes_aeronaves"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClientesAeronaves,
};
