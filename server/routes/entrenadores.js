'use strict'

const { api } = require("../config/config")
const controllersEntrenadores=require('../controllers/entrenadores')



module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/entrenadores`, controllersEntrenadores.getCoachs);
    app.get(`${api.baseEndpoint}/entrenadores/:id`, controllersEntrenadores.getCoach);
    app.post(`${api.baseEndpoint}/entrenadores/registrar`, controllersEntrenadores.createCoach);
    app.patch(`${api.baseEndpoint}/entrenadores/editar/:id`, controllersEntrenadores.updateCoach);
    app.delete(`${api.baseEndpoint}/entrenadores/cambiar-estatus/:id`, controllersEntrenadores.changeStatusCoach);
}