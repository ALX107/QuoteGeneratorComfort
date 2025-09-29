const pool = require('../config/db');

const getCategoriasOperaciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "categorias_operaciones"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCategoriasOperaciones,
};
