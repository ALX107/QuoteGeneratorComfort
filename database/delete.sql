-- ========= SCRIPT DE LIMPIEZA DE DATOS =========

-- Deshabilitar restricciones y limpiar tablas masivamente.
-- RESTART IDENTITY: Reinicia los contadores (SERIAL/BIGSERIAL) a 1.
-- CASCADE: Borra los datos de tablas hijas que tengan FK a estas tablas.

TRUNCATE TABLE 
    cotizacion_conceptos,
    cotizaciones_historico,
    precios_conceptos,
    servicios_cliente_especiales,
    conceptos_default,
    fbos,
    clientes_aeronaves,
    aeronaves_modelos,
    categorias_conceptos,
    categorias_operaciones,
    aeropuertos,
    clientes,
    usuarios
RESTART IDENTITY CASCADE;

-- ========= REINICIO DE SECUENCIAS INDEPENDIENTES =========

-- Como creaste una secuencia manual que no está atada directamente 
-- a una columna SERIAL (cotizacion_id_seq), hay que reiniciarla aparte.

ALTER SEQUENCE cotizacion_id_seq RESTART WITH 1;

-- Fin del script