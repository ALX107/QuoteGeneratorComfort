-- =================================================================
-- SCRIPT DE INSERCIÓN DE DATOS DE PRUEBA
-- =================================================================
-- Se insertan datos en orden de dependencia para respetar las
-- restricciones de llaves foráneas.
-- =================================================================

-- ========= TABLAS INDEPENDIENTES (Nivel 0) =========

-- 1. Insertar Clientes
INSERT INTO clientes (id_cliente, nombre_cliente, email_cliente, telefono_cliente, pais_cliente) VALUES
(1, 'Aviation Services Inc.', 'contact@aviationservices.com', '555-123-4567', 'Estados Unidos'),
(2, 'Global Jet Charter', 'ops@globaljet.com', '555-987-6543', 'México'),
(3, 'Ejecutivos Aéreos de México', 'contacto@eam.mx', '555-555-5555', 'México');

-- 2. Insertar Aeropuertos (usando ICAO reales de México)
INSERT INTO aeropuertos (id_aeropuerto, icao_aeropuerto, nombre_aeropuerto, ciudad_aeropuerto, estado_aeropuerto, pais_aeropuerto, clasificacion_aeropuerto, grupo_aeropuerto) VALUES
(1, 'MMMX', 'Aeropuerto Internacional de la Ciudad de México', 'Ciudad de México', 'CDMX', 'México', 'Comercial', 'Grupo Aeroportuario de la Ciudad de México'),
(2, 'MMGL', 'Aeropuerto Internacional de Guadalajara', 'Guadalajara', 'Jalisco', 'México', 'Comercial', 'Grupo Aeroportuario del Pacífico'),
(3, 'MMMY', 'Aeropuerto Internacional de Monterrey', 'Monterrey', 'Nuevo León', 'México', 'Comercial', 'Grupo Aeroportuario Centro Norte'),
(4, 'MMUN', 'Aeropuerto Internacional de Cancún', 'Cancún', 'Quintana Roo', 'México', 'Comercial', 'ASUR');

-- 3. Insertar Categorías de Operaciones
INSERT INTO categorias_operaciones (id_cat_operacion, nombre_cat_operacion) VALUES
(1, 'Handling Completo'),
(2, 'Catering'),
(3, 'Permisos de Vuelo'),
(4, 'Transporte Terrestre');

-- 4. Insertar Categorías de Conceptos (Servicios)
INSERT INTO categorias_conceptos (id_cat_concepto, nombre_cat_concepto) VALUES
(1, 'Servicios de Rampa'),
(2, 'Servicios a Pasajeros'),
(3, 'Combustible'),
(4, 'Catering VIP');


-- ========= TABLAS DEPENDIENTES (Nivel 1) =========

-- 5. Insertar Aeronaves (asociadas a los clientes)
INSERT INTO aeronaves (id_aeronave, icao_aeronave, nombre_aeronave, mtow_aeronave, envergadura_aeronave, es_miembro_caa, matricula_aeronave, id_cliente) VALUES
(1, 'C750', 'Cessna Citation X', 16.6, 19.4, true, 'XA-ABC', 2),
(2, 'GLEX', 'Bombardier Global Express', 44.5, 28.5, false, 'N123US', 1),
(3, 'LJ45', 'Learjet 45', 9.75, 14.56, true, 'XA-MEX', 3);

-- 6. Insertar FBOs (asociados a los aeropuertos)
INSERT INTO fbos (id_fbo, nombre_fbo, grupo_fbo, id_aeropuerto) VALUES
(1, 'Manny Aviation Services', 'Manny Group', 1), -- En MMMX
(2, 'Universal Aviation', 'Universal Weather and Aviation', 1), -- En MMMX
(3, 'Aerolíneas Ejecutivas', 'ALE', 3); -- En MMMY

-- 7. Insertar Conceptos Estandarizados (asociados a categorías de conceptos)
INSERT INTO conceptos_estandarizados (id_concepto_std, nombre_concepto_default, id_categoria_concepto) VALUES
(1, 'Arrastre de Aeronave (Push-back)', 1),
(2, 'Unidad de Potencia Externa (GPU)', 1),
(3, 'Agua Potable y Sanidad', 1),
(4, 'Sala VIP', 2),
(5, 'Coordinación de Combustible Jet-A1', 3);

-- 8. Insertar Servicios Especiales para Clientes
INSERT INTO servicios_cliente_especiales (id_cliente, nombre_servicio, costo_servicio) VALUES
(2, 'Kit de Bienvenida VIP para Global Jet', 250.00); -- Un servicio especial solo para el cliente con ID 2


-- ========= TABLAS DEPENDIENTES (Nivel 2) =========

-- 9. Insertar Precios para los conceptos (algunos generales, otros por aeropuerto/FBO)
INSERT INTO precios_conceptos (id_precio_concepto, nombre_local_concepto, costo_concepto, divisa, id_concepto_std, id_aeropuerto, id_fbo) VALUES
(1, 'Arrastre de Aeronave', 200.00, 'USD', 1, NULL, NULL), -- Precio general
(2, 'GPU por hora', 150.00, 'USD', 2, 1, NULL), -- Precio específico para MMMX
(3, 'Servicio de Agua y Lavatorio', 180.00, 'USD', 3, 1, 1), -- Precio específico para el FBO Manny en MMMX
(4, 'Acceso a Sala VIP por pasajero', 75.00, 'USD', 4, NULL, NULL),
(5, 'Coordinación de Combustible', 100.00, 'USD', 5, 1, NULL);


-- ========= TABLAS DEPENDIENTES (Nivel 3) =========

-- 10. Insertar una Cotización principal
INSERT INTO cotizaciones (
    id_cotizacion, numero_referencia, fecha_cotizacion, nombre_solicitante, nombre_responsable, exchange_rate,
    id_cliente, id_cat_operacion, id_aeronave, id_aeropuerto, id_fbo,
    fecha_llegada, fecha_salida, aeropuerto_origen_id, aeropuerto_destino_id,
    tripulacion_llegada, pasajeros_llegada, tripulacion_salida, pasajeros_salida
    -- Los totales se dejan nulos, ya que normalmente se calculan después de insertar los conceptos.
) VALUES (
    1, 'REF-2025-001', '2025-09-29', 'Juan Pérez', 'Ana García', 17.50,
    2, 1, 1, 1, 1, -- Cliente: Global Jet, Op: Handling, Aeronave: XA-ABC, Aeropuerto: MMMX, FBO: Manny
    '2025-10-05', '2025-10-07', 2, 4, -- Origen: MMGL, Destino: MMUN
    2, 6, 2, 6
);


-- ========= TABLAS DEPENDIENTES (Nivel 4) =========

-- 11. Insertar los conceptos asociados a la cotización anterior (ID 1)
-- Para este ejemplo, asumimos un Service Charge (sc) del 10% y un IVA (vat) del 16%
INSERT INTO cotizacion_conceptos (
    id_cotizacion, id_precio_concepto, nombre_servicio, cantidad, costo_mxn, costo_usd,
    sc_porcentaje, vat_porcentaje, s_cargo, vat, total_usd
) VALUES
-- Concepto 1: Arrastre (Precio Específico de FBO)
(1, 3, 'Servicio de Agua y Lavatorio', 1, 3150.00, 180.00, 10.00, 16.00, 18.00, 31.68, 229.68),
-- Concepto 2: GPU (Precio Específico de Aeropuerto)
(1, 2, 'GPU por hora', 2, 5250.00, 300.00, 10.00, 16.00, 30.00, 52.80, 382.80),
-- Concepto 3: Sala VIP (Precio General)
(1, 4, 'Acceso a Sala VIP por pasajero', 6, 7875.00, 450.00, 10.00, 16.00, 45.00, 79.20, 574.20);

-- NOTA: Los campos de totales en la tabla 'cotizaciones' (total_costo, total_final, etc.)
-- deberían ser actualizados mediante un UPDATE después de insertar los conceptos.
-- Por ejemplo: UPDATE cotizaciones SET total_final = (229.68 + 382.80 + 574.20) WHERE id_cotizacion = 1;


-- 12. Insertar un registro en el historial para la cotización recién creada
INSERT INTO cotizaciones_historico (
    id_cotizacion, numero_referencia, fecha_cotizacion, nombre_solicitante, nombre_responsable, exchange_rate,
    id_cliente, id_cat_operacion, id_aeronave, id_aeropuerto, id_fbo,
    fecha_llegada, fecha_salida, aeropuerto_origen_id, aeropuerto_destino_id,
    tripulacion_llegada, pasajeros_llegada, tripulacion_salida, pasajeros_salida,
    total_final, -- Suponiendo que ya se calculó el total
    fecha_modificacion, usuario_modificacion, tipo_accion, version
) VALUES (
    1, 'REF-2025-001', '2025-09-29', 'Juan Pérez', 'Ana García', 17.50,
    2, 1, 1, 1, 1, -- Cliente: Global Jet, Op: Handling, Aeronave: XA-ABC, Aeropuerto: MMMX, FBO: Manny
    '2025-10-05', '2025-10-07', 2, 4, -- Origen: MMGL, Destino: MMUN
    2, 6, 2, 6,
    1186.68, -- Total calculado de los conceptos insertados
    CURRENT_TIMESTAMP, 'Ana García', 'CREADA', 1
);