'use strict'

const pc=require('picocolors');
const { api, plataforma } = require('../config/config');

const controllersUser=require('../controllers/usuarios');
const { validateAuth, authorizeRole } = require('../auth');


module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/usuarios`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersUser.getUsers);
    app.get(`${api.baseEndpoint}/usuarios/:id`, validateAuth, controllersUser.getUser);
    app.post(`${api.baseEndpoint}/usuarios/crear-usuario`, controllersUser.createUser);
    app.patch(`${api.baseEndpoint}/usuarios/editar/:id`, validateAuth, controllersUser.updateUser);
    app.delete(`${api.baseEndpoint}/usuarios/eliminar/:id`, controllersUser.deleteUser); 

};