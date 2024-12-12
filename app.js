'use strict';

require('dotenv').config();

const express = require('express');
const pc = require('picocolors');
const cors = require('cors'); // Importa cors
const morgan = require('morgan');
const app = express();

// Configura el puerto
app.set('port', parseInt(process.env.PORT, 10) || 3001);

// Middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.disable('x-powered-by');

// Configuración de CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Permite solo tu frontend en desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  })
);

// Rutas
require('./server/routes/seedDataBase')(app);
require('./server/routes/admin')(app);
require('./server/routes/usuarios')(app);
require('./server/routes/actividades')(app);
require('./server/routes/membresias')(app);
require('./server/routes/agendaActividades')(app);
require('./server/routes/entrenadores')(app);
require('./server/routes/inscripciones')(app);
require('./server/routes/login')(app);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).send({ mensaje: `El recurso solicitado no existe!` });
});

module.exports = app;
