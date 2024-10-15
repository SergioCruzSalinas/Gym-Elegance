'use strict'

const pc=require('picocolors');
const { api } = require('../config/config');

const controllersAdmin=require('../controllers/admin')


module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/administradores`, controllersAdmin.getAdmins);
    app.get(`${api.baseEndpoint}/administradores/:id`, controllersAdmin.getAdmin);
    app.post(`${api.baseEndpoint}/administradores/crear-admin`, controllersAdmin.createAdmin);
    app.patch(`${api.baseEndpoint}/administradores/editar/:id`, controllersAdmin.updateAdmin);
    app.delete(`${api.baseEndpoint}/administradores/eliminar/:id`, controllersAdmin.deleteAdmin);

};