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
                cd.nombre_concepto_default,
                pc.tarifa_servicio,
                pc.divisa,
                pc.id_cat_concepto,
                cc.nombre_cat_concepto,
                cd.es_default,
                cd.id_concepto_std
            FROM precios_conceptos pc
            JOIN conceptos_default cd ON pc.id_concepto_std = cd.id_concepto_std
            JOIN categorias_conceptos cc ON pc.id_cat_concepto = cc.id_cat_concepto
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
        const query = `
            SELECT 
                cd.id_concepto_std, 
                cd.nombre_concepto_default, 
                cd.costo_concepto_default, 
                cd.es_default,
                cc.nombre_cat_concepto
            FROM conceptos_default cd
            JOIN categorias_conceptos cc ON cd.id_categoria_concepto = cc.id_cat_concepto
        `;
        const result = await pool.query(query);
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