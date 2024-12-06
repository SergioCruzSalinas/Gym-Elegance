'use strict'

const pc=require('picocolors');
const { api, plataforma } = require('../config/config');

const controllersMembresia=require('../controllers/membresias');
const { validateAuth, authorizeRole } = require('../auth');

module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/membresias`, controllersMembresia.getMemberships);   
    app.get(`${api.baseEndpoint}/membresia`, controllersMembresia.getMembership);                    
    app.post(`${api.baseEndpoint}/membresias/crear-membresia`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersMembresia.createMembership);
    app.patch(`${api.baseEndpoint}/membresias/editar/:id`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersMembresia.updateMembership);
    app.delete(`${api.baseEndpoint}/membresias/cambiar-estatus/:id`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersMembresia.changeStatusMemberships);
}