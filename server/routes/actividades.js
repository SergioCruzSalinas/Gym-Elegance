'use strict'

const pc = require('picocolors');
const { api, plataforma } = require('../config/config');

const controllersActividades= require('../controllers/actividades');
const { validateAuth, authorizeRole } = require('../auth');



module.exports = (app) => {
    app.get(`${api.baseEndpoint}/actividades`,controllersActividades.getActivities);
    app.post(`${api.baseEndpoint}/actividades/registrar`, validateAuth, authorizeRole([plataforma.roles.admin, plataforma.roles.root]), controllersActividades.createActivity);
    app.patch(`${api.baseEndpoint}/actividades/editar/:id`, validateAuth, authorizeRole([plataforma.roles.admin, plataforma.roles.root]), controllersActividades.updateActivity);
    app.delete(`${api.baseEndpoint}/actividades/cambiar-estatus/:id`,validateAuth, authorizeRole([plataforma.roles.admin, plataforma.roles.root]), controllersActividades.changeStatusActivity);
};