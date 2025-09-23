DROP TABLE clientes;

CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20)
);

-- ========= INDEPENDENT TABLES (Create These First) =========

CREATE TABLE Clientes (
  "id_cliente" BIGINT PRIMARY KEY NOT NULL,
  "nombre_cliente" VARCHAR(500) NOT NULL,
  "direccion_dliente" VARCHAR(500),
  "telefono_cliente" VARCHAR(15),
  "ciudad_cliente" VARCHAR(500),
  "estado_cliente" VARCHAR(500),
  "zip_cliente" VARCHAR(500)
);

CREATE TABLE "Aeropuertos" (
  "id_aeropuerto" BIGINT PRIMARY KEY NOT NULL,
  "icao_aeropuerto" VARCHAR(4) UNIQUE NOT NULL,
  "nombre_aeropuerto" VARCHAR(100) NOT NULL,
  "ciudad_aeropuerto" VARCHAR(50) NOT NULL,
  "estado_aeropuerto" VARCHAR(500) NOT NULL,
  "pais_aeropuerto" VARCHAR(500) NOT NULL,
  -- Note: general, comercial, carga, base aérea
  "clasificacion_aeropuerto" VARCHAR(500) NOT NULL DEFAULT '20',
  "grupo_aeropuerto" VARCHAR(500) NOT NULL
);

CREATE TABLE "CategoriasOperaciones" (
  "id_cat_operacion" BIGINT PRIMARY KEY NOT NULL,
  "nombre_cat_operacion" VARCHAR(50) NOT NULL
);
-- TABLE NOTE: qué operación se quiere hacer (catering, handling, far 135, transportation) PENDIENTE, PQ SE PUEDE METER COMO ARREGLO Y NO EN BD

CREATE TABLE "CategoriasConceptos" (
  "id_categoria_serv" BIGINT PRIMARY KEY NOT NULL,
  "nombre_categoria" VARCHAR(500) NOT NULL
);

CREATE TABLE "RegistroHistoricoCotizaciones" (
  "id_coti" BIGINT PRIMARY KEY NOT NULL,
  "numeroreferencia_coti" VARCHAR(500) NOT NULL,
  "fecha_coti" DATE NOT NULL,
  "fecha_operacion_coti" DATERANGE NOT NULL,
  "total_coti" DECIMAL NOT NULL,
  "exRate_coti" DECIMAL NOT NULL,
  "nombre_cat_operacion" VARCHAR(500) NOT NULL,
  "icao_aeronave" VARCHAR(4) NOT NULL,
  "nombre_cliente" VARCHAR(500) NOT NULL,
  "icao_aeropuerto" VARCHAR(4) NOT NULL
);


-- ========= DEPENDENT TABLES (Level 1) =========

CREATE TABLE "Aeronaves" (
  "id_aeronave" BIGINT PRIMARY KEY NOT NULL,
  "icao_aeronave" VARCHAR(4) UNIQUE NOT NULL,
  "nombre_aeronave" VARCHAR(50),
  -- Note: en toneladas
  "mtow_aeronave" DECIMAL NOT NULL,
  "envergadura_aeronave" DECIMAL NOT NULL,
  "id_cliente" BIGINT NOT NULL,
  CONSTRAINT "fk_aeronaves_cliente" FOREIGN KEY ("id_cliente") REFERENCES "Clientes"("id_cliente")
);

CREATE TABLE "FBOs" (
  "id_fbo" BIGINT PRIMARY KEY NOT NULL,
  "nombre_fbo" VARCHAR(500) NOT NULL,
  "grupo_fbo" VARCHAR(500) NOT NULL,
  "id_aeropuerto" BIGINT NOT NULL,
  CONSTRAINT "fk_fbos_aeropuerto" FOREIGN KEY ("id_aeropuerto") REFERENCES "Aeropuertos"("id_aeropuerto")
);

CREATE TABLE "ClientesEspeciales" (
  "id_cliente_esp" BIGINT PRIMARY KEY NOT NULL,
  "nombre_servicio" VARCHAR(500) NOT NULL,
  "costo_servicio_especial" DECIMAL NOT NULL,
  CONSTRAINT "fk_clientesespeciales_cliente" FOREIGN KEY ("id_cliente_esp") REFERENCES "Clientes"("id_cliente")
);

CREATE TABLE "ConceptosEstandarizados" (
  "id_servicio" BIGINT PRIMARY KEY NOT NULL,
  "default_nombre_servicio" VARCHAR(500),
  "id_categoria_serv" BIGINT NOT NULL,
  CONSTRAINT "fk_conceptos_categoria" FOREIGN KEY ("id_categoria_serv") REFERENCES "CategoriasConceptos"("id_categoria_serv")
);


-- ========= DEPENDENT TABLES (Level 2) =========

CREATE TABLE "AeronaveEspeciales" (
  "matricula_aeronave" VARCHAR(500) PRIMARY KEY NOT NULL,
  "caa_member" BOOLEAN NOT NULL,
  "id_aeronave" BIGINT UNIQUE NOT NULL,
  "fecha_vigencia_caa" DATE NOT NULL,
  CONSTRAINT "fk_aeronaveespeciales_aeronave" FOREIGN KEY ("id_aeronave") REFERENCES "Aeronaves"("id_aeronave")
);

CREATE TABLE "PreciosConceptos" (
  "id_precio_serv" BIGINT PRIMARY KEY NOT NULL,
  "local_nombre_servicio" VARCHAR(100) NOT NULL,
  "costo_servicio" DECIMAL NOT NULL,
  "divisa" VARCHAR(3) NOT NULL,
  "id_servicio" BIGINT NOT NULL,
  "id_aeropuerto" BIGINT,
  "id_fbo" BIGINT,
  CONSTRAINT "fk_precios_servicio" FOREIGN KEY ("id_servicio") REFERENCES "ConceptosEstandarizados"("id_servicio"),
  CONSTRAINT "fk_precios_aeropuerto" FOREIGN KEY ("id_aeropuerto") REFERENCES "Aeropuertos"("id_aeropuerto"),
  CONSTRAINT "fk_precios_fbo" FOREIGN KEY ("id_fbo") REFERENCES "FBOs"("id_fbo")
);

CREATE TABLE "InfoCotizaciones" (
  "id_coti" BIGINT PRIMARY KEY NOT NULL,
  "nombre_cliente" VARCHAR(500),
  "nombre_cat_operacion" VARCHAR(500),
  "matricula_aeronave" VARCHAR(500),
  "icao_aeronave" VARCHAR(500),
  "mtow_aeronave" DECIMAL,
  "icao_aeropuerto" VARCHAR(500),
  "nombre_fbo" VARCHAR(500),
  "fecha_llegada" DATE,
  "fecha_salida" DATE,
  "icao_aerop_to" VARCHAR(500),
  "icao_aerop_from" VARCHAR(500),
  "crew_to" INTEGER,
  "crew_from" INTEGER,
  "pax_to" INTEGER,
  "pax_from" INTEGER,
  "exchange_rate" DECIMAL,
  "fecha_coti" DATE,
  "nombre_responsable" VARCHAR(500),
  "nombre_solicitante" VARCHAR(500),
  "total_costo" DECIMAL,
  "total_s_cargo" DECIMAL,
  "total_vat" DECIMAL,
  "total_final" DECIMAL,
  "total_palabra" VARCHAR(500),

  -- Valid Foreign Key Constraints
  CONSTRAINT "fk_infocoti_registro" FOREIGN KEY ("id_coti") REFERENCES "RegistroHistoricoCotizaciones"("id_coti"),
  CONSTRAINT "fk_infocoti_matricula" FOREIGN KEY ("matricula_aeronave") REFERENCES "AeronaveEspeciales"("matricula_aeronave"),
  CONSTRAINT "fk_infocoti_icao_aeronave" FOREIGN KEY ("icao_aeronave") REFERENCES "Aeronaves"("icao_aeronave"),
  CONSTRAINT "fk_infocoti_icao_aeropuerto" FOREIGN KEY ("icao_aeropuerto") REFERENCES "Aeropuertos"("icao_aeropuerto"),
  CONSTRAINT "fk_infocoti_icao_aerop_to" FOREIGN KEY ("icao_aerop_to") REFERENCES "Aeropuertos"("icao_aeropuerto")

  -- The following references from your script were invalid because the target columns are not UNIQUE or PRIMARY KEYs.
  -- ref: < "InfoCotizaciones"."nombre_cliente" to "Clientes"."nombre_cliente"
  -- ref: < "InfoCotizaciones"."nombre_cat_operacion" to "CategoriasOperaciones"."nombre_cat_operacion"
  -- ref: < "InfoCotizaciones"."mtow_aeronave" to "Aeronaves"."mtow_aeronave"
  -- ref: < "InfoCotizaciones"."nombre_fbo" to "FBOs"."nombre_fbo"
  -- ref: < "InfoCotizaciones"."exchange_rate" to "RegistroHistoricoCotizaciones"."exRate_coti"
  -- ref: < "InfoCotizaciones"."total_final" to "RegistroHistoricoCotizaciones"."total_coti"
);


-- ========= DEPENDENT TABLES (Level 3) =========

CREATE TABLE "RegistroConceptos" (
  "id_serv_selec" BIGINT PRIMARY KEY NOT NULL,
  "nombre_serv_selec" VARCHAR(500) NOT NULL,
  "cantidad_serv_selec" INTEGER NOT NULL,
  "costo_mxn" DECIMAL NOT NULL,
  "costo_usd" DECIMAL NOT NULL,
  -- Note: costo_usd * cantidad
  "costo_total_usd" DECIMAL NOT NULL,
  "sc_porcentaje" INTEGER NOT NULL,
  "s_cargo" DECIMAL NOT NULL,
  "vat_porcentaje" INTEGER NOT NULL,
  "vat" DECIMAL NOT NULL,
  "total" DECIMAL NOT NULL
  -- The original script defined invalid foreign keys from this table to non-unique columns in "PreciosConceptos".
  -- A logical relationship would be a foreign key from this table to "PreciosConceptos"."id_precio_serv",
  -- which could be added as:
  -- "id_precio_serv" BIGINT,
  -- CONSTRAINT "fk_registro_precio" FOREIGN KEY ("id_precio_serv") REFERENCES "PreciosConceptos"("id_precio_serv")
);