'use strict'

const pc=require('picocolors');
const { api } = require('../config/config');

const controllersMembresia=require('../controllers/membresias');

module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/membresias`, controllersMembresia.getMemberships);
    app.post(`${api.baseEndpoint}/membresias/crear-membresia`, controllersMembresia.createMembership);
    app.patch(`${api.baseEndpoint}/membresias/editar/:id`, controllersMembresia.updateMembership);
    app.delete(`${api.baseEndpoint}/membresias/cambiar-estatus/:id`, controllersMembresia.changeStatusMemberships);
}