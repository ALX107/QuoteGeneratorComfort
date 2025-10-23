-- ========= INSERCIÓN DE DATOS EN TABLAS INDEPENDIENTES =========

-- Clientes (5 clientes de ejemplo)
INSERT INTO clientes (id_cliente, nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, ciudad_cliente, estado_cliente, pais_cliente, zip_cliente, contacto_cliente) VALUES
(1, 'AeroCharter Internacional', 'contacto@charterint.com', '+1-202-555-0176', '123 Aviation Avenue', 'Miami', 'Florida', 'USA', '33101', 'Juan Pérez'),
(2, 'Vuelos Ejecutivos de Lujo', 'ops@vueloslujo.net', '+44 20 7946 0958', '456 Business Jet Rd.', 'Londres', 'Inglaterra', 'Reino Unido', 'SW1A 0AA', 'Laura Gómez'),
(3, 'Global Jet Services', 'info@globaljets.com', '+52-55-5555-1234', 'Av. Reforma 789', 'Ciudad de México', 'CDMX', 'México', '06500', 'Carlos Rodríguez'),
(4, 'Transportes Aéreos Rápidos', 'soporte@aerorapido.com.mx', '+52-81-8345-6789', 'Parque Industrial 100', 'Monterrey', 'Nuevo León', 'México', '64000', 'Sofía Hernández'),
(5, 'Servicios Aéreos del Pacífico', 'reservas@pacificair.com', '+1-310-555-0123', '555 Ocean View Blvd', 'Los Angeles', 'California', 'USA', '90001', 'David Chen');

-- Aeropuertos (4 aeropuertos de ejemplo)
INSERT INTO aeropuertos (id_aeropuerto, icao_aeropuerto, nombre_aeropuerto, ciudad_aeropuerto, estado_aeropuerto, pais_aeropuerto, clasificacion_aeropuerto, grupo_aeropuerto) VALUES
(1, 'MMMX', 'Aeropuerto Internacional de la Ciudad de México', 'Ciudad de México', 'CDMX', 'México', 'Comercial/Carga', 'Grupo Aeroportuario de la Ciudad de México'),
(2, 'MMTO', 'Aeropuerto Internacional de Toluca', 'Toluca', 'Estado de México', 'México', 'General/Ejecutivo', 'Aleatica'),
(3, 'KLAX', 'Los Angeles International Airport', 'Los Angeles', 'California', 'USA', 'Comercial/Carga', 'Los Angeles World Airports'),
(4, 'EGLL', 'Heathrow Airport', 'Londres', 'Inglaterra', 'Reino Unido', 'Comercial/Carga', 'Heathrow Airport Holdings');

-- Categorías de Operaciones
INSERT INTO categorias_operaciones (id_cat_operacion, nombre_cat_operacion) VALUES
(1, 'N/A'),
(2, 'AMBULANCE / FAR PART 135'),
(3, 'CHARTER / FAR PART 135'),
(4, 'DIPLOMATIC / MILITARY'),
(5, 'PRIVATE / FAR PART 91'),
(6, 'CAA / PRIVATE / FAR PART 91'),
(7, 'FLETAMENTO / FAR PART 121'),
(8, 'APIS'),
(9, 'TRANSPORTATION'),
(10, 'CATERING'),
(11, 'FUEL / COMBUSTIBLE');

-- Categorías de Conceptos (Servicios)
INSERT INTO categorias_conceptos (id_cat_concepto, nombre_cat_concepto) VALUES
(1, 'Servicios en Rampa FBO CANCÚN'),
(2, 'Limpieza de Aeronave'),
(3, 'Comisariato y Catering'),
(4, 'Servicios a Pasajeros'),
(5, 'Servicios a Tripulación'),
(6, 'Tasas y Permisos');

---

-- ========= INSERCIÓN DE DATOS EN TABLAS DEPENDIENTES (Nivel 1) =========

-- Modelos de Aeronaves
INSERT INTO aeronaves_modelos (id_modelo_aeronave, icao_aeronave, nombre_aeronave, mtow_aeronave, envergadura_aeronave) VALUES
(1, 'C56X', 'Cessna Citation Excel', 9.16, 17.17),
(2, 'GLEX', 'Bombardier Global Express', 44.45, 28.65),
(3, 'FA7X', 'Dassault Falcon 7X', 31.75, 26.21),
(4, 'E55P', 'Embraer Phenom 300', 8.15, 15.91),
(5, 'B738', 'Boeing 737-800 (BBJ2)', 79.01, 35.79);

-- Flota de Aeronaves de Clientes (varias por cliente)
INSERT INTO clientes_aeronaves (id_cliente_aeronave, matricula_aeronave, es_miembro_caa, fecha_vigencia_caa, id_cliente, id_modelo_aeronave) VALUES
(1, 'N123AC', TRUE, '2026-12-31', 1, 2), -- AeroCharter, Global Express
(2, 'N456AC', FALSE, NULL, 1, 3),       -- AeroCharter, Falcon 7X
(3, 'XA-GJS', TRUE, '2027-05-20', 3, 1), -- Global Jet, Citation Excel
(4, 'XA-LUX', TRUE, '2026-08-15', 3, 4), -- Global Jet, Phenom 300
(5, 'XA-VIP', FALSE, NULL, 3, 5),       -- Global Jet, BBJ2
(6, 'N789SP', TRUE, '2025-11-10', 5, 2); -- Serv. Pacifico, Global Express

-- TODOS LOS FBOs Y  AQUÍ SE GUARDA AVIACIÓN COMERCIAL Y GENERAL DE CADA AEROPUERTO
INSERT INTO fbos (id_fbo, nombre_fbo, grupo_fbo, id_aeropuerto) VALUES
-- FBOs para Toluca (MMTO, id_aeropuerto=2)
(1, 'Manny Aviation Services', 'Manny Aviation', 2),
(2, 'Universal Aviation', 'Universal Weather and Aviation', 2),
(3, 'Eolo Plus', 'Eolo', 2),
(4, 'ICCS', 'ICCS', 2),
-- FBOs para Los Angeles (KLAX, id_aeropuerto=3)
(5, 'Atlantic Aviation', 'Atlantic Aviation', 3),
(6, 'Signature Flight Support', 'Signature', 3),
(7, 'Clay Lacy Aviation', 'Clay Lacy', 3),
(8, 'Landmark Aviation', 'Landmark', 3),
--Se insertan aviación comercial y general para aeropuerto CDMX (id_aeropuerto=1 y 2)
(9, 'Aviación General', 'Aviación General', 1),
(11, 'Aviación Comercial', 'Aviación Comercial', 1),
(12, 'Aviación General', 'Aviación General', 2),
(13, 'Aviación Comercial', 'Aviación Comercial', 2);
;

-- Conceptos Estandarizados (Servicios base)
INSERT INTO conceptos_estandarizados (id_concepto_std, nombre_concepto_default, id_categoria_concepto) VALUES
(1, 'Handling Básico', 1),
(2, 'Limpieza Interior Estándar', 2),
(3, 'Agua Potable', 1),
(4, 'Servicio de Lavatorio', 1),
(5, 'Catering VIP - Pax', 3),
(6, 'Transporte Tripulación - Hotel', 5),
(7, 'TUA (Tarifa de Uso de Aeropuerto)', 6),
(8, 'Uso de Plataforma por Hora', 6),
(9, 'Catering Ligero - Tripulación', 3),
(10, 'Limpieza Exterior', 2),
(11, 'GPU (Ground Power Unit)', 1),
(12, 'ASU (Air Start Unit)', 1);

-- Servicios Especiales con costo fijo por cliente
INSERT INTO servicios_cliente_especiales (id_servicio_especial, id_cliente, nombre_servicio, costo_servicio) VALUES
(1, 3, 'Kit de bienvenida VIP personalizado', 150.00),
(2, 3, 'Prensa internacional específica', 50.00),
(3, 1, 'Coordinación de seguridad avanzada', 350.00);

---

-- ========= INSERCIÓN DE DATOS EN TABLAS DEPENDIENTES (Nivel 2) =========

-- Precios de Conceptos QUE APLICAN PARA UN AEROPUERTO Y/O FBO ESPECÍFICO
INSERT INTO precios_conceptos (id_precio_concepto, nombre_local_concepto, costo_concepto, divisa, id_concepto_std, id_aeropuerto, id_fbo) VALUES
-- ** Escenario: Aeropuerto de Toluca (MMTO, id=2) **
-- 1. Servicios del AEROPUERTO (sin FBO)
(1, 'TUA Internacional', 75.00, 'USD', 7, 2, NULL),
(2, 'Estacionamiento Plataforma General (por día)', 250.00, 'USD', 8, 2, NULL),
-- 2. Servicios FBO 'Manny Aviation' (id_fbo=1) en Toluca
(3, 'Handling Básico Manny', 850.00, 'USD', 1, 2, 1),
(4, 'Limpieza Interior Detallada', 300.00, 'USD', 2, 2, 1),
(5, 'Servicio de Agua y Lavatorio', 150.00, 'USD', 3, 2, 1),
(6, 'GPU (por hora)', 120.00, 'USD', 11, 2, 1),
(7, 'Catering Gourmet Pax (por persona)', 95.00, 'USD', 5, 2, 1),
(8, 'Transporte Ejecutivo (Sedan)', 200.00, 'USD', 6, 2, 1),
(9, 'Descarga de equipaje', 50.00, 'USD', 4, 2, 1),
-- 3. Servicios FBO 'Universal Aviation' (id_fbo=2) en Toluca
(10, 'Handling Integral Universal', 920.00, 'USD', 1, 2, 2),
(11, 'Limpieza Interior Estándar', 250.00, 'USD', 2, 2, 2),
(12, 'Servicio de Agua y Lavatorio', 130.00, 'USD', 4, 2, 2),
(13, 'ASU (por evento)', 250.00, 'USD', 12, 2, 2),
(14, 'Catering Ligero Tripulación (por persona)', 45.00, 'USD', 9, 2, 2),
(15, 'Transporte en Van de Lujo', 350.00, 'USD', 6, 2, 2),
(16, 'Coordinación de Aduanas VIP', 180.00, 'USD', 4, 2, 2),
-- 4. Servicios FBO 'Eolo Plus' (id_fbo=3) en Toluca
(17, 'Handling Esencial Eolo', 780.00, 'USD', 1, 2, 3),
(18, 'Limpieza Interior Rápida', 180.00, 'USD', 2, 2, 3),
(19, 'Servicio de Agua', 80.00, 'USD', 3, 2, 3),
(20, 'Servicio de Lavatorio', 80.00, 'USD', 4, 2, 3),
(21, 'GPU (por hora)', 110.00, 'USD', 11, 2, 3),
(22, 'Taxi Seguro Tripulación', 90.00, 'USD', 6, 2, 3),
(23, 'Snacks y bebidas de cortesía', 0.00, 'USD', 9, 2, 3),
-- 5. Servicios de Aviación General para Aeropuerto CDMX (id:1)
(24, 'Landing Fee', 120.00, 'USD', 1, 1, 9),
-- 6. Servicios de Aviación Comercial para Aeropuerto CDMX (id:1)
(25, 'Landing Fee', 250.00, 'USD', 1, 1, 11);

-- Cotización 1
INSERT INTO cotizaciones (
    id_cotizacion, numero_referencia, fecha_cotizacion, nombre_solicitante, nombre_responsable, exchange_rate,
    id_cliente, id_cat_operacion, id_cliente_aeronave, id_aeropuerto, id_fbo,
    fecha_llegada, fecha_salida, aeropuerto_origen_id, aeropuerto_destino_id,
    tripulacion_llegada, pasajeros_llegada, tripulacion_salida, pasajeros_salida,
    total_costo, total_s_cargo, total_vat, total_final, total_en_palabras
) VALUES (
    1, 'REF-2025-001', '2025-10-06', 'Asistente de Juan Pérez', 'Mariana López', 19.85,
    1, 1, 1, 2, 1, -- Cliente 1, Handling, Aeronave N123AC (id=1), en Toluca (id=2), con FBO Manny (id=1)
    '2025-10-10', '2025-10-12', 3, 4, -- Llega de KLAX (id=3), sale para EGLL (id=4)
    3, 8, 3, 8,
    3150.00, 412.50, 570.00, 4132.50, 'CUATRO MIL CIENTO TREINTA Y DOS DÓLARES 50/100 USD'
);

-- Cotización 2
INSERT INTO cotizaciones (
    id_cotizacion, numero_referencia, fecha_cotizacion, nombre_solicitante, nombre_responsable, exchange_rate,
    id_cliente, id_cat_operacion, id_cliente_aeronave, id_aeropuerto, id_fbo,
    fecha_llegada, fecha_salida, aeropuerto_origen_id, aeropuerto_destino_id,
    tripulacion_llegada, pasajeros_llegada, tripulacion_salida, pasajeros_salida,
    total_costo, total_s_cargo, total_vat, total_final, total_en_palabras
) VALUES (
    2, 'REF-2025-002', '2025-10-07', 'Piloto en Jefe', 'Pedro Ramírez', 19.90,
    3, 1, 3, 2, 2, -- Cliente 3, Handling, Aeronave XA-GJS (id=3), en Toluca (id=2), con FBO Universal (id=2)
    '2025-11-05', '2025-11-05', 1, 3, -- Llega de MMMX (id=1), sale para KLAX (id=3)
    2, 4, 2, 3,
    1400.00, 165.00, 250.40, 1815.40, 'UN MIL OCHOCIENTOS QUINCE DÓLARES 40/100 USD'
);

---

-- ========= INSERCIÓN DE DATOS EN TABLAS DEPENDIENTES (Nivel 3) =========

-- Conceptos para la Cotización 1 (id_cotizacion=1)
INSERT INTO cotizacion_conceptos (
    id_cotizacion_concepto, id_cotizacion, id_precio_concepto, nombre_servicio, cantidad, costo_mxn, costo_usd,
    sc_porcentaje, vat_porcentaje, s_cargo, vat, total_usd
) VALUES
(1, 1, 3, 'Handling Básico Manny', 1, 16872.50, 850.00, 15.00, 16.00, 127.50, 156.40, 1133.90),
(2, 1, 7, 'Catering Gourmet Pax (por persona)', 8, 15086.00, 760.00, 15.00, 16.00, 114.00, 139.84, 1013.84),
(3, 1, 8, 'Transporte Ejecutivo (Sedan)', 2, 7940.00, 400.00, 15.00, 16.00, 60.00, 73.60, 533.60),
(4, 1, 1, 'TUA Internacional', 8, 11910.00, 600.00, 0.00, 16.00, 0.00, 96.00, 696.00),
(5, 1, 2, 'Estacionamiento Plataforma General (por día)', 2, 9925.00, 500.00, 10.00, 16.00, 50.00, 88.00, 638.00);

-- Conceptos para la Cotización 2 (id_cotizacion=2)
INSERT INTO cotizacion_conceptos (
    id_cotizacion_concepto, id_cotizacion, id_precio_concepto, nombre_servicio, cantidad, costo_mxn, costo_usd,
    sc_porcentaje, vat_porcentaje, s_cargo, vat, total_usd
) VALUES
(6, 2, 10, 'Handling Integral Universal', 1, 18308.00, 920.00, 15.00, 16.00, 138.00, 169.28, 1227.28),
(7, 2, 16, 'Coordinación de Aduanas VIP', 1, 3582.00, 180.00, 15.00, 16.00, 27.00, 33.12, 240.12),
(8, 2, 1, 'TUA Internacional', 4, 5970.00, 300.00, 0.00, 16.00, 0.00, 48.00, 348.00);

-- Historial de Cotizaciones
INSERT INTO cotizaciones_historico (
    id_historico, id_cotizacion, numero_referencia, fecha_cotizacion, nombre_solicitante, nombre_responsable, exchange_rate,
    id_cliente, id_cat_operacion, id_cliente_aeronave, id_aeropuerto, id_fbo,
    fecha_llegada, fecha_salida, aeropuerto_origen_id, aeropuerto_destino_id,
    tripulacion_llegada, pasajeros_llegada, tripulacion_salida, pasajeros_salida,
    total_costo, total_s_cargo, total_vat, total_final, total_en_palabras,
    usuario_modificacion, tipo_accion, version
) VALUES
(1, 1, 'REF-2025-001', '2025-10-06', 'Asistente de Juan Pérez', 'Mariana López', 19.85, 1, 1, 1, 2, 1, '2025-10-10', '2025-10-12', 3, 4, 3, 8, 3, 8, 3150.00, 412.50, 570.00, 4132.50, 'CUATRO MIL CIENTO TREINTA Y DOS DÓLARES 50/100 USD', 'Mariana López', 'CREADA', 1),
(2, 2, 'REF-2025-002', '2025-10-07', 'Piloto en Jefe', 'Pedro Ramírez', 19.90, 3, 1, 3, 2, 2, '2025-11-05', '2025-11-05', 1, 3, 2, 4, 2, 3, 1400.00, 165.00, 250.40, 1815.40, 'UN MIL OCHOCIENTOS QUINCE DÓLARES 40/100 USD', 'Pedro Ramírez', 'CREADA', 1);