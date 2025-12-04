const pool = require('../config/db');

const createQuote = async (req, res) => {
  // Extrae los datos del formulario y el arreglo de servicios del cuerpo de la solicitud.
  // NOTA: Varios campos ahora son objetos { id, label } para el modelo SNAPSHOT.

  console.log("--- DEBUG BODY ---");
  console.log(req.body);
  console.log("--- FIN DEBUG ---");

  const {
    customer, flightType, date, aircraftModel, mtow, mtow_unit, quotedBy,
    attn, station, eta, from, crewFrom, paxFrom, fbo, isCaaMember,
    etd, to, crewTo, paxTo, exchangeRate,
    servicios // Este es el arreglo de servicios/conceptos
  } = req.body;

  // 1. Obtener un cliente del pool para la transacción
  const client = await pool.connect();

  try {
    // 2. Iniciar la transacción
    await client.query('BEGIN');

    // Función auxiliar para extraer ID y Texto de forma segura
    // Recibe: el valor (objeto/string/null) y si el TEXTO es obligatorio
    const procesarCampo = (valor, textoObligatorio = false, nombreCampo = '') => {
      let id = null;
      let texto = null;

      if (!valor) {
        // Si es null o undefined
        if (textoObligatorio) throw new Error(`El campo '${nombreCampo}' es obligatorio.`);
        return { id: null, texto: null };
      }

      if (typeof valor === 'object') {
        // Caso: Es un objeto { id: 1, label: "Texto" }
        id = valor.id || null;
        texto = valor.label || null;
      } else if (typeof valor === 'string') {
        // Caso: Es solo texto "Texto Nuevo" (Cliente nuevo o dato manual)
        id = null;
        texto = valor;
      }

      if (textoObligatorio && !texto) {
        throw new Error(`El campo '${nombreCampo}' requiere un nombre válido.`);
      }

      return { id, texto };
    };

    // --- APLICAMOS LA LÓGICA A CADA CAMPO ---

    // Cliente (Texto obligatorio, ID opcional)
    const datosCliente = procesarCampo(customer, true, 'Cliente');

    // Tipo de Vuelo (Texto obligatorio, ID usualmente obligatorio pero lo manejamos flexible)
    const datosOperacion = procesarCampo(flightType, true, 'Tipo de Vuelo');

    // Aeronave (Texto obligatorio - Matrícula)
    const datosAeronave = procesarCampo(aircraftModel, true, 'Matrícula/Modelo');

    // Estación (Texto obligatorio)
    const datosAeropuerto = procesarCampo(station, true, 'Aeropuerto');

    // FBO (Opcional)
    const datosFbo = procesarCampo(fbo, false);

    // Aeropuertos Origen/Destino (Opcionales en texto, pero si vienen, extraemos)
    const datosAeropuertoOrigen = procesarCampo(from, false);

    const datosAeropuertoDestino = procesarCampo(to, false);

    const idModeloAeronaveSnapshot = aircraftModel?.id_modelo_aeronave || null;
    const modeloSnapshot = aircraftModel?.modelo || null;
 
    const mtowSnapshot = mtow || null;

    const mtowUnitSnapshot = mtow_unit || null;

    // 3. Insertar la cotización principal para obtener los IDs generados por la BD.
    const cotizacionQuery = `
      INSERT INTO "cotizaciones_historico" (
        id_cotizacion, numero_referencia, fecha_cotizacion, nombre_responsable, 
        nombre_solicitante, es_miembro_caa, exchange_rate,
        fecha_llegada, tripulacion_llegada, pasajeros_llegada,
        fecha_salida, tripulacion_salida, pasajeros_salida,
        tipo_accion, estatus, version,

        -- Campos de relación y snapshot
        id_cliente, cliente, 
        id_cat_operacion, cat_operacion,
        id_cliente_aeronave, id_modelo_aeronave, matricula_aeronave, 
        modelo_aeronave, mtow, mtow_unit,
        id_aeropuerto, aeropuerto,
        id_fbo, fbo,
        aeropuerto_origen_id, aeropuerto_origen,
        aeropuerto_destino_id, aeropuerto_destino
      ) 
      VALUES (nextval('cotizacion_id_seq'), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
      RETURNING id_historico, id_cotizacion, numero_referencia;
    `;

    // El número de referencia ahora es temporal. Se asignará el secuencial al final.
    const tempRef = `PENDIENTE-${Date.now()}`;
    const tipo_accion = 'CREADA';
    const estatus = 'ACTIVA';
    const version = 1;

    const cotizacionValues = [
      tempRef, date, quotedBy, attn, isCaaMember, exchangeRate,
      eta, crewFrom, paxFrom,
      etd, crewTo, paxTo,
      tipo_accion, estatus, version,
      // Asignando ID y Snapshot para cada campo. El orden debe coincidir con la consulta INSERT.

      datosCliente.id,     datosCliente.texto,     // $15, $16
      datosOperacion.id,   datosOperacion.texto,   // $17, $18
      datosAeronave.id,                           // id_cliente_aeronave (si existe)
      idModeloAeronaveSnapshot,                   // id_modelo_aeronave (si se seleccionó un modelo)
      datosAeronave.texto,                        // Matrícula (Texto)
      modeloSnapshot,                             // Modelo (Texto)
      mtowSnapshot,                               // MTOW
      mtowUnitSnapshot,                           // MTOW Unit
      datosAeropuerto.id, datosAeropuerto.texto,
      datosFbo.id, datosFbo.texto,
      datosAeropuertoOrigen.id, datosAeropuertoOrigen.texto,
      datosAeropuertoDestino.id, datosAeropuertoDestino.texto
    ];

    const result = await client.query(cotizacionQuery, cotizacionValues);
    const { id_historico, id_cotizacion } = result.rows[0];
    console.log(`--- COTIZACIÓN BASE INSERTADA. ID Histórico: ${id_historico}, ID Cotización: ${id_cotizacion} ---`);

    // 4. Insertar cada concepto en 'cotizacion_conceptos' y calcular los totales.
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
      // FIX: Desestructurar las propiedades del objeto 'servicio'
      const {
        nombre_servicio, cantidad, costo_mxn, costo_usd,
        sc_porcentaje, vat_porcentaje, s_cargo, vat, total_usd
      } = servicio;

      const conceptosValues = [
        id_cotizacion, nombre_servicio, cantidad, costo_mxn, costo_usd,
        sc_porcentaje, vat_porcentaje, s_cargo, vat, total_usd
      ];
      await client.query(conceptosQuery, conceptosValues);

      // Acumular totales
      total_costo += parseFloat(costo_usd || 0) * parseInt(cantidad || 1);
      total_s_cargo += parseFloat(s_cargo || 0);
      total_vat += parseFloat(vat || 0);
      total_final += parseFloat(total_usd || 0);
    }
    console.log('--- CONCEPTOS INSERTADOS Y TOTALES CALCULADOS ---');

    // 5. Actualizar la cotización con los totales calculados (aún con la referencia temporal).
    const updateTotalsQuery = `
      UPDATE "cotizaciones_historico" 
      SET total_costo = $1, total_s_cargo = $2, total_vat = $3, total_final = $4
      WHERE id_historico = $5;
    `;
    await client.query(updateTotalsQuery, [total_costo, total_s_cargo, total_vat, total_final, id_historico]);
    console.log('--- COTIZACIÓN ACTUALIZADA CON TOTALES ---');

    // 6. Si todo fue exitoso, confirmar la transacción.
    await client.query('COMMIT');
    console.log('--- TRANSACCIÓN COMPLETADA (COMMIT) ---');

    // 7. AHORA, DESPUÉS DEL COMMIT, generamos el número de referencia secuencial y final.
    // Esto garantiza que no se creen huecos si una transacción anterior falló.
    const refResult = await pool.query("SELECT COALESCE(MAX(CAST(split_part(numero_referencia, '/', 1) AS INTEGER)), 0) + 1 as next_ref FROM cotizaciones_historico WHERE numero_referencia NOT LIKE 'PENDIENTE-%'");
    const nextRefNumber = refResult.rows[0].next_ref;
    const añoActual = new Date().getFullYear().toString().slice(-2);
    const numero_referencia = `${nextRefNumber}/${añoActual}`;

    const updateQuery = `
      UPDATE "cotizaciones_historico" 
      SET 
        numero_referencia = $1,
        total_costo = $2,
        total_s_cargo = $3,
        total_vat = $4,
        total_final = $5
      WHERE id_historico = $6; -- Usamos id_historico que es la PK
    `;
    const updateValues = [
      numero_referencia, total_costo, total_s_cargo, total_vat, total_final, id_historico
    ];
    await client.query(updateQuery, updateValues);
    console.log('--- COTIZACIÓN ACTUALIZADA CON NÚMERO DE REFERENCIA FINAL:', numero_referencia);

    // 8. Enviar respuesta al cliente con el número de referencia final.
    res.status(201).json({
      id_cotizacion: id_cotizacion,
      numero_referencia: numero_referencia,
      message: 'Cotización y sus conceptos han sido creados exitosamente.'
    });

  } catch (err) {
    // Si ocurre cualquier error, revertir la transacción
    await client.query('ROLLBACK');
    console.error('--- ERROR EN LA TRANSACCIÓN, SE HIZO ROLLBACK ---');
    console.error('Error al procesar la solicitud:', err);
    res.status(500).json({
      error: 'Ocurrió un error al procesar la solicitud.',
      detalle: err.message
    });
  } finally {
    // En cualquier caso (éxito o error), liberar el cliente para devolverlo al pool
    client.release();
  }
};

const getCotizacionesByStatus = async (status, res) => {
  try {
    const queryText = `
    SELECT
      ch.id_cotizacion,
      ch.numero_referencia,
      ch.fecha_modificacion AS fecha_creacion,
      ch.fecha_llegada,
      ch.estatus,
      ch.fecha_salida,
      ch.total_final,
      ch.exchange_rate,
      -- Usamos los campos SNAPSHOT para mostrar los datos históricos correctos
      ch.cliente AS nombre_cliente,
      ch.cat_operacion AS nombre_cat_operacion,
      ch.aeropuerto AS icao_aeropuerto,
      ch.matricula_aeronave,
      ch.total_en_palabras,
      COALESCE(am.icao_aeronave, ch.modelo_aeronave) AS icao_aeronave
    FROM
      "cotizaciones_historico" AS ch
    LEFT JOIN 
      "aeronaves_modelos" AS am ON ch.id_modelo_aeronave = am.id_modelo_aeronave
    WHERE
      ch.estatus = $1
    ORDER BY
      ch.id_cotizacion DESC
    `;
    const result = await pool.query(queryText, [status]);
    res.json(result.rows);
  } catch (err) {
    console.error(`Error al obtener cotizaciones con estado ${status}:`, err);
    res.status(500).json({ error: `Error interno del servidor al obtener cotizaciones con estado ${status}.` });
  }
};

const getCotizacionesHistorico = (req, res) => getCotizacionesByStatus('ACTIVA', res);

const getCotizacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const quoteQuery = 'SELECT * FROM "cotizaciones_historico" WHERE id_cotizacion = $1';
    const quoteResult = await pool.query(quoteQuery, [id]);

    if (quoteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    const conceptsQuery = 'SELECT * FROM "cotizacion_conceptos" WHERE id_cotizacion = $1';
    const conceptsResult = await pool.query(conceptsQuery, [id]); // Los conceptos se ligan por id_cotizacion

    const quote = quoteResult.rows[0];
    const concepts = conceptsResult.rows;

    res.json({ ...quote, servicios: concepts });
  } catch (err) {
    console.error('Error fetching quote by id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteQuote = async (req, res) => {
  // 1. Obtener un cliente del pool de conexiones
  const client = await pool.connect();
  const { id } = req.params;

  try {
    const updateQuery = `
      UPDATE "cotizaciones_historico"
      SET estatus = 'INACTIVA'
      WHERE id_cotizacion = $1;
    `;
    const result = await client.query(updateQuery, [id]);

    // 3. Verificar si se afectó alguna fila
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }
    res.json({ message: 'Cotización marcada como INACTIVA exitosamente.' });
  } catch (err) {
    console.error('Error al eliminar la cotización:', err);
    res.status(500).json({ error: 'Error interno del servidor al eliminar la cotización.' });
  } finally {
    // 5. Liberar el cliente en cualquier caso (éxito o error)
    client.release();
  }
};

const getCotizacionesEliminadas = (req, res) => getCotizacionesByStatus('INACTIVA', res);

/**
 * Une varias cotizaciones existentes en una nueva cotización agregada.
 *
 * Reglas de negocio implementadas:
 * - Se requieren al menos 2 ids de cotización.
 * - Todas las cotizaciones deben tener el mismo cliente.
 * - Todas las cotizaciones deben tener la misma matrícula de aeronave.
 * - Los campos de encabezado / snapshot se toman de la PRIMERA cotización seleccionada.
 * - Los servicios de todas las cotizaciones se copian a la nueva cotización (sin mezclarlos),
 *   y los totales se recalculan sumando sus importes.
 * - Se registra en el campo `total_en_palabras` un texto del tipo:
 *     "JOIN OF: 123/25, 130/25, 140/25"
 *   para identificar fácilmente el origen de la unión sin cambiar el esquema.
 */
const joinQuotes = async (req, res) => {
  const { ids } = req.body || {};

  if (!Array.isArray(ids) || ids.length < 2) {
    return res.status(400).json({
      error: 'Debes proporcionar al menos dos ids de cotización para unir.',
    });
  }

  // Normalizar ids a enteros únicos
  const uniqueIds = [...new Set(ids.map((id) => parseInt(id, 10)).filter(Boolean))];
  if (uniqueIds.length < 2) {
    return res.status(400).json({
      error: 'Los ids de cotización proporcionados no son válidos.',
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1) Obtener cotizaciones base
    const quotesResult = await client.query(
      `
        SELECT *
        FROM "cotizaciones_historico"
        WHERE id_cotizacion = ANY($1::bigint[])
        ORDER BY id_cotizacion ASC
      `,
      [uniqueIds],
    );

    if (quotesResult.rows.length < 2) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        error: 'No se encontraron suficientes cotizaciones para unir.',
      });
    }

    const baseQuotes = quotesResult.rows;
    const firstQuote = baseQuotes[0];

    // 2) Validar que todas las cotizaciones tengan el mismo cliente y misma matrícula de aeronave
    const firstCliente = firstQuote.cliente || firstQuote.id_cliente;
    const firstMatricula = firstQuote.matricula_aeronave;

    for (let i = 1; i < baseQuotes.length; i++) {
      const quote = baseQuotes[i];
      const quoteCliente = quote.cliente || quote.id_cliente;
      const quoteMatricula = quote.matricula_aeronave;

      if (firstCliente !== quoteCliente) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'No se pueden unir cotizaciones de diferentes clientes. Todas las cotizaciones seleccionadas deben tener el mismo cliente.',
        });
      }

      if (firstMatricula !== quoteMatricula) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'No se pueden unir cotizaciones con diferentes matrículas de aeronave. Todas las cotizaciones seleccionadas deben tener la misma matrícula.',
        });
      }
    }

    // 3) Obtener todos los conceptos de esas cotizaciones
    const conceptosResult = await client.query(
      `
        SELECT *
        FROM "cotizacion_conceptos"
        WHERE id_cotizacion = ANY($1::bigint[])
        ORDER BY id_cotizacion ASC, id_cotizacion_concepto ASC
      `,
      [uniqueIds],
    );
    const allConcepts = conceptosResult.rows;

    // 4) Calcular totales combinados
    let total_costo = 0;
    let total_s_cargo = 0;
    let total_vat = 0;
    let total_final = 0;

    for (const concepto of allConcepts) {
      const {
        cantidad,
        costo_usd,
        s_cargo,
        vat,
        total_usd,
      } = concepto;

      total_costo += (parseFloat(costo_usd || 0) * parseInt(cantidad || 1, 10));
      total_s_cargo += parseFloat(s_cargo || 0);
      total_vat += parseFloat(vat || 0);
      total_final += parseFloat(total_usd || 0);
    }

    // 5) Generar nuevo id_cotizacion a partir de la secuencia
    const seqResult = await client.query('SELECT nextval(\'cotizacion_id_seq\') AS new_id_cotizacion');
    const newIdCotizacion = seqResult.rows[0].new_id_cotizacion;

    // 6) Insertar nueva fila en cotizaciones_historico con referencia temporal
    const tempRef = `PENDIENTE-JOIN-${Date.now()}`;
    const tipo_accion = 'CREADA';
    const version = 1;

    // Construimos un texto que indique de qué cotizaciones proviene la unión
    // También extraemos las estaciones únicas de todas las cotizaciones unidas
    const joinedRefs = baseQuotes
      .map((q) => q.numero_referencia)
      .filter(Boolean);
    const joinedStations = [...new Set(baseQuotes
      .map((q) => q.aeropuerto)
      .filter(Boolean))];

    const joinedRefsText = `JOIN OF: ${joinedRefs.join(', ')}`;
    const joinedStationsText = joinedStations.length > 0 ? `STATIONS: ${joinedStations.join(', ')}` : '';
    const fullJoinedText = `${joinedRefsText}${joinedStationsText ? ' | ' + joinedStationsText : ''}`;

    const insertQuery = `
      INSERT INTO "cotizaciones_historico" (
        id_cotizacion,
        numero_referencia,
        fecha_cotizacion,
        nombre_solicitante,
        nombre_responsable,
        exchange_rate,
        es_miembro_caa,
        fecha_llegada,
        fecha_salida,
        tripulacion_llegada,
        pasajeros_llegada,
        tripulacion_salida,
        pasajeros_salida,

        id_cliente,
        id_cat_operacion,
        id_cliente_aeronave,
        id_aeropuerto,
        id_fbo,
        aeropuerto_origen_id,
        aeropuerto_destino_id,

        cliente,
        cat_operacion,
        matricula_aeronave,
        modelo_aeronave,
        mtow,
        mtow_unit,
        aeropuerto,
        fbo,
        aeropuerto_origen,
        aeropuerto_destino,

        total_costo,
        total_s_cargo,
        total_vat,
        total_final,
        total_en_palabras,

        tipo_accion,
        version
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26, $27, $28, $29, $30, $31,
        $32, $33, $34, $35, $36,
        $37
      )
      RETURNING id_historico, id_cotizacion, numero_referencia;
    `;

    const insertValues = [
      newIdCotizacion,
      tempRef,
      // Datos básicos: tomamos la fecha actual como fecha de cotización unida
      new Date(),
      firstQuote.nombre_solicitante,
      firstQuote.nombre_responsable,
      firstQuote.exchange_rate,
      firstQuote.es_miembro_caa,
      firstQuote.fecha_llegada,
      firstQuote.fecha_salida,
      firstQuote.tripulacion_llegada,
      firstQuote.pasajeros_llegada,
      firstQuote.tripulacion_salida,
      firstQuote.pasajeros_salida,

      // Relaciones y snapshots heredados de la primera cotización
      firstQuote.id_cliente,
      firstQuote.id_cat_operacion,
      firstQuote.id_cliente_aeronave,
      firstQuote.id_aeropuerto,
      firstQuote.id_fbo,
      firstQuote.aeropuerto_origen_id,
      firstQuote.aeropuerto_destino_id,

      firstQuote.cliente,
      firstQuote.cat_operacion,
      firstQuote.matricula_aeronave,
      firstQuote.modelo_aeronave,
      firstQuote.mtow,
      firstQuote.mtow_unit,
      firstQuote.aeropuerto,
      firstQuote.fbo,
      firstQuote.aeropuerto_origen,
      firstQuote.aeropuerto_destino,

      total_costo,
      total_s_cargo,
      total_vat,
      total_final,
      fullJoinedText,

      tipo_accion,
      version,
    ];

    const insertResult = await client.query(insertQuery, insertValues);
    const { id_historico } = insertResult.rows[0];

    // 7) Insertar conceptos combinados apuntando al nuevo id_cotizacion
    const conceptosInsertQuery = `
      INSERT INTO "cotizacion_conceptos" (
        id_cotizacion,
        id_precio_concepto,
        nombre_servicio,
        cantidad,
        costo_mxn,
        costo_usd,
        sc_porcentaje,
        vat_porcentaje,
        s_cargo,
        vat,
        total_usd
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11
      )
    `;

    for (const concepto of allConcepts) {
      const {
        id_precio_concepto,
        nombre_servicio,
        cantidad,
        costo_mxn,
        costo_usd,
        sc_porcentaje,
        vat_porcentaje,
        s_cargo,
        vat,
        total_usd,
      } = concepto;

      const conceptosValues = [
        newIdCotizacion,
        id_precio_concepto,
        nombre_servicio,
        cantidad,
        costo_mxn,
        costo_usd,
        sc_porcentaje,
        vat_porcentaje,
        s_cargo,
        vat,
        total_usd,
      ];

      await client.query(conceptosInsertQuery, conceptosValues);
    }

    await client.query('COMMIT');

    // 8) Fuera de la transacción, generar el número de referencia secuencial definitivo
    const refResult = await pool.query(
      "SELECT COALESCE(MAX(CAST(split_part(numero_referencia, '/', 1) AS INTEGER)), 0) + 1 as next_ref FROM cotizaciones_historico WHERE numero_referencia NOT LIKE 'PENDIENTE-%'",
    );
    const nextRefNumber = refResult.rows[0].next_ref;
    const añoActual = new Date().getFullYear().toString().slice(-2);
    const numero_referencia = `${nextRefNumber}/${añoActual}`;

    const updateRefQuery = `
      UPDATE "cotizaciones_historico"
      SET
        numero_referencia = $1,
        total_costo = $2,
        total_s_cargo = $3,
        total_vat = $4,
        total_final = $5
      WHERE id_historico = $6
      RETURNING *;
    `;
    const updateRefValues = [
      numero_referencia,
      total_costo,
      total_s_cargo,
      total_vat,
      total_final,
      id_historico,
    ];

    const finalResult = await pool.query(updateRefQuery, updateRefValues);
    const newQuote = finalResult.rows[0];

    // 9) Volver a traer los conceptos para responder al frontend
    const finalConceptsResult = await pool.query(
      'SELECT * FROM "cotizacion_conceptos" WHERE id_cotizacion = $1 ORDER BY id_cotizacion_concepto ASC',
      [newIdCotizacion],
    );
    const finalConcepts = finalConceptsResult.rows;

    return res.status(201).json({
      message: 'Cotización unida creada correctamente.',
      quote: newQuote,
      servicios: finalConcepts,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error al unir cotizaciones:', err);
    return res.status(500).json({
      error: 'Ocurrió un error al unir las cotizaciones.',
      detalle: err.message,
    });
  } finally {
    client.release();
  }
};

module.exports = {
  createQuote,
  getCotizacionesHistorico,
  getCotizacionById,
  joinQuotes,
  deleteQuote, 
  getCotizacionesEliminadas 
};