const express = require('express');
const router = express.Router();
const pool = require('../db');

// ejemplo: listar clientes
router.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
