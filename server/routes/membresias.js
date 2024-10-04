'use strict'

const pc=require('picocolors');
const { api } = require('../config/config');

const controllersMembresia=require('../controllers/membresias');

module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/membresias`, controllersMembresia.getMemberships);
    app.get(`${api.baseEndpoint}/membresias/crear-membresia`, controllersMembresia.createMemberships);
    app.get(`${api.baseEndpoint}/membresias/editar/:editar`, controllersMembresia.updateMemberships);
    app.get(`${api.baseEndpoint}/membresias/eliminar/:id`, controllersMembresia.deleteMemberships);
}