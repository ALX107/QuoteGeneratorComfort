-- =================================================================
-- SCRIPT DE BORRADO DE TABLAS
-- =================================================================
-- Las tablas se eliminan en orden inverso a su dependencia para
-- evitar errores de restricción de llaves foráneas (foreign keys).
-- Se empieza por las tablas más dependientes.
-- =================================================================

-- ========= NIVEL 3 (Tablas que dependen de múltiples tablas) =========

-- Eliminar la tabla de conceptos de cotización, que depende de 'cotizaciones' y 'precios_conceptos'.
DROP TABLE IF EXISTS cotizacion_conceptos;

-- Eliminar la tabla de historial. No tiene FK, pero lógicamente es la más dependiente.
DROP TABLE IF EXISTS cotizaciones_historico;


-- ========= NIVEL 2 (Tablas que dependen de tablas de Nivel 1) =========

-- Eliminar la tabla principal de cotizaciones.
DROP TABLE IF EXISTS cotizaciones;

-- Eliminar la tabla de precios, que depende de 'conceptos_estandarizados', 'aeropuertos' y 'fbos'.
DROP TABLE IF EXISTS precios_conceptos;


-- ========= NIVEL 1 (Tablas que dependen de las tablas independientes) =========

-- Eliminar los servicios especiales de clientes, que depende de 'clientes'.
DROP TABLE IF EXISTS servicios_cliente_especiales;

-- Eliminar la tabla de aeronaves, que depende de 'clientes'.
DROP TABLE IF EXISTS aeronaves;

-- Eliminar la tabla de FBOs, que depende de 'aeropuertos'.
DROP TABLE IF EXISTS fbos;

-- Eliminar los conceptos estandarizados, que depende de 'categorias_conceptos'.
DROP TABLE IF EXISTS conceptos_estandarizados;


-- ========= TABLAS INDEPENDIENTES (No dependen de otras) =========

-- Una vez eliminadas las tablas dependientes, se pueden eliminar las tablas maestras.
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS aeropuertos;
DROP TABLE IF EXISTS categorias_operaciones;
DROP TABLE IF EXISTS categorias_conceptos;