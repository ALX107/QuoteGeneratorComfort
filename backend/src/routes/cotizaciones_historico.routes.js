const express = require('express');
const router = express.Router();
const { getCotizacionesHistorico } = require('../controllers/cotizaciones_historico.controller');

//Listar todas las cotizaciones en histórico
router.get('/listar/cotizaciones/historico', getCotizacionesHistorico);

module.exports = router;
