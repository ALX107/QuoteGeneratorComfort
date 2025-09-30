const express = require('express');
const router = express.Router();
const { getFbos } = require('../controllers/fbos.controller');

// ejemplo: listar fbos
router.get('/listar/fbos', getFbos);

module.exports = router;
