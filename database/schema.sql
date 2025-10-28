-- ========= TABLAS INDEPENDIENTES (No dependen de otras) =========

-- Tabla para almacenar la información de los clientes.
CREATE TABLE clientes (
    id_cliente BIGSERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    email_cliente VARCHAR(255) UNIQUE,
    telefono_cliente VARCHAR(25),
    direccion_cliente VARCHAR(500),
    ciudad_cliente VARCHAR(100),
    estado_cliente VARCHAR(100),
    pais_cliente VARCHAR(100),
    zip_cliente VARCHAR(20),
    contacto_cliente VARCHAR(255),
    --si está activo o inactivo
    condicion_cliente BOOLEAN DEFAULT TRUE
);

-- Tabla para aeropuertos.
CREATE TABLE aeropuertos (
    id_aeropuerto BIGSERIAL PRIMARY KEY,
    icao_aeropuerto VARCHAR(4) UNIQUE NOT NULL,
    nombre_aeropuerto VARCHAR(255) NOT NULL,
    ciudad_aeropuerto VARCHAR(100) NOT NULL,
    estado_aeropuerto VARCHAR(100) NOT NULL,
    pais_aeropuerto VARCHAR(100) NOT NULL,
    -- Clasificación: general, comercial, carga, base aérea, etc.
    clasificacion_aeropuerto VARCHAR(50) NOT NULL,
    grupo_aeropuerto VARCHAR(100) NOT NULL
);

-- Categorías para los tipos de operación de una cotización (ej. Catering, Handling, etc.)
CREATE TABLE categorias_operaciones (
    id_cat_operacion BIGSERIAL PRIMARY KEY,
    nombre_cat_operacion VARCHAR(100) UNIQUE NOT NULL
);

-- Categorías para los conceptos o servicios que se pueden cotizar.
CREATE TABLE categorias_conceptos (
    id_cat_concepto BIGSERIAL PRIMARY KEY,
    nombre_cat_concepto VARCHAR(100) UNIQUE NOT NULL
);

-- ========= TABLAS DEPENDIENTES (Nivel 1) =========

-- Tabla "universo" para los modelos de aeronaves.
CREATE TABLE aeronaves_modelos (
    id_modelo_aeronave BIGSERIAL PRIMARY KEY,
    icao_aeronave VARCHAR(4) UNIQUE NOT NULL,
    nombre_aeronave VARCHAR(100) NOT NULL,
    -- MTOW (Maximum Takeoff Weight) en toneladas.
    mtow_aeronave DECIMAL(10, 2) NOT NULL,
    envergadura_aeronave DECIMAL(10, 2) NOT NULL
);

-- Tabla para las aeronaves específicas de cada cliente (la flota).
CREATE TABLE clientes_aeronaves (
    id_cliente_aeronave BIGSERIAL PRIMARY KEY,
    matricula_aeronave VARCHAR(20) UNIQUE NOT NULL,
    es_miembro_caa BOOLEAN DEFAULT FALSE,
    fecha_vigencia_caa DATE,
    id_cliente BIGINT NOT NULL,
    id_modelo_aeronave BIGINT NOT NULL,

    CONSTRAINT fk_cliente_aeronave_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_cliente_aeronave_modelo FOREIGN KEY (id_modelo_aeronave) REFERENCES aeronaves_modelos(id_modelo_aeronave)
);

-- FBOs (Fixed-Base Operators) asociados a un aeropuerto.
--AQUÍ SE GUARDA SI ES AVIACIÓN COMERCIAL O GENERAL JUNTO CON LOS FBOS SEGÚN SU ID AEROPUERTO
CREATE TABLE fbos (
    id_fbo BIGSERIAL PRIMARY KEY,
    nombre_fbo VARCHAR(255) NOT NULL,
    grupo_fbo VARCHAR(255) NOT NULL, ---grupo al que pertenece el fbo o si es aviación comercial o general
    id_aeropuerto BIGINT NOT NULL,

    CONSTRAINT fk_fbos_aeropuerto FOREIGN KEY (id_aeropuerto) REFERENCES aeropuertos(id_aeropuerto)
);

-- Conceptos o servicios default que se pueden ofrecer.
CREATE TABLE conceptos_default (
    id_concepto_std BIGSERIAL PRIMARY KEY,
    nombre_concepto_default VARCHAR(255) NOT NULL,
    costo_concepto_default DECIMAL(12, 2) NOT NULL,
    id_categoria_concepto BIGINT NOT NULL,

    CONSTRAINT fk_conceptos_categoria FOREIGN KEY (id_categoria_concepto) REFERENCES categorias_conceptos(id_cat_concepto)
);

-------- Servicios especiales con costo fijo para un cliente específico.
CREATE TABLE servicios_cliente_especiales (
    id_servicio_especial BIGSERIAL PRIMARY KEY, 
    id_cliente BIGINT NOT NULL, -- FK que referencia al cliente
    nombre_servicio VARCHAR(255) NOT NULL,
    costo_servicio DECIMAL(12, 2) NOT NULL,

    -- La constraint ahora apunta a la columna correcta
    CONSTRAINT fk_servicios_cliente_especial_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- ========= TABLAS DEPENDIENTES (Nivel 2) =========

-- Precios específicos para un concepto. Puede variar por aeropuerto o FBO.
CREATE TABLE precios_conceptos(
    id_precio_concepto BIGSERIAL PRIMARY KEY,
    nombre_local_concepto VARCHAR(255) NOT NULL,
    costo_concepto DECIMAL(12, 2) NOT NULL,
    divisa VARCHAR(3) NOT NULL,
    -- El precio puede ser general o específico para un aeropuerto o FBO.
    id_concepto_std BIGINT NOT NULL,
    id_aeropuerto BIGINT,
    id_fbo BIGINT,

    CONSTRAINT fk_precios_concepto FOREIGN KEY (id_concepto_std) REFERENCES conceptos_default(id_concepto_std),
    CONSTRAINT fk_precios_aeropuerto FOREIGN KEY (id_aeropuerto) REFERENCES aeropuertos(id_aeropuerto),
    CONSTRAINT fk_precios_fbo FOREIGN KEY (id_fbo) REFERENCES fbos(id_fbo)
);
-------AQÚI ME QUEDÉ-----
-- Tabla principal de cotizaciones. Contiene la información MÁS RECIENTE de la cotización.
CREATE TABLE cotizaciones (
    id_cotizacion BIGSERIAL PRIMARY KEY,
    -- Información general
    numero_referencia VARCHAR(50) UNIQUE, -- quitar restricción not null 
    fecha_cotizacion DATE NOT NULL DEFAULT CURRENT_DATE,
    nombre_solicitante VARCHAR(255),
    nombre_responsable VARCHAR(255),
    exchange_rate DECIMAL(10, 4) NOT NULL,

    -- Relaciones con otras tablas (IDs)
    id_cliente BIGINT NOT NULL,
    id_cat_operacion BIGINT NOT NULL,
    id_cliente_aeronave BIGINT NOT NULL,
    id_aeropuerto BIGINT NOT NULL,
    id_fbo BIGINT,
    
    -- Información de la operación
    fecha_llegada DATE,
    fecha_salida DATE,
    aeropuerto_origen_id BIGINT,
    aeropuerto_destino_id BIGINT,
    tripulacion_llegada INT,
    pasajeros_llegada INT,
    tripulacion_salida INT,
    pasajeros_salida INT,

    -- Totales (calculados a partir de los conceptos)
    total_costo DECIMAL(15, 2),
    total_s_cargo DECIMAL(15, 2),
    total_vat DECIMAL(15, 2),
    total_final DECIMAL(15, 2),
    total_en_palabras VARCHAR(500),

    -- Constraints
    CONSTRAINT fk_cotizaciones_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_cotizaciones_categoria FOREIGN KEY (id_cat_operacion) REFERENCES categorias_operaciones(id_cat_operacion),
    CONSTRAINT fk_cotizaciones_aeronave FOREIGN KEY (id_cliente_aeronave) REFERENCES clientes_aeronaves(id_cliente_aeronave),
    CONSTRAINT fk_cotizaciones_aeropuerto FOREIGN KEY (id_aeropuerto) REFERENCES aeropuertos(id_aeropuerto),
    CONSTRAINT fk_cotizaciones_fbo FOREIGN KEY (id_fbo) REFERENCES fbos(id_fbo),
    CONSTRAINT fk_cotizaciones_aeropuerto_origen FOREIGN KEY (aeropuerto_origen_id) REFERENCES aeropuertos(id_aeropuerto),
    CONSTRAINT fk_cotizaciones_aeropuerto_destino FOREIGN KEY (aeropuerto_destino_id) REFERENCES aeropuertos(id_aeropuerto)
);


-- ========= TABLAS DEPENDIENTES (Nivel 3) =========

-- Tabla de enlace para registrar los conceptos (servicios) incluidos en cada cotización.
CREATE TABLE cotizacion_conceptos (
    id_cotizacion_concepto BIGSERIAL PRIMARY KEY,
    id_cotizacion BIGINT NOT NULL,
    -- Podría ser un concepto de precio fijo o uno ad-hoc.
    id_precio_concepto BIGINT,
    
    nombre_servicio VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    costo_mxn DECIMAL(12, 2) NOT NULL,
    costo_usd DECIMAL(12, 2) NOT NULL,
    
    -- Porcentajes aplicados
    sc_porcentaje DECIMAL(5, 2) NOT NULL, -- Ej: 15.00 para 15%
    vat_porcentaje DECIMAL(5, 2) NOT NULL,

    -- Campos calculados (pueden ser calculados en la aplicación o aquí)
    s_cargo DECIMAL(12, 2) NOT NULL,
    vat DECIMAL(12, 2) NOT NULL,
    total_usd DECIMAL(15, 2) NOT NULL,

    CONSTRAINT fk_conceptos_cotizacion FOREIGN KEY (id_cotizacion) REFERENCES cotizaciones(id_cotizacion),
    CONSTRAINT fk_conceptos_precio FOREIGN KEY (id_precio_concepto) REFERENCES precios_conceptos(id_precio_concepto)
);

-- Tabla para almacenar el historial de cambios y versiones de las cotizaciones.
CREATE TABLE cotizaciones_historico (
    id_historico BIGSERIAL PRIMARY KEY,
    -- Referencia a la cotización original en la tabla 'cotizaciones'
    id_cotizacion BIGINT NOT NULL,
    
    -- Datos de la cotización en el momento del registro
    numero_referencia VARCHAR(50) NOT NULL,
    fecha_cotizacion DATE NOT NULL,
    nombre_solicitante VARCHAR(255),
    nombre_responsable VARCHAR(255),
    exchange_rate DECIMAL(10, 4) NOT NULL,
    id_cliente BIGINT NOT NULL,
    id_cat_operacion BIGINT NOT NULL,
    id_cliente_aeronave BIGINT NOT NULL,
    id_aeropuerto BIGINT NOT NULL,
    id_fbo BIGINT,
    fecha_llegada DATE,
    fecha_salida DATE,
    aeropuerto_origen_id BIGINT,
    aeropuerto_destino_id BIGINT,
    tripulacion_llegada INT,
    pasajeros_llegada INT,
    tripulacion_salida INT,
    pasajeros_salida INT,
    total_costo DECIMAL(15, 2),
    total_s_cargo DECIMAL(15, 2),
    total_vat DECIMAL(15, 2),
    total_final DECIMAL(15, 2),
    total_en_palabras VARCHAR(500),

    -- Metadatos del historial
    fecha_modificacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_modificacion VARCHAR(255), -- Quién hizo el cambio
    tipo_accion VARCHAR(50) NOT NULL, -- 'CREADA', 'ACTUALIZADA', 'REVERTIDA', etc.
    version INT NOT NULL, -- Un número de versión que se incrementa
    
    -- No se necesita una FK directa a cotizaciones para permitir que el historial persista
    -- incluso si la cotización original se elimina, pero mantenemos el ID para la relación lógica.
    CONSTRAINT chk_tipo_accion CHECK (tipo_accion IN ('CREADA', 'ACTUALIZADA', 'REVERTIDA', 'CANCELADA')) --verificar
);

