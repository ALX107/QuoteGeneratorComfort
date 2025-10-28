const express = require('express');
const router = express.Router();
const { getServiciosByAeropuertoOrFbo, getDefaultConceptos } = require('../controllers/servicios.controller');

router.get('/servicios', getServiciosByAeropuertoOrFbo);

router.get('/conceptos-default', getDefaultConceptos);

module.exports = router;