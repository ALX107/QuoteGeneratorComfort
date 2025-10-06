const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const clientesRoutes = require('./routes/clientes.routes');
const aeropuertosRoutes = require('./routes/aeropuertos.routes');
const categoriasOperacionesRoutes = require('./routes/categorias_operaciones.routes');
const fbosRoutes = require('./routes/fbos.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const aeronavesModelosRoutes = require('./routes/aeronaves_modelos.routes');
const clientesAeronavesRoutes = require('./routes/clientes_aeronaves.routes');


const corsOptions = require('./config/cors');

const app = express();
const port = 3000;

// Habilitar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Rutas de la API
app.use('/api', clientesRoutes);
app.use('/api', aeropuertosRoutes);
app.use('/api', categoriasOperacionesRoutes);
app.use('/api', fbosRoutes);
app.use('/api', serviciosRoutes);
app.use('/api', aeronavesModelosRoutes);
app.use('/api', clientesAeronavesRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
