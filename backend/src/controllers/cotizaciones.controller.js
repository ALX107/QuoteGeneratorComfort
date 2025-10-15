const pool = require('../config/db');

const createQuote = async (req, res) => {

  try {

    // Extrae los datos enviados desde el formulario del frontend del cuerpo de la solicitud.
    const {
      customer, flightType, date, aircraftModel, quotedBy,
      attn, station, eta, from, crewFrom, paxFrom, fbo,
      etd, to, crewTo, paxTo, exchangeRate
    } = req.body;
    
    //Crear la cotización principal para obtener su ID autogenerado (solo datos del formulario)
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
    
    // Ejecuta la primera consulta y espera el resultado.
    const nuevaCotizacionResult = await pool.query(cotizacionQuery, cotizacionValues);
    // Extrae el ID de la respuesta. `rows[0]` contiene la primera (y única) fila devuelta.
    const idCotizacion = nuevaCotizacionResult.rows[0].id_cotizacion;
    console.log('--- PRIMER INSERT EXITOSO. ID OBTENIDO:', idCotizacion);

    const añoActual = new Date().getFullYear().toString().slice(-2);
    const numero_referencia = `${idCotizacion}/${añoActual}`;
    const tipo_accion = 'CREADA';
    const version = 1;

    //Actualizar la cotización principal con el número de referencia
    const updateQuery = `
      UPDATE "cotizaciones" 
      SET numero_referencia = $1 
      WHERE id_cotizacion = $2;
    `;
        
    // Se ejecuta la consulta de actualización
    await pool.query(updateQuery, [numero_referencia, idCotizacion]);

    //Crear el registro en la tabla de histórico con todos los datos
    const historicoQuery = `
      INSERT INTO "cotizaciones_historico" (
        id_cliente, id_cat_operacion, fecha_cotizacion, id_cliente_aeronave,
        nombre_responsable, nombre_solicitante, id_aeropuerto, fecha_llegada,
        aeropuerto_origen_id, tripulacion_llegada, pasajeros_llegada, id_fbo,
        fecha_salida, aeropuerto_destino_id, tripulacion_salida, pasajeros_salida,
        exchange_rate, id_cotizacion, numero_referencia, tipo_accion, version
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21);
    `;

    // El array de valores ahora incluye tanto los datos del formulario como los generados en el backend.
    const historicoValues = [
      customer, flightType, date, aircraftModel, quotedBy,
      attn, station, eta, from, crewFrom, paxFrom, fbo,
      etd, to, crewTo, paxTo, exchangeRate,
      idCotizacion, numero_referencia, tipo_accion, version
    ];
    
    // Ejecuta la consulta para guardar el registro histórico.
    await pool.query(historicoQuery, historicoValues);

    res.status(201).json({
      id_cotizacion: idCotizacion,
      numero_referencia: numero_referencia,
      message: 'Cotización creada exitosamente.'
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