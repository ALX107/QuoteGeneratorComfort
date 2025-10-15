const pool = require('../config/db');

const getCotizacionesHistorico = async (req, res) => {
  try {
    // Esta consulta une el histórico con otras 4 tablas para obtener datos legibles.
    const query = `
      SELECT
        ch.id_cotizacion,
        ch.numero_referencia,
        ch.fecha_cotizacion,
        ch.fecha_llegada,
        ch.total_final,
        ch.exchange_rate,
        c.nombre_cliente AS nombre_cliente,      -- Nombre del cliente desde la tabla 'clientes'
        co.nombre_cat_operacion AS nombre_cat_operacion,              -- Nombre de la operación desde 'categorias_operaciones'
        a.nombre_aeropuerto AS nombre_aeropuerto,                  -- Nombre del aeropuerto desde 'aeropuertos'
        ca.matricula_aeronave AS matricula_aeronave             -- Matrícula de la aeronave desde 'cliente_aeronaves'
      FROM
        "cotizaciones_historico" AS ch
      LEFT JOIN
        "clientes" AS c ON ch.id_cliente = c.id_cliente -- FIX: Se usa el alias 'c'
      LEFT JOIN
        "categorias_operaciones" AS co ON ch.id_cat_operacion = co.id_cat_operacion -- FIX: Se usa el alias 'co'
      LEFT JOIN
        "aeropuertos" AS a ON ch.id_aeropuerto = a.id_aeropuerto -- FIX: Se usa el alias 'a'
      LEFT JOIN
        "clientes_aeronaves" AS ca ON ch.id_cliente_aeronave = ca.id_cliente_aeronave -- FIX: Se usa el alias 'ca'
      ORDER BY
        ch.fecha_cotizacion DESC;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener el histórico de cotizaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = {
  getCotizacionesHistorico,
};