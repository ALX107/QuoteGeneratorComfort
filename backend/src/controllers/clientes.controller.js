const pool = require('../config/db');

const getClientes = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Clientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClientes,
};
