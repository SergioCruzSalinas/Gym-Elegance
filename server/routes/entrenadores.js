'use strict'

const { api } = require("../config/config")
const controllersEntrenadores=require('../controllers/entrenadores')



module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/entrenadores`, controllersEntrenadores.getCoachs);
    app.get(`${api.baseEndpoint}/entrenadores/crear`, controllersEntrenadores.createCoach);
    app.get(`${api.baseEndpoint}/entrenadores/editar/:id`, controllersEntrenadores.updateCoach);
    app.get(`${api.baseEndpoint}/entrenadores/eliminar/:id`, controllersEntrenadores.deleteCoach);
}