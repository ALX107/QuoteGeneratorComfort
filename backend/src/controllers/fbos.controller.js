const pool = require('../config/db');

const getFbos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "fbos"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getFbos,
};
