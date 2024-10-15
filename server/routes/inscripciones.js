'use strict'

const { api } = require("../config/config");

const controllersInscripciones= require('../controllers/inscripciones')





module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/inscripciones`, controllersInscripciones.getInscripciones);
    app.get(`${api.baseEndpoint}/inscripciones/:id`, controllersInscripciones.getInscripcion);
    app.post(`${api.baseEndpoint}/inscripciones/crear`, controllersInscripciones.createInscripcion);
    app.patch(`${api.baseEndpoint}/inscripciones/editar/:id`, controllersInscripciones.updateInscripcion);
    app.delete(`${api.baseEndpoint}/inscripciones/eliminar/:id`, controllersInscripciones.changeStatusInscripcion);

}