'use strict'

const { validateAuth } = require("../auth");
const { api } = require("../config/config")

const controllerLogin=require('../controllers/login')


module.exports=(app)=>{
    app.post(`${api.baseEndpoint}/crear-sesion`, controllerLogin.createSession);
    app.get(`${api.baseEndpoint}/check-token`, controllerLogin.checkToken);
    app.delete(`${api.baseEndpoint}/usuarios/cerrar-sesion`, controllerLogin.closeSession);
    app.put(`${api.baseEndpoint}/recuperar-contrasenia`, controllerLogin.recoveryPassword);
    app.patch(`${api.baseEndpoint}/restablecer-contrasenia`, controllerLogin.restorePassword);
    app.patch(`${api.baseEndpoint}/usuarios/cambiar-contrasenia`, controllerLogin.changePassword);
}