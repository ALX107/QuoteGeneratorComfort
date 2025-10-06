const express = require('express');
const router = express.Router();
const { getServiciosByAeropuertoOrFbo } = require('../controllers/servicios.controller');

router.get('/servicios', getServiciosByAeropuertoOrFbo);

module.exports = router;