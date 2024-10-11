'use strict'

const pc=require('picocolors');
const { api } = require('../config/config');

const controllersUser=require('../controllers/usuarios')


module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/usuarios`, controllersUser.getUsers);
    app.get(`${api.baseEndpoint}/usuarios/:id`, controllersUser.getUser);
    app.post(`${api.baseEndpoint}/usuarios/crear-usuario`, controllersUser.createUser);
    app.patch(`${api.baseEndpoint}/usuarios/editar/:id`, controllersUser.updateUser);
    app.delete(`${api.baseEndpoint}/usuarios/eliminar/:id`, controllersUser.deleteUser);

};