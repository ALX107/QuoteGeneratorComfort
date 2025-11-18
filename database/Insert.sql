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
(11, 'FUEL / COMBUSTIBLE'),
(12, 'PERMIT');

-- Categorías de Conceptos (Servicios)
INSERT INTO categorias_conceptos (id_cat_concepto, nombre_cat_concepto) VALUES
(1, 'FBO Services'),
(2, 'Airport Services'),
(3, 'Third-Party Services'),
(4, 'Taxes % Imigration Services'),
(5, 'Landing Permit'),
(6, 'Raf Coordination'),
(7, 'Fuel'),
(8, 'Apis'),
(9, 'Additional Services'),
(10, 'Default');
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

-- Conceptos Default (Servicios base)
INSERT INTO conceptos_default (id_concepto_std, nombre_concepto_default, costo_concepto_default, id_categoria_concepto) VALUES
(1, 'Landing Fee', 920.00, 10),
(2, 'Embarking / Disembarking', 900.00, 10),
(3, 'Parking Fee', 300.00, 10),
(4, 'Overnight', 45, 10),
(5, 'TUA Internacional', 678, 10),
(6, 'Landing Permit Cost', 920.00, 10),
(7, 'Landing Permit Coordination', 920.00, 10),
(8, 'Raf Coordination', 344, 10),
(9, 'Agent Supervisory Fee', 455, 10);

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
(6, 'GPU (por hora)', 120.00, 'USD', 9, 2, 1),
(7, 'Catering Gourmet Pax (por persona)', 95.00, 'USD', 5, 2, 1),
(8, 'Transporte Ejecutivo (Sedan)', 200.00, 'USD', 6, 2, 1),
(9, 'Descarga de equipaje', 50.00, 'USD', 4, 2, 1),
-- 3. Servicios FBO 'Universal Aviation' (id_fbo=2) en Toluca
(10, 'Handling Integral Universal', 920.00, 'USD', 1, 2, 2),
(11, 'Limpieza Interior Estándar', 250.00, 'USD', 2, 2, 2),
(12, 'Servicio de Agua y Lavatorio', 130.00, 'USD', 4, 2, 2),
(13, 'ASU (por evento)', 250.00, 'USD', 9, 2, 2),
(14, 'Catering Ligero Tripulación (por persona)', 45.00, 'USD', 9, 2, 2),
(15, 'Transporte en Van de Lujo', 350.00, 'USD', 6, 2, 2),
(16, 'Coordinación de Aduanas VIP', 180.00, 'USD', 4, 2, 2),
-- 4. Servicios FBO 'Eolo Plus' (id_fbo=3) en Toluca
(17, 'Handling Esencial Eolo', 780.00, 'USD', 1, 2, 3),
(18, 'Limpieza Interior Rápida', 180.00, 'USD', 2, 2, 3),
(19, 'Servicio de Agua', 80.00, 'USD', 3, 2, 3),
(20, 'Servicio de Lavatorio', 80.00, 'USD', 4, 2, 3),
(21, 'GPU (por hora)', 110.00, 'USD', 9, 2, 3),
(22, 'Taxi Seguro Tripulación', 90.00, 'USD', 6, 2, 3),
(23, 'Snacks y bebidas de cortesía', 0.00, 'USD', 9, 2, 3),
-- 5. Servicios de Aviación General para Aeropuerto CDMX (id:1)
(24, 'Landing Fee', 120.00, 'USD', 1, 1, 9),
-- 6. Servicios de Aviación Comercial para Aeropuerto CDMX (id:1)
(25, 'Landing Fee', 250.00, 'USD', 1, 1, 11);

