const pool = require('../config/db');

const getServiciosByAeropuertoOrFbo = async (req, res) => {
    const { id_aeropuerto, id_fbo } = req.query;

    try {
        let query = `
            SELECT 
                pc.id_precio_concepto,
                pc.nombre_local_concepto,
                pc.costo_concepto,
                pc.divisa,
                cs.nombre_concepto_default,
                cc.nombre_cat_concepto
            FROM precios_conceptos pc
            JOIN conceptos_estandarizados cs ON pc.id_concepto_std = cs.id_concepto_std
            JOIN categorias_conceptos cc ON cs.id_categoria_concepto = cc.id_cat_concepto
            WHERE (pc.id_aeropuerto IS NULL AND pc.id_fbo IS NULL)
        `;

        const params = [];

        if (id_fbo) {
            query += ` OR pc.id_fbo = $1`;
            params.push(id_fbo);
        } else if (id_aeropuerto) {
            query += ` OR pc.id_aeropuerto = $1`;
            params.push(id_aeropuerto);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getServiciosByAeropuertoOrFbo,
};