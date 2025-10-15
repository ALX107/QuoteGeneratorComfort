const express = require('express');
const router = express.Router();
const cotizacionesController = require('../controllers/cotizaciones.controller');

router.post('/cotizaciones', cotizacionesController.createQuote);

module.exports = router;
