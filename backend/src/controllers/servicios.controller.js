const pool = require('../config/db');

const getServiciosByAeropuertoOrFbo = async (req, res) => {
    const { id_fbo } = req.query;

    if (!id_fbo) {
        return res.json([]);
    }

    try {
        const query = `
            SELECT 
                pc.id_precio_concepto,
                pc.nombre_local_concepto,
                pc.costo_concepto,
                pc.divisa,
                cs.nombre_concepto_default,
                cc.nombre_cat_concepto
            FROM precios_conceptos pc
            JOIN conceptos_default cs ON pc.id_concepto_std = cs.id_concepto_std
            JOIN categorias_conceptos cc ON cs.id_categoria_concepto = cc.id_cat_concepto
            WHERE pc.id_fbo = $1
        `;

        const result = await pool.query(query, [id_fbo]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getDefaultConceptos = async (req, res) => {
    try {
        const result = await pool.query('SELECT id_concepto_std, nombre_concepto_default, costo_concepto_default FROM conceptos_default');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching default conceptos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getServiciosByAeropuertoOrFbo,
    getDefaultConceptos,
};