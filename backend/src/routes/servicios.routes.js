const express = require('express');
const router = express.Router();
const { getServiciosByAeropuertoOrFbo, getServiciosByAviationType } = require('../controllers/servicios.controller');

router.get('/servicios', getServiciosByAeropuertoOrFbo);
router.get('/servicios-by-aviation-type', getServiciosByAviationType);

//router.get('/conceptos-default', getDefaultConceptos);

module.exports = router;