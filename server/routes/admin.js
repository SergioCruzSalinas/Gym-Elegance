'use strict'

const pc=require('picocolors');
const { api, plataforma } = require('../config/config');

const controllersAdmin=require('../controllers/admin');
const { validateAuth, authorizeRole } = require('../auth');


module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/administradores`,validateAuth, authorizeRole([plataforma.roles.root]), controllersAdmin.getAdmins);
    app.get(`${api.baseEndpoint}/administradores/:id`,validateAuth, authorizeRole([plataforma.roles.root]), controllersAdmin.getAdmin);
    app.post(`${api.baseEndpoint}/administradores/crear-admin`,validateAuth, authorizeRole([plataforma.roles.root]), controllersAdmin.createAdmin);
    app.patch(`${api.baseEndpoint}/administradores/editar/:id`,validateAuth, authorizeRole([plataforma.roles.root]), controllersAdmin.updateAdmin);
    app.delete(`${api.baseEndpoint}/administradores/eliminar/:id`,validateAuth, authorizeRole([plataforma.roles.root]), controllersAdmin.deleteAdmin);

};