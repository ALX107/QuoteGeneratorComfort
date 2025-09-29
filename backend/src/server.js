const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const clientesRoutes = require('./routes/clientes.routes');
const aeropuertosRoutes = require('./routes/aeropuertos.routes');
const corsOptions = require('./config/cors');

const app = express();
const port = 3000;

// Habilitar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Rutas de la API
app.use('/api', clientesRoutes);
app.use('/api', aeropuertosRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
