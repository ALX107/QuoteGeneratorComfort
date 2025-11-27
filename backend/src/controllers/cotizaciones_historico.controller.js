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

    const modeloSnapshot = aircraftModel?.modelo || req.body.aircraftModelName || null;
 
    const mtowSnapshot = mtow || null;
    
    const mtowUnitSnapshot = mtow_unit || null;

    // 3. Insertar la cotización principal para obtener los IDs generados por la BD.
    const cotizacionQuery = `
      INSERT INTO "cotizaciones_historico" (
        id_cotizacion, numero_referencia, fecha_cotizacion, nombre_responsable, 
        nombre_solicitante, es_miembro_caa, exchange_rate,
        fecha_llegada, tripulacion_llegada, pasajeros_llegada,
        fecha_salida, tripulacion_salida, pasajeros_salida,
        tipo_accion, version,

        -- Campos de relación y snapshot
        id_cliente, cliente, 
        id_cat_operacion, cat_operacion,
        id_cliente_aeronave, matricula_aeronave, 
        modelo_aeronave, mtow, mtow_unit,
        id_aeropuerto, aeropuerto,
        id_fbo, fbo,
        aeropuerto_origen_id, aeropuerto_origen,
        aeropuerto_destino_id, aeropuerto_destino
      ) 
      VALUES (nextval('cotizacion_id_seq'), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
      RETURNING id_historico, id_cotizacion, numero_referencia;
    `;

    // El número de referencia ahora es temporal. Se asignará el secuencial al final.
    const tempRef = `PENDIENTE-${Date.now()}`;
    const tipo_accion = 'CREADA';
    const version = 1;

    const cotizacionValues = [
      tempRef, date, quotedBy, attn, isCaaMember, exchangeRate,
      eta, crewFrom, paxFrom,
      etd, crewTo, paxTo,
      tipo_accion, version,
      // Asignando ID y Snapshot para cada campo. El orden debe coincidir con la consulta INSERT.

      datosCliente.id,     datosCliente.texto,     // $15, $16
      datosOperacion.id,   datosOperacion.texto,   // $17, $18
      datosAeronave.id,    datosAeronave.texto,    // Matrícula (ID y Texto)
      modeloSnapshot,                             // Modelo (Texto)
      mtowSnapshot,                               // MTOW
      mtowUnitSnapshot,                           // MTOW Unit
      datosAeropuerto.id,    datosAeropuerto.texto,
      datosFbo.id,        datosFbo.texto,
      datosAeropuertoOrigen.id,      datosAeropuertoOrigen.texto,
      datosAeropuertoDestino.id,     datosAeropuertoDestino.texto
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

const getCotizacionesHistorico = async (req, res) => {
  try {
    // Esta consulta une el histórico con otras 4 tablas para obtener datos legibles.
    const query = `
    SELECT
      ch.id_cotizacion,
      ch.numero_referencia,
      ch.fecha_modificacion AS fecha_creacion,
      ch.fecha_llegada,
      ch.fecha_salida,
      ch.total_final,
      ch.exchange_rate,
      -- Usamos los campos SNAPSHOT para mostrar los datos históricos correctos
      ch.cliente AS nombre_cliente,
      ch.cat_operacion AS nombre_cat_operacion,
      ch.aeropuerto AS icao_aeropuerto,
      ch.matricula_aeronave,
      -- FIX: Usar COALESCE para mostrar el ICAO si existe, o el texto manual si no.
      -- Si am.icao_aeronave es NULL (porque el JOIN falló o el campo es nulo),
      -- se mostrará el valor de ch.modelo_aeronave (el snapshot).
      COALESCE(am.icao_aeronave, ch.modelo_aeronave) AS icao_aeronave
    FROM
      "cotizaciones_historico" AS ch
    LEFT JOIN "clientes_aeronaves" AS ca ON ch.id_cliente_aeronave = ca.id_cliente_aeronave
    LEFT JOIN "aeronaves_modelos" AS am ON ca.id_modelo_aeronave = am.id_modelo_aeronave
    ORDER BY
      ch.id_cotizacion DESC
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener el histórico de cotizaciones:', err);
    res.status(500).json({ error: 'Error interno del servidor al obtener cotizaciones.' });
  }
};

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

module.exports = {
  createQuote,
  getCotizacionesHistorico,
  getCotizacionById,
};