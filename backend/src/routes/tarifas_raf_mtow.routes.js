const express = require('express');
const router = express.Router();
const tarifasController = require('../controllers/tarifas_raf_mtow.controller');

router.get('/listar/tarifas_raf_mtow', tarifasController.getTarifasRafMtow);

module.exports = router;