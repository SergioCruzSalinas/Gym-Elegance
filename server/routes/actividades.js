'use strict'

const pc = require('picocolors');
const { api } = require('../config/config');

const controllersActividades= require('../controllers/actividades')



module.exports = (app) => {
    app.get(`${api.baseEndpoint}/actividades`, controllersActividades.getActivities);
    app.post(`${api.baseEndpoint}/actividades/registrar`, controllersActividades.createActivity);
    app.patch(`${api.baseEndpoint}/actividades/editar/:id`, controllersActividades.updateActivity);
    app.delete(`${api.baseEndpoint}/actividades/cambiar-estatus/:id`, controllersActividades.changeStatusActivity);
};