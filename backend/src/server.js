const express = require('express');
const cors = require('cors');
const axios = require('axios'); 

const pool = require('./config/db');

const clientesRoutes = require('./routes/clientes.routes');
const aeropuertosRoutes = require('./routes/aeropuertos.routes');
const categoriasOperacionesRoutes = require('./routes/categorias_operaciones.routes');
const fbosRoutes = require('./routes/fbos.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const aeronavesModelosRoutes = require('./routes/aeronaves_modelos.routes');
const clientesAeronavesRoutes = require('./routes/clientes_aeronaves.routes');
const cotizacionesRoutes = require('./routes/cotizaciones.routes');
const cotizacionesHistoricoRoutes = require('./routes/cotizaciones_historico.routes');


const corsOptions = require('./config/cors');

const app = express();
const port = 3000;

// Habilitar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());


// Rutas de la API
app.use('/api', clientesRoutes);
app.use('/api', aeropuertosRoutes);
app.use('/api', categoriasOperacionesRoutes);
app.use('/api', fbosRoutes);
app.use('/api', serviciosRoutes);
app.use('/api', aeronavesModelosRoutes);
app.use('/api', clientesAeronavesRoutes);
app.use('/api', cotizacionesRoutes);
app.use('/api', cotizacionesHistoricoRoutes);


app.get('/api/tipo-de-cambio', async (req, res) => {
    const token = '069c2abcc766a1ecd1b91604ad1c08da08a5cb734c0bf8188550ee85937b14ee'; 
    const idSerie = 'SF43718';

    // 1. Obtenemos la fecha de hoy y le restamos un día.
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 1);

    // 2. Ajustamos por si ayer fue fin de semana.
    // getDay() devuelve 0 para Domingo y 6 para Sábado.
    if (fecha.getDay() === 0) { // Si ayer fue Domingo...
        fecha.setDate(fecha.getDate() - 2); // ...nos vamos al Viernes.
    } else if (fecha.getDay() === 6) { // Si ayer fue Sábado...
        fecha.setDate(fecha.getDate() - 1); // ...nos vamos al Viernes.
    }

    // 3. Formateamos la fecha al formato YYYY-MM-DD que requiere la API.
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0-11
    const dia = String(fecha.getDate()).padStart(2, '0');
    const fechaFormateada = `${anio}-${mes}-${dia}`;
    

    // 4. Construimos la nueva URL pidiendo el dato para la fecha calculada.
    const url = `https://www.banxico.org.mx/SieAPIRest/service/v1/series/${idSerie}/datos/${fechaFormateada}/${fechaFormateada}`;
    
    console.log(`Solicitando tipo de cambio para la fecha: ${fechaFormateada}`); // Para depuración

    try {
        const response = await axios.get(url, {
            headers: { 'Bmx-Token': token }
        });

        // Verificamos si la API devolvió datos para esa fecha
        if (response.data.bmx.series[0].datos.length > 0) {
            const tipoDeCambio = response.data.bmx.series[0].datos[0].dato;
            res.json({ tipoDeCambio: tipoDeCambio });
        } else {
            // Esto pasaría si consultamos en un día feriado, por ejemplo.
            res.status(404).json({ error: `No se encontró tipo de cambio para la fecha ${fechaFormateada}.` });
        }

    } catch (error) {
        console.error("Error en el servidor al consultar Banxico:", error.message);
        res.status(500).json({ error: 'No se pudo obtener el tipo de cambio.' });
    }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
