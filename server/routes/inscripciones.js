'use strict'

const { validateAuth, authorizeRole } = require("../auth");
const { api, plataforma } = require("../config/config");

const controllersInscripciones= require('../controllers/inscripciones')





module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/inscripciones`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersInscripciones.getInscripciones);
    app.get(`${api.baseEndpoint}/inscripciones/:id`, validateAuth, authorizeRole([plataforma.roles.admin, plataforma.roles.usuario]), controllersInscripciones.getInscripcion);
    app.post(`${api.baseEndpoint}/inscripciones/crear`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersInscripciones.createInscripcion);
    app.patch(`${api.baseEndpoint}/inscripciones/editar/:id`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersInscripciones.updateInscripcion);
    app.delete(`${api.baseEndpoint}/inscripciones/eliminar/:id`, validateAuth, authorizeRole([plataforma.roles.admin]), controllersInscripciones.changeStatusInscripcion);

}