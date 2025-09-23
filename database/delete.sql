-- Borrado de Tablas Dependientes (Nivel 3 y 2)
DROP TABLE IF EXISTS "public"."RegistroConceptos";
DROP TABLE IF EXISTS "public"."InfoCotizaciones";
DROP TABLE IF EXISTS "public"."AeronaveEspeciales";
DROP TABLE IF EXISTS "public"."PreciosConceptos";

-- Borrado de Tablas Dependientes (Nivel 1)
DROP TABLE IF EXISTS "public"."Aeronaves";
DROP TABLE IF EXISTS "public"."FBOs";
DROP TABLE IF EXISTS "public"."ClientesEspeciales";
DROP TABLE IF EXISTS "public"."ConceptosEstandarizados";

-- Borrado de Tablas Independientes o Base (Nivel 0)
DROP TABLE IF EXISTS "public"."RegistroHistoricoCotizaciones";
DROP TABLE IF EXISTS "public"."Clientes";
DROP TABLE IF EXISTS "public"."Aeropuertos";
DROP TABLE IF EXISTS "public"."CategoriasOperaciones";
DROP TABLE IF EXISTS "public"."CategoriasConceptos";