const express = require('express');
const router = express.Router();
const cotizacionesController = require('../controllers/cotizaciones_historico.controller');

// Ruta para listar todas las cotizaciones
router.get('/listar/cotizaciones', cotizacionesController.getCotizacionesHistorico);

// Obtener una cotización por ID
router.get('/cotizacion/:id', cotizacionesController.getCotizacionById);

// Crear una nueva cotización
router.post('/cotizaciones', cotizacionesController.createQuote);

// Unir varias cotizaciones en una nueva
router.post('/cotizaciones/join', cotizacionesController.joinQuotes);

module.exports = router;
