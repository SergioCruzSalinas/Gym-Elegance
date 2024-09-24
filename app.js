'use strict';

require('dotenv').config();

const express=require('express')
const pc = require('picocolors')
const app = express()
const morgan = require('morgan')


app.set('port', parseInt(process.env.PORT, 10) || 3001);

app.use(morgan('dev'))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

// Disable header
app.disable('x-powered-by');

require('./server/routes/actividades/actividades')(app)

app.use('*', (req, res) => {
    res.status(404).send({ mensaje: `El recurso solicitado no existe!` });
  });
  
  module.exports = app;