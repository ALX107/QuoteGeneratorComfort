const express = require('express');
const router = express.Router();
const { getCategoriasOperaciones } = require('../controllers/categorias_operaciones.controller');

// ejemplo: listar categorias de operaciones    
router.get('/listar/categoriasOperaciones', getCategoriasOperaciones);

module.exports = router;
