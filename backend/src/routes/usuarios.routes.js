const express = require('express');
const router = express.Router();
const { login, registerUser } = require('../controllers/usuarios.controller');

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para registrar un nuevo usuario (opcional, para desarrollo)
router.post('/register', registerUser);

module.exports = router;
