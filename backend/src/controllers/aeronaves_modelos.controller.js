
const pool = require('../config/db');

const getAeronavesModelos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aeronaves_modelos');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAeronavesModelos,
};
