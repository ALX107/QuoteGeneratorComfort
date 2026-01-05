const pool = require('../config/db');

const getServiciosByAeropuertoOrFbo = async (req, res) => {
    const { id_fbo } = req.query;

    if (!id_fbo) {
        return res.json([]);
    }

    try {

        // 1. Averiguar el Grupo del FBO para determinar las categorías
        const fboQuery = 'SELECT grupo_fbo, id_aeropuerto FROM fbos WHERE id_fbo = $1';
        const fboResult = await pool.query(fboQuery, [id_fbo]);

        if (fboResult.rows.length === 0) {
            return res.json([]);
        }

        const grupoFbo = fboResult.rows[0].grupo_fbo;
        
        let catMin, catMax;

        // Lógica de rangos 
        if (grupoFbo === 'Aviación General') {
            // Categorías 8 a 15
            catMin = 8;
            catMax = 15;
        } else if (grupoFbo === 'Aviación Comercial') {
            // Categorías 16 a 23
            catMin = 16;
            catMax = 23;
        } else {
            // Es un FBO Real (GAP, OMA, etc.) -> Categorías 1 a 7
            catMin = 1;
            catMax = 7;
        }

        // 2. Consulta Maestra
        // Trae los conceptos default dentro del rango.
        // Hace JOIN con precios_conceptos especificamente para ESTE id_fbo.
        // Si hay precio especifico lo usa, si no, usa el default.
        
        const query = `
            SELECT 
                cd.id_concepto_std,
                cd.nombre_concepto_default,
                cd.es_default,
                cc.nombre_cat_concepto,
                cc.id_cat_concepto,
                -- Prioridad: Precio especifico > Precio default
                COALESCE(pc.tarifa_servicio, cd.costo_concepto_default) as tarifa_servicio,
                COALESCE(pc.divisa, cd.divisa_concepto_default) as divisa,
                pc.id_precio_concepto
            FROM conceptos_default cd
            JOIN categorias_conceptos cc ON cd.id_cat_concepto = cc.id_cat_concepto
            LEFT JOIN precios_conceptos pc 
                ON cd.id_concepto_std = pc.id_concepto_std 
                AND pc.id_fbo = $1
            WHERE cd.id_cat_concepto BETWEEN $2 AND $3
            ORDER BY cd.id_concepto_std ASC
        `;            

        const result = await pool.query(query, [id_fbo, catMin, catMax]);
        res.json(result.rows);

    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getServiciosByAeropuertoOrFbo,
};