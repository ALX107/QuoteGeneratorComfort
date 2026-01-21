const express = require('express');
const router = express.Router();

const { getServiciosByAeropuertoOrFbo, getServiciosByAviationType } = require('../controllers/servicios.controller');

const { getServiciosEspecialesByCliente } = require('../controllers/servicios.controller');

router.get('/servicios', getServiciosByAeropuertoOrFbo);

router.get('/clientes/:id_cliente/servicios-especiales', getServiciosEspecialesByCliente);

router.get('/servicios-by-aviation-type', getServiciosByAviationType);

//router.get('/conceptos-default', getDefaultConceptos);

module.exports = router;