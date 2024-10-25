'use strict'

const pc=require('picocolors');
const { api } = require('../config/config');

const controllersAgendaActivities=require('../controllers/agendaActividades')


module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/agenda-actividades`, controllersAgendaActivities.getAgendaActivities);
    app.get(`${api.baseEndpoint}/agenda-actividades/:id`, controllersAgendaActivities.getAgendaActivity);
    app.post(`${api.baseEndpoint}/agenda-actividades/crear-cita`, controllersAgendaActivities.createAgendaActivities);
    app.patch(`${api.baseEndpoint}/agenda-actividades/editar/:id`, controllersAgendaActivities.updateAgendaActivity);
    app.patch(`${api.baseEndpoint}/agenda-actividades/asitencia/:id`, controllersAgendaActivities.updateAsistenceDate);

};