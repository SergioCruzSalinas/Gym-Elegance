'use strict'

const pc = require('picocolors');
const { api } = require('../config/config');

const controllersActividades= require('../controllers/actividades')



module.exports = (app) => {
    app.get(`${api.baseEndpoint}/actividades`, controllersActividades.getActivities);
    app.get(`${api.baseEndpoint}/actividades/registrar`, controllersActividades.createActvities);
    app.get(`${api.baseEndpoint}/actividades/editar/:id`, controllersActividades.updateActivity);
    app.get(`${api.baseEndpoint}/actividades/eliminar/:id`, controllersActividades.deleteActivity);
};