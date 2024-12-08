'use strict'

const { api, plataforma } = require('../config/config');

const controllersAgendaActivities=require('../controllers/agendaActividades');
const { validateAuth, authorizeRole } = require('../auth');


module.exports=(app)=>{
    app.get(`${api.baseEndpoint}/agenda-actividades`,validateAuth, authorizeRole([plataforma.roles.admin, plataforma.roles.instructor, plataforma.roles.usuario]), controllersAgendaActivities.getAgendaActivities);
    app.get(`${api.baseEndpoint}/agenda-actividades/:id`, validateAuth,controllersAgendaActivities.getAgendaActivity);
    app.post(`${api.baseEndpoint}/agenda-actividades/crear-cita`, validateAuth, controllersAgendaActivities.createAgendaActivities);
    app.patch(`${api.baseEndpoint}/agenda-actividades/editar/:id`,validateAuth, controllersAgendaActivities.updateAgendaActivity);
    app.patch(`${api.baseEndpoint}/agenda-actividades/asistencia/:id`, validateAuth, authorizeRole([plataforma.roles.admin, plataforma.roles.instructor]), controllersAgendaActivities.updateAsistenceDate);

};