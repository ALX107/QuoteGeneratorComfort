-- ========= INSERCIÓN DE DATOS EN TABLAS INDEPENDIENTES =========

-- Clientes 
INSERT INTO clientes (id_cliente, nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, ciudad_cliente, estado_cliente, pais_cliente, zip_cliente, contacto_cliente) VALUES 
(1, 'PÚBLICO GENERAL', 'mostrador@charterint.com', '+1-202-555-0101', 'Terminal 1, Aeropuerto Intl', 'Miami', 'Florida', 'USA', '33101', 'Agente de Turno'),
(2, 'S.D.N. FUERZA AÉREA MEXICANA', 'logistica@fam.gob.mx', '+52-55-5557-9090', 'Campo Militar No. 1', 'Ciudad de México', 'CDMX', 'México', '11200', 'Gral. Roberto Miranda'),
(3, 'CST FLIGHT SERVICES', 'dispatch@cstflight.com', '+52-55-1234-5678', 'Av. Paseo de la Reforma 222', 'Ciudad de México', 'CDMX', 'México', '06600', 'Lic. Mariana Vega'),
(4, 'BABIN AIR LTD', 'ops@babinair.mx', '+52-81-8300-4500', 'Hangar 4, Aeropuerto del Norte', 'Apodaca', 'Nuevo León', 'México', '66600', 'Ing. Eduardo Garza'),
(5, 'ODYSSEY AIRWAYS, LLC.', 'charter@odysseyair.com', '+1-813-555-0199', '4000 N Westshore Blvd', 'Tampa', 'Florida', 'USA', '33607', 'Sarah Connor'),
(6, 'SIGNUM AVIATION INC', 'flightops@signum.aero', '+1-206-555-0888', '888 Boeing Field Way', 'Seattle', 'Washington', 'USA', '98108', 'Michael Ross'),
(7, 'BOUTIQUE AIR INC.', 'reservations@boutiqueair.com', '+1-415-555-0777', '555 Market Street, Suite 200', 'San Francisco', 'California', 'USA', '94103', 'Jessica Pearson'),
(8, 'PACIFIC COAST JET LLC.', 'sales@pacificcoastjet.net', '+1-619-555-0666', '2300 Stillwater Rd', 'San Diego', 'California', 'USA', '92101', 'Harvey Specter'),
(9, 'SELECT AERO NC.', 'info@selectaeronc.com', '+1-704-555-0555', '500 Regional Road', 'Charlotte', 'North Carolina', 'USA', '28208', 'Louis Litt'),
(10, 'AEROCIVIL. US', 'admin@aerocivil.us', '+1-305-555-0444', '100 Brickell Bay Dr', 'Miami', 'Florida', 'USA', '33131', 'Donna Paulsen'),
(11, 'APOLLO AVIATION', 'support@apolloav.co.uk', '+44-20-7946-0123', '10 Downing Street Area', 'Londres', 'Inglaterra', 'Reino Unido', 'SW1A 2AA', 'James Bond'),
(12, 'BIG SKY INSULATION', 'hangar@bigskycorp.com', '+1-406-555-0333', '200 Mountain View Rd', 'Bozeman', 'Montana', 'USA', '59715', 'John Dutton'),
(13, 'MIDWEST AVIATION', 'operations@midwestav.com', '+1-312-555-0222', '300 Wacker Drive', 'Chicago', 'Illinois', 'USA', '60606', 'Alicia Florrick'),
(14, 'PCJ', 'dispatch@pcj.aero', '+1-818-555-0199', '16700 Roscoe Blvd', 'Van Nuys', 'California', 'USA', '91406', 'Michael Vance'),
(15, 'REVA', 'ops@revaair.com', '+1-954-555-2200', '2101 W Commercial Blvd', 'Fort Lauderdale', 'Florida', 'USA', '33309', 'Sarah Connor'),
(16, 'AEG ICE', 'deicing@aegfuels.com', '+44-20-7555-0888', 'Gatwick Airport, South Terminal', 'London', 'England', 'UK', 'RH6 0NP', 'James Sterling'),
(17, 'AEG GRAL', 'general.aviation@aegfuels.com', '+1-305-555-1234', '701 Brickell Avenue', 'Miami', 'Florida', 'USA', '33131', 'Elena Rodriguez'),
(18, 'ALE', 'logistics@ale-inc.com', '+52-55-5555-9876', 'Av. Paseo de la Reforma 222', 'Ciudad de México', 'CDMX', 'Mexico', '06600', 'Carlos Méndez'),
(19, 'UAS', 'dxb.ops@uas.aero', '+971-4-555-6789', 'Dubai Airport Freezone', 'Dubai', 'Dubai', 'UAE', '00000', 'Amira Al-Fayed'),
(20, 'GLOBAL X', 'charter@globalxair.com', '+1-786-555-4321', 'Miami International Airport', 'Miami', 'Florida', 'USA', '33126', 'Ricardo Tubbs'),
(21, 'PRIME JET', 'sales@primejet.com', '+1-303-555-8765', '7625 S Peoria St', 'Englewood', 'Colorado', 'USA', '80112', 'David Bowman');

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
INSERT INTO categorias_operaciones (id_cat_operacion, nombre_cat_operacion, tarifa_land_permit_coord) VALUES
(1, 'N/A',0),
(2, 'AMBULANCE / FAR PART 135',0),
(3, 'CHARTER / FAR PART 135',400),
(4, 'DIPLOMATIC / MILITARY',0),
(5, 'PRIVATE / FAR PART 91', 250),
(6, 'CAA / PRIVATE / FAR PART 91',0),
(7, 'FLETAMENTO / FAR PART 121', 1000),
(8, 'APIS',0),
(9, 'TRANSPORTATION',0),
(10, 'CATERING',0),
(11, 'FUEL / COMBUSTIBLE',0),
(12, 'PERMIT',0);

-- Categorías de Conceptos (Servicios)
INSERT INTO categorias_conceptos (id_cat_concepto, nombre_cat_concepto) VALUES
(1, 'FBO Services'),
(2, 'Taxes & Imigration Services FBO'),
(3, 'Landing Permit FBO'),
(4, 'RAF Coordination FBO'),
(5, 'Fuel FBO'),
(6, 'APIS FBO'),
(7, 'Additional Services FBO'),
(8, 'Airport Services General Aviation'),
(9, 'Third-Party Services General Aviation'),
(10, 'Taxes & Imigration Services General Aviation'),
(11, 'Landing Permit General Aviation'),
(12, 'RAF Coordination General Aviation'),
(13, 'Fuel General Aviation'),
(14, 'APIS General Aviation'),
(15, 'Additional Services General Aviation'),
(16, 'Airport Services Commercial Aviation'),
(17, 'Third-Party Services Commercial Aviation'),
(18, 'Taxes & Imigration Services Commercial Aviation'),
(19, 'Landing Permit Commercial Aviation'),
(20, 'RAF Coordination Commercial Aviation'),
(21, 'Fuel Commercial Aviation'),
(22, 'APIS Commercial Aviation'),
(23, 'Additional Services Commercial Aviation');

--Clasificación de Aeronaves
INSERT INTO clasificaciones_aeronaves (id_clasificacion, nombre_clasificacion) VALUES
(1,'Helicopter'),
(2,'Mono/Bimotor'),
(3,'Turbo Prop'),
(4,'Light Jet'),
(5,'Medium Jet'),
(6,'Large Jet'),
(7,'X Large Jet'),
(8,'XX Large Jet'),
(9,'Wide Body');

-- ========= INSERCIÓN DE DATOS EN TABLAS DEPENDIENTES (Nivel 1) =========


-- Wide Body (60,001 kg - 600,000 kg)
INSERT INTO aeronaves_modelos (id_modelo_aeronave, icao_aeronave, nombre_aeronave, mtow_aeronave, envergadura_aeronave, id_clasificacion) VALUES
(1, 'A380', 'Airbus A380', 560000, 79.75, 9),
(2, 'B777', 'Boeing 777', 299370, 60.90, 9),
(3, 'A350', 'Airbus A350', 280000, 64.75, 9),
(4, 'A340', 'Airbus A340', 275000, 60.30, 9),
(5, 'B767', 'Boeing 767', 186880, 47.60, 9),
(6, 'B787', 'Boeing 787', 227930, 60.10, 9),
(7, 'AS3B', 'Airbus A300B', 165000, 44.84, 9),
(8, 'A321', 'Airbus A321', 93500, 35.80, 9),
(9, 'B727', 'Boeing 727', 89400, 32.92, 9),
(10, 'B737', 'Boeing 737', 85000, 28.35, 9),
(11, 'B738', 'Boeing 737-800', 79015, 35.80, 9),
(12, 'A320N', 'Airbus A320neo', 79000, 35.80, 9),
(13, 'A319', 'Airbus A319', 75500, 35.80, 9),
(14, 'A320', 'Airbus A320', 77000, 35.80, 9),
(15, 'MD80', 'McDonnell Douglas MD-80', 67812, 32.82, 9),
(16, 'MD82', 'McDonnell Douglas MD-82', 67812, 32.82, 9),
(17, 'MD83', 'McDonnell Douglas MD-83', 72575, 32.82, 9),
(18, 'B733', 'Boeing 737-300', 61235, 28.88, 9),
(19, 'P3', 'Lockheed P-3 Orion', 61235, 30.40, 9),

---------------------------
(20, 'B744', 'Boeing 747-400', 396890, 64.40, 9),
(21, 'C17A', 'Globemaster III', 265350, 51.75, 9),
(22, 'A400', 'Airbus A400M', 141000, 42.40, 9),
(23, 'B757', 'Boeing 757', 115680, 38.05, 9),
(24, 'B752', 'Boeing 757-200', 115680, 38.05, 9),
(25, 'B722', 'Boeing 727-200', 95000, 32.92, 9),
(26, 'C40', 'Boeing 737-700C', 77565, 34.30, 9),
(27, 'C30J', 'C-130J Super Hercules', 74400, 40.41, 9),
(28, 'C130', 'Hercules', 70300, 40.41, 9),

--ESTOS NO ESTÁN EN LA TABLA DE CLASIFICACIÓN

---------------------------

-- XX Large Jet (40,001 kg - 60,000 kg)
(29, 'GL7T', 'Bombardier Global 7500', 52400, 31.70, 8),
(30, 'FA10X', 'Falcon 10X', 52163, 33.60, 8),
(31, 'DC93', 'Douglas DC-9-30', 49895, 28.45, 8),
(32, 'DC9', 'Douglas DC-9', 49895, 28.45, 8),
(33, 'G650', 'Gulfstream G650', 45178, 30.36, 8),
(34, 'GLF6', 'Gulfstream G650', 45178, 30.36, 8),
(35, 'GA6C', 'Gulfstream G600', 45178, 28.96, 8),
(36, 'GLEX', 'Global Express GLEX', 45132, 28.65, 8),
(37, 'GL60', 'Global 6000', 45132, 28.65, 8),
(38, 'GLXR', 'Bombardier Global Express', 44452, 28.65, 8),
(39, 'A190', 'Antonov An-148', 43700, 28.91, 8),
(40, 'G600', 'Gulfstream G600', 42638, 28.96, 8),
(41, 'GL5T', 'Global 5000', 41957, 28.65, 8),
(42, 'GLF5', 'Gulfstream V', 41277, 28.50, 8),
(43, 'G550', 'Gulfstream G550', 41277, 28.50, 8),
(44, 'GA5C', 'Gulfstream G500', 41277, 26.29, 8),
------------------------
(45, 'GL6T', 'Global 6000', 45132, 28.65, 8),

--NO ESTÁN EN LA TABLA DE CLASIFICACIÓN
------------------------

-- X Large Jet (30,001 kg - 40,000 kg)
(46, 'GLF4', 'Gulfstream IV', 33838, 23.72, 7),
(47, 'G450', 'Gulfstream G450', 33838, 23.72, 7),
(48, 'CRJ7', 'Bombardier CRJ700', 33340, 23.20, 7),
(49, 'FA8X', 'Falcon 8X', 33113, 26.29, 7),
(50, 'C27J', 'Alenia C-27J Spartan', 31800, 28.70, 7),
(51, 'FA7X', 'Falcon 7X', 31751, 26.21, 7),
(52, 'GLF3', 'Gulfstream III', 31751, 23.72, 7),
(53, 'F7X', 'Falcon 7X', 31751, 26.21, 7),

--------------------------
(54, 'E170', 'Embraer 170', 37200, 26.00, 7),

--NO ESTÁN EN LA TABLA DE CLASIFICACIÓN
--------------------------

-- Large Jet (20,001 kg - 30,000 kg)
(55, 'GLF2', 'Gulfstream II', 29710, 20.98, 6),
(56, 'CRJ2', 'Bombardier CRJ200', 24041, 21.20, 6),
(57, 'C295', 'Airbus C295', 23200, 25.81, 6),
(58, 'E35L', 'Legacy 600', 22500, 21.17, 6),
(59, 'F900', 'Falcon 900', 22225, 19.33, 6),
(60, 'E145', 'Embraer E145', 22000, 20.04, 6),
(61, 'E135', 'Embraer E135', 20990, 20.04, 6),
(62, 'E35L', 'Embraer Legacy 600', 22500, 21.17, 6),
---------------------------
(63, 'SB20', 'Saab 2000', 22800, 24.76, 6),
--NO ESTÁN EN LA TABLA DE CLASIFICACIÓN
---------------------------

-- Medium Jet (10,001 kg - 20,000 kg)
(64, 'E550', 'Legacy 500', 19550, 19.25, 5),
(65, 'CL60', 'Challenger 600/604', 21863, 19.61, 5),
(66, 'CL36', 'Challenger 600', 19550, 19.61, 5),
(67, 'EMB550', 'Praetor 600', 19449, 21.50, 5),
(68, 'F2EX', 'Falcon 2000EX', 19414, 19.33, 5),
(69, 'S64', 'Sikorsky S-64', 19050, 21.95, 5),
(70, 'CL35', 'Challenger 350', 18416, 21.00, 5),
(71, 'G280', 'Gulfstream G280', 17962, 19.20, 5),
(72, 'C700', 'Citation Longitude', 17917, 20.42, 5),
(73, 'E545', 'Legacy 450', 17768, 19.25, 5),
(74, 'FA50', 'Falcon 50', 17600, 18.86, 5),
(75, 'CL30', 'Challenger 300', 17258, 19.46, 5),
(76, 'HA4T', 'Hawker 4000', 16375, 18.80, 5),
(77, 'C750', 'Citation X', 16375, 19.48, 5),
(78, 'F2TH', 'Falcon 2000', 16330, 19.33, 5),
(79, 'ASRT', 'Astra', 16080, 16.05, 5),
(80, 'GALX', 'Galaxy', 16080, 17.70, 5),
(81, 'GLF200', 'Gulfstream G200', 16080, 17.70, 5),
(82, 'C68A', 'Citation Latitude', 13971, 22.05, 5),
(83, 'FA20', 'Falcon 20', 13835, 16.30, 5),
(84, 'C680', 'Citation Sovereign', 13744, 19.30, 5),
(85, 'H25B', 'Hawker 800/850XP', 12701, 16.60, 5),
(86, 'H25C', 'Hawker 1000', 14061, 15.70, 5),
(87, 'G150', 'Gulfstream G150', 11839, 16.94, 5),
(88, 'G100', 'Gulfstream G100', 11839, 16.71, 5),
(89, 'E120', 'Embraer E120', 11500, 19.78, 5),
(90, 'H25A', 'Hawker 800XP', 10886, 15.66, 5),
(91, 'LJ60', 'Learjet 60', 10660, 13.34, 5),
(92, 'UH60', 'Black Hawk', 10660, 16.36, 5),
---------------------------
(93, 'WW24', 'Westwind 24', 10660, 13.7, 5),

--NO ESTÁN EN LA TABLA DE CLASIFICACIÓN
---------------------------

-- Light Jet (1,000 kg - 10,000 kg)
(94, 'C560', 'Cessna Citation V/Ultra', 9979, 15.90, 4),
(95, 'LJ40', 'Learjet 40', 9752, 14.56, 4),
(96, 'LJ75', 'Learjet 75', 9752, 15.51, 4),
(97, 'LJ70', 'Learjet 70', 9752, 15.51, 4),
(98, 'LJ45', 'Learjet 45', 9752, 14.56, 4),
(99, 'LJ55', 'Learjet 55', 9752, 13.34, 4),
(100, 'C650', 'Citation III/VI/VII', 9525, 16.31, 4),
(101, 'C56X', 'Citation Excel/XLS', 9163, 17.17, 4),
(102, 'LJ35', 'Learjet 35', 8301, 12.04, 4),
(103, 'E55P', 'Phenom 300', 8150, 15.90, 4),
(104, 'PC24', 'Pilatus PC-24', 8005, 17.00, 4),
(105, 'LJ31', 'Learjet 31', 7800, 13.36, 4),
(106, 'C25C', 'Citation CJ4', 7761, 15.49, 4),
(107, 'SW4', 'Metroliner', 7484, 17.37, 4),
(108, 'BE40', 'Beechjet 400', 7303, 13.26, 4),
(109, 'AT80', 'Air Tractor AT-802', 7257, 18.06, 4),
(110, 'BE30', 'King Air 300', 6804, 16.61, 4),
(111, 'LJ25', 'Learjet 25', 6577, 10.84, 4),
(112, 'LJ24', 'Learjet 24', 6350, 10.84, 4),
(113, 'LJ28', 'Learjet 28', 6350, 13.35, 4),
(114, 'C550', 'Citation II', 6291, 15.75, 4),
(115, 'C25B', 'Citation CJ3', 6291, 16.26, 4),
(116, 'BE20', 'King Air 200', 5670, 16.61, 4),
(117, 'PRM1', 'Premier I', 5670, 13.56, 4),
(118, 'UC35', 'Citation V (Mil)', 7700, 15.90, 4),
(119, 'FA10', 'Falcon 10', 7600, 13.08, 4),
(120, 'C26', 'Metroliner', 7480, 17.37, 4),
(121, 'C501', 'Citation I/SP', 5670, 14.35, 4),
(122, 'C5252', 'Citation CJ2', 5670, 15.19, 4),
(123, 'C500', 'Citation I', 5670, 14.35, 4),
(124, 'C525', 'Citation Jet', 4990, 14.26, 4),
(125, 'C25A', 'Citation CJ2', 4990, 15.19, 4),
(126, '525', 'Citation Jet', 4990, 14.26, 4),
(127, 'HDJT', 'HondaJet', 4808, 12.12, 4),
(128, 'E50P', 'Phenom 100', 4800, 12.30, 4),
(129, 'E50', 'Phenom 100', 4800, 12.30, 4),
(130, 'BE9T', 'King Air F90', 4760, 13.99, 4),
(131, 'C510', 'Citation Mustang', 3920, 13.16, 4),
(132, 'SF50', 'Vision Jet', 2722, 11.79, 4),
(133, 'BD10', 'Bede BD-10', 2041, 8.15, 4),
---------------------------
(134, 'C12', 'Huron (King Air)', 6800, 16.61, 4),
(135, 'C25M', 'Citation M2', 4853, 14.26, 4),
(136, 'C90I', 'King Air C90', 4750, 15.32, 4),
(137, 'MU2', 'Mitsubishi MU-2', 4700, 11.94, 4),
(138, 'EA50', 'Eclipse 500', 2720, 11.40, 4),
--NO ESTÁN EN LA TABLA DE CLASIFICACIÓN
---------------------------

--VERIFICAR DE AQUI EN ADELANTE

-- Turbo Prop (1,800 kg - 8,600 kg)
(139, 'BE30', 'Beechcraft King Air 300', 6350, 16.61, 3),
(140, 'BE50', 'Beechcraft BE50 Twin Bonanza ', 2858, 13.78, 3),------
(141, 'B350', 'Beechcraft King Air 350', 6804, 17.65, 3),
(142, 'B300', 'Beechcraft King Air 300', 6350, 16.61, 3),
(143, 'SW3', 'Swearingen Metroliner III', 6577, 17.37, 3),
(144, 'B200', 'Beechcraft King Air 200', 5670, 16.61, 3),
(145, 'B20GT', 'Beechcraft King Air 200GT', 5670, 16.61, 3),
(146, 'BE20', 'Beechcraft King Air 200', 5670, 16.60, 3),
(147, 'B20T', 'Beechcraft King Air 200T', 5670, 16.61, 3),
(148, 'P180', 'Piaggio P.180 Avanti', 5489, 14.03, 3),
(149, 'E314', 'Embraer EMB 314 Super Tucano', 5400, 11.14, 3),
(150, 'BE9L', 'Beechcraft King Air C90GTx', 4754, 15.32, 3),
(151, 'PC12', 'Pilatus PC-12', 4760, 16.27, 3),
(152, 'BE90', 'Beechcraft King Air 90', 4378, 15.32, 3),
(153, 'C90', 'Beechcraft King Air C90', 4378, 15.32, 3),
(154, 'C90GT', 'Beechcraft King Air C90GT', 4580, 15.32, 3),
(155, 'E90', 'Beechcraft King Air E90', 4580, 15.32, 3),
(156, 'C441', 'Cessna 441 Conquest II', 4668, 15.04, 3),
(157, 'C90A', 'Beechcraft King Air C90A', 4378, 15.32, 3),
(158, '690C', 'Twin Commander 690C', 4683, 15.88, 3),
(159, 'AC90', 'Aero Commander 690', 4649, 14.20, 3),
(160, 'PT52', 'Piper PA-31T2 Cheyenne IIXL', 4128, 13.01, 3),
(161, 'PAY2', 'Piper Cheyenne II', 4300, 13.00, 3),
(162, 'C208', 'Cessna 208 Caravan', 3629, 15.88, 3),
(163, 'TBM9', 'Daher TBM 900', 3354, 12.83, 3),
(164, 'C414', 'Cessna 414 Chancellor', 3062, 13.45, 3),
(165, 'TBM7', 'Socata TBM 700', 3354, 12.83, 3),
(166, 'TBM8', 'Daher TBM 850', 3354, 12.83, 3),
(167, 'C421', 'Cessna 421 Golden Eagle', 3379, 12.52, 3),
(168, 'PA46', 'Piper PA-46-500TP Meridian', 2310, 13.11, 3),----------
(169, 'G120', 'Grob G 120TP', 1590, 10.31, 3),

-- Mono Bimotor (500 kg - 3,000 kg)
(170, 'BE55', 'Beechcraft Baron 55', 2313, 11.53, 2),
(171, 'B55P', 'Beechcraft Baron 55P', 2313, 11.53, 2),
(172, 'P46T', 'Piper PA-46-500TP Meridian', 2310, 13.11, 2),
(173, 'PA45', 'Piper PA-45 Stepwawny', 1724, 10.85, 2),
(174, 'PA46T', 'Piper PA-46-500TP Malibu Meridian', 2310, 13.11, 2),
(175, 'PA34', 'Piper PA-34 Seneca', 2154, 11.90, 2),
(176, 'PA36', 'Piper PA-36 Pawnee Brave', 2177, 11.80, 2),----------
(177, 'T210', 'Cessna T210 Centurion', 1814, 11.20, 2),
(178, 'BE36', 'Beechcraft Bonanza 36', 1656, 10.21, 2),
(179, 'G36', 'Beechcraft Bonanza G36', 1656, 10.21, 2),
(180, 'BE46', 'Beechcraft Model 17 Staggerwing', 1928, 9.75, 2),
(181, 'C210', 'Cessna 210 Centurion', 1814, 11.20, 2),
(182, 'G6', 'Cirrus SR22 G6', 1633, 11.68, 2),
(183, 'SR22', 'Cirrus SR22', 1633, 11.68, 2),
(184, 'C206', 'Cessna 206 Stationair', 1633, 10.97, 2),
(185, 'C207', 'Cessna 207 Skywagon', 1724, 10.97, 2),
(186, 'PA32', 'Piper PA-32 Saratoga', 1633, 10.02, 2),
(187, 'P32R', 'Piper PA-32R Saratoga', 1633, 10.02, 2),
(188, 'PCA32', 'Piper PA-32 Cherokee Six', 1542, 10.00, 2),
(189, 'C260', 'Cessna 260 Skylane', 1406, 10.97, 2),
(190, 'BE35', 'Beechcraft Bonanza V35', 1542, 10.21, 2),
(191, 'M20T', 'Mooney M20T Predator', 1315, 11.00, 2),
(192, 'C185', 'Cessna 185 Skywagon', 1520, 10.92, 2),
(193, 'M20K', 'Mooney M20K', 1419, 11.00, 2),
(194, 'M20M', 'Mooney M20M Bravo', 1528, 11.00, 2),
(195, 'C182', 'Cessna 182 Skylane', 1406, 10.97, 2),
(196, 'P28T', 'Piper PA-28RT-201T Turbo Arrow', 1315, 10.80, 2),
(197, 'PA28T', 'Piper PA-28R-201T Turbo Arrow III', 1315, 10.80, 2),
(198, 'M20P', 'Mooney M20P', 1315, 11.00, 2),
(199, 'PA28', 'Piper PA-28 Cherokee', 975, 9.14, 2),
(200, 'C172', 'Cessna 172 Skyhawk', 1157, 11.00, 2),
(201, 'M20E', 'Mooney M20E Super 21', 1168, 10.67, 2),
(202, 'PA25', 'Piper PA-25 Pawnee', 1315, 11.02, 2),
(203, 'PA22', 'Piper PA-22 Tri-Pacer', 907, 8.92, 2),
(204, 'CC19', 'XCub Carbon Cub', 845, 10.41, 2),
(205, 'CCX2300', 'CubCrafters Carbon Cub EX-3', 907, 10.41, 2),
(206, 'PA18', 'Piper PA-18 Super Cub', 794, 10.73, 2),
(207, 'C150', 'Cessna 150 Commuter/Trainer', 726, 10.11, 2),
(208, '7GCAA', 'American Champion Citabria', 748, 10.19, 2),
(209, 'FLF150', 'Cessna 150 Aerobat', 726, 10.11, 2),
(210, 'RV12', 'Vans Aircraft RV-12', 599, 8.21, 2), ------
(211, 'CH75', 'Zenith CH 750', 600, 9.09, 2),

-- Helicopter (500 kg - 12,000 kg aprox.)
(212, 'R44', 'Robinson R44', 1089, 10.10, 1),
(213, 'R66', 'Robinson R66', 1225, 10.10, 1),
(214, 'R22', 'Robinson R22 Beta', 622, 7.60, 1),
(215, 'AS50', 'Eurocopter AS350 Écureuil', 2250, 10.69, 1),
(216, 'B206', 'Bell 206 JetRanger', 1451, 10.16, 1),
(217, 'AS32', 'Super Puma', 9000, 15.60, 1);


-- Flota de Aeronaves de Clientes (varias por cliente)
INSERT INTO clientes_aeronaves (id_cliente_aeronave, matricula_aeronave, es_miembro_caa, fecha_vigencia_caa, id_cliente, id_modelo_aeronave) VALUES
(1, '3910', FALSE, NULL, 2, 42), -- Fuerza Aérea Mexicana, Gulfstream V
(2, 'N868CW', FALSE, NULL, 12, 94),       -- Big Sky Insulation, Cessna Citation V 
(3, 'N476JD', FALSE, NULL, 5, 122), -- ODYSSEY AIRWAYS, Citation CJ2 
(4, 'N704LB', FALSE, NULL, 6, 71), -- Signum Aviation, Gulfstream G280
(5, 'N204A', FALSE, NULL, 6, 42),       -- Signum Aviation, Gulfstream V
(6, 'N65S', FALSE, NULL, 6, 59), -- Signum Aviation, Falcon 900
(7, 'N357K', TRUE, '2010-10-10', 13, 96); --MidWest Aviation, Learjet 75

--(6, 'N65S', TRUE, '2025-11-10', 6, 92); 

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
INSERT INTO conceptos_default (id_concepto_std, nombre_concepto_default, costo_concepto_default, divisa_concepto_default, es_default, exento_sc, id_cat_concepto) VALUES
--FBO SERVICES (1)
(1, 'Landing Fee', 0.00,'MXN', true, false, 1),
(2, 'Embarking / Disembarking', 0.00,'MXN', true, false, 1),
(3, 'Parking Fee', 0.00, 'MXN',true, false, 1),
(4, 'Overnight', 0.00,'MXN', true, false, 1),
(5, 'TUA', 0.00,'MXN',true, false, 1),
(6, 'TUI', 0.00, 'MXN',false, false, 1),
(7, 'Handling', 0.00,'MXN', false, false, 1),
(8, 'Lav Service', 0.00, 'MXN',false, false, 1),
(9, 'Dish Wash', 0.00,'MXN', false, false, 1),
(10, 'Food Refrigeration', 0.00, 'MXN',false, false, 1),
(11, 'Luggage Hauling', 0.00,'MXN', false, false, 1),
(12, 'Catering', 0.00,'MXN', false, false, 1),
(13, 'Transportation', 0.00, 'MXN',false, false, 1),
(14, 'Airport Participation', 0.00, 'MXN',false, false, 1),
--TAXES & IMMIGRATION SERVICES (2) --FBO
(15, 'DNR', 983, 'MXN',false, false,2),
(16, 'DSM', 232, 'MXN',false, false,2),
(17, 'DSME/Arrival', 2707, 'MXN', false,false, 2),
(18, 'DSME/Departure', 2707, 'MXN', false, false ,2),
--LANDING PERMIT (3) --FBO
(19, 'Landing Permit Cost', 2281.00, 'MXN', true, false, 3),
(20, 'Landing Permit Coordination', 0.00,'USD', true, true, 3),
--RAF COORDINATION (4) --FBO 
(21, 'RAF Coordination', 0.00,'USD', true, true, 4),
(22, 'Agent Supervisory Fee', 0.00,'MXN', true, true, 4),
--FUEL (5) --FBO
(23, 'Fuel Uplift', 0.00,'MXN', false, false,5),
(24, 'Dugaem', 0.00,'MXN', false, false, 5),
(25, 'Fuel Supervision', 0.00,'MXN', false,false, 5),
--APIS (6) --FBO
(26, 'APIS National', 50.00,'USD', false, false,6),
(27, 'APIS International', 50.00,'USD', false, false,6),
--ADDTIONAL SERVICES (7) --FBO
(28, 'Vehicle Access To Ramp', 0.00,'MXN', false, false,7),
(29, 'Extension Time', 0.00,'MXN', false,false, 7),
(30, 'Anticipation Time', 0.00,'MXN', false, false,7),
(31, 'ICQ', 0.00,'MXN', false, false,7),
(32, 'VIP Service', 0.00,'MXN', false, false,7),
(33, 'Mexican Insurance', 0.00,'MXN', false, false,7),
--AIRPORT SERVICES (8) --AV.GRAL
(34, 'Landing Fee', 0.00,'MXN', true, false,8),
(35, 'Embarking / Disembarking', 0.00,'MXN', true,false, 8),
(36, 'Parking Fee', 0.00, 'MXN',true, false,8),
(37, 'Overnight', 0.00,'MXN', true,false, 8),
(38, 'TUA', 0.00,'MXN',true, false,8),
(39, 'GAT', 0.00,'MXN', false, false,8),
--THIRD PARTY SERVICES (9) --AV.GRAL
(40, 'Lavatory Service', 0.00, 'MXN', false, false,9),
(41, 'Catering', 0.00,'MXN', false, false,9),
(42, 'Transportation', 0.00, 'MXN',false,false, 9),
(43, 'GPU/APU', 0.00, 'MXN',false, false,9),
--TAXES & IMMIGRATION SERVICES (10) --AV.GRAL
(44, 'DNR', 983.00, 'MXN',false, false,10),
(45, 'DSM', 232.00, 'MXN',false, false,10),
(46, 'DSME/Arrival', 2707.00, 'MXN', false, false,10),
(47, 'DSME/Departure', 2707.00, 'MXN', false, false,10),
--LANDING PERMIT (11) --AV.GRAL
(48, 'Landing Permit Cost', 2281.00, 'MXN', true, false,11),
(49, 'Landing Permit Coordination', 0.00,'USD', true, true, 11),
--RAF COORDINATION (12) --AV.GRAL
(50, 'RAF Coordination', 0.00,'USD', true, true, 12),
(51, 'Agent Supervisory Fee', 0.00,'MXN', true, true, 12),
--FUEL (13) --AV.GRAL
(52, 'Fuel Uplift', 0.00,'MXN', false, false,13),
(53, 'Dugaem', 0.00,'MXN', false, false,13),
(54, 'Fuel Supervision', 0.00,'MXN', false, false,13),
--APIS (14) --AV.GRAL
(55, 'APIS National', 50.00,'USD', false, false,14),
(56, 'APIS International', 50.00,'USD', false, false,14),
--ADDITIONAL SERVICES (15) --AV.GRAL
(57, 'Vehicle Access To Ramp', 0.00, 'MXN',false,false, 15),
(58, 'Extension Time', 0.00, 'MXN',false,false, 15),
(59, 'Anticipation Time', 0.00, 'MXN',false, false,15),
(60, 'VIP Service', 0.00, 'MXN',false, false,15),
(61, 'Mexican Insurance', 0.00, 'MXN',false, false,15),
--AIRPORT SERVICES (16) --AV.COM
(62, 'Landing Fee', 0.00, 'MXN',true, false,16),
(63, 'Embarking / Disembarking', 0.00, 'MXN',true, false,16),
(64, 'Parking Fee', 0.00, 'MXN',true, false,16),
(65, 'Overnight', 0.00, 'MXN',true,false, 16),
(66, 'TUA', 0.00, 'MXN',true, false,16),
(67, 'Passenger Security', 0.00, 'MXN',false,false, 16),
(68, 'Counters', 0.00, 'MXN',false,false, 16),
(69, 'Jetway', 0.00, 'MXN',false,false, 16),
(70, 'Shuttle', 0.00, 'MXN', false, false,16),
(71, 'Slots', 0.00,'MXN', false, false,16),
--THIRD PARTY SERVICES (17) --AV.COM
(72, 'Ground Support Equipment', 0.00, 'MXN',false,false, 17),
(73, 'Security', 0.00, 'MXN',false,false, 17),
(74, 'Catering', 0.00, 'MXN',false, false,17),
(75, 'Transportation', 0.00, 'MXN',false, false,17),
--TAXES & IMMIGRATION SERVICES (18) --AV.COM
(76, 'DNR', 983.00, 'MXN',false, false,18),
(77, 'DSM', 232.00, 'MXN',false, false,18),
(78, 'DSME/Arrival', 2707.00, 'MXN', false,false, 18),
(79, 'DSME/Departure', 2707.00, 'MXN', false, false,18),
--LANDING PERMIT (19) --AV.COM
(80, 'Landing Permit Cost', 2281.00, 'MXN', true,false, 19),
(81, 'Landing Permit Coordination', 0.00,'USD', true, true, 19),
--RAF COORDINATION (20) --AV.COM
(82, 'RAF Coordination', 0.00,'USD', true, true, 20),
(83, 'Agent Supervisory Fee', 0.00,'MXN', true,true, 20),
--FUEL (21) --AV.COM
(84, 'Fuel Uplift', 0.00,'MXN', false, false,21),
(85, 'Dugaem', 0.00,'MXN', false, false,21),
(86, 'Fuel Supervision', 0.00,'MXN', false, false,21),
--APIS (22) --AV.COM
(87, 'APIS National', 50.00,'USD', false,false, 22),
(88, 'APIS International', 50.00,'USD', false, false,22),
--ADDITIONAL SERVICES (23) --AV.COM
(89, 'Vehicle Access To Ramp', 0.00, 'MXN',false,false, 23),
(90, 'Extension Time', 0.00, 'MXN',false, false,23),
(91, 'Anticipation Time', 0.00, 'MXN',false, false,23),
(92, 'VIP Service', 0.00, 'MXN',false,false, 23),
(93, 'Mexican Insurance', 0.00, 'MXN',false, false, 23),
--FBO SERVICES (1)
(94, 'International Terminal Service', 0.00, 'MXN',false,false, 1);

INSERT INTO tarifas_raf_mtow (min_weight, max_weight, costo_usd, costo_caa_usd, id_concepto_std, id_clasificacion) VALUES

--FBO RAF coordination (21)
(500, 12000, 479.00, 343.00, 21, 1), --helicopteros
(500, 3000, 341.00, 245.00,21, 2),  --monomotores y bimotores 
(1800, 8600, 546.00, 391.00,21, 3), --turboprops 
(1000, 10000, 684.00, 489.00,21, 4), 
(10001, 20000, 820.00, 587.00,21, 5), 
(20001, 30000, 1367.00, 978.00,21, 6),
(30001, 40000, 1867.00, 1336.04,21, 7),
(40001, 60000, 2050.00, 1467.00,21, 8),
(60001, 600000, 3080.00, 0.00,21, 9),

--Aviación Gral RAF coordination (50)
(500, 12000, 479.00, 343.00,50, 1), 
(500, 3000, 341.00, 245.00,50, 2),  
(1800, 8600, 546.00, 391.00,50, 3), 
(1000, 10000, 684.00, 489.00,50, 4), 
(10001, 20000, 820.00, 587.00,50, 5), 
(20001, 30000, 1367.00, 978.00,50, 6),
(30001, 40000, 1867.00, 1336.04,50, 7),
(40001, 60000, 2050.00, 1467.00,50, 8),
(60001, 600000, 3080.00, 0.00, 50, 9),


--Aviación Comercial RAF coordination (82)
(500, 12000, 479.00, 343.00,82, 1), 
(500, 3000, 341.00, 245.00,82, 2),  
(1800, 8600, 546.00, 391.00,82, 3), 
(1000, 10000, 684.00, 489.00,82, 4), 
(10001, 20000, 820.00, 587.00,82, 5), 
(20001, 30000, 1367.00, 978.00,82, 6),
(30001, 40000, 1867.00, 1336.04,82, 7),
(40001, 60000, 2050.00, 1467.00,82, 8),
(60001, 600000, 3080.00, 0.00,82, 9);


-- Servicios Especiales con costo fijo por cliente
INSERT INTO servicios_cliente_especiales (id_servicio_especial, id_cliente, id_concepto_std, costo_servicio) VALUES
(1, 14, 21, 0.00), --PCJ RAF COORDINATION FBO
(2, 14, 50, 0.00), --PCJ RAF COORDINATION AV GRAL
(3, 14, 82, 0.00), --PCJ RAF COORDINATION AV COM

(4, 15, 21, 550.00), --REVA RAF COORDINATION FBO
(5, 15, 50, 550.00), --REVA RAF COORDINATION AV GRAL
(6, 15, 82, 550.00), --REVA RAF COORDINATION AV COM

(7, 16, 21, 1200.00), --AEG ICE RAF COORDINATION FBO -- SOLO VUELOS DE REPATRIACIÓN
(8, 16, 50, 1200.00), --AEG ICE RAF COORDINATION AV GRAL -- SOLO VUELOS DE REPATRIACIÓN
(9, 16, 82, 1200.00), --AEG ICE RAF COORDINATION AV COM -- SOLO VUELOS DE REPATRIACIÓN

(10, 17, 21, 0.00), --AEG GRAL RAF COORDINATION FBO
(11, 17, 50, 0.00), --AEG GRAL RAF COORDINATION AV GRAL
(12, 17, 82, 0.00), --AEG GRAL RAF COORDINATION AV COM

(13, 18, 21, 0.00), --ALE RAF COORDINATION FBO
(14, 18, 50, 0.00), --ALE RAF COORDINATION AV GRAL
(15, 18, 82, 0.00), --ALE RAF COORDINATION AV COM

(16, 19, 21, 0.00), --UAS RAF COORDINATION FBO
(17, 19, 50, 0.00), --UAS RAF COORDINATION AV GRAL
(18, 19, 82, 0.00), --UAS RAF COORDINATION AV COM

(19, 20, 21, 0.00), --GLOBAL X RAF COORDINATION FBO
(20, 20, 50, 0.00), --GLOBAL X RAF COORDINATION AV GRAL
(21, 20, 82, 0.00), --GLOBAL X RAF COORDINATION AV COM

(22, 21, 21, 1467.00), --PRIME JET RAF COORDINATION FBO
(23, 21, 50, 1467.00), --PRIME JET RAF COORDINATION AV GRAL
(24, 21, 82, 1467.00); --PRIME JET RAF COORDINATION AV COM

--(2, 14, 6, 700.00),
--(3, 15, 8, 1200.00), --AEG (SOLO VUELOS DE REPATRIACIÓN)
--(4, 15, 6, 400.00), --AEG (SOLO VUELOS DE REPATRIACIÓN)
--(5, 16, 8, 1467.00),
--(6, 16, 6, 400.00),
--(7, 17, 8, 350.00), --PINACLE (SOLO PARA SÁN JOSÉ, CANCUN, SAN LUCAS, GUADALAJARA Y PUERTO VALLARTA)
--(8, 17, 6, 400.00); --PINACLE (SOLO PARA SÁN JOSÉ, CANCUN, SAN LUCAS, GUADALAJARA Y PUERTO VALLARTA)

-- ========= INSERCIÓN DE DATOS EN TABLAS DEPENDIENTES (Nivel 2) =========

-- Precios de Conceptos QUE APLICAN PARA UN AEROPUERTO Y/O FBO ESPECÍFICO
INSERT INTO precios_conceptos (id_precio_concepto, tarifa_servicio, divisa, id_concepto_std, id_cat_concepto, id_aeropuerto, id_fbo) VALUES


--TARIFAS DE AVIACIÓN GENERAL POR AEROPUERTO
--34 Landing Fee
--35 Embarking / Disembarking
--36 Parking Fee
--37 Overnight
--38 TUA

-----------TOLUCA AVIACIÓN GENERAL (id_aeropuerto:44) -----------
(1, 0, 'MXN', 34, 8, 44, 106),
(2, 0, 'MXN', 35, 8, 44, 106),
(3, 0, 'MXN', 36, 8, 44, 106),
(4, 0, 'MXN', 37, 8, 44, 106),
(5, 0, 'MXN', 38, 8, 44, 106),

-----------SAN JOSÉ DEL CABO AVIACIÓN GENERAL (id_aeropuerto:36) -----------
(6, 103.42, 'MXN', 34, 8, 36, 90), --POR TONELADA Y 3O MINS DE ESTACIONAMIENTO
(7, 0, 'MXN', 35, 8, 36, 90), 
(8, 34.46, 'MXN', 36, 8, 36, 90), --POR TONELADA Y POR MEDIA HORA
(9, 4.11, 'MXN', 37, 8, 36, 90), --POR TONELADA Y POR MEDIA HORA 
(10, 63.25, 'USD', 38, 8, 36, 90), --POR PASAJERO

-----------CANCÚN AVIACIÓN GENERAL (id_aeropuerto:46) -----------
(11, 0, 'MXN', 34, 8, 46, 110),
(12, 0, 'MXN', 35, 8, 46, 110),
(13, 0, 'MXN', 36, 8, 46, 110),
(14, 0, 'MXN', 37, 8, 46, 110),
(15, 0, 'MXN', 38, 8, 46, 110),

-----------AIFA AVIACIÓN GENERAL (id_aeropuerto:38) -----------
(16, 0, 'MXN', 34, 8, 38, 94),
(17, 0, 'MXN', 35, 8, 38, 94),
(18, 0, 'MXN', 36, 8, 38, 94),
(19, 0, 'MXN', 37, 8, 38, 94),
(20, 0, 'MXN', 38, 8, 38, 94),

-----------TULUM AVIACIÓN GENERAL (id_aeropuerto:42) -----------
(21, 0, 'MXN', 34, 8, 42, 102),
(22, 0, 'MXN', 35, 8, 42, 102),
(23, 0, 'MXN', 36, 8, 42, 102),
(24, 0, 'MXN', 37, 8, 42, 102),
(25, 0, 'MXN', 38, 8, 42, 102),

-----------MONTERREY MMAN AVIACIÓN GENERAL (id_aeropuerto:3) -----------
(26, 107.51, 'MXN', 34, 8, 3, 24), --TARIFA HORARIO ESTÁNDAR
(27, 0, 'MXN', 35, 8, 3, 24),
(28, 0, 'MXN', 36, 8, 3, 24),
(29, 6.28, 'MXN', 37, 8, 3, 24),
(30, 57.74, 'USD', 38, 8, 3, 24),

-----------GUADALAJARA AVIACIÓN GENERAL (id_aeropuerto:13) -----------
(31, 125.15 , 'MXN', 34, 8, 13, 44),
(32, 0, 'MXN', 35, 8, 13, 44),
(33, 41.76, 'MXN', 36, 8, 13, 44),
(34, 5.01, 'MXN', 37, 8, 13, 44),
(35, 63.25, 'USD', 38, 8, 13, 44),

-----------SAN LUCAS AVIACIÓN GENERAL (id_aeropuerto:37) -----------
(36, 0, 'MXN', 34, 8, 37, 92),
(37, 0, 'MXN', 35, 8, 37, 92),
(38, 0, 'MXN', 36, 8, 37, 92),
(39, 0, 'MXN', 37, 8, 37, 92),
(40, 0, 'MXN', 38, 8, 37, 92);