-- ========= INSERCIÓN DE DATOS EN TABLAS INDEPENDIENTES =========

-- Clientes (5 clientes de ejemplo)
INSERT INTO clientes (id_cliente, nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, ciudad_cliente, estado_cliente, pais_cliente, zip_cliente, contacto_cliente) VALUES 
(1, 'AeroCharter Internacional', 'contacto@charterint.com', '+1-202-555-0176', '123 Aviation Avenue', 'Miami', 'Florida', 'USA', '33101', 'Juan Pérez'),
(2, 'Vuelos Ejecutivos de Lujo', 'ops@vueloslujo.net', '+44 20 7946 0958', '456 Business Jet Rd.', 'Londres', 'Inglaterra', 'Reino Unido', 'SW1A 0AA', 'Laura Gómez'),
(3, 'Global Jet Services', 'info@globaljets.com', '+52-55-5555-1234', 'Av. Reforma 789', 'Ciudad de México', 'CDMX', 'México', '06500', 'Carlos Rodríguez'),
(4, 'Transportes Aéreos Rápidos', 'soporte@aerorapido.com.mx', '+52-81-8345-6789', 'Parque Industrial 100', 'Monterrey', 'Nuevo León', 'México', '64000', 'Sofía Hernández'),
(5, 'Servicios Aéreos del Pacífico', 'reservas@pacificair.com', '+1-310-555-0123', '555 Ocean View Blvd', 'Los Angeles', 'California', 'USA', '90001', 'David Chen');

-- Aeropuertos (58 aeropuertos de México)
INSERT INTO aeropuertos (id_aeropuerto, icao_aeropuerto, nombre_aeropuerto, ciudad_aeropuerto, estado_aeropuerto, pais_aeropuerto, clasificacion_aeropuerto, grupo_aeropuerto) VALUES
(1, 'MM81', 'Aeródromo Privado La Retama', 'Isla Socorro', 'Colima', 'México', 'Militar/Naval', 'Semar'),
(2, 'MMAA', 'Aeropuerto Internacional de Acapulco', 'Acapulco', 'Guerrero', 'México', 'Internacional/Público', 'OMA'),
(3, 'MMAN', 'Aeropuerto Internacional del Norte', 'Monterrey', 'Nuevo León', 'México', 'Ejecutivo / Aviación privada', 'OMA'),
(4, 'MMAS', 'Aeropuerto Internacional de Aguascalientes','Aguascalientes','Aguascalientes','México','Internacional/Público','GAP'),
(5, 'MMBT', 'Aeropuerto Internacional Bahías de Huatulco', 'Huatulco', 'Oaxaca', 'México', 'Internacional/Público', 'ASUR'),
(6, 'MMCP', 'Aeropuerto Internacional de Campeche', 'Campeche', 'Campeche', 'México', 'Internacional/Público', 'GACM'),
(7, 'MMCS', 'Aeropuerto Internacional Abraham González', 'Ciudad Juárez', 'Chihuahua', 'México', 'Internacional/Público', 'OMA'),
(8, 'MMCT', 'Aeropuerto Internacional de Chichén Itzá', 'Chichén Itzá', 'Yucatán', 'México', 'Internacional/Público', 'Gobierno/ Grupo Ciclo'),
(9, 'MMCU', 'Aeropuerto Internacional General Roberto Fierro Villalobos', 'Chihuahua', 'Chihuahua', 'México', 'Internacional/Público', 'OMA'),
(10, 'MMCZ', 'Aeropuerto Internacional de Cozumel', 'Cozumel', 'Quintana Roo', 'México', 'Internacional/Público', 'ASUR'),
(11, 'MMDO', 'Aeropuerto Internacional General Guadalupe Victoria', 'Durango', 'Durango', 'México', 'Internacional/Público', 'OMA'),
(12, 'MMES', 'Aeropuerto Internacional Gral. Alberto L. Salinas Carranza', 'Ensenada', 'Baja California', 'México', 'Militar / Mixto', 'Sedena'),
(13, 'MMGL', 'Aeropuerto Internacional Miguel Hidalgo y Costilla', 'Guadalajara', 'Jalisco', 'México', 'Comercial', 'GAP'),
(14, 'MMGM', 'Aeropuerto Internacional Gral. José María Yáñez', 'Guaymas', 'Sonora', 'México', 'Comercial', 'GACM'),
(15, 'MMGR', 'Aeropuerto Regional de Guerrero Negro', 'Guerrero Negro', 'Baja California Sur', 'México', 'Regional', 'Estatal'),
(16, 'MMHO', 'Aeropuerto Internacional Gral. Ignacio Pesqueira García', 'Hermosillo', 'Sonora', 'México', 'Comercial', 'GAP'),
(17, 'MMIA', 'Aeropuerto Internacional Lic. Miguel de la Madrid', 'Colima', 'Colima', 'México', 'Comercial', 'GACM'),
(18, 'MMLO', 'Aeropuerto Internacional del Bajío (Guanajuato)', 'Silao / León', 'Guanajuato', 'México', 'Comercial', 'GAP'),
(19, 'MMLP', 'Aeropuerto Internacional Manuel Márquez de León', 'La Paz', 'Baja California Sur', 'México', 'Comercial', 'GAP'),
(20, 'MMLT', 'Aeropuerto Internacional de Loreto', 'Loreto', 'Baja California Sur', 'México', 'Comercial', 'GACM'),
(21, 'MMMA', 'Aeropuerto Internacional Gral. Servando Canales', 'Matamoros', 'Tamaulipas', 'México', 'Comercial', 'GACM'),
(22, 'MMMD', 'Aeropuerto Internacional Lic. Manuel Crescencio Rejón', 'Mérida', 'Yucatán', 'México', 'Comercial', 'ASUR'),
(23, 'MMMM', 'Aeropuerto Internacional Gral. Francisco J. Múgica', 'Morelia', 'Michoacán', 'México', 'Comercial', 'GAP'),
(24, 'MMMX', 'Aeropuerto Internacional de la Ciudad de México', 'Ciudad de México', 'CDMX', 'México', 'Comercial/Carga', 'GACM'),
(25, 'MMMY', 'Aeropuerto Internacional Gral. Mariano Escobedo', 'Monterrey (Apodaca)', 'Nuevo León', 'México', 'Comercial', 'OMA'),
(26, 'MMMZ', 'Aeropuerto Internacional Gral. Rafael Buelna', 'Mazatlán', 'Sinaloa', 'México', 'Comercial', 'OMA'),
(27, 'MMNL', 'Aeropuerto Internacional Quetzalcóatl', 'Nuevo Laredo', 'Tamaulipas', 'México', 'Comercial', 'ASA'),
(28, 'MMOX', 'Aeropuerto Internacional Xoxocotlán', 'Oaxaca', 'Oaxaca', 'México', 'Comercial', 'ASUR'),
(29, 'MMPA', 'Aeropuerto Internacional El Tajín', 'Poza Rica', 'Veracruz', 'México', 'Comercial / Nacional', 'ASUR'),
(30, 'MMPB', 'Aeropuerto Internacional Hermanos Serdán', 'Puebla (Huejotzingo)', 'Puebla', 'México', 'Comercial', 'GACM'),
(31, 'MMPG', 'Aeropuerto Internacional de Piedras Negras', 'Piedras Negras', 'Coahuila', 'México', 'Comercial', 'Estatal'),
(32, 'MMPQ', 'Aeropuerto Internacional de Palenque', 'Palenque', 'Chiapas', 'México', 'Comercial', 'GACM'),
(33, 'MMPR', 'Aeropuerto Internacional Lic. Gustavo Díaz Ordaz', 'Puerto Vallarta', 'Jalisco', 'México', 'Comercial', 'GAP'),
(34, 'MMPS', 'Aeropuerto Internacional de Puerto Escondido', 'Puerto Escondido', 'Oaxaca', 'México', 'Comercial', 'GACM'),
(35, 'MMQT', 'Aeropuerto Intercontinental de Querétaro', 'Querétaro (Colón)', 'Querétaro', 'México', 'Comercial', 'GAP'),
(36, 'MMSD', 'Aeropuerto Internacional de Los Cabos', 'San José del Cabo', 'Baja California Sur', 'México', 'Comercial', 'GAP'),
(37, 'MMSL', 'Aeropuerto Cabo San Lucas Internacional', 'Cabo San Lucas', 'Baja California Sur', 'México', 'Privado / Internacional', 'GAP'),
(38, 'MMSM', 'Aeropuerto Internacional Felipe Ángeles (AIFA)', 'Santa Lucía', 'Estado de México', 'México', 'Mixto (Civil-Militar)', 'GAFSACOMM'),
(39, 'MMSP', 'Aeropuerto Internacional Ponciano Arriaga', 'San Luis Potosí', 'San Luis Potosí', 'México', 'Internacional', 'OMA'),
(40, 'MMTC', 'Aeropuerto Internacional Francisco Sarabia', 'Torreón', 'Coahuila', 'México', 'Comercial', 'OMA'),
(41, 'MMTJ', 'Aeropuerto Internacional Gral. Abelardo L. Rodríguez', 'Tijuana', 'Baja California', 'México', 'Comercial', 'GAP'),
(42, 'MMTL', 'Aeropuerto Internacional de Tulum Felipe Carrillo Puerto', 'Tulúm', 'Quintana Roo', 'México', 'Internacional', 'GAFSACOMM'),
(43, 'MMTM', 'Aeropuerto Internacional Gral. Francisco Javier Mina', 'Tampico', 'Tamaulipas', 'México', 'Comercial', 'OMA'),
(44, 'MMTO', 'Aeropuerto Internacional de Toluca', 'Toluca', 'Estado de México', 'México', 'General/Ejecutivo', 'GACM'),
(45, 'MMTP', 'Aeropuerto Internacional de Tapachula', 'Tapachula', 'Chiapas', 'México', 'Comercial', 'ASUR'),
(46, 'MMUN', 'Aeropuerto Internacional de Cancún', 'Cancún', 'Quintana Roo', 'México', 'Comercial', 'ASUR'),
(47, 'MMVA', 'Aeropuerto Internacional Carlos Rovirosa Pérez', 'Villahermosa', 'Tabasco', 'México', 'Comercial', 'ASUR'),
(48, 'MMVR', 'Aeropuerto Internacional Gral. Heriberto Jara', 'Veracruz', 'Veracruz', 'México', 'Comercial', 'ASUR'),
(49, 'MMZC', 'Aeropuerto Internacional Gral. Leobardo C. Ruiz', 'Zacatecas (Calera)', 'Zacatecas', 'México', 'Comercial', 'OMA'),
(50, 'MMZH', 'Aeropuerto Internacional de Ixtapa-Zihuatanejo', 'Zihuatanejo', 'Guerrero', 'México', 'Comercial', 'OMA'),
(51, 'MMZO', 'Aeropuerto Internacional Playa de Oro', 'Manzanillo', 'Colima', 'México', 'Comercial', 'GAP'),
(52, 'MMMT', 'Aeropuerto Internacional de Minatitlán', 'Minatitlán', 'Veracruz', 'México', 'Internacional', 'ASUR'),
(53, 'MMCE', 'Aeropuerto Internacional de Ciudad del Carmen', 'Ciudad del Carmen', 'Campeche', 'México', 'Internacional', 'GACM'),
(54, 'MMCN', 'Aeropuerto Internacional de Ciudad Obregón', 'Ciudad Obregón', 'Sonora', 'México', 'Internacional', 'GACM'),
(55, 'MMCL', 'Aeropuerto Internacional de Culiacán', 'Culiacan', 'Sinaloa', 'México', 'Internacional', 'OMA'),
(56, 'MMRX', 'Aeropuerto Internacional de Reynosa', 'Reynosa', 'Tamaulipas', 'México', 'Internacional', 'OMA'),
(57, 'MMML', 'Aeropuerto Internacional General Rodolfo Sánchez Taboada', 'Mexicali', 'Baja California', 'México', 'Internacional', 'GAP'),
(58, 'MMIO', 'Aeropuerto Internacional Plan de Guadalupe', 'Saltillo', 'Coahuila', 'México', 'Internacional', 'ASA');


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
(2, 'Airport Services General Aviation'),
(3, 'Airport Services Commercial Aviation'),
(4, 'Third-Party Services'),
(5, 'Taxes % Imigration Services'),
(6, 'Landing Permit'),
(7, 'Raf Coordination'),
(8, 'Fuel'),
(9, 'Apis'),
(10, 'Additional Services'),
(11, 'Default');
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
-- FBOs para Toluca (MMTO, id_aeropuerto=44)
(1, 'Asertec', 'GAP', 44),
(2, 'Fly Across', 'GAP', 44),
(3, 'SAE', 'GAP', 44),
-- FBO para MMSM (MMSM, id_aeropuerto=38)
(4, 'AIFA FBO', 'GAFSACOMM', 38),
-- FBO para MMQT (MMQT, id_aeropuerto=35)
(5, 'AirBusiness FBO', 'GAP', 35),
-- FBO para MMLO (MMLO, id_aeropuerto=18)
(6, 'Fly Across', 'GAP', 18),
-- FBO para MMUN (MMUN, id_aeropuerto=46)
(7, 'Asur FBO', 'ASUR', 46),
-- FBO para MMLP (MMLP, id_aeropuerto=19)
(8, 'Prime Sky', 'GAP', 19),
-- FBO para MMHO (MMHO, id_aeropuerto=16)
(9, 'Prime Sky', 'GAP', 16),
-- FBO para MMSD (MMSD, id_aeropuerto=36)
(10, 'Prime Sky', 'GAP', 36),
-- FBO para MMLT (MMLT, id_aeropuerto=20)
(11, 'Loreto FBO', 'GACM', 20),
-- FBO para MMTL (MMTL, id_aeropuerto=42)
(12, 'Tulum FBO', 'GAFSACOMM', 42),
-- FBO para MMOX (MMOX, id_aeropuerto=28)
(13, 'AeroSync FBO', 'ASUR', 28),
-- FBO para MMAS (MMAS, id_aeropuerto=4)
(14, 'Aeroservicios Myra', 'GAP', 4),
-- FBO para MMAN (MMAN, id_aeropuerto=3)
(15, 'Jet Mach', 'SIN GRUPO', 3),
-- FBO para MMMY (MMMY, id_aeropuerto=25)
(16, 'ICCS', 'OMA', 25),
-- FBO para MMCU (MMCU, id_aeropuerto=9)
(17, 'ICCS', 'OMA', 9),
-- FBO para MMIO (MMIO, id_aeropuerto=58)
(18, 'ICCS', 'OMA', 58),
-- FBO para MMSL (MMSL, id_aeropuerto=37)
(19, 'Amigo Flight', 'GAP', 37),
--Se insertan aviación comercial y general para todos los aeropuertos
(20, 'Aviación General', 'Aviación General', 1),
(21, 'Aviación Comercial', 'Aviación Comercial', 1),
(22, 'Aviación General', 'Aviación General', 2),
(23, 'Aviación Comercial', 'Aviación Comercial', 2),
(24, 'Aviación General', 'Aviación General', 3),
(25, 'Aviación Comercial', 'Aviación Comercial', 3),
(26, 'Aviación General', 'Aviación General', 4),
(27, 'Aviación Comercial', 'Aviación Comercial', 4),
(28, 'Aviación General', 'Aviación General', 5),
(29, 'Aviación Comercial', 'Aviación Comercial', 5),
(30, 'Aviación General', 'Aviación General', 6),
(31, 'Aviación Comercial', 'Aviación Comercial', 6),
(32, 'Aviación General', 'Aviación General', 7),
(33, 'Aviación Comercial', 'Aviación Comercial', 7),
(34, 'Aviación General', 'Aviación General', 8),
(35, 'Aviación Comercial', 'Aviación Comercial', 8),
(36, 'Aviación General', 'Aviación General', 9),
(37, 'Aviación Comercial', 'Aviación Comercial', 9),
(38, 'Aviación General', 'Aviación General', 10),
(39, 'Aviación Comercial', 'Aviación Comercial', 10),
(40, 'Aviación General', 'Aviación General', 11),
(41, 'Aviación Comercial', 'Aviación Comercial', 11),
(42, 'Aviación General', 'Aviación General', 12),
(43, 'Aviación Comercial', 'Aviación Comercial', 12),
(44, 'Aviación General', 'Aviación General', 13),
(45, 'Aviación Comercial', 'Aviación Comercial', 13),
(46, 'Aviación General', 'Aviación General', 14),
(47, 'Aviación Comercial', 'Aviación Comercial', 14),
(48, 'Aviación General', 'Aviación General', 15),
(49, 'Aviación Comercial', 'Aviación Comercial', 15),
(50, 'Aviación General', 'Aviación General', 16),
(51, 'Aviación Comercial', 'Aviación Comercial', 16),
(52, 'Aviación General', 'Aviación General', 17),
(53, 'Aviación Comercial', 'Aviación Comercial', 17),
(54, 'Aviación General', 'Aviación General', 18),
(55, 'Aviación Comercial', 'Aviación Comercial', 18),
(56, 'Aviación General', 'Aviación General', 19),
(57, 'Aviación Comercial', 'Aviación Comercial', 19),
(58, 'Aviación General', 'Aviación General', 20),
(59, 'Aviación Comercial', 'Aviación Comercial', 20),
(60, 'Aviación General', 'Aviación General', 21),
(61, 'Aviación Comercial', 'Aviación Comercial', 21),
(62, 'Aviación General', 'Aviación General', 22),
(63, 'Aviación Comercial', 'Aviación Comercial', 22),
(64, 'Aviación General', 'Aviación General', 23),
(65, 'Aviación Comercial', 'Aviación Comercial', 23),
(66, 'Aviación General', 'Aviación General', 24),
(67, 'Aviación Comercial', 'Aviación Comercial', 24),
(68, 'Aviación General', 'Aviación General', 25),
(69, 'Aviación Comercial', 'Aviación Comercial', 25),
(70, 'Aviación General', 'Aviación General', 26),
(71, 'Aviación Comercial', 'Aviación Comercial', 26),
(72, 'Aviación General', 'Aviación General', 27),
(73, 'Aviación Comercial', 'Aviación Comercial', 27),
(74, 'Aviación General', 'Aviación General', 28),
(75, 'Aviación Comercial', 'Aviación Comercial', 28),
(76, 'Aviación General', 'Aviación General', 29),
(77, 'Aviación Comercial', 'Aviación Comercial', 29),
(78, 'Aviación General', 'Aviación General', 30),
(79, 'Aviación Comercial', 'Aviación Comercial', 30),
(80, 'Aviación General', 'Aviación General', 31),
(81, 'Aviación Comercial', 'Aviación Comercial', 31),
(82, 'Aviación General', 'Aviación General', 32),
(83, 'Aviación Comercial', 'Aviación Comercial', 32),
(84, 'Aviación General', 'Aviación General', 33),
(85, 'Aviación Comercial', 'Aviación Comercial', 33),
(86, 'Aviación General', 'Aviación General', 34),
(87, 'Aviación Comercial', 'Aviación Comercial', 34),
(88, 'Aviación General', 'Aviación General', 35),
(89, 'Aviación Comercial', 'Aviación Comercial', 35),
(90, 'Aviación General', 'Aviación General', 36),
(91, 'Aviación Comercial', 'Aviación Comercial', 36),
(92, 'Aviación General', 'Aviación General', 37),
(93, 'Aviación Comercial', 'Aviación Comercial', 37),
(94, 'Aviación General', 'Aviación General', 38),
(95, 'Aviación Comercial', 'Aviación Comercial', 38),
(96, 'Aviación General', 'Aviación General', 39),
(97, 'Aviación Comercial', 'Aviación Comercial', 39),
(98, 'Aviación General', 'Aviación General', 40),
(99, 'Aviación Comercial', 'Aviación Comercial', 40),
(100, 'Aviación General', 'Aviación General', 41),
(101, 'Aviación Comercial', 'Aviación Comercial', 41),
(102, 'Aviación General', 'Aviación General', 42),
(103, 'Aviación Comercial', 'Aviación Comercial', 42),
(104, 'Aviación General', 'Aviación General', 43),
(105, 'Aviación Comercial', 'Aviación Comercial', 43),
(106, 'Aviación General', 'Aviación General', 44),
(107, 'Aviación Comercial', 'Aviación Comercial', 44),
(108, 'Aviación General', 'Aviación General', 45),
(109, 'Aviación Comercial', 'Aviación Comercial', 45),
(110, 'Aviación General', 'Aviación General', 46),
(111, 'Aviación Comercial', 'Aviación Comercial', 46),
(112, 'Aviación General', 'Aviación General', 47),
(113, 'Aviación Comercial', 'Aviación Comercial', 47),
(114, 'Aviación General', 'Aviación General', 48),
(115, 'Aviación Comercial', 'Aviación Comercial', 48),
(116, 'Aviación General', 'Aviación General', 49),
(117, 'Aviación Comercial', 'Aviación Comercial', 49),
(118, 'Aviación General', 'Aviación General', 50),
(119, 'Aviación Comercial', 'Aviación Comercial', 50),
(120, 'Aviación General', 'Aviación General', 51),
(121, 'Aviación Comercial', 'Aviación Comercial', 51),
(122, 'Aviación General', 'Aviación General', 52),
(123, 'Aviación Comercial', 'Aviación Comercial', 52),
(124, 'Aviación General', 'Aviación General', 53),
(125, 'Aviación Comercial', 'Aviación Comercial', 53),
(126, 'Aviación General', 'Aviación General', 54),
(127, 'Aviación Comercial', 'Aviación Comercial', 54),
(128, 'Aviación General', 'Aviación General', 55),
(129, 'Aviación Comercial', 'Aviación Comercial', 55),
(130, 'Aviación General', 'Aviación General', 56),
(131, 'Aviación Comercial', 'Aviación Comercial', 56),
(132, 'Aviación General', 'Aviación General', 57),
(133, 'Aviación Comercial', 'Aviación Comercial', 57),
(134, 'Aviación General', 'Aviación General', 58),
(135, 'Aviación Comercial', 'Aviación Comercial', 58),
-- FBO para MMPR (MMPR, id_aeropuerto=33)
(136, 'Aerotron FBO', 'GAP', 33);

-- Conceptos Default (Servicios base)
INSERT INTO conceptos_default (id_concepto_std, nombre_concepto_default, costo_concepto_default, id_categoria_concepto) VALUES
(1, 'Landing Fee', 0.00, 11),
(2, 'Embarking / Disembarking', 0.00, 11),
(3, 'Parking Fee', 0.00, 11),
(4, 'Overnight', 0.00, 11),
(5, 'TUA Internacional', 0.00, 11),
(6, 'Landing Permit Cost', 0.00, 11),
(7, 'Landing Permit Coordination', 0.00, 11),
(8, 'Raf Coordination', 0.00, 11),
(9, 'Agent Supervisory Fee', 0.00, 11);

-- Servicios Especiales con costo fijo por cliente
INSERT INTO servicios_cliente_especiales (id_servicio_especial, id_cliente, nombre_servicio, costo_servicio) VALUES
(1, 3, 'Kit de bienvenida VIP personalizado', 150.00),
(2, 3, 'Prensa internacional específica', 50.00),
(3, 1, 'Coordinación de seguridad avanzada', 350.00);

-- ========= INSERCIÓN DE DATOS EN TABLAS DEPENDIENTES (Nivel 2) =========

-- Precios de Conceptos QUE APLICAN PARA UN AEROPUERTO Y/O FBO ESPECÍFICO
INSERT INTO precios_conceptos (id_precio_concepto, nombre_local_concepto, costo_concepto, divisa, id_cat_concepto, id_aeropuerto, id_fbo) VALUES
-- ** MMTO **
-- 1. Servicios del AEROPUERTO (sin FBO se tendría q poner NULL) -> (1, '', 1.00, 'MXN', 1, 44, NULL),
-- 2. Servicios FBO 'Asertec' (id_fbo=1) en MMTO
(1, 'Hand Asertec', 10.00, 'MXN', 1, 44, 1),
-- 3. Servicios FBO 'Fly Across' (id_fbo=2) en MMTO
(2, 'Hand Fly Across', 20.00, 'MXN', 1, 44, 2),
-- 4. Servicios FBO 'SAE' (id_fbo=3) en MMTO
(3, 'Hand SAE', 30.00, 'MXN', 1, 44, 3),
-- 5. Servicios de Aviación General para MMTO (id:106)
(4, 'Hand AG MMTO', 40.00, 'MXN', 2, 44, 106),
-- 6. Servicios de Aviación Comercial para MMTO (id:107)
(5, 'Hand AC MMTO', 50.00, 'MXN', 3, 44, 107),
--ACAPULCO AG
(6, 'Transportation', 4000.00, 'MXN', 4, 2, 22),
(7, 'Vehicle Access To Ramp', 1000.00, 'MXN', 10, 2, 22),
(8, 'APIS', 501.00, 'MXN', 9, 2, 22),
(9, 'TUA International', 1000.00, 'MXN', 2, 2, 22),
(10, 'Landing Permit Cost', 2281.00, 'MXN', 6, 2, 22),
(11, 'Landing Permit Coordination', 14015.00, 'MXN', 6, 2, 22),
(12, 'DNR', 1465.00, 'MXN', 5, 2, 22),
(13, 'DSM', 0.00, 'MXN', 5, 2, 22),
(14, 'Catering', 5568.00, 'MXN', 4, 2, 22),
(15, 'Fuel Uplift', 0.00, 'MXN', 8, 2, 22),
(16, 'Dugaem', 0.00, 'MXN', 8, 2, 22),
--ACAPULCO AC
(17, 'Transportation', 0.00, 'MXN', 4, 2, 23),
(18, 'Vehicle Access To Ramp', 0.00, 'MXN', 10, 2, 23),
(19, 'APIS', 0.00, 'MXN', 9, 2, 23),
(20, 'TUA International', 0.00, 'MXN', 2, 2, 23),
(21, 'Landing Permit Cost', 0.00, 'MXN', 6, 2, 23),
(22, 'Landing Permit Coordination', 0.00, 'MXN', 6, 2, 23),
(23, 'DNR', 0.00, 'MXN', 5, 2, 23),
(24, 'DSM', 0.00, 'MXN', 5, 2, 23),
(25, 'Catering', 0.00, 'MXN', 4, 2, 23),
(26, 'Fuel Uplift', 0.00, 'MXN', 8, 2, 23),
(27, 'Dugaem', 0.00, 'MXN', 8, 2, 23);