-- ========= SCRIPT PARA ELIMINAR COMPLETAMENTE LA BD (DROP) =========
-- Se eliminan en orden inverso a su creación (de la más dependiente a la independiente).

-- 1. Tablas de último nivel (Dependen de muchas otras)
DROP TABLE IF EXISTS cotizacion_conceptos CASCADE;
DROP TABLE IF EXISTS servicios_cliente_especiales CASCADE;
DROP TABLE IF EXISTS tarifas_raf_mtow CASCADE; -- Nueva tabla detectada

-- 2. Tablas de historial y precios
DROP TABLE IF EXISTS cotizaciones_historico CASCADE;
DROP TABLE IF EXISTS precios_conceptos CASCADE;

-- 3. Tablas de relación operativa (Flota y FBOs)
DROP TABLE IF EXISTS clientes_aeronaves CASCADE;
DROP TABLE IF EXISTS fbos CASCADE;

-- 4. Tablas de configuración de servicios y modelos
DROP TABLE IF EXISTS conceptos_default CASCADE;
DROP TABLE IF EXISTS aeronaves_modelos CASCADE;

-- 5. Tablas catálogo/independientes (Base)
DROP TABLE IF EXISTS clasificaciones_aeronaves CASCADE; -- Nueva tabla detectada
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS aeropuertos CASCADE;
DROP TABLE IF EXISTS categorias_operaciones CASCADE;
DROP TABLE IF EXISTS categorias_conceptos CASCADE;

-- 6. Tablas de sistema/acceso
--DROP TABLE IF EXISTS usuarios CASCADE; -- Nueva tabla detectada

-- 7. Secuencias
DROP SEQUENCE IF EXISTS cotizacion_id_seq; -- Secuencia detectada