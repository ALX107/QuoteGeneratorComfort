const express = require('express');
const router = express.Router();
const { getCotizacionesHistorico, getCotizacionById } = require('../controllers/cotizaciones_historico.controller');

//Listar todas las cotizaciones en histórico
router.get('/listar/cotizaciones/historico', getCotizacionesHistorico);

// Obtener una cotización por ID
router.get('/cotizacion/:id', getCotizacionById);

module.exports = router;
