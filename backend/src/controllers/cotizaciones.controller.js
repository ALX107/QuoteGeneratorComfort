
const pool = require('../config/db');

const createQuote = async (req, res) => {
  try {
    // Extrae los datos del formulario y el arreglo de servicios del cuerpo de la solicitud.
    const {
      customer, flightType, date, aircraftModel, quotedBy,
      attn, station, eta, from, crewFrom, paxFrom, fbo,
      etd, to, crewTo, paxTo, exchangeRate,
      servicios // Este es el arreglo de servicios/conceptos
    } = req.body;

    // 1. Crear la cotización principal para obtener su ID
    const cotizacionQuery = `
      INSERT INTO "cotizaciones" (
        id_cliente, id_cat_operacion, fecha_cotizacion, id_cliente_aeronave,
        nombre_responsable, nombre_solicitante, id_aeropuerto, fecha_llegada,
        aeropuerto_origen_id, tripulacion_llegada, pasajeros_llegada, id_fbo,
        fecha_salida, aeropuerto_destino_id, tripulacion_salida, pasajeros_salida,
        exchange_rate
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
      RETURNING id_cotizacion;
    `;
    const cotizacionValues = [
      customer, flightType, date, aircraftModel, quotedBy,
      attn, station, eta, from, crewFrom, paxFrom, fbo,
      etd, to, crewTo, paxTo, exchangeRate
    ];
    
    const nuevaCotizacionResult = await pool.query(cotizacionQuery, cotizacionValues);
    const idCotizacion = nuevaCotizacionResult.rows[0].id_cotizacion;
    console.log('--- PRIMER INSERT EXITOSO. ID OBTENIDO:', idCotizacion);

    // 2. Generar número de referencia y otros metadatos
    const añoActual = new Date().getFullYear().toString().slice(-2);
    const numero_referencia = `${idCotizacion}/${añoActual}`;
    const tipo_accion = 'CREADA';
    const version = 1;

    // 3. Insertar cada concepto en la tabla 'cotizacion_conceptos' y calcular totales
    let total_costo = 0;
    let total_s_cargo = 0;
    let total_vat = 0;
    let total_final = 0;

    const conceptosQuery = `
      INSERT INTO "cotizacion_conceptos" (
        id_cotizacion, nombre_servicio, cantidad, costo_mxn, costo_usd,
        sc_porcentaje, vat_porcentaje, s_cargo, vat, total_usd
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `;

    for (const servicio of servicios) {
      const {
        nombre_servicio, cantidad, costo_mxn, costo_usd,
        sc_porcentaje, vat_porcentaje, s_cargo, vat, total_usd
      } = servicio;

      const conceptosValues = [
        idCotizacion, nombre_servicio, cantidad, costo_mxn, costo_usd,
        sc_porcentaje, vat_porcentaje, s_cargo, vat, total_usd
      ];

      await pool.query(conceptosQuery, conceptosValues);

      // Acumular totales. Aseguramos que los valores son numéricos.
      total_costo += parseFloat(costo_usd || 0) * parseInt(cantidad || 1);
      total_s_cargo += parseFloat(s_cargo || 0);
      total_vat += parseFloat(vat || 0);
      total_final += parseFloat(total_usd || 0);
    }
    console.log('--- CONCEPTOS INSERTADOS Y TOTALES CALCULADOS ---');

    // 4. Actualizar la cotización principal con el número de referencia y los totales
    const updateQuery = `
      UPDATE "cotizaciones" 
      SET 
        numero_referencia = $1,
        total_costo = $2,
        total_s_cargo = $3,
        total_vat = $4,
        total_final = $5
      WHERE id_cotizacion = $6;
    `;
    const updateValues = [
      numero_referencia, total_costo, total_s_cargo, total_vat, total_final, idCotizacion
    ];
    await pool.query(updateQuery, updateValues);
    console.log('--- COTIZACIÓN ACTUALIZADA CON TOTALES Y REF ---');

    // 5. Crear el registro en la tabla de histórico con todos los datos, incluyendo totales
    const historicoQuery = `
      INSERT INTO "cotizaciones_historico" (
        id_cliente, id_cat_operacion, fecha_cotizacion, id_cliente_aeronave,
        nombre_responsable, nombre_solicitante, id_aeropuerto, fecha_llegada,
        aeropuerto_origen_id, tripulacion_llegada, pasajeros_llegada, id_fbo,
        fecha_salida, aeropuerto_destino_id, tripulacion_salida, pasajeros_salida,
        exchange_rate, id_cotizacion, numero_referencia, tipo_accion, version,
        total_costo, total_s_cargo, total_vat, total_final
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25);
    `;

    const historicoValues = [
      customer, flightType, date, aircraftModel, quotedBy,
      attn, station, eta, from, crewFrom, paxFrom, fbo,
      etd, to, crewTo, paxTo, exchangeRate,
      idCotizacion, numero_referencia, tipo_accion, version,
      total_costo, total_s_cargo, total_vat, total_final
    ];
    
    await pool.query(historicoQuery, historicoValues);
    console.log('--- REGISTRO DE HISTÓRICO CREADO ---');

    // 6. Enviar respuesta al cliente
    res.status(201).json({
      id_cotizacion: idCotizacion,
      numero_referencia: numero_referencia,
      message: 'Cotización y sus conceptos han sido creados exitosamente.'
    });

  } catch (err) {
    console.error('Error al procesar la solicitud:', err);
    res.status(500).json({
      error: 'Ocurrió un error al procesar la solicitud.',
      detalle: err.message
    });
  }
};

module.exports = { createQuote };