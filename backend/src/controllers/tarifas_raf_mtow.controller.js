// backend/src/controllers/tarifas_raf_mtow.controller.js
const pool = require('../config/db');

const getTarifasRafMtow = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tarifas_raf_mtow ORDER BY id_clasificacion, min_weight');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener tarifas RAF:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    getTarifasRafMtow
};
