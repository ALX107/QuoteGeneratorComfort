const express = require('express');
const router = express.Router();
const { getClientesAeronaves } = require('../controllers/clientes_aeronaves.controller');

//Listar Aeronaves Clientes
router.get('/listar/clientes_aeronaves', getClientesAeronaves);

module.exports = router;
