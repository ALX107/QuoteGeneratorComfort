const express = require('express');
const router = express.Router();
const { getAeropuertos } = require('../controllers/aeropuertos.controller');

// ejemplo: listar aeropuertos
router.get('/listar/aeropuertos', getAeropuertos);

module.exports = router;
