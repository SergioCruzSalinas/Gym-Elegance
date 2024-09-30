'use strict'

const pc = require('picocolors');
const { api } = require('../config/config');

const controllersActividades= require('../controllers/actividades')



module.exports = (app) => {
    app.get(`${api.baseEndpoint}/actividades`, controllersActividades.getActivities);
};