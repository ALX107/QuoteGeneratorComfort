-- ========= SCRIPT DE LIMPIEZA DE DATOS (RESET) =========

-- Deshabilitar restricciones y limpiar tablas masivamente.
-- RESTART IDENTITY: Reinicia los contadores (SERIAL/BIGSERIAL) a 1.
-- CASCADE: Borra los datos de tablas hijas que tengan FK a estas tablas.

TRUNCATE TABLE 
    cotizacion_conceptos,
    cotizaciones_historico,
    precios_conceptos,
    servicios_cliente_especiales,
    tarifas_raf_mtow,           -- Agregada (Nueva tabla)
    conceptos_default,
    fbos,
    clientes_aeronaves,
    aeronaves_modelos,
    clasificaciones_aeronaves,  -- Agregada (Nueva tabla)
    categorias_conceptos,
    categorias_operaciones,
    aeropuertos,
    clientes
    --usuarios
RESTART IDENTITY CASCADE;

-- ========= REINICIO DE SECUENCIAS INDEPENDIENTES =========

-- Reiniciamos la secuencia manual que no depende de una columna SERIAL
ALTER SEQUENCE cotizacion_id_seq RESTART WITH 1;

-- Fin del script