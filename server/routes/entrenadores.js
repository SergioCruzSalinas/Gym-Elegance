'use strict'

const { validateAuth, authorizeRole } = require("../auth");
const { api, plataforma } = require("../config/config")
const controllersEntrenadores=require('../controllers/entrenadores')



module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/entrenadores`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersEntrenadores.getCoachs);
    app.get(`${api.baseEndpoint}/entrenadores/:id`,validateAuth, authorizeRole([plataforma.roles.admin, plataforma.roles.instructor]), controllersEntrenadores.getCoach);
    app.post(`${api.baseEndpoint}/entrenadores/registrar`,validateAuth, authorizeRole([plataforma.roles.admin]), controllersEntrenadores.createCoach);
    app.patch(`${api.baseEndpoint}/entrenadores/editar/:id`, validateAuth, authorizeRole([plataforma.roles.admin, plataforma.roles.instructor]), controllersEntrenadores.updateCoach);
    app.delete(`${api.baseEndpoint}/entrenadores/cambiar-estatus/:id`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersEntrenadores.changeStatusCoach);
}