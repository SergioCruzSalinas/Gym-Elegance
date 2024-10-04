'use strict'

const pc = require('picocolors');
const { api } = require('../config/config');

const controllersAgendaActividades=require('../controllers/agendaActividades');

module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/agenda-actividades`, controllersAgendaActividades.getAgenda);
    app.get(`${api.baseEndpoint}/reservar-cita`, controllersAgendaActividades.createReserveAgenda);
    app.get(`${api.baseEndpoint}/cita/editar/:id`, controllersAgendaActividades.updateReserveAgenda);
    app.get(`${api.baseEndpoint}/cita/asitencia/:id`, controllersAgendaActividades.attendanceAgenda)
    app.get(`${api.baseEndpoint}/reservar-cita/estatus/:id`, controllersAgendaActividades.statusReserveAgenda);


}