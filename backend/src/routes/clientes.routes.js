const express = require('express');
const router = express.Router();
const { getClientes } = require('../controllers/clientes.controller');

// ejemplo: listar clientes
router.get('/clientes', getClientes);

module.exports = router;
