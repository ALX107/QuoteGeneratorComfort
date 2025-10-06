const express = require('express');
const router = express.Router();
const { getAeronavesModelos } = require('../controllers/aeronaves_modelos.controller');

//Listar Aeronaves Modelos
router.get('/listar/aeronaves_modelos', getAeronavesModelos);

module.exports = router;
