-- ========= SCRIPT PARA ELIMINAR COMPLETAMENTE LAS TABLAS (DROP) =========
-- El orden es fundamental: se eliminan primero las tablas dependientes.

-- Nivel 3: Tablas que dependen de otras tablas principales.
DROP TABLE IF EXISTS cotizacion_conceptos;
DROP TABLE IF EXISTS cotizaciones_historico;

-- Nivel 2: Tablas que son referenciadas por el nivel 3.
DROP TABLE IF EXISTS cotizaciones;
DROP TABLE IF EXISTS precios_conceptos;

-- Nivel 1: Tablas que son referenciadas por el nivel 2.
DROP TABLE IF EXISTS servicios_cliente_especiales;
DROP TABLE IF EXISTS clientes_aeronaves;
DROP TABLE IF EXISTS fbos;
DROP TABLE IF EXISTS conceptos_default;

-- Nivel 0: Tablas independientes (no dependen de ninguna otra).
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS aeronaves_modelos;
DROP TABLE IF EXISTS aeropuertos;
DROP TABLE IF EXISTS categorias_operaciones;
DROP TABLE IF EXISTS categorias_conceptos;